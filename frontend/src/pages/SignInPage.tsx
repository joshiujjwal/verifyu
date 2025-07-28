import React from 'react';
import { auth, functions } from '../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';
import { StytchLoginConfig, StytchEvent, StytchError } from '@stytch/vanilla-js';
import { StytchLogin } from '@stytch/react';
import { Products } from '@stytch/vanilla-js';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get the base URL from environment variable or fallback to window.location.origin
  const baseUrl = import.meta.env.VITE_BASE_URL;
  
  const stytchLoginConfig: StytchLoginConfig = {
    products: [Products.emailMagicLinks],
    emailMagicLinksOptions: {
      loginRedirectURL: baseUrl + '/authenticate',
      signupRedirectURL: baseUrl + '/authenticate',
    },
  };

  const handleStytchAuth = async (data: { product: any; token: string; }) => {
    try {
      console.log('Stytch auth successful, token received:', data.token);
      
      const createFirebaseToken = httpsCallable< { stytchToken: string }, { firebase_token: string } >(functions, 'createFirebaseToken');
      console.log('Calling createFirebaseToken function...');
      
      const result = await createFirebaseToken({ stytchToken: data.token });
      console.log('Firebase token created successfully:', result.data);
      
      const { firebase_token } = result.data;
      
      console.log('Signing in with Firebase custom token...');
      await signInWithCustomToken(auth, firebase_token);
      console.log('Firebase sign in successful');
      
      console.log('Navigating to /settings...');
      navigate('/settings');
    } catch (error) {
      console.error("Error signing in with Stytch token:", error);
    }
  };

  const stytchCallbacks = {
    onEvent: (message: StytchEvent) => {
      console.log('Stytch event:', message);
    },
    onSuccess: (data: { product: any; token: string; }) => {
      console.log('Stytch onSuccess called with:', data);
      handleStytchAuth(data);
    },
    onError: (error: StytchError) => {
      console.log('Stytch error:', error);
    },
  };

  return (
    <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center text-text-primary mb-6">Sign In or Sign Up</h2>
        <StytchLogin config={stytchLoginConfig} callbacks={stytchCallbacks} />
    </div>
  );
};

export default SignInPage;