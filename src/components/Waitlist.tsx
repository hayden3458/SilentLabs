import React, { useState } from 'react';

const gradientText = {
  background: 'linear-gradient(90deg, #7B61FF 0%, #2EC4F1 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
};

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{background: '#000'}}>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6" style={{...gradientText, fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
        SilentLabs
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
        Conversational workspace based in New York.
      </h2>
      <p className="text-lg text-gray-400 mb-8 text-center" style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
        Be the first to know when we launch.
      </p>
      {submitted ? (
        <div className="bg-white/10 rounded-2xl px-8 py-6 text-center text-lg text-green-300 shadow-lg max-w-md w-full" style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>You’re on our waitlist!</div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center gap-4">
          <input
            type="email"
            required
            placeholder="Your email or phone number"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-md text-gray-200 placeholder-gray-400 border border-white/20 rounded-2xl outline-none text-lg shadow-lg focus:border-white/40 focus:border-2 transition"
            aria-label="Enter your email"
            style={{boxShadow: '0 4px 24px 0 rgba(44,62,80,0.12), 0 0 0 1.5px rgba(180,220,255,0.12)', background: 'rgba(20,24,34,0.55)', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}} 
          />
          <button
            type="submit"
            className="py-2 mt-2 px-6 flex items-center justify-center rounded-[2rem] text-lg font-semibold transition focus:outline-none"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
              letterSpacing: '0.01em',
              minWidth: '160px',
              marginLeft: 'auto',
              background: '#eceef1',
              color: '#a0a4b8',
              boxShadow: '0 0 40px 8px #fff, 6px 6px 16px #d1d9e6, -6px -6px 16px #ffffff, 0 1px 0 0 #fff inset',
              border: 'none',
              borderRadius: '2rem',
              textAlign: 'center',
            }}
          >
            Join
          </button>
        </form>
      )}
      {/* Footer Section */}
      <div className="mt-16 flex flex-col items-center w-full">
        <div className="flex items-center justify-center mb-2">
          <span className="text-base md:text-lg text-gray-400" style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>Talk to us with your ideas</span>
          <a
            href="https://www.instagram.com/meet.silentlabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 outline-none group"
            style={{display: 'inline-block', borderRadius: '8px', transition: 'background 0.2s', position: 'relative', top: '4px'}}
            tabIndex={0}
          >
            <span className="inline-flex items-center justify-center" style={{borderRadius: '8px', transition: 'background 0.2s'}}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all insta-icon"
                style={{
                  display: 'inline',
                  verticalAlign: 'middle',
                  borderRadius: '8px',
                  boxShadow: '0 0 0 0 transparent',
                }}
              >
                <rect x="4" y="4" width="28" height="28" rx="7" stroke="#bfc4cc" strokeWidth="3.5" fill="none" className="insta-rect"/>
                <circle cx="18" cy="18" r="7" stroke="#bfc4cc" strokeWidth="3.5" fill="none" className="insta-circle"/>
                <circle cx="24.5" cy="11.5" r="2.5" fill="#bfc4cc" className="insta-dot"/>
              </svg>
            </span>
            <style>{`
              .group:hover .insta-rect, .group:focus .insta-rect,
              .group:hover .insta-circle, .group:focus .insta-circle {
                stroke: #fff !important;
              }
              .group:hover .insta-dot, .group:focus .insta-dot {
                fill: #fff !important;
              }
              .group:hover span, .group:focus span {
                background: none !important;
              }
            `}</style>
          </a>
        </div>
        <div className="text-base text-gray-300 text-center mb-2" style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
          Email: <a href="mailto:silenstartup@gmail.com" className="underline hover:text-white transition">silenstartup@gmail.com</a>
        </div>
        <div className="text-lg text-gray-400 text-center" style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}>
          © 2025 SilentLabs StartUp, Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Waitlist; 