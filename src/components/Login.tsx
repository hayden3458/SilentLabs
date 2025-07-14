import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './GoogleLogo.css';

// Add CSS for the Google G logo
const googleLogoCSS = `
.logo-container {
  width: 22px;
  height: 22px;
  position: relative;
  display: inline-block;
}
.logo-g {
  width: 100%;
  height: 100%;
  position: relative;
}
.g-line {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 180deg,
    #ea4335 0deg,
    #ea4335 90deg,
    #fbbc05 90deg,
    #fbbc05 180deg,
    #34a853 180deg,
    #34a853 270deg,
    #4285f4 270deg,
    #4285f4 360deg
  );
}
.g-inner {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  background: white;
  border-radius: 50%;
  z-index: 1;
}
.g-bar {
  position: absolute;
  width: 50%;
  height: 20%;
  top: 60%;
  left: 50%;
  background: #4285f4;
  border-radius: 0 0 40px 40px;
  transform: translate(-50%, 0);
  z-index: 2;
}
`;

const GoogleLogoCSS = () => (
  <div className="logo-container">
    <div className="logo-g">
      <div className="g-line"></div>
      <div className="g-inner"></div>
      <div className="g-bar"></div>
    </div>
  </div>
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
      <div className="mb-4 text-center text-base text-gray-900">
        {isLogin ? (
          <>
            Need an account?{' '}
            <Link to="/signup" className="text-gray-900 font-semibold hover:underline">Make one</Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 font-semibold hover:underline">Sign in</Link>
          </>
        )}
      </div>
      <div className="flex items-center w-full my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <button className="w-full mb-3 py-3 rounded-full bg-black text-white flex items-center justify-center text-lg font-medium hover:bg-gray-900 transition">
        <span className="mr-3"><GoogleLogoCSS /></span>
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-nature-glass text-gray-900 font-inter px-4">
      <AuthForm mode={mode} />
    </div>
  );
};

export default Login; 