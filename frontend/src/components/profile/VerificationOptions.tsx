import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Diamond, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const VerificationOptions: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [worldIdError, setWorldIdError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // This should be stored in your .env.local file
  const worldcoinAppId = import.meta.env.VITE_WORLDCOIN_APP_ID;
  const worldcoinAction = import.meta.env.VITE_WORLDCOIN_ACTION;

  const handleWorldIdSuccess = async (proof: ISuccessResult) => {
    setIsVerifying(true);
    setWorldIdError(null);
    try {
      const verifyWorldIdFunction = httpsCallable(functions, 'verifyWorldId');
      await verifyWorldIdFunction({ proof });
      // The user's profile will update automatically via the onSnapshot listener
    } catch (error: any) {
      console.error("World ID verification failed:", error);
      setWorldIdError(error.message || "An unknown error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!userProfile) return null;

  const currentLevel = userProfile.verificationLevel;

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-4">Verification Status</h2>
      <div className="space-y-6">
        {/* Step 2: Phone Verification */}
        {currentLevel < 2 && (
          <div>
            <h3 className="font-semibold text-lg text-white">Level 2: Phone Verification</h3>
            <p className="text-gray-400 mt-1 mb-3">Verify your phone number using Stytch for an increased trust level.</p>
            <Button variant="secondary" onClick={() => alert("Redirect to Stytch phone verification flow.")}>
              <Shield className="w-4 h-4 mr-2" />
              Verify Phone
            </Button>
          </div>
        )}

        {/* Step 3: Government ID */}
        {currentLevel < 3 && (
           <div>
            <h3 className="font-semibold text-lg text-white">Level 3: Government ID</h3>
            <p className="text-gray-400 mt-1 mb-3">Verify with a government-issued ID. This requires redirecting to a secure third-party service.</p>
            <Button variant="secondary" onClick={() => alert("Redirect to ID verification service.")}>
              <Shield className="w-4 h-4 mr-2" />
              Verify with ID
            </Button>
          </div>
        )}

        {/* Step 4: World ID */}
        {currentLevel < 4 ? (
          <div>
            <h3 className="font-semibold text-lg text-white">Level 4: Prove Personhood</h3>
            <p className="text-gray-400 mt-1 mb-3">Use World ID to prove you are a unique human, providing the highest level of trust.</p>
            
            <IDKitWidget
              app_id={worldcoinAppId!}
              action={worldcoinAction!}
              signal={currentUser?.uid} // Tie proof to user's Firebase UID
              onSuccess={handleWorldIdSuccess}
              // handleVerify is deprecated, use onSuccess
            >
              {({ open }) => (
                <Button onClick={open} isLoading={isVerifying}>
                  <Diamond className="w-4 h-4 mr-2" />
                  {isVerifying ? 'Verifying...' : 'Verify with World ID'}
                </Button>
              )}
            </IDKitWidget>
            {worldIdError && (
                <div className="mt-3 flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <p>{worldIdError}</p>
                </div>
            )}
          </div>
        ) : (
            <div className="flex items-center gap-3 p-4 bg-dark-900 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                    <h3 className="font-semibold text-white">World ID Verified</h3>
                    <p className="text-gray-400">You have achieved the highest verification level.</p>
                </div>
            </div>
        )}
      </div>
    </Card>
  );
};

export default VerificationOptions;