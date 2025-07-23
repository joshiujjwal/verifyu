import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Switch from '../ui/Switch';

const SettingsForm: React.FC = () => {
  const { userProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [privacy, setPrivacy] = useState(userProfile?.privacySettings || { showName: true, showEmail: false, showPhone: false });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!userProfile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    const userDocRef = doc(db, 'users', userProfile.uid);
    try {
      await updateDoc(userDocRef, {
        displayName: displayName,
        privacySettings: privacy
      });
      setSaveMessage('Settings saved successfully!');
    } catch (error) {
      console.error("Error updating settings: ", error);
      setSaveMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your public name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <p className="text-gray-400">{userProfile.email}</p>
          </div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">Privacy Settings</h2>
        <p className="text-gray-400 mb-4">Control what others see when they verify your code.</p>
        <div className="space-y-4">
          <Switch
            label="Show Display Name"
            checked={privacy.showName}
            onChange={(checked) => setPrivacy(p => ({ ...p, showName: checked }))}
          />
          <Switch
            label="Show Email Address"
            checked={privacy.showEmail}
            onChange={(checked) => setPrivacy(p => ({ ...p, showEmail: checked }))}
          />
        </div>
      </Card>

      <div className="mt-6 flex items-center gap-4">
        <Button type="submit" isLoading={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        {saveMessage && <p className="text-green-400">{saveMessage}</p>}
      </div>
    </form>
  );
};

export default SettingsForm;