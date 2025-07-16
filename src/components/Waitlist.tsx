import React, { useState, useRef, useEffect } from 'react';
import LiquidGlassButton from './LiquidGlassButton';

// Pastel gradient for heading (peach to teal/blue)
const logoGradient = {
  background: 'linear-gradient(90deg, #F7CBA0 0%, #BFD8C2 50%, #7DBAC1 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
};

const navLinks = [
  { name: 'Support', href: '#' },
];

const quickLinks = [
  { name: 'Our Flagship Product', href: '#' },
  { name: 'Team', href: '#' },
  { name: 'AI Features', href: '#' },
  { name: 'Pricing', href: '#' },
];

const faqList = [
  {
    q: 'What is SilentLabs?',
    a: "SilentLabs is a suite of intuitive collaboration and productivity tools designed to help teams work smarter, inspired by modern, minimalist, and daily-basis design.",
  },
  {
    q: 'When will our flagship product launch?',
    a: "We plan to release a beta version of Silent in early October 2025. Simply add your email or phone number on our waitlist for the latest updates. We'll notify you shortly before launch.",
  },
  {
    q: 'How is my data handled?',
    a: "Your data is safe with us. We use MongoDB Atlas, a secure cloud database service, and exercise necessary security measures to protect your information. ",
  },
  {
    q: 'Is SilentLabs free?',
    a: 'The pricing is not yet determined.',
  },
];

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [inputError, setInputError] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchShouldRender, setSearchShouldRender] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportVisible, setSupportVisible] = useState(false);
  const [supportShouldRender, setSupportShouldRender] = useState(false);
  const supportModalRef = useRef<HTMLDivElement>(null);

  // Animate search overlay open/close
  useEffect(() => {
    if (searchOpen) {
      setSearchShouldRender(true);
      setTimeout(() => setSearchVisible(true), 10);
    } else if (searchShouldRender) {
      setSearchVisible(false);
      const timeout = setTimeout(() => setSearchShouldRender(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [searchOpen]);

  // Close overlay on Escape or click outside
  useEffect(() => {
    if (!searchShouldRender) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSearchOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [searchShouldRender]);

  // Animate support modal open/close
  useEffect(() => {
    if (supportOpen) {
      setSupportShouldRender(true);
      setTimeout(() => setSupportVisible(true), 10); // allow render before animating in
    } else if (supportShouldRender) {
      setSupportVisible(false);
      const timeout = setTimeout(() => setSupportShouldRender(false), 500); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [supportOpen]);

  // Support modal close on Escape or click outside
  useEffect(() => {
    if (!supportShouldRender) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSupportOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (
        supportModalRef.current &&
        !supportModalRef.current.contains(e.target as Node)
      ) {
        setSupportOpen(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [supportShouldRender]);

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  function validateEmailOrPhone(value: string) {
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Simple phone regex (digits, spaces, dashes, parentheses, plus)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailOrPhone(email.trim())) {
      setInputError('Please enter a valid email or phone number.');
      return;
    }
    setInputError('');
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse at bottom right, #F7F3EA 60%, #F7CBA0 120%)',
        transition: 'background 0.3s',
      }}
    >
      {/* Apple-style Header */}
      <header
        className="fixed top-0 left-0 w-full z-30 flex items-center justify-center shadow-sm"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          minHeight: '48px',
          borderBottom: '1px solid #f2e9de',
        }}
      >
        <nav className="w-full max-w-7xl flex items-center justify-between px-4 md:px-8" style={{height: 48}}>
          {/* Left: Stylized Logo */}
          <div className="flex items-center min-w-[120px]">
            <span
              className="text-xl font-bold select-none"
              style={{
                ...logoGradient,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              SilentLabs
            </span>
          </div>
          {/* Center: (empty for now) */}
          <div className="flex-1" />
          {/* Right: Support link and Icons */}
          <div className="flex items-center gap-4 min-w-[60px] justify-end">
            {/* Support Link */}
            <a
              href="#"
              className="text-base font-medium hover:underline transition hidden md:inline"
              style={{
                color: '#222',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                textDecorationThickness: '2px',
                textUnderlineOffset: '4px',
                padding: '2px 0',
              }}
              onClick={e => { e.preventDefault(); setSupportOpen(true); }}
            >
              Support
            </a>
            {/* Search Icon */}
            <button
              aria-label="Search"
              className="p-1 rounded hover:bg-gray-100 transition"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setSearchOpen(true)}
            >
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>
            {/* Cart Icon replaced with Sign In */}
            <button
              aria-label="Sign In"
              className="p-1 rounded hover:bg-gray-100 transition"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="22" height="22" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 19c0-2.5 3.5-4.5 8-4.5s8 2 8 4.5" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
      {/* Spacer for fixed header */}
      <div style={{ height: 56 }} />
      {/* Main Content */}
      <h1
        className="text-6xl md:text-7xl font-extrabold mb-4 text-center"
        style={{
          ...logoGradient,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          letterSpacing: '-0.03em',
          whiteSpace: 'nowrap',
        }}
      >
        SilentLabs
      </h1>
      <h2
        className="text-2xl md:text-3xl font-semibold mb-2 text-[#7DBAC1]"
        style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        Conversational workspace based in New York.
      </h2>
      <p
        className="text-lg mb-8 text-center"
        style={{
          color: '#6B8B8B', // darker than #A3B6B6
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        Be the first to know when we launch.
      </p>
      {submitted ? (
        <div
          className="rounded-2xl px-8 py-6 text-center text-lg shadow-lg max-w-md w-full"
          style={{
            background: 'rgba(255,255,255,0.85)',
            color: '#7DBAC1',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 600,
          }}
        >
          You’re on our waitlist!
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col items-center gap-4"
        >
          <input
            type="text"
            required
            placeholder="Your email or phone number"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-6 py-4 border rounded-2xl outline-none text-lg shadow-md focus:border-[#7DBAC1] focus:border-2 transition"
            aria-label="Enter your email or phone number"
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderColor: '#E3E8E8',
              color: '#7B8B99', // darker placeholder
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
              boxShadow: '0 2px 12px 0 rgba(180,200,210,0.10)',
            }}
          />
          {inputError && (
            <div className="text-red-500 text-sm mt-1 w-full text-center">{inputError}</div>
          )}
          <LiquidGlassButton
            type="submit"
            className="mt-2"
          >
            Join
          </LiquidGlassButton>
        </form>
      )}
      {/* Search Overlay */}
      {searchShouldRender && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-start bg-[#f7f7f8] bg-opacity-95 transition-all duration-500 ease-out ${searchVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
        >
          <div className={`w-full max-w-3xl mx-auto mt-24 px-4 transition-all duration-500 ease-out ${searchVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            <div className="flex items-center border-b border-gray-300 pb-2">
              <svg width="32" height="32" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="mr-2">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search silentlabs.org"
                className="w-full text-2xl md:text-3xl font-semibold bg-transparent outline-none border-none placeholder-gray-400"
                style={{color: '#555', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif'}}
              />
            </div>
            <div className="mt-8">
              <div className="text-base text-gray-500 mb-3 font-medium">Directory</div>
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-lg text-gray-700 hover:text-[#7DBAC1] transition font-medium"
                    >
                      <svg width="18" height="18" fill="none" stroke="#7DBAC1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Support Modal Overlay */}
      {supportShouldRender && (
        <div
          className={`fixed inset-0 z-50 flex justify-center overflow-y-auto transition-opacity duration-500 ease-out ${supportVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'rgba(247, 247, 248, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'background 0.4s',
          }}
        >
          <div
            ref={supportModalRef}
            className={`w-full max-w-2xl mx-auto my-12 rounded-2xl bg-white/90 shadow-xl px-8 py-10 md:py-14 md:px-16 flex flex-col items-center max-h-[90vh] overflow-y-auto transition-all duration-500 ease-out ${supportVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
            style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
              boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10)',
            }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center" style={{color: '#444'}}>About SilentLabs</h2>
            <p className="text-lg text-center mb-8" style={{color: '#666'}}>Parent Company: SilentLabs Inc.</p>
            <div className="w-full max-w-lg mx-auto mb-8">
              <h3 className="text-xl font-bold mb-2" style={{color: '#444'}}>Contact Us</h3>
              <p className="mb-3 text-gray-700">Want to foster ideas for our conversation? Reach us through:</p>
              <div className="mb-1 text-gray-700">Email: <a href="mailto:silenstartup@gmail.com" className="no-underline text-[#7DBAC1]">silenstartup@gmail.com</a></div>
              <div className="mb-1 text-gray-700">Instagram: <a href="https://www.instagram.com/meet.silentlabs/" target="_blank" rel="noopener noreferrer" className="no-underline text-[#7DBAC1]">meet.silentlabs</a></div>
            </div>
            <div className="w-full max-w-lg mx-auto">
              <h3 className="text-xl font-bold mb-3" style={{color: '#444'}}>Frequently Asked Questions</h3>
              <ul className="space-y-4">
                {faqList.map(faq => (
                  <li key={faq.q}>
                    <div className="font-semibold mb-1" style={{color: '#444'}}>{faq.q}</div>
                    <div className="text-gray-700 text-base">{faq.a}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Footer Section */}
      <div className="mt-16 flex flex-col items-center w-full">
        <div className="flex items-center justify-center mb-0 font-semibold tracking-wide">
          <span
            className="text-lg md:text-lg"
            style={{
              color: '#7CA18A', // darker than #BFD8C2
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            Talk to us with your ideas
          </span>
          <a
            href="https://www.instagram.com/meet.silentlabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 outline-none group"
            style={{
              display: 'inline-block',
              borderRadius: '8px',
              transition: 'background 0.2s',
              position: 'relative',
              top: '4px',
            }}
            tabIndex={0}
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ borderRadius: '8px', transition: 'background 0.2s' }}
            >
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
                <rect x="4" y="4" width="28" height="28" rx="7" stroke="#BFD8C2" strokeWidth="3.5" fill="none" className="insta-rect"/>
                <circle cx="18" cy="18" r="7" stroke="#BFD8C2" strokeWidth="3.5" fill="none" className="insta-circle"/>
                <circle cx="24.5" cy="11.5" r="2.5" fill="#BFD8C2" className="insta-dot"/>
              </svg>
            </span>
            <style>{`
              .group:hover .insta-rect, .group:focus .insta-rect,
              .group:hover .insta-circle, .group:focus .insta-circle {
                stroke: #7DBAC1 !important;
              }
              .group:hover .insta-dot, .group:focus .insta-dot {
                fill: #7DBAC1 !important;
              }
              .group:hover span, .group:focus span {
                background: none !important;
              }
            `}</style>
          </a>
        </div>
        <div
          className="text-base text-center mb-2"
          style={{
            color: '#6B8B8B', // darker than #A3B6B6
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          {/* Email removed as requested */}
        </div>
        <div
          className="text-lg text-center -mt-1 font-semibold tracking-wide"
          style={{
            color: '#7CA18A', // darker than #BFD8C2
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          © 2025 SilentLabs, Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Waitlist; 