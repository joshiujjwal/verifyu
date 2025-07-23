import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { ShieldCheck, ShieldAlert, Loader } from 'lucide-react';

interface VerificationResult {
    profile: {
        displayName?: string;
    };
    level: {
        name: string;
        description: string;
    };
}

const VerifyPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyUserCode = async () => {
      if (!code) return;
      setLoading(true);
      setError(null);
      try {
        const verifyCodeFunction = httpsCallable< { code: string }, VerificationResult >(functions, 'verifyCode');
        const result: HttpsCallableResult<VerificationResult> = await verifyCodeFunction({ code });
        setVerificationResult(result.data);
      } catch (err: any) {
        setError(err.message);
        console.error("Verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyUserCode();
  }, [code]);

  if (loading) {
    return <div className="flex justify-center items-center pt-20"><Loader className="w-10 h-10 animate-spin text-brand-primary" /></div>;
  }

  if (error) {
    return (
        <div className="max-w-md mx-auto mt-10 bg-dark-800 p-8 rounded-lg border border-red-500/50 text-center">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
            <p className="text-red-300 mt-2">{error}</p>
        </div>
    );
  }

  if (verificationResult) {
    const { profile, level } = verificationResult;
    return (
        <div className="max-w-md mx-auto mt-10 bg-dark-800 p-8 rounded-lg border border-green-500/50 text-center">
            <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">User Verified</h2>
            {profile.displayName && <p className="text-xl text-gray-200 mt-4">{profile.displayName}</p>}
            <p className="text-lg text-gray-300 mt-2">Verification Level: <span className="font-bold">{level.name}</span></p>
        </div>
    );
  }

  return null;
};

export default VerifyPage;