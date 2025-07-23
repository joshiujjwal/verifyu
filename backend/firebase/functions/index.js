/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
require("dotenv").config();


// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


const admin = require("firebase-admin");
const {FieldValue} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const stytch = require("stytch");


// let serviceAccountKey = null;
// const isDevelopment = process.env.NODE_ENV === "development" || process.env.FUNCTIONS_EMULATOR;

// if (isDevelopment) {
//   try {
//     const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
//     serviceAccountKey = require(serviceAccountPath);
//     adminConfig.credential = admin.credential.cert(serviceAccountKey);
//     console.log("Using service account key for local development");
//   } catch (error) {
//     console.warn("Service account key not found for local development:", error.message);
//     console.warn("Using default credentials - some features may not work in emulator");
//   }
// } else {
//   // In production, explicitly use application default credentials
//   console.log("Using application default credentials for production");
// }

// // Initialize Firebase Admin - this should work in both dev and production
// try {
//   // Check if app is already initialized to avoid duplicate initialization
//   if (admin.apps.length === 0) {
//     admin.initializeApp(adminConfig);
//   }
//   // Only log service account details in development
//   if (isDevelopment) {
//     const adminCredential = admin.app().options.credential;
//     console.log("Service account details:", {
//       projectId: admin.app().options.projectId,
//       hasCredential: !!adminCredential,
//       clientEmail: serviceAccountKey?.client_email || "No client email",
//       privateKey: serviceAccountKey?.private_key ? "Present" : "Missing",
//     });
//     console.log("Firebase Admin initialized with project:", admin.app().options.projectId);
//     console.log("Service account email:", serviceAccountKey?.client_email || "Using default credentials");
//   } else {
//     // Production logging - minimal and clean
//     console.log("Firebase Admin initialized with service account:", admin.app().options.serviceAccountId);
//     console.log("Firebase Admin initialized for production with project:", admin.app().options.projectId);
//   }
// } catch (error) {
//   console.error("Failed to initialize Firebase Admin:", error);
//   throw error;
// }

admin.initializeApp();

// --- CLIENT INITIALIZATION ---
// Use environment variables for local development, Firebase config for production
let config = null;
let stytchClient = null;

const getConfig = () => {
  if (config) return config;

  // Use environment variables for Firebase Functions v2
  config = {
    stytch: {
      "project_id": process.env.STYTCH_PROJECT_ID,
      "secret": process.env.STYTCH_SECRET,
    },
    worldcoin: {
      "app_id": process.env.WORLDCOIN_APP_ID,
      "action": process.env.WORLDCOIN_ACTION,
    },
  };

  // Validate required config
  if (!config.stytch.project_id) {
    throw new Error("Missing STYTCH_PROJECT_ID environment variable");
  }
  if (!config.stytch.secret) {
    throw new Error("Missing STYTCH_SECRET environment variable");
  }

  return config;
};

const getStytchClient = () => {
  if (stytchClient) return stytchClient;

  const config = getConfig();
  console.log("Stytch client configuration:", {
    project_id: config.stytch.project_id,
    secret: config.stytch.secret ? "***" : "MISSING",
    env: "live", // or "test"
  });

  stytchClient = new stytch.Client({
    project_id: config.stytch.project_id,
    secret: config.stytch.secret,
    env: stytch.envs.live, // Use "live" for production
  });

  return stytchClient;
};

// --- USER LIFECYCLE FUNCTIONS ---

/**
 * Creates a new user profile in Firestore when a user signs up via Firebase Auth.
 * @param {functions.auth.UserRecord} user The user record created.
 * @returns {Promise} A promise that resolves when the profile is created.
 */
exports.createNewUser = onDocumentCreated("users/{userId}", async (event) => {
  const user = event.data.data();
  const {uid, email, displayName, photoURL} = user;
  const userRef = admin.firestore().collection("users").doc(uid);

  return userRef.set({
    email,
    displayName: displayName || null,
    photoURL: photoURL || null,
    createdAt: FieldValue.serverTimestamp(),
    verificationLevel: 1, // Default level for email verification
    worldIdNullifier: null, // Add field for World ID uniqueness
    privacySettings: {
      showName: true,
      showEmail: false,
      showPhone: false,
    },
  });
});

/**
 * Exchanges a Stytch token (magic link or session) for a Firebase custom token and updates the user's profile.
 * @param {object} data The data passed to the function, containing the stytch_token.
 * @param {functions.https.CallableContext} context The context of the function call.
 * @returns {Promise<{firebase_token: string}>} A Firebase custom token.
 */
exports.createFirebaseToken = onCall(async (request) => {
  const {data, context} = request;
  console.log("Raw data received:", data);
  console.log("Data keys:", Object.keys(data));
  const stytchToken = data.stytchToken;
  console.log("createFirebaseToken called with:", {
    hasToken: !!stytchToken,
    tokenLength: stytchToken?.length,
    tokenPrefix: stytchToken?.substring(0, 10),
    context: {
      auth: !!context?.auth,
      uid: context?.auth?.uid,
    },
  });
  try {
    const stytchClient = getStytchClient();
    const config = getConfig();
    console.log("Stytch config loaded:", {
      hasProjectId: !!config.stytch.project_id,
      hasSecret: !!config.stytch.secret,
      projectId: config.stytch.project_id,
    });
    let user;
    try {
      console.log("Attempting session authentication...");
      const sessionResult = await stytchClient.sessions.authenticate({session_token: stytchToken});
      user = sessionResult.user;
      console.log("Session authentication successful");
    } catch (sessionError) {
      console.log("Session authentication failed:", sessionError.message);
      // If session authentication fails, try to authenticate as a magic link token
      try {
        console.log("Attempting magic link authentication...");
        const magicLinkResult = await stytchClient.magicLinks.authenticate({
          token: stytchToken,
        });
        user = magicLinkResult.user;
        console.log("Magic link authentication successful");
      } catch (magicLinkError) {
        console.error("Both session and magic link authentication failed:", {
          sessionError: sessionError.message,
          magicLinkError: magicLinkError.message,
        });
        throw new Error("Invalid Stytch token.");
      }
    }

    const firebaseToken = await admin.auth().createCustomToken(user.user_id);

    const userRef = admin.firestore().collection("users").doc(user.user_id);
    const userDoc = await userRef.get();

    const hasVerifiedEmail = user.emails.some((e) => e.verified);
    const hasVerifiedPhone = user.phone_numbers.some((p) => p.verified);

    let verificationLevel = 0;
    if (hasVerifiedEmail) verificationLevel = 1;
    if (hasVerifiedPhone) verificationLevel = 2;

    if (!userDoc.exists) {
      // Create profile if it doesn't exist
      await userRef.set({
        email: user.emails.find((e) => e.verified)?.email || null,
        displayName: user.name?.first_name || null,
        createdAt: FieldValue.serverTimestamp(),
        verificationLevel: verificationLevel,
        worldIdNullifier: null,
        privacySettings: {showName: true, showEmail: false, showPhone: false},
      });
    } else {
      // Update verification level if it's an upgrade
      const currentLevel = userDoc.data().verificationLevel || 0;
      if (verificationLevel > currentLevel) {
        await userRef.update({verificationLevel: verificationLevel});
      }
    }

    return {firebase_token: firebaseToken};
  } catch (error) {
    console.error("Stytch authentication failed:", error);
    throw new Error("Stytch token is invalid.");
  }
});


// --- CORE FEATURE FUNCTIONS ---

/**
 * Generates a short-lived, one-time verification code for an authenticated user.
 * @param {object} data The data passed to the function (not used).
 * @param {functions.https.CallableContext} context The context of the function call.
 * @returns {Promise<{code: string}>} The generated one-time code.
 */
exports.generateCode = onCall({
  enforceAppCheck: false,
  maxInstances: 10,
}, async (request) => {
  const {data, auth} = request;

  // Safe debugging for Firebase Functions v2
  console.log("generateCode called with:", {
    hasRequest: !!request,
    hasData: !!data,
    hasAuth: !!auth,
    requestKeys: request ? Object.keys(request) : [],
    authUid: auth?.uid,
    authToken: auth?.token ? "Present" : "Missing",
  });

  // Check if auth exists
  if (!auth) {
    console.error("No auth in request object");
    throw new Error("Authentication required. Please sign in to generate a code.");
  }

  if (!auth.uid) {
    console.error("No UID in auth:", {
      authKeys: Object.keys(auth),
      authType: typeof auth,
    });
    throw new Error("User ID not found. Please sign in again.");
  }

  const userId = auth.uid;
  console.log("Generating code for user:", userId);

  // Verify the user exists in Firebase Auth
  try {
    const userRecord = await admin.auth().getUser(userId);
    console.log("Firebase Auth user verified:", userRecord.uid);
  } catch (authError) {
    console.error("Firebase Auth user verification failed:", authError);
    throw new Error("Invalid user authentication. Please sign in again.");
  }

  // Check if the user exists in the database
  const userRef = admin.firestore().collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    console.error("User profile not found for ID:", userId);
    throw new Error("User profile not found. Please complete your profile setup.");
  }

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + 15 * 60 * 1000); // 15 minutes

  try {
    await admin.firestore().collection("codes").doc(code).set({userId, expiresAt});
    console.log("Code generated successfully:", code, "for user:", userId);
    return {code};
  } catch (error) {
    console.error("Failed to save code to Firestore:", error);
    throw new Error("Failed to generate code. Please try again.");
  }
});

/**
 * Verifies a one-time code and returns the user's public profile based on their privacy settings.
 * @param {object} data The data passed to the function, containing the code.
 * @param {functions.https.CallableContext} context The context of the function call.
 * @returns {Promise<object>} The user's public profile and verification level.
 */
exports.verifyCode = onCall(async (request) => {
  const {data} = request;
  const {code} = data;
  if (!code) {
    throw new Error("A 'code' must be provided.");
  }
  const codeRef = admin.firestore().collection("codes").doc(code);
  const codeDoc = await codeRef.get();

  if (!codeDoc.exists) {
    throw new Error("Invalid verification code.");
  }
  const {userId, expiresAt} = codeDoc.data();

  if (expiresAt.toMillis() < Date.now()) {
    await codeRef.delete();
    throw new Error("This code has expired.");
  }

  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error("Could not find the user for this code.");
  }

  const userProfile = userDoc.data();
  const {privacySettings, verificationLevel} = userProfile;

  const publicProfile = {};
  if (privacySettings.showName) {
    publicProfile.displayName = userProfile.displayName;
  }
  if (privacySettings.showEmail) {
    publicProfile.email = userProfile.email;
  }

  await codeRef.delete(); // Code is one-time use

  return {
    profile: publicProfile,
    level: verificationLevel || 1,
  };
});


// --- ADVANCED VERIFICATION FUNCTIONS ---

/**
 * Verifies a World ID proof, ensures its uniqueness, and upgrades the user to Level 4.
 * @param {object} data The data containing the World ID proof, including the nullifier_hash.
 * @param {functions.https.CallableContext} context The context of the function call.
 * @returns {Promise<{success: boolean, level: number}>} Success status and new level.
 */
exports.verifyWorldId = onCall(async (request) => {
  const {data, context} = request;
  if (!context || !context.auth) {
    throw new Error("You must be logged in.");
  }

  const {proof} = data;
  const {nullifier_hash} = proof;
  const userId = context.auth.uid;

  // 1. Check if this World ID has already been used on our platform.
  const usersRef = admin.firestore().collection("users");
  const querySnapshot = await usersRef.where("worldIdNullifier", "==", nullifier_hash).limit(1).get();

  if (!querySnapshot.empty) {
    throw new Error("This World ID has already been linked to another account.");
  }

  // 2. Verify the proof with Worldcoin's servers.
  const config = getConfig();
  const verifyRes = await fetch(`https://developer.worldcoin.org/api/v1/verify`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      ...proof,
      action: config.worldcoin.action,
      signal: userId, // Tie the proof to the user's ID to prevent replay attacks
    }),
  });

  if (verifyRes.ok) {
    // 3. If verification is successful, update the user's profile.
    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.update({
      verificationLevel: 4,
      worldIdNullifier: nullifier_hash, // Store the hash to ensure uniqueness
    });
    return {success: true, level: 4};
  } else {
    // 4. Handle verification failure.
    const errorBody = await verifyRes.json();
    console.error("World ID verification failed:", errorBody);
    throw new Error(`World ID verification failed: ${errorBody.code}`);
  }
});

/**
 * [PLACEHOLDER] Handles webhooks from a Government ID verification service (e.g., Stripe Identity).
 * This function would not be called directly from the client.
 */
exports.handleIdVerificationWebhook = functions.https.onRequest(async (req, res) => {
  // const event = req.body;
  // 1. Verify the webhook signature to ensure it's from the trusted service.
  // 2. Check the event type (e.g., 'identity.verification_session.verified').
  // 3. Extract the user ID you stored in the session's metadata.
  // 4. Update the user's verificationLevel to 3 in Firestore, ensuring not to downgrade from level 4.
  //    const userId = event.data.object.metadata.user_id;
  //    const userRef = admin.firestore().collection("users").doc(userId);
  //    const userDoc = await userRef.get();
  //    if (userDoc.exists && userDoc.data().verificationLevel < 3) {
  //        await userRef.update({ verificationLevel: 3 });
  //    }
  // 5. Respond with a 200 OK to acknowledge receipt.
  res.status(200).send("Webhook received.");
});

// Add this test function
exports.testAdminAccess = onCall(async (request) => {
  try {
    const db = admin.firestore();
    const testDoc = await db.collection("test").doc("admin-test").get();
    console.log("Admin SDK access test successful", testDoc.data());
    return {success: true, message: "Admin SDK is working correctly"};
  } catch (error) {
    console.error("Admin SDK access test failed:", error);
    throw new Error(`Admin SDK error: ${error.message}`);
  }
});

// Add this test function
exports.testAuth = onCall(async (request) => {
  const {context} = request;
  console.log("testAuth called with context:", {
    hasContext: !!context,
    hasAuth: !!context?.auth,
    authUid: context?.auth?.uid,
  });

  if (!context || !context.auth || !context.auth.uid) {
    throw new Error("Not authenticated");
  }

  return {
    success: true,
    uid: context.auth.uid,
    message: "Authentication working correctly",
  };
});
