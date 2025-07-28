import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SettingsForm from '../components/profile/SettingsForm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import LevelBadge from '../components/profile/LevelBadge';
import VerificationOptions from '../components/profile/VerificationOptions';

const SettingsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedCode(null);
    try {
      const generateCodeFunction = httpsCallable<unknown, { code: string }>(functions, 'generateCode');
      const result = await generateCodeFunction();
      setGeneratedCode(result.data.code);
    } catch (err: any) {
      setError('Failed to generate code. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!userProfile) {
    return <div className="text-center text-text-tertiary">Loading profile...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Settings</h1>
        <SettingsForm />
      </div>
      
      <div className="space-y-6">
        <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-2">My Status</h2>
            <div className="mt-4">
                <LevelBadge level={userProfile.verificationLevel} />
            </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Generate One-Time Code</h2>
          <p className="text-text-tertiary mb-4 text-sm">Share this code to let others verify your status. It's valid for 15 minutes.</p>
          <div className="flex items-center gap-4">
            <Button onClick={handleGenerateCode} isLoading={isGenerating}>
              Generate Code
            </Button>
            {generatedCode && (
              <div className="bg-bg-overlay p-2 rounded-lg font-mono text-lg text-status-success tracking-widest">
                {generatedCode}
              </div>
            )}
          </div>
          {error && <p className="text-status-error mt-2 text-sm">{error}</p>}
        </Card>

        <VerificationOptions />
      </div>
    </div>
  );
};

export default SettingsPage;