import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { LogOut, Settings, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-bg-primary/50 backdrop-blur-sm border-b border-border-primary sticky top-0 z-50">
      <nav className="container mx-auto max-w-5xl px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-text-primary">
          Verify<span className="text-brand-primary">U</span>
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-text-secondary hidden sm:block">
                Welcome, {userProfile?.displayName || 'User'}
              </span>
              <Link to="/settings" className="p-2 rounded-md hover:bg-bg-secondary transition-colors">
                <Settings className="w-5 h-5 text-text-secondary" />
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-md hover:bg-bg-secondary transition-colors">
                <LogOut className="w-5 h-5 text-status-error" />
              </button>
            </>
          ) : (
            <Link to="/signin" className="flex items-center bg-brand-primary text-text-primary px-4 py-2 rounded-lg font-semibold hover:bg-brand-primary-hover transition-colors">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;