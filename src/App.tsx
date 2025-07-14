import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Team from './Team';
import './App.css';
import PromptTemplates from './components/PromptTemplates';
import Analytics from './components/Analytics';
import Login from './components/Login';
import VoiceDictation, { VoiceDictationHandle } from './components/VoiceDictation';
import TeamMemberPage from './components/TeamMemberPage';

interface PromptHistory {
  id: string;
  original: string;
  enhanced: string;
  rating: number;
  timestamp: Date;
  category: string;
}

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-glassgreen-500/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
};

// Intersection Observer Hook for Scroll Animations
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isVisible];
};

// Animated Section Component
const AnimatedSection = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" }) => {
  const [ref, isVisible] = useIntersectionObserver();

  const directions = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8"
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : `opacity-0 transform ${directions[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Enhanced Micro-Button Component
const MicroButton = ({ children, variant = "primary", className = "", ...props }: { children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string; [key: string]: any }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = "relative overflow-hidden rounded-full font-semibold transition-all duration-300 transform";
  
  const variants: Record<string, string> = {
    primary: "bg-glassgreen-500 text-glassblue-900 hover:bg-glassgreen-400 shadow-glass",
    secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
    ghost: "text-white/80 hover:text-white"
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variants[variant]} ${className} ${
        isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Ripple effect */}
      <span 
        className="absolute inset-0 bg-white/20 transform scale-0 transition-transform duration-300 rounded-full" 
        style={{ transform: isPressed ? 'scale(1)' : 'scale(0)' }} 
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <button
      className={`relative overflow-hidden rounded-full transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`
      }}
    >
      {children}
    </button>
  );
};

// Enhanced Floating Input Component
const FloatingInput = ({ label, value, onChange, placeholder, maxLength, ...props }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; maxLength?: number; [key: string]: any }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  return (
    <div className="relative">
      <input
        {...props}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 py-3 bg-white/10 backdrop-blur-glass border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-glassgreen-500 transition-all duration-300"
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <label 
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue 
            ? 'top-2 text-xs text-glassgreen-400' 
            : 'top-3 text-sm text-white/60'
        }`}
      >
        {label}
      </label>
      
      {/* Focus indicator */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
        isFocused ? 'ring-2 ring-glassgreen-500/50' : ''
      }`} />
    </div>
  );
};

// Animated Character Counter Component
const AnimatedCharacterCounter = ({ current, max, className = "" }: { current: number; max: number; className?: string }) => {
  const progress = (current / max) * 100;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xs text-white/80">{current}/{max}</span>
      <div className="w-8 h-8 relative">
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke={progress > 80 ? '#ef4444' : '#a8e063'}
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 14}`}
            strokeDashoffset={`${2 * Math.PI * 14 * (1 - animatedProgress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  );
};

// Enhanced Tilt Card Component
const TiltCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className={`bg-white/10 backdrop-blur-glass border border-white/20 rounded-2xl p-8 transition-all duration-500 hover:bg-white/15 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)' 
          : '0 8px 32px rgba(31, 38, 135, 0.18)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Animated Icon Component
const AnimatedIcon = ({ icon: Icon, className = "" }: { icon: React.ComponentType<{ className?: string }>; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon 
        className={`w-6 h-6 transition-all duration-300 ${
          isHovered ? 'text-glassgreen-400 scale-110' : 'text-white/80'
        }`}
      />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isHovered ? 'bg-glassgreen-400/20 blur-md scale-150' : 'scale-100'
      }`} />
    </div>
  );
};

function App() {
  const { t } = useTranslation();
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showHistory, setShowHistory] = useState(false);
  const [enhancementMode, setEnhancementMode] = useState('standard');
  const [characterCount, setCharacterCount] = useState(0);
  const [showAbout, setShowAbout] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceRef = useRef<VoiceDictationHandle>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setCharacterCount(originalPrompt.length);
  }, [originalPrompt]);

  const handleEnhance = async () => {
    if (!originalPrompt.trim()) return;
    
    setIsEnhancing(true);
    
    // Simulate API call with mock enhancement
    setTimeout(() => {
      const mockEnhanced = `Enhanced: ${originalPrompt}\n\nContext: This prompt has been optimized for better AI understanding and response quality.`;
      setEnhancedPrompt(mockEnhanced);
      setIsEnhancing(false);
      setShowRating(true);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedPrompt);
    // Show copy feedback
  };

  const handleRate = (rating: number) => {
    setCurrentRating(rating);
    const newEntry: PromptHistory = {
      id: Date.now().toString(),
      original: originalPrompt,
      enhanced: enhancedPrompt,
      rating,
      timestamp: new Date(),
      category: selectedCategory
    };
    setPromptHistory([newEntry, ...promptHistory]);
    setShowRating(false);
    setOriginalPrompt('');
    setEnhancedPrompt('');
    setCurrentRating(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleEnhance();
    }
  };

  // Example: chat history state (empty for now)
  const chatHistory: string[] = [];

  // Example user state (replace with real auth/user data)
  const user = {
    isLoggedIn: false, // set to true if logged in
    name: 'Hayden',
    email: 'hayden@example.com',
    profilePic: '', // set to image URL if available
  };

  // About overlay modal
  const AboutOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-lg transition-all" onClick={() => setShowAbout(false)} />
      <div className="relative w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-glass rounded-3xl shadow-glass p-8 flex flex-col items-center mt-16 mb-16" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold" onClick={() => setShowAbout(false)} aria-label="Close">×</button>
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 tracking-tight text-white">About Promptly</h1>
        <p className="text-lg md:text-xl text-white/90 font-light text-center max-w-2xl mb-8">Promptly is dedicated to helping you create better AI prompts with a modern, minimalist, and nature-inspired design.</p>
        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
          <div className="text-white/90 mb-6">
            <div>Have questions, feedback, or partnership ideas? Reach out to us through:</div>
            <div className="mt-2">Email: <a href="mailto:hello@promptly.app" className="underline text-glassgreen-300">hello@promptly.app</a></div>
            <div className="mt-2">Instagram: <span className="underline text-glassgreen-300">promptlyed</span></div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <div className="mb-4">
            <h3 className="font-semibold text-white mb-1">What is Promptly?</h3>
            <p className="text-white/80">Promptly is a package of intuitive prompt enhancement tools that takes a user's rough prompt and transforms it into an optimized version for daily tasks.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-white mb-1">When will Promptly launch?</h3>
            <p className="text-white/80">We plan to release a beta version in early October 2025. Stay tuned for updates via our Instagram and mailing list.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-white mb-1">How can I join Promptly at launch?</h3>
            <p className="text-white/80">Enter your email on our waitlist. We'll notify you shortly before launch.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-white mb-1">Is Promptly free?</h3>
            <p className="text-white/80">Promptly offers a free tier for everyone with limited features. Premium features will be added in the future.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Close About overlay on Esc
  useEffect(() => {
    if (!showAbout) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAbout(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAbout]);

  // WorkspacePage: main chat/workflow area
  const WorkspacePage = () => (
    <div className="min-h-screen flex bg-nature-glass text-white font-inter">
      {/* Sidebar */}
      <aside className="w-80 bg-white/10 backdrop-blur-glass border-r border-white/10 flex flex-col p-6 min-h-screen">
        <div className="mb-8">
          <div className="text-2xl font-extrabold tracking-tight text-white mb-6">
            Promptly
          </div>
          <button className="w-full flex items-center justify-center py-2 mb-6 rounded-xl bg-glassgreen-500/80 text-glassblue-900 font-semibold shadow-glass hover:bg-glassgreen-400 transition text-base">
            <span className="mr-2">＋</span> New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto mb-6">
          <div className="text-xs text-white/60 mb-2">Recent</div>
          {/* Only show chats if there is history */}
          {chatHistory.length > 0 ? (
            <ul className="space-y-2">
              {chatHistory.map((chat, idx) => (
                <li key={idx} className="truncate text-white/90 hover:bg-white/10 rounded-lg px-3 py-2 cursor-pointer transition">{chat}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="mt-auto">
          {user.isLoggedIn && (
            <div className="flex items-center space-x-2 mt-2">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-glassgreen-500/80 flex items-center justify-center text-glassblue-900 font-bold">
                  {user.name ? user.name[0].toLowerCase() : '?'}
                </div>
              )}
              <span className="text-white/80 text-sm">My Profile</span>
            </div>
          )}
        </div>
      </aside>
      {/* Main area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mt-[-10vh]">
          <div className="flex items-center mb-2">
            <span className="inline-block w-10 h-10 bg-gradient-to-br from-glassgreen-500 to-glassblue-700 rounded-full flex items-center justify-center mr-3">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="14" fill="#4ADE80"/><text x="50%" y="55%" textAnchor="middle" fill="#1e293b" fontSize="16" fontWeight="bold" dy=".3em">P</text></svg>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-glassblue-100">Hi, I'm Promptly.</h2>
          </div>
          <p className="text-white/80 text-lg mb-8">How can I help you today?</p>
          <div className="w-full max-w-xl">
            <div className="rounded-2xl bg-white/60 border border-white/30 flex items-center px-6 py-4 shadow-glass">
              <input
                type="text"
                placeholder="Message Promptly"
                className="flex-1 bg-transparent outline-none text-lg text-glassblue-900 placeholder:text-glassblue-400 font-inter"
              />
              <button className="ml-3 px-4 py-2 rounded-full bg-glassgreen-500 text-glassblue-900 font-semibold shadow-glass hover:bg-glassgreen-400 transition">Search</button>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <button className="px-4 py-1 rounded-full bg-white/20 border border-white/20 text-white/80 font-medium text-sm flex items-center">Summarize Email</button>
              <button className="px-4 py-1 rounded-full bg-white/20 border border-white/20 text-white/80 font-medium text-sm flex items-center">Draft Reply</button>
              <button className="px-4 py-1 rounded-full bg-white/20 border border-white/20 text-white/80 font-medium text-sm flex items-center">Daily Planner</button>
              <button className="px-4 py-1 rounded-full bg-white/20 border border-white/20 text-white/80 font-medium text-sm flex items-center">Idea Generator</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-nature-glass text-white font-inter flex flex-col">
        {/* Navigation Bar */}
        <nav className="w-full flex items-center justify-between px-8 py-4 bg-transparent">
          <Link to="/" className="flex items-center space-x-2 group focus:outline-none">
            <div className="w-8 h-8 bg-gradient-to-br from-glassgreen-500 to-glassblue-700 rounded-xl flex items-center justify-center shadow-glass group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-lg">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-glassgreen-300 transition-colors">Promptly</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/team" className="text-white/80 hover:text-white text-sm font-medium transition">{t('Team')}</Link>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/80 hover:text-white text-sm font-medium transition bg-transparent border-none outline-none cursor-pointer">{t('Features')}</button>
            <button type="button" onClick={() => setShowAbout(true)} className="text-white/80 hover:text-white text-sm font-medium transition bg-transparent border-none outline-none cursor-pointer">{t('About')}</button>
                          <button onClick={() => setShowAbout(true)} className="text-white/80 hover:text-white text-sm font-medium transition bg-transparent border-none outline-none cursor-pointer">{t('Contact')}</button>
            <Link to="/login" className="ml-4 px-5 py-2 rounded-full bg-glassgreen-500 text-glassblue-900 font-semibold shadow-glass hover:bg-glassgreen-400 transition text-center">{t('Get started for free')}</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/team" element={<Team />} />
          <Route path="/team/:name" element={<TeamMemberPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/" element={
            <main className="flex-1 flex flex-col">
              {/* Hero Section */}
              <section className="flex flex-col items-center justify-center flex-1 px-4 pt-8 pb-16">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-glassgreen-500/20 border border-glassgreen-500/30 text-glassgreen-300 text-sm font-medium mb-6">
                    <span className="w-2 h-2 bg-glassgreen-400 rounded-full mr-2 animate-pulse"></span>
                    AI-Powered Prompt Enhancement
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-center leading-tight mb-6 tracking-tight text-white" style={{letterSpacing: '-0.02em'}}>{t('Start simple, learn fast, and build toward excellence.')}</h1>
                  <p className="text-lg md:text-xl text-white/90 font-light text-center max-w-2xl mb-8">{t('Promptly is your AI prompt assistant. Transform rough ideas into perfect prompts with a single click. Minimal, modern, and inspired by the best in design.')}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <MicroButton 
                      variant="primary" 
                      className="px-8 py-3 text-lg"
                      onClick={() => window.location.href = '/login'}
                    >
                      {t('Get started for free')}
                    </MicroButton>
                    <MicroButton 
                      variant="secondary" 
                      className="px-8 py-3 text-lg"
                      onClick={() => setShowAbout(true)}
                    >
                      Watch Demo
                    </MicroButton>
                  </div>
                </div>
                {/* Glassy Card for Prompt Enhancer */}
                <div className="w-full max-w-xl mx-auto bg-white/30 backdrop-blur-glass border border-white/20 rounded-3xl shadow-glass p-8 flex flex-col items-center" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
                  <label className="block text-base font-medium text-white mb-2 self-start">{t('Your Prompt')}</label>
                  {/* Voice Dictation Integration */}
                  <div className="w-full mb-4">
                    <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-glassgreen-500 via-glassblue-700 to-glassgreen-400 shadow-glass">
                      <textarea
                        ref={textareaRef}
                        value={originalPrompt}
                        onChange={(e) => setOriginalPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={t('Type your rough prompt here... (Ctrl+Enter to enhance)')}
                        className="w-full h-32 p-6 bg-white/30 backdrop-blur-glass border-none rounded-2xl text-lg text-white placeholder-white/80 font-inter focus:outline-none focus:ring-2 focus:ring-glassgreen-500 transition-all duration-300 resize-none shadow-glass pr-14"
                        maxLength={2000}
                      />
                      {/* Microphone Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isListening) {
                            voiceRef.current?.stopListening();
                            setIsListening(false);
                          } else {
                            voiceRef.current?.startListening();
                            setIsListening(true);
                          }
                        }}
                        className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${isListening ? 'bg-glassgreen-500 text-glassblue-900 animate-pulse' : 'bg-white/30 text-white/80 hover:bg-glassgreen-400 hover:text-glassblue-900'}`}
                        aria-label={isListening ? 'Stop dictation' : 'Start dictation'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 01-6 0V7a3 3 0 016 0v5z" />
                        </svg>
                      </button>
                      {/* VoiceDictation (hidden, controlled by ref) */}
                      <VoiceDictation
                        ref={voiceRef}
                        onResult={text => setOriginalPrompt(prev => prev + text)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full mb-6">
                    <AnimatedCharacterCounter current={characterCount} max={2000} />
                    <MicroButton
                      onClick={handleEnhance}
                      disabled={!originalPrompt.trim() || isEnhancing}
                      className="px-6 py-2 font-inter"
                      variant="primary"
                    >
                      {isEnhancing ? (
                        <span className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-glassgreen-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('Enhancing...')}</span>
                        </span>
                      ) : (
                        t('Enhance Prompt')
                      )}
                    </MicroButton>
                  </div>
                  {/* Enhanced Result */}
                  {enhancedPrompt && (
                    <div className="w-full bg-glassblue-500/30 border border-glassblue-700 rounded-xl p-4 mb-4 backdrop-blur-glass">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{t('Enhanced Prompt')}</span>
                        <button
                          onClick={handleCopy}
                          className="text-white/80 hover:text-white text-xs font-medium transition-colors"
                        >
                          📋 {t('Copy')}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-white font-mono font-inter">{enhancedPrompt}</pre>
                    </div>
                  )}
                  {/* Rating Section */}
                  {showRating && (
                    <div className="w-full flex flex-col items-center mt-2">
                      <h3 className="text-base font-medium text-white mb-2 text-center">{t('How well did this enhancement work?')}</h3>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleRate(rating)}
                            className="text-2xl hover:scale-110 transition-transform duration-300 text-glassgreen-500"
                          >
                            {rating <= currentRating ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-white/80 text-center">{t('Your feedback helps improve our enhancement algorithm')}</p>
                    </div>
                  )}
                </div>
              </section>
              {/* Features Section */}
              <section id="features" className="py-20 px-4 bg-white/5 backdrop-blur-glass">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Why Choose Promptly?</h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">Transform your AI interactions with our intelligent prompt enhancement technology</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    <AnimatedSection delay={0}>
                      <TiltCard delay={0}>
                        <div className="w-12 h-12 bg-gradient-to-br from-glassgreen-500 to-glassblue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-glassgreen-300 transition-colors">Lightning Fast</h3>
                        <p className="text-white/80 group-hover:text-white/90 transition-colors">Enhance your prompts in seconds with our optimized AI algorithms</p>
                      </TiltCard>
                    </AnimatedSection>
                    <div className="bg-white/10 backdrop-blur-glass border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-glassgreen-500 to-glassblue-700 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Smart Enhancement</h3>
                      <p className="text-white/80">AI-powered suggestions that understand context and improve clarity</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-glass border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-glassgreen-500 to-glassblue-700 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Privacy First</h3>
                      <p className="text-white/80">Your prompts are processed securely and never stored permanently</p>
                    </div>
                  </div>
                </div>
              </section>
              {/* Use Cases Section */}
              <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Perfect for Every Use Case</h2>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">From creative writing to business communication, Promptly enhances your AI interactions</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-glassblue-700/20 to-glassgreen-500/20 border border-white/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-4">✍️</div>
                      <h3 className="text-lg font-bold text-white mb-2">Content Creation</h3>
                      <p className="text-white/70 text-sm">Blog posts, social media, and marketing copy</p>
                    </div>
                    <div className="bg-gradient-to-br from-glassblue-700/20 to-glassgreen-500/20 border border-white/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-4">💼</div>
                      <h3 className="text-lg font-bold text-white mb-2">Business</h3>
                      <p className="text-white/70 text-sm">Emails, reports, and professional communication</p>
                    </div>
                    <div className="bg-gradient-to-br from-glassblue-700/20 to-glassgreen-500/20 border border-white/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-4">🎨</div>
                      <h3 className="text-lg font-bold text-white mb-2">Creative Writing</h3>
                      <p className="text-white/70 text-sm">Stories, scripts, and artistic expression</p>
                    </div>
                    <div className="bg-gradient-to-br from-glassblue-700/20 to-glassgreen-500/20 border border-white/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl mb-4">📚</div>
                      <h3 className="text-lg font-bold text-white mb-2">Academic</h3>
                      <p className="text-white/70 text-sm">Research, essays, and educational content</p>
                    </div>
                  </div>
                </div>
              </section>
              {/* Call to Action Section */}
              <section className="py-20 px-4 bg-gradient-to-r from-glassblue-700/20 to-glassgreen-500/20">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to Transform Your AI Experience?</h2>
                  <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Join thousands of users who are already creating better prompts with Promptly. Start your journey today.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <MicroButton 
                      variant="primary" 
                      className="px-8 py-4 text-lg"
                      onClick={() => window.location.href = '/login'}
                    >
                      Get Started Free
                    </MicroButton>
                    <MicroButton 
                      variant="secondary" 
                      className="px-8 py-4 text-lg"
                      onClick={() => setShowAbout(true)}
                    >
                      Learn More
                    </MicroButton>
                  </div>
                  <p className="text-sm text-white/60 mt-4">No credit card required • Free forever plan available</p>
                </div>
              </section>
              {/* Notion-style Footer */}
              <footer className="w-full bg-white/10 text-white/90 py-12 px-4 mt-16 flex flex-col items-center border-t border-white/10">
                <div className="w-full max-w-6xl flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                  {/* Logo and Socials */}
                  <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-glassgreen-500 to-glassblue-700 rounded-xl flex items-center justify-center shadow-glass mr-2">
                        <span className="text-white font-extrabold text-2xl">P</span>
                      </div>
                      <span className="text-2xl font-bold tracking-tight text-white">{t('Promptly StartUp')}</span>
                    </div>
                    <div className="flex space-x-4 mb-4">
                      <a href="#" aria-label="Instagram" className="hover:text-glassgreen-400"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg></a>
                      <a href="#" aria-label="Reddit" className="hover:text-glassgreen-400"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M21.6 13.2c0-1.1-.9-2-2-2-.5 0-1 .2-1.3.5-1.2-.8-2.8-1.3-4.6-1.4l.9-4.1 3.5.8c0 .6.5 1 1.1 1 .6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1c-.4 0-.8.2-1 .6l-3.8-.8c-.2 0-.4.1-.4.3l-1 4.5c-1.8.1-3.4.6-4.6 1.4-.3-.3-.8-.5-1.3-.5-1.1 0-2 .9-2 2 0 .7.4 1.3 1 1.7-.1.4-.2.8-.2 1.3 0 2.6 3.1 4.7 7 4.7s7-2.1 7-4.7c0-.4-.1-.9-.2-1.3.6-.4 1-1 1-1.7zm-13.2 1.1c0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1c-.6 0-1.1-.5-1.1-1.1zm8.2 2.2c-.9.9-2.7 1-3.6 1s-2.7-.1-3.6-1c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .6.6 2.1.8 2.9.8.8 0 2.3-.2 2.9-.8.2-.2.5-.2.7 0 .2.2.2.5 0 .7zm-.1-1.1c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1z"/></svg></a>
                      <a href="#" aria-label="LinkedIn" className="hover:text-glassgreen-400"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg></a>
                      <a href="#" aria-label="GitHub" className="hover:text-glassgreen-400"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z"/></svg></a>
                      <a href="#" aria-label="YouTube" className="hover:text-glassgreen-400"><svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.072 0 12 0 12s0 3.928.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.5 20.5 12 20.5 12 20.5s7.5 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.928 24 12 24 12s0-3.928-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                    </div>
                  </div>
                  {/* Columns */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                    <div>
                      <h4 className="font-semibold mb-3">{t('Company')}</h4>
                      <ul className="space-y-2 text-sm">
                        {/* <li><a href="#" className="hover:underline">About us</a></li> */}
                        <li><a href="#" className="hover:underline">{t('Careers')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Our Journey')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Terms & Conditions')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Privacy Rights')}</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{t('Product')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">{t('iOS & Android')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Mac & Windows')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Web Extension')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Features')}</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{t('Resources')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">{t('Help center')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Pricing')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Community')}</a></li>
                        <li><a href="#" className="hover:underline">{t('Templates')}</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Promptly StartUp</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:underline">Enterprise</a></li>
                        <li><a href="#" className="hover:underline">Small business</a></li>
                        <li><a href="#" className="hover:underline">Personal</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mt-8 border-t border-white/10 pt-6 text-xs text-white/60">
                  <div className="mb-2 md:mb-0 text-left w-full md:w-auto">© 2025 Promptly StartUp, Inc.</div>
                  <div className="font-semibold text-white/80 flex items-center">Explore more <span className="ml-1">→</span></div>
                </div>
              </footer>
            </main>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
        </Routes>
        {showAbout && <AboutOverlay />}
        <FloatingParticles />
      </div>
    </Router>
  );
}

export default App;
