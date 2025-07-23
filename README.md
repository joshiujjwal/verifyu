# VerifU - A Decentralized Identity & Verification Platform

VerifU is a modern web application that allows users to create a trusted digital identity by aggregating different levels of verification. Users can then generate short-lived, shareable codes to prove their identity level to others without revealing sensitive personal information.

This project uses a modern, scalable, and secure tech stack designed for rapid development and a great user experience.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Verification Levels](#verification-levels)
- [Core Features](#core-features)

---

## Tech Stack

**Frontend:**
- **Framework:** React.js (using Vite)
- **Styling:** Tailwind CSS

**Backend & Database:**
- **Platform:** Google Firebase
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Serverless Logic:** Firebase Cloud Functions

**Third-Party Integrations:**
- **Flexible Auth:** Stytch
- **Proof of Personhood:** World ID by Worldcoin

---

## Project Structure

The project is organized into two main directories: `frontend` for the React application and `firebase` for all backend services.

```
/verifyu
├── frontend/           # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── ...
│   └── package.json
│
└── firebase/           # Firebase Backend
    ├── functions/      # Cloud Functions
    │   ├── src/
    │   └── package.json
    ├── firestore.rules
    └── firebase.json
```

---

## Setup and Installation

### 1. Prerequisites

- Node.js (v18 or later)
- NPM or Yarn
- A Firebase account ([firebase.google.com](https://firebase.google.com))
- A Stytch account (for Level 2+ verification)
- A Worldcoin Developer account (for Level 4 verification)

### 2. Clone the Repository

```sh
git clone <your-repository-url>
cd verifyu
```

### 3. Frontend Setup

Navigate to the frontend directory and install the necessary packages:

```sh
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory and add your Firebase and Stytch public keys:

```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"

VITE_STYTCH_PUBLIC_TOKEN="your_stytch_public_token"
```

### 4. Firebase Backend Setup

Install the Firebase CLI if you haven't already:

```sh
npm install -g firebase-tools
```

Log in to Firebase:

```sh
firebase login
```

Navigate to the functions directory and install its dependencies:

```sh
cd ../firebase/functions
npm install
```

---

## Running the Application

### Start the Frontend Development Server

From the `frontend` directory, run:

```sh
npm run dev
```

This will start the React application, typically on [http://localhost:5173](http://localhost:5173).

### Deploy Firebase Functions & Rules

From the `firebase` directory, deploy your backend:

```sh
firebase deploy
```

This will deploy your Firestore security rules and any Cloud Functions you've written.

---

## Verification Levels

| Level | Card    | Verification Method                        |
|-------|---------|--------------------------------------------|
| 1     | Bronze  | Email verification (Firebase Auth)         |
| 2     | Silver  | Phone verification (Firebase Auth/Stytch)  |
| 3     | Gold    | Government ID (e.g., Stripe Identity)      |
| 4     | Diamond | Proof of Personhood (World ID)             |

---

## Core Features

- **User Profiles:** Each user has a profile in Firestore storing their verification level and privacy settings.
- **Privacy Controls:** Users can control which pieces of information (name, email, etc.) are visible to others.
- **One-Time Codes:** Users can generate a short-lived code to share their verification status without logging in.
- **Secure Verification:** A verifier enters the code to see the user's Level Card and publicly designated information.