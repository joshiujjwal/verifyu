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
      <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
        Securely Verify Identity.
      </h1>
      <p className="text-lg md:text-xl text-text-tertiary max-w-2xl mb-8">
        Enter a VerifyU code to instantly see a user's verified status without compromising their privacy.
      </p>
      
      <form onSubmit={handleVerify} className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter one-time code..."
            className="w-full p-4 pr-16 text-lg bg-bg-primary border-2 border-border-primary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
          />
          <button type="submit" className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-text-primary bg-brand-primary rounded-r-lg hover:bg-brand-primary-hover transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </form>
      <p className='text-sm text-text-tertiary mt-4'><i>Code is valid only once. If You see verification failed, request new code</i></p>
    </div>
  );
};

export default HomePage;