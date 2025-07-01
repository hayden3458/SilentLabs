import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M255.68 133.45c0-11.14-.9-22.29-2.82-33.13H130.5v62.7h70.13c-3.02 16.29-12.13 30.09-25.8 39.36v32.64h41.7c24.4-22.5 38.25-55.7 38.25-101.57z" fill="#4285F4"/>
      <path d="M130.5 262c34.65 0 63.74-11.48 84.99-31.2l-41.7-32.64c-11.6 7.8-26.5 13.2-43.29 13.2-33.3 0-61.56-22.47-71.7-52.7H15.7v33.3C36.8 230.6 80.1 262 130.5 262z" fill="#34A853"/>
      <path d="M58.8 158.66c-5.2-15.29-5.2-31.8 0-47.09V78.27H15.7c-14.6 29.2-14.6 63.09 0 92.29l43.1-33.9z" fill="#FBBC05"/>
      <path d="M130.5 51.13c18.85-.3 36.8 6.36 50.6 18.8l37.8-37.8C194.2 11.48 165.15 0 130.5 0 80.1 0 36.8 31.4 15.7 78.27l43.1 33.3c10.14-30.23 38.4-52.7 71.7-52.7z" fill="#EA4335"/>
    </g>
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect x="4" y="4" width="18" height="18" fill="#F35325"/>
      <rect x="26" y="4" width="18" height="18" fill="#81BC06"/>
      <rect x="4" y="26" width="18" height="18" fill="#05A6F0"/>
      <rect x="26" y="26" width="18" height="18" fill="#FFBA08"/>
    </g>
  </svg>
);

const AuthForm: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const isLogin = mode === 'login';
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPassword) {
      setShowPassword(true);
    } else {
      // Here you would normally handle authentication
      navigate('/workspace');
    }
  };
  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-glass rounded-3xl shadow-glass p-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8">{isLogin ? 'Sign in' : 'Create an account'}</h1>
      <form className="w-full flex flex-col items-center" onSubmit={handleContinue}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-5 py-3 rounded-full border border-gray-300 bg-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glassgreen-500 transition text-[#18181b]"
          required
          disabled={showPassword}
        />
        {showPassword && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 px-5 py-3 rounded-full border border-gray-300 bg-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-glassgreen-500 transition text-[#18181b]"
            required
            autoFocus
          />
        )}
        <button type="submit" className="w-full mb-4 py-3 rounded-full bg-black text-white text-lg font-semibold transition hover:bg-gray-900">
          Continue
        </button>
      </form>
      <div className="mb-4 text-center text-base text-black dark:text-techblue-900">
        {isLogin ? (
          <>
            Need an account?{' '}
            <Link to="/signup" className="text-black font-semibold hover:underline">Make one</Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-black font-semibold hover:underline">Sign in</Link>
          </>
        )}
      </div>
      <div className="flex items-center w-full my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <button className="w-full mb-3 py-3 rounded-full bg-black text-white flex items-center justify-center text-lg font-medium hover:bg-gray-900 transition">
        <span className="mr-3"><GoogleLogo /></span>
        Continue with Google
      </button>
      <button className="w-full py-3 rounded-full bg-black text-white flex items-center justify-center text-lg font-medium hover:bg-gray-900 transition">
        <span className="mr-3"><MicrosoftLogo /></span>
        Continue with Microsoft Account
      </button>
    </div>
  );
};

const Login: React.FC = () => {
  const location = useLocation();
  // /login = sign in, /signup = create account
  const mode = location.pathname === '/signup' ? 'signup' : 'login';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nature-glass text-white font-inter px-4">
      <AuthForm mode={mode} />
    </div>
  );
};

export default Login; 