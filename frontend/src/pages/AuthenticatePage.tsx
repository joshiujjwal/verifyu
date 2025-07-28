import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, functions } from '../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { Loader, AlertTriangle } from 'lucide-react';

const AuthenticatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // Extract token from URL parameters
        const token = searchParams.get('token');
        const tokenType = searchParams.get('stytch_token_type');

        // Debug logging to see what we're getting
        console.log('URL parameters:', {
          token: token ? `${token.substring(0, 10)}...` : null,
          tokenType,
          allParams: Object.fromEntries(searchParams.entries())
        });

        if (!token) {
          setError('No authentication token found in URL');
          setLoading(false);
          return;
        }

        // Check if token looks valid (basic validation)
        if (token.length < 10) {
          setError('Invalid token format');
          setLoading(false);
          return;
        }
        
        // Call Firebase function to create custom token
        const createFirebaseToken = httpsCallable<{ stytchToken: string }, { firebase_token: string }>(
          functions, 
          'createFirebaseToken'
        );
        
        console.log('Calling createFirebaseToken function...');
        const result = await createFirebaseToken({ stytchToken: token });
        console.log('Firebase token created successfully:', result.data);
        
        const { firebase_token } = result.data;
        
        // Sign in with Firebase custom token
        console.log('Signing in with Firebase custom token...');
        await signInWithCustomToken(auth, firebase_token);
        console.log('Firebase sign in successful');
        
        // Redirect to settings page
        console.log('Navigating to /settings...');
        navigate('/settings');
      } catch (error: any) {
        console.error("Error authenticating with Stytch token:", error);
        
        // Provide more user-friendly error messages
        let errorMessage = 'Authentication failed';
        if (error.message?.includes('expired')) {
          errorMessage = 'Your authentication link has expired. Please request a new one.';
        } else if (error.message?.includes('invalid')) {
          errorMessage = 'Invalid authentication link. Please try signing in again.';
        } else {
          errorMessage = error.message || 'Authentication failed';
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    authenticateUser();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-brand-primary mb-4" />
        <p className="text-text-tertiary">Authenticating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto bg-bg-primary p-8 rounded-lg border border-status-error text-center">
          <AlertTriangle className="w-16 h-16 text-status-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Authentication Failed</h2>
          <p className="text-status-error">{error}</p>
          <button 
            onClick={() => navigate('/signin')}
            className="mt-4 px-4 py-2 bg-brand-primary text-text-primary rounded-lg hover:bg-brand-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthenticatePage; 