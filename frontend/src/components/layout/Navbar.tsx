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
    <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-50">
      <nav className="container mx-auto max-w-5xl px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Verify<span className="text-brand-primary">U</span>
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span className="text-gray-300 hidden sm:block">
                Welcome, {userProfile?.displayName || 'User'}
              </span>
              <Link to="/settings" className="p-2 rounded-md hover:bg-dark-700 transition-colors">
                <Settings className="w-5 h-5 text-gray-300" />
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-md hover:bg-dark-700 transition-colors">
                <LogOut className="w-5 h-5 text-red-400" />
              </button>
            </>
          ) : (
            <Link to="/signin" className="flex items-center bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors">
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