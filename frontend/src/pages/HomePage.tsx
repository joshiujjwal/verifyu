import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/verify/${code.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center pt-16 md:pt-24">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Securely Verify Identity.
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
        Enter a VerifyU code to instantly see a user's verified status without compromising their privacy.
      </p>
      
      <form onSubmit={handleVerify} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter one-time code..."
            className="w-full p-4 pr-16 text-lg bg-dark-800 border-2 border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
          />
          <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-white bg-brand-primary rounded-r-lg hover:bg-brand-primary/90 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;