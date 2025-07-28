import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { ShieldCheck, ShieldAlert, Mail, Loader } from 'lucide-react';
import LevelBadge from '../components/profile/LevelBadge';

interface VerificationResult {
    profile: {
        displayName?: string;
        email?: string;
    };
    level: number;  // Changed from object to number to match backend
}

const levelInfo = {
    1: { name: 'Bronze', description: 'Email verified', icon: '👤' },
    2: { name: 'Silver', description: 'Phone verified', icon: '📞' },
    3: { name: 'Gold', description: 'Government ID verified', icon: '🏛️' },
    4: { name: 'Diamond', description: 'World ID verified', icon: '🌍' },
};

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
        <div className="max-w-md mx-auto mt-10 bg-bg-primary p-8 rounded-lg border border-status-error text-center">
            <ShieldAlert className="w-16 h-16 text-status-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary">Verification Failed</h2>
            <p className="text-status-error mt-2">{error}</p>
        </div>
    );
  }

  if (verificationResult) {
    const { profile, level } = verificationResult;
    const levelData = levelInfo[level as keyof typeof levelInfo] || levelInfo[1];
    
    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
            {/* Verification Result */}
            <div className="bg-bg-primary p-8 rounded-lg border border-status-success text-center">
                <ShieldCheck className="w-16 h-16 text-status-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-primary">User Verified</h2>
                
                {/* Level Badge */}
                <div className="mt-4 flex justify-center">
                    <LevelBadge level={level as 1 | 2 | 3 | 4} />
                </div>
                
                {/* Level Description */}
                <p className="text-sm text-text-tertiary mt-2">{levelData.description}</p>
                
                {/* User Details */}
                <div className="mt-6 space-y-2">
                    {profile.displayName && (
                        <div className="flex items-center gap-2 text-text-secondary">
                            <span className="font-semibold">Name:</span>
                            <span>{profile.displayName}</span>
                        </div>
                    )}
                    
                    {profile.email && (
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Mail className="w-4 h-4" />
                            <span>{profile.email}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Levels Legend */}
            <div className="bg-bg-primary p-6 rounded-lg border border-border-secondary">
                <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">Verification Levels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(levelInfo).map(([levelNum, info]) => (
                        <div 
                            key={levelNum} 
                            className={`p-4 rounded-lg border-2 transition-all ${
                                parseInt(levelNum) === level 
                                    ? 'border-status-success bg-bg-success' 
                                    : 'border-border-secondary bg-bg-secondary'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{info.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-text-primary">
                                            Level {levelNum}: {info.name}
                                        </span>
                                        {parseInt(levelNum) === level && (
                                            <span className="text-xs bg-status-success text-text-primary px-2 py-1 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-tertiary mt-1">{info.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-4 p-3 bg-bg-info border border-status-info rounded-lg">
                    <p className="text-sm text-status-info text-center">
                        💡 <strong>Tip:</strong> Higher verification levels indicate more thorough identity verification, 
                        providing greater trust and security for all users.
                    </p>
                </div>
            </div>
        </div>
    );
  }

  return null;
};

export default VerifyPage;