import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SettingsPage from './pages/SettingsPage';
import VerifyPage from './pages/VerifyPage';
import AuthenticatePage from './pages/AuthenticatePage';
import Navbar from './components/layout/Navbar';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-screen bg-dark-900 font-sans">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify/:code" element={<VerifyPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/authenticate" element={<AuthenticatePage />} />
          {currentUser && <Route path="/settings" element={<SettingsPage />} />}
        </Routes>
      </main>
    </div>
  );
}

export default App;