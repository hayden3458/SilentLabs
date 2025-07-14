import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Team from './Team';
import './App.css';
import PromptTemplates from './components/PromptTemplates';
import Analytics from './components/Analytics';
import LanguageSelector from './components/LanguageSelector';
import Login from './components/Login';
import VoiceDictation, { VoiceDictationHandle } from './components/VoiceDictation';
import TeamMemberPage from './components/TeamMemberPage';
import PromptBuilder from './components/PromptBuilder';
import { useNavigate } from 'react-router-dom';

interface PromptHistory {
  id: string;
  original: string;
  enhanced: string;
  rating: number;
  timestamp: Date;
  category: string;
}

// BricksLoader animation component
const BricksLoader: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#F5F0E6]">
    <div style={{ display: 'flex', gap: 8 }}>
      {[0, 1, 2, 3, 4].map((col) => (
        <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className="animate-brick"
              style={{
                width: 32,
                height: 16,
                borderRadius: 4,
                background: `linear-gradient(90deg, #F5CBA7 0%, #A3CEF1 100%)`,
                marginBottom: 2,
                animationDelay: `${(col * 0.15 + row * 0.1)}s`,
                boxShadow: '0 2px 8px 0 rgba(34,34,59,0.08)'
              }}
            />
          ))}
        </div>
      ))}
    </div>
    <style>{`
      @keyframes brick-bounce {
        0% { transform: translateY(40px) scaleY(0.7); opacity: 0.2; }
        60% { transform: translateY(-8px) scaleY(1.1); opacity: 1; }
        80% { transform: translateY(2px) scaleY(0.95); }
        100% { transform: translateY(0) scaleY(1); opacity: 1; }
      }
      .animate-brick {
        animation: brick-bounce 1s cubic-bezier(.68,-0.55,.27,1.55) infinite alternate;
      }
    `}</style>
  </div>
);

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
  const [showTutorial, setShowTutorial] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(320); // default width in px
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceRef = useRef<VoiceDictationHandle>(null);
  const [isListening, setIsListening] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  // Add state to control showing the chat home page
  const [showChatHome, setShowChatHome] = useState(true);
  const [loading, setLoading] = useState(false);

  // Recent chats and user state
  const [recentChats, setRecentChats] = useState([
    { id: '1', title: 'Welcome!', messages: [], timestamp: Date.now() },
    { id: '2', title: 'Project Ideas', messages: [], timestamp: Date.now() - 100000 },
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  const [user] = useState({ name: 'Hayden', email: 'hayden@example.com', avatar: '' });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Feature card interaction states
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const categories = [
    { id: 'general', name: 'General', icon: '💬' },
    { id: 'creative', name: 'Creative', icon: '✍️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'technical', name: 'Technical', icon: '⚙️' },
    { id: 'academic', name: 'Academic', icon: '📚' },
    { id: 'marketing', name: 'Marketing', icon: '📢' }
  ];

  const enhancementModes = [
    { id: 'standard', name: 'Standard', description: 'Balanced enhancement' },
    { id: 'concise', name: 'Concise', description: 'Shorter, focused prompts' },
    { id: 'detailed', name: 'Detailed', description: 'Comprehensive prompts' },
    { id: 'creative', name: 'Creative', description: 'Imaginative rewrites' }
  ];

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

  const clearHistory = () => {
    setPromptHistory([]);
  };

  const handleTemplateSelect = (template: string) => {
    setOriginalPrompt(template);
  };

  // Example: chat history state (empty for now)
  const chatHistory: string[] = [];

  // Add chat
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat = { id: newId, title: 'New Chat', messages: [], timestamp: Date.now() };
    setRecentChats([{ ...newChat }, ...recentChats]);
    setActiveChatId(newId);
    setShowChatHome(true);
  };

  // Delete chat
  const handleDeleteChat = (id: string) => {
    setDeleteChatId(id);
    setShowDeleteConfirm(true);
  };
  const confirmDeleteChat = () => {
    if (deleteChatId) {
      setRecentChats(recentChats.filter(chat => chat.id !== deleteChatId));
      if (activeChatId === deleteChatId && recentChats.length > 1) {
        setActiveChatId(recentChats.find(chat => chat.id !== deleteChatId)!.id);
      }
      setDeleteChatId(null);
      setShowDeleteConfirm(false);
    }
  };
  const cancelDeleteChat = () => {
    setDeleteChatId(null);
    setShowDeleteConfirm(false);
  };

  // Feature card demo functions
  const handleCardClick = (cardId: string) => {
    setActiveCard(cardId);
    setShowDemo(cardId);
    setDemoProgress(0);
    
    // Simulate demo progress
    const interval = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleCardHover = (cardId: string) => {
    setActiveCard(cardId);
  };

  const handleCardLeave = () => {
    setActiveCard(null);
    setShowDemo(null);
    setDemoProgress(0);
  };

  // Swipeable cards functionality
  const handleCardScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = 320 + 24; // card width + gap
    const newSlide = Math.round(scrollLeft / cardWidth);
    setCurrentSlide(newSlide);
  };

  const scrollToCard = (index: number) => {
    const container = document.querySelector('.swipeable-cards-container');
    if (container) {
      const cardWidth = 320 + 24; // card width + gap
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(index);
    }
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

  // Handle sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing.current && sidebarRef.current) {
      const min = 200, max = 500;
      const newWidth = Math.min(Math.max(e.clientX, min), max);
      setSidebarWidth(newWidth);
    }
  };
  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = '';
  };
  useEffect(() => {
    if (!sidebarOpen) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarOpen]);

  // WorkspacePage: main chat/workflow area
  const WorkspacePage = () => (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-inter relative overflow-hidden">
      {/* Background glass orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 glass-orb opacity-20"></div>
      <div className="absolute bottom-40 right-32 w-24 h-24 glass-orb opacity-15" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 glass-orb opacity-25" style={{animationDelay: '6s'}}></div>
      
      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 max-w-xs w-full flex flex-col items-center glass-modal">
            <h3 className="text-lg font-bold text-[#22223B] mb-4">Delete chat?</h3>
            <p className="text-[#4A4E69] mb-6 text-center">Are you sure you want to delete this chat history? This action cannot be undone.</p>
            <div className="flex gap-4 w-full">
              <button className="flex-1 py-2 rounded-lg bg-[#F5CBA7] text-[#22223B] font-semibold hover:bg-[#F3B97A] transition glass-button liquid-ripple" onClick={confirmDeleteChat}>Delete</button>
              <button className="flex-1 py-2 rounded-lg bg-[#A3CEF1] text-[#22223B] font-semibold hover:bg-[#7FB6E0] transition glass-button liquid-ripple" onClick={cancelDeleteChat}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Sidebar */}
      {sidebarOpen ? (
        <aside
          ref={sidebarRef}
          className="bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col p-6 min-h-screen relative transition-all duration-200 glass-nav"
          style={{ width: sidebarWidth, minWidth: 200, maxWidth: 500 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="text-2xl font-extrabold tracking-tight text-white mb-6 liquid-text">
              Promptly
            </div>
            <button
              className="ml-2 text-white/70 hover:text-white text-xl font-bold px-2 py-1 rounded transition glass-button liquid-ripple"
              style={{ marginTop: '-1.5rem' }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          <button className="w-full flex items-center justify-center py-2 mb-3 rounded-xl bg-gradient-to-r from-[#F5CBA7] to-[#A3CEF1] text-[#22223B] font-semibold shadow-lg hover:shadow-xl transition text-base glass-button liquid-ripple"
            onClick={handleNewChat}>
            + New chat
          </button>
          {/* Recent Chats */}
          <div className="mt-6">
            <div className="text-xs text-[#4A4E69] font-semibold mb-2">Recent</div>
            <ul className="space-y-1">
              {recentChats.map(chat => (
                <li key={chat.id} className="group relative">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg transition font-medium flex items-center pr-10 glass-nav-item ${activeChatId === chat.id ? 'bg-gradient-to-r from-[#F5CBA7] to-[#A3CEF1] text-[#22223B]' : 'bg-white/0 text-[#4A4E69] hover:bg-white/20'}`}
                    onClick={() => { setActiveChatId(chat.id); setShowChatHome(true); }}
                  >
                    <span className="truncate block flex-1">{chat.title}</span>
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#F5CBA7] hover:bg-[#F3B97A] text-[#B00020] rounded-full p-1 w-7 h-7 flex items-center justify-center shadow glass-button liquid-ripple"
                    onClick={() => handleDeleteChat(chat.id)}
                    tabIndex={-1}
                    aria-label="Delete chat"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Draggable handle */}
          <div
            onMouseDown={handleMouseDown}
            style={{ position: 'absolute', top: 0, right: 0, width: 8, height: '100%', cursor: 'ew-resize', zIndex: 10 }}
          />
          {/* Profile/Settings at bottom */}
          <div className="mt-auto pt-8 flex flex-col items-center">
            <div className="relative w-full flex items-center justify-center">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-[#22223B] font-semibold w-full justify-center glass-button liquid-ripple"
                onClick={() => setShowProfileDropdown(v => !v)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5CBA7] to-[#A3CEF1] flex items-center justify-center text-lg font-bold modern-pulse">
                    {user.name[0]}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </button>
              {showProfileDropdown && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg py-2 w-40 z-50 border border-white/20 glass-modal">
                  <button className="block w-full text-left px-4 py-2 text-[#22223B] hover:bg-[#F5CBA7]/40 transition glass-nav-item" onClick={() => setShowProfileDropdown(false)}>Profile</button>
                  <button className="block w-full text-left px-4 py-2 text-[#22223B] hover:bg-[#A3CEF1]/40 transition glass-nav-item" onClick={() => setShowProfileDropdown(false)}>Settings</button>
                  <button className="block w-full text-left px-4 py-2 text-[#B00020] hover:bg-[#F5CBA7]/40 transition glass-nav-item" onClick={() => setShowProfileDropdown(false)}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </aside>
      ) : (
        <button
          className="fixed top-6 left-0 z-50 bg-gradient-to-r from-[#F5CBA7] to-[#A3CEF1] text-[#22223B] font-bold px-2 py-1 rounded-r-xl shadow-lg hover:shadow-xl transition glass-button liquid-ripple"
          style={{ minWidth: 32 }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          ≡
        </button>
      )}
      {/* Main area */}
      <main className="workspace-main flex-1 flex flex-col items-center justify-center">
        {loading && <BricksLoader />}
        {showChatHome && !loading ? (
          // Main chat home page UI
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mt-[-10vh]">
              <div className="flex items-center mb-2">
                <span className="inline-block w-10 h-10 bg-gradient-to-br from-[#F5CBA7] to-[#A3CEF1] rounded-full flex items-center justify-center mr-3 modern-pulse">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="14" fill="#4ADE80"/><text x="50%" y="55%" textAnchor="middle" fill="#1e293b" fontSize="16" fontWeight="bold" dy=".3em">P</text></svg>
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white liquid-text">Hi, I'm Promptly.</h2>
              </div>
              <p className="text-[#4A4E69] text-lg mb-8">How can I help you today?</p>
              <div className="w-full max-w-xl">
                <div className="rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center px-6 py-4 shadow-lg glass-input">
                  <input
                    type="text"
                    placeholder="Message Promptly"
                    className="flex-1 bg-transparent outline-none text-lg text-white placeholder:text-white/60 font-inter"
                  />
                  <button
                    className="ml-3 px-4 py-2 rounded-full bg-gradient-to-r from-[#F5CBA7] to-[#A3CEF1] text-[#22223B] font-semibold shadow-lg hover:shadow-xl transition glass-button liquid-ripple"
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => setLoading(false), 2000); // Simulate generation
                    }}
                  >Search</button>
                </div>
                <div className="flex items-center space-x-3 mt-4">
                  <button className="px-4 py-1 rounded-full bg-gradient-to-r from-[#F5CBA7] to-[#A3CEF1] text-[#22223B] font-medium text-sm flex items-center glass-button liquid-ripple">Summarize Email</button>
                  <button className="px-4 py-1 rounded-full bg-gradient-to-r from-[#A3CEF1] to-[#F5CBA7] text-[#22223B] font-medium text-sm flex items-center glass-button liquid-ripple">Draft Reply</button>
                  <button className="px-4 py-1 rounded-full bg-gradient-to-r from-[#F5CBA7] to-[#A3CEF1] text-[#22223B] font-medium text-sm flex items-center glass-button liquid-ripple">Daily Planner</button>
                  <button className="px-4 py-1 rounded-full bg-gradient-to-r from-[#A3CEF1] to-[#F5CBA7] text-[#22223B] font-medium text-sm flex items-center glass-button liquid-ripple">Idea Generator</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Future chat UI or other content here */}
          </div>
        )}
      </main>
    </div>
  );

  return (
      <Router>
      <div className="min-h-screen bg-white text-gray-900 font-inter flex flex-col pt-[88px]">
          {/* Navigation Bar */}
        <nav className="w-full flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg glass-nav fixed top-0 left-0 z-50" style={{backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'}}>
          <Link to="/" className="flex items-center space-x-3 group focus:outline-none transition-transform duration-300 hover:scale-105 liquid-ripple">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mr-2 modern-pulse">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-black">Promptly</span>
          </Link>
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search features..." 
                className="w-64 px-4 py-2 pl-10 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 placeholder-gray-500"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Mobile Search Button */}
            <button className="md:hidden p-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/80 transition glass-button liquid-ripple">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Features Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] text-sm font-semibold transition-all duration-300 hover:scale-105 glass-nav-item footer-black-underline flex items-center gap-1">
                {t('Features')}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 glass-modal">
                <div className="p-4 space-y-3">
                  <a href="/enhance" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Prompt Enhancement</div>
                    <div className="text-xs text-gray-500">Transform rough prompts instantly</div>
                  </a>
                  <a href="/search" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Prompt Search</div>
                    <div className="text-xs text-gray-500">Find and organize your prompts</div>
                  </a>
                  <a href="/projects" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Project Management</div>
                    <div className="text-xs text-gray-500">Manage prompt-based projects</div>
                  </a>
                  <a href="#voice" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Voice Input</div>
                    <div className="text-xs text-gray-500">Speak your prompts naturally</div>
                  </a>
                </div>
              </div>
            </div>

            {/* Solutions Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] text-sm font-semibold transition-all duration-300 hover:scale-105 glass-nav-item footer-black-underline flex items-center gap-1">
                Solutions
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 glass-modal">
                <div className="p-4 space-y-3">
                  <a href="#enterprise" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Enterprise</div>
                    <div className="text-xs text-gray-500">For large organizations</div>
                  </a>
                  <a href="#startup" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Startups</div>
                    <div className="text-xs text-gray-500">Scale your AI workflow</div>
                  </a>
                  <a href="#personal" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition glass-nav-item">
                    <div className="font-semibold">Personal</div>
                    <div className="text-xs text-gray-500">Individual productivity</div>
                  </a>
                </div>
              </div>
            </div>

            <Link to="/team" className="text-gray-700 hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] text-sm font-semibold transition-all duration-300 hover:scale-105 glass-nav-item footer-black-underline">{t('Team')}</Link>
            <button type="button" onClick={() => setShowAbout(true)} className="text-gray-700 hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] text-sm font-semibold transition-all duration-300 hover:scale-105 bg-transparent border-none outline-none cursor-pointer glass-nav-item footer-black-underline">{t('About')}</button>
            
            {/* Language Selector in Header */}
            {/* <div className="hidden lg:block">
              <LanguageSelector />
            </div> */}

            <Link to="/login" className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center glass-button liquid-ripple nav-blue-gradient-btn">
              {t('Get started for free')}
            </Link>
          </div>
          </nav>
          <Routes>
            <Route path="/team" element={<Team />} />
            <Route path="/team/:name" element={<TeamMemberPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/" element={
              <main className="flex-1 flex flex-col">
              {/* Notion-style Hero Section */}
              <section className="w-full flex flex-col items-center justify-center pt-16 pb-10 px-4 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 relative overflow-hidden">
                {/* Floating glass orbs */}
                <div className="absolute top-20 left-10 w-8 h-8 glass-orb opacity-60"></div>
                <div className="absolute top-40 right-20 w-6 h-6 glass-orb opacity-40" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 left-1/4 w-4 h-4 glass-orb opacity-50" style={{animationDelay: '4s'}}></div>
                
                <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-6 leading-tight liquid-text" style={{letterSpacing: '-0.01em'}}>
                  Start simple, learn fast,<br className="hidden md:block" /> and build toward excellence.
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4 modern-pulse">Promptly is your AI prompt assistant.</h2>
                <p className="text-lg md:text-xl text-center text-gray-700 max-w-2xl mb-8 liquid-flow">Transform rough ideas into perfect prompts with a single click. Minimal, modern, and inspired by the best in design.</p>
              </section>
              {/* Notion-style Trusted Bar */}
              <div className="w-full flex flex-col items-center py-6 bg-white/0">
                <div className="text-xs text-gray-400 mb-2 tracking-wide">Recommended by teams</div>
                <div className="flex flex-wrap gap-6 items-center justify-center text-black/80 text-lg font-bold opacity-80">
                  <span>OpenAI</span>
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span>Figma</span>
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span>Claude</span>
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span>Notion</span>
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  <span>Vercel</span>
                </div>
              </div>

              {/* Notion-style Feature Cards Grid */}
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-12 px-2 md:px-0">
                {/* Prompt Enhancement Card */}
                <div 
                  className={`group relative rounded-3xl border border-red-200 bg-gradient-to-br from-red-100 via-red-200 to-orange-100 shadow-lg p-8 flex flex-col min-h-[380px] transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-red-300 cursor-pointer overflow-hidden plastic-card liquid-card-hover ${activeCard === 'enhance' ? 'ring-4 ring-red-300' : ''}`}
                  onClick={() => handleCardClick('enhance')}
                  onMouseEnter={() => handleCardHover('enhance')}
                  onMouseLeave={handleCardLeave}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-orange-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating glass particles */}
                  <div className="absolute top-4 right-4 w-3 h-3 glass-particle opacity-0 group-hover:opacity-100 transition-all duration-700" style={{animationDelay: '0.1s'}}></div>
                  <div className="absolute top-8 right-8 w-2 h-2 glass-particle opacity-0 group-hover:opacity-100 transition-all duration-700" style={{animationDelay: '0.3s'}}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500 font-semibold text-sm group-hover:text-red-600 transition-colors">Prompt Conversation</span>
                      <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full ml-2 group-hover:bg-red-200 transition-colors modern-pulse">New</span>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">Perfect prompts every time.</h2>
                    <p className="text-gray-700 mb-6 group-hover:text-gray-600 transition-colors">Instantly transform rough ideas into clear, effective prompts for any AI model. Enhance, structure, and optimize with a single click.</p>
                    
                    {/* Interactive Demo Area */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-red-100 p-4 shadow-inner flex flex-col gap-2 group-hover:shadow-lg transition-all duration-300 group-hover:border-red-200 glass-input">
                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                          <span>Prompt @Today</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Animated text effect */}
                        <div className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                          <span className="inline-block group-hover:animate-pulse">"Summarize this meeting in 3 bullet points."</span>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <span className="bg-red-100 text-red-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                            AI Enhanced
                          </span>
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors">Original</span>
                        </div>
                        
                        {/* Demo progress indicator */}
                        {showDemo === 'enhance' && (
                          <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-red-200 via-red-400 to-red-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${demoProgress}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {/* Hover demo overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50/90 to-orange-50/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced action button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href='/enhance';
                    }}
                    className="absolute top-6 right-6 bg-white/80 hover:bg-red-100 text-red-500 rounded-full p-2 shadow transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-red-200 glass-button liquid-ripple"
                  >
                    <span className="text-xl group-hover:rotate-12 transition-transform duration-300 text-red-500">→</span>
                  </button>
                </div>

                {/* Prompt Search Card */}
                <div 
                  className={`group relative rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-100 shadow-lg p-8 flex flex-col min-h-[380px] transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-300 cursor-pointer overflow-hidden plastic-card liquid-card-hover ${activeCard === 'search' ? 'ring-4 ring-blue-300' : ''}`}
                  onClick={() => handleCardClick('search')}
                  onMouseEnter={() => handleCardHover('search')}
                  onMouseLeave={handleCardLeave}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating glass particles */}
                  <div className="absolute top-4 right-4 w-3 h-3 glass-particle opacity-0 group-hover:opacity-100 transition-all duration-700" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute top-8 right-8 w-2 h-2 glass-particle opacity-0 group-hover:opacity-100 transition-all duration-700" style={{animationDelay: '0.4s'}}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-500 font-semibold text-sm group-hover:text-blue-600 transition-colors">Prompt Search</span>
                      <span className="bg-blue-100 text-blue-500 text-xs font-bold px-2 py-0.5 rounded-full ml-2 group-hover:bg-blue-200 transition-colors modern-pulse">New</span>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">One search for every prompt.</h2>
                    <p className="text-gray-700 mb-6 group-hover:text-gray-600 transition-colors">Find, organize, and reuse your best prompts. Search across all your prompt history, categories, and projects in one place.</p>
                    
                    {/* Interactive Demo Area */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 p-4 shadow-inner flex flex-col gap-2 group-hover:shadow-lg transition-all duration-300 group-hover:border-blue-200 glass-input">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-400 text-xs">Search</span>
                          <span className="text-gray-500 text-xs">@All Prompts</span>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Animated search input */}
                        <div className="flex gap-2 text-sm text-gray-700 group-hover:text-gray-800 transition-colors">
                          <span className="font-semibold group-hover:animate-pulse">"Brainstorm startup ideas"</span>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <span className="bg-blue-100 text-blue-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                            Project
                          </span>
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors">Personal</span>
                        </div>
                        
                        {/* Search results preview */}
                        <div className="mt-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="h-1 bg-blue-200 rounded-full w-3/4"></div>
                          <div className="h-1 bg-blue-200 rounded-full w-1/2"></div>
                          <div className="h-1 bg-blue-200 rounded-full w-5/6"></div>
                        </div>
                        
                        {/* Demo progress indicator */}
                        {showDemo === 'search' && (
                          <div className="mt-2 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-200 via-blue-400 to-blue-700 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${demoProgress}%` }}
                            ></div>
                          </div>
                        )}
                        
                        {/* Hover demo overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 to-cyan-50/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced action button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href='/search';
                    }}
                    className="absolute top-6 right-6 bg-white/80 hover:bg-blue-100 text-blue-500 rounded-full p-2 shadow transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-blue-200 glass-button liquid-ripple"
                  >
                    <span className="text-xl group-hover:rotate-12 transition-transform duration-300 text-blue-500">→</span>
                  </button>
                </div>
              </div>

              {/* Projects Card (full width on mobile, right on desktop) */}
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-1 gap-8 pb-16 px-2 md:px-0">
                <div 
                  className={`group relative rounded-3xl border border-yellow-200 bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-100 shadow-lg p-8 flex flex-col min-h-[220px] transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:border-yellow-300 cursor-pointer overflow-hidden plastic-card liquid-card-hover ${activeCard === 'projects' ? 'ring-4 ring-yellow-300' : ''}`}
                  onClick={() => handleCardClick('projects')}
                  onMouseEnter={() => handleCardHover('projects')}
                  onMouseLeave={handleCardLeave}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 to-orange-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating glass particles */}
                  <div className="absolute top-4 right-4 w-3 h-3 glass-particle opacity-0 group-hover:opacity-100 transition-all duration-700" style={{animationDelay: '0.1s'}}></div>
                  <div className="absolute top-8 right-8 w-2 h-2 glass-particle opacity-0 group-hover:opacity-100 transition-all duration-700" style={{animationDelay: '0.3s'}}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600 font-semibold text-sm group-hover:text-yellow-700 transition-colors">Prompt Projects</span>
                    </div>
                    <h2 className="text-2xl font-extrabold mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">Keep every prompt project on sync.</h2>
                    <p className="text-gray-700 mb-4 group-hover:text-gray-600 transition-colors">Organize, plan, and track your prompt-based projects. Collaborate, assign, and manage all your prompt workflows in one place.</p>
                    
                    {/* Interactive Demo Area */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-yellow-100 p-4 shadow-inner flex flex-col gap-2 group-hover:shadow-lg transition-all duration-300 group-hover:border-yellow-200 glass-input">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-600 text-xs font-bold">Project</span>
                          <span className="text-gray-400 text-xs">Prompt Launch Plan</span>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className="text-base font-semibold text-gray-800 group-hover:text-gray-900 transition-colors group-hover:animate-pulse">
                          "Launch campaign prompt set"
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                            In Progress
                          </span>
                          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors">Team</span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2 bg-gray-200 rounded-full h-1.5 group-hover:bg-gray-300 transition-colors overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: showDemo === 'projects' ? `${demoProgress}%` : '75%' }}
                          ></div>
                        </div>
                        
                        {/* Hover demo overlay - only keep the colored overlay, remove icon, emoji, and text */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced action button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href='/projects';
                    }}
                    className="absolute top-6 right-6 bg-white/80 hover:bg-yellow-100 text-yellow-600 rounded-full p-2 shadow transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-yellow-200 glass-button liquid-ripple"
                  >
                    <span className="text-xl group-hover:rotate-12 transition-transform duration-300 text-yellow-600">→</span>
                  </button>
                </div>
              </div>

              {/* New Interactive Demo Section */}
              <section className="w-full max-w-6xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold gradient-black mb-4 liquid-text">See Promptly in Action</h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto liquid-flow">Watch your prompts transform in real-time with our interactive demo</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 glass-modal">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">Input</span>
                        <span className="bg-red-50 text-red-400 text-xs px-2 py-0.5 rounded-full">Live Demo</span>
                      </div>
                      
                      <div className="space-y-4">
                        <textarea 
                          className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/60 backdrop-blur-sm resize-none demo-textarea"
                          placeholder="Type your rough prompt here..."
                          defaultValue="Summarize this meeting"
                        />
                        
                        <div className="flex gap-2">
                          <button 
                            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition glass-button liquid-ripple"
                            onClick={() => {
                              // Simulate enhancement
                              const textarea = document.querySelector('.demo-textarea') as HTMLTextAreaElement;
                              if (textarea) {
                                textarea.value = "Please provide a comprehensive summary of the meeting in 3-4 bullet points, including key decisions made, action items assigned, and next steps. Focus on the most important outcomes and any deadlines mentioned.";
                              }
                            }}
                          >
                            Enhance
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition glass-button liquid-ripple">
                            Audio
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Output Section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">Enhanced Output</span>
                        <span className="bg-green-50 text-green-400 text-xs px-2 py-0.5 rounded-full">AI Optimized</span>
                      </div>
                      
                      <div className="bg-green-50/60 border border-green-200 rounded-xl p-4 min-h-[120px] flex items-center">
                        <div className="text-gray-800 font-medium">
                          "Please provide a comprehensive summary of the meeting in 3-4 bullet points, including key decisions made, action items assigned, and next steps. Focus on the most important outcomes and any deadlines mentioned."
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition glass-button liquid-ripple">
                          Copy
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition glass-button liquid-ripple">
                          Rate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* New Social Proof Section */}
              <section className="w-full max-w-6xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold gradient-black mb-4 liquid-text">Trusted by Teams Worldwide</h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto liquid-flow">Join thousands of professionals who've transformed their AI workflow</p>
                </div>
                
                {/* Animated Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 text-center glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="text-4xl font-extrabold text-gray-900 mb-2 modern-pulse count-up">10,000+</div>
                    <div className="text-gray-600 font-medium">Prompts Enhanced</div>
                    <div className="text-xs text-gray-400 mt-2">Last 30 days</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 text-center glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="text-4xl font-extrabold text-gray-900 mb-2 modern-pulse count-up">98%</div>
                    <div className="text-gray-600 font-medium">User Satisfaction</div>
                    <div className="text-xs text-gray-400 mt-2">Based on 2,500+ reviews</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 text-center glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="text-4xl font-extrabold text-gray-900 mb-2 modern-pulse count-up">500+</div>
                    <div className="text-gray-600 font-medium">Active Teams</div>
                    <div className="text-xs text-gray-400 mt-2">From 50+ countries</div>
                  </div>
                </div>
                
                {/* Testimonials Carousel */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 p-8 glass-modal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          S
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Sarah Chen</div>
                          <div className="text-sm text-gray-600">Product Manager, TechCorp</div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"Promptly has revolutionized how our team writes AI prompts. We've seen a 40% improvement in response quality."</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          M
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Marcus Rodriguez</div>
                          <div className="text-sm text-gray-600">Content Creator, CreativeStudio</div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"The prompt enhancement feature saves me hours every week. It's like having an AI expert on my team."</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* New Swipeable Feature Cards Section */}
              <section className="w-full max-w-6xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold gradient-black mb-4 liquid-text">Advanced Features</h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto liquid-flow">Discover powerful tools designed for professional AI workflows</p>
                </div>
                
                <div className="relative overflow-hidden">
                  <div 
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory swipeable-cards-container"
                    onScroll={handleCardScroll}
                    style={{
                      scrollBehavior: 'smooth',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {/* Voice Dictation Card */}
                    <div className="min-w-[320px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 flex-shrink-0 snap-start glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">Voice Input</span>
                        <span className="bg-purple-50 text-purple-400 text-xs px-2 py-0.5 rounded-full">New</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Speak Your Prompts</h3>
                      <p className="text-gray-600 mb-4">Transform your voice into perfectly crafted prompts with advanced speech recognition.</p>
                      <div className="bg-purple-50/60 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          "Create a marketing plan for..."
                        </div>
                      </div>
                      <button className="w-full py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition glass-button liquid-ripple">
                        Try Voice Input
                      </button>
                    </div>

                    {/* Analytics Card */}
                    <div className="min-w-[320px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 flex-shrink-0 snap-start glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">Analytics</span>
                        <span className="bg-blue-50 text-blue-400 text-xs px-2 py-0.5 rounded-full">Pro</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Insights</h3>
                      <p className="text-gray-600 mb-4">Track your prompt performance and optimize based on real data and feedback.</p>
                      <div className="bg-blue-50/60 rounded-xl p-3 mb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Success Rate</span>
                            <span className="text-gray-900 font-semibold">94%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '94%'}}></div>
                          </div>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition glass-button liquid-ripple">
                        View Analytics
                      </button>
                    </div>

                    {/* Templates Card */}
                    <div className="min-w-[320px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 flex-shrink-0 snap-start glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">Templates</span>
                        <span className="bg-green-50 text-green-400 text-xs px-2 py-0.5 rounded-full">Popular</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Ready-to-Use Templates</h3>
                      <p className="text-gray-600 mb-4">Access hundreds of pre-built prompts for common use cases and industries.</p>
                      <div className="bg-green-50/60 rounded-xl p-3 mb-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">📧 Email Writing</div>
                          <div className="text-sm text-gray-700">📊 Data Analysis</div>
                          <div className="text-sm text-gray-700">🎨 Creative Writing</div>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition glass-button liquid-ripple">
                        Browse Templates
                      </button>
                    </div>

                    {/* Collaboration Card */}
                    <div className="min-w-[320px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-6 flex-shrink-0 snap-start glass-modal hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">Team</span>
                        <span className="bg-orange-50 text-orange-400 text-xs px-2 py-0.5 rounded-full">Enterprise</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Team Collaboration</h3>
                      <p className="text-gray-600 mb-4">Share, comment, and collaborate on prompts with your team in real-time.</p>
                      <div className="bg-orange-50/60 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                          </div>
                          <span className="text-sm text-gray-600">3 team members</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition glass-button liquid-ripple">
                        Invite Team
                      </button>
                    </div>
                  </div>
                  
                  {/* Swipe Indicators */}
                  <div className="flex justify-center gap-2 mt-6">
                    {[0, 1, 2, 3].map((index) => (
                      <button
                        key={index}
                        onClick={() => scrollToCard(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentSlide === index 
                            ? 'bg-blue-500 w-6' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* New Pricing Section */}
              <section className="w-full max-w-6xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold gradient-black mb-4 liquid-text">Simple, Transparent Pricing</h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto liquid-flow">Choose the plan that fits your needs. Start free, upgrade anytime.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-8 glass-modal">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                      <div className="text-4xl font-extrabold text-gray-900 mb-1">$0</div>
                      <div className="text-gray-600">Forever</div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        10 prompts per day
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Basic templates
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Community support
                      </li>
                    </ul>
                    
                    <button className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition glass-button liquid-ripple">
                      Get Started Free
                    </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-blue-200 p-8 glass-modal relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                    </div>
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                      <div className="text-4xl font-extrabold text-gray-900 mb-1">$9</div>
                      <div className="text-gray-600">per month</div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Unlimited prompts
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Advanced templates
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Analytics & insights
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Priority support
                      </li>
                    </ul>
                    
                    <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition glass-button liquid-ripple">
                      Start Pro Trial
                    </button>
                  </div>

                  {/* Enterprise Plan */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 p-8 glass-modal">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                      <div className="text-4xl font-extrabold text-gray-900 mb-1">Custom</div>
                      <div className="text-gray-600">Contact us</div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Everything in Pro
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Team collaboration
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Custom integrations
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✓</span>
                        Dedicated support
                      </li>
                    </ul>
                    
                    <button className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition glass-button liquid-ripple">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </section>

              {/* New Use Cases Section */}
              <section className="w-full max-w-6xl mx-auto py-16 px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold gradient-black mb-4 liquid-text">Popular Use Cases</h2>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto liquid-flow">Discover how professionals use Promptly across different industries</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 p-6 glass-modal hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Email Writing</h3>
                    <p className="text-gray-600 text-sm">Craft professional emails, follow-ups, and responses in seconds.</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 p-6 glass-modal hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Data Analysis</h3>
                    <p className="text-gray-600 text-sm">Generate insights and reports from complex datasets.</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 p-6 glass-modal hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Creative Writing</h3>
                    <p className="text-gray-600 text-sm">Brainstorm ideas, write stories, and develop creative content.</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 p-6 glass-modal hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Business Planning</h3>
                    <p className="text-gray-600 text-sm">Develop strategies, business plans, and market analysis.</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 p-6 glass-modal hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Academic Research</h3>
                    <p className="text-gray-600 text-sm">Write research papers, literature reviews, and academic content.</p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/30 p-6 glass-modal hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Startup Ideas</h3>
                    <p className="text-gray-600 text-sm">Generate business ideas, validate concepts, and plan launches.</p>
                  </div>
                </div>
              </section>

              {/* Notion-style Footer */}
              <footer className="w-full bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 border-t border-white/20 text-gray-700 py-16 px-4 mt-16 flex flex-col items-center relative overflow-hidden">
                {/* Background glass orbs */}
                <div className="absolute top-10 left-10 w-16 h-16 glass-orb opacity-30"></div>
                <div className="absolute bottom-10 right-10 w-12 h-12 glass-orb opacity-25" style={{animationDelay: '4s'}}></div>
                
                <div className="w-full max-w-6xl flex flex-col md:flex-row md:justify-between md:items-start gap-12">
                    {/* Logo and Socials */}
                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mr-3 modern-pulse">
                        <span className="text-white font-black text-2xl">P</span>
                      </div>
                      <span className="text-3xl font-black tracking-tight text-black">Promptly StartUp</span>
                    </div>
                    <div className="flex space-x-6 mb-6">
                      <button aria-label="Instagram" className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 glass-button liquid-ripple">
                        <svg width="20" height="20" fill="#E1306C" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                      </button>
                      <button aria-label="Reddit" className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 glass-button liquid-ripple"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21.6 13.2c0-1.1-.9-2-2-2-.5 0-1 .2-1.3.5-1.2-.8-2.8-1.3-4.6-1.4l.9-4.1 3.5.8c0 .6.5 1 1.1 1 .6 0 1.1-.5 1.1-1.1s-.5-1.1-1.1-1.1c-.4 0-.8.2-1 .6l-3.8-.8c-.2 0-.4.1-.4.3l-1 4.5c-1.8.1-3.4.6-4.6 1.4-.3-.3-.8-.5-1.3-.5-1.1 0-2 .9-2 2 0 .7.4 1.3 1 1.7-.1.4-.2.8-.2 1.3 0 2.6 3.1 4.7 7 4.7s7-2.1 7-4.7c0-.4-.1-.9-.2-1.3.6-.4 1-1 1-1.7zm-13.2 1.1c0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1c-.6 0-1.1-.5-1.1-1.1zm8.2 2.2c-.9.9-2.7 1-3.6 1s-2.7-.1-3.6-1c-.2-.2-.2-.5 0-.7.2-.2.5-.2.7 0 .6.6 2.1.8 2.9.8.8 0 2.3-.2 2.9-.8.2-.2.5-.2.7 0 .2.2.2.5 0 .7zm-.1-1.1c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1z"/></svg></button>
                      <button aria-label="LinkedIn" className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 glass-button liquid-ripple">
                        <svg width="20" height="20" fill="#0077B5" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
                      </button>
                      <button aria-label="GitHub" className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 glass-button liquid-ripple">
                        <svg width="20" height="20" fill="#333" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.16.58.67.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z"/></svg>
                      </button>
                      <button aria-label="YouTube" className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 glass-button liquid-ripple">
                        <svg width="20" height="20" fill="#FF0000" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.072 0 12 0 12s0 3.928.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.5 20.5 12 20.5 12 20.5s7.5 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.928 24 12 24 12s0-3.928-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <LanguageSelector />
                      </div>
                    </div>
                    {/* Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                      <div>
                      <h4 className="font-bold mb-4 text-lg">Company</h4>
                      <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Careers</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Our Journey</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Terms & Conditions</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Privacy Rights</button></li>
                        </ul>
                      </div>
                      <div>
                      <h4 className="font-bold mb-4 text-lg">Product</h4>
                      <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">iOS & Android</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Mac & Windows</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Web Extension</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Features</button></li>
                        </ul>
                      </div>
                      <div>
                      <h4 className="font-bold mb-4 text-lg">Resources</h4>
                      <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Help center</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Pricing</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Community</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Templates</button></li>
                        </ul>
                      </div>
                      <div>
                      <h4 className="font-bold mb-4 text-lg">Promptly StartUp</h4>
                      <ul className="space-y-3 text-sm">
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Enterprise</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Small business</button></li>
                        <li><button className="hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 hover:scale-105 inline-block glass-nav-item footer-black-underline">Personal</button></li>
                        </ul>
                    </div>
                  </div>
                  </div>
                <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center border-t border-white/20 pt-8 text-sm text-gray-400 mt-0">
                    <div className="mb-2 md:mb-0 text-left w-full md:w-auto">© 2025 Promptly StartUp, Inc.</div>
                  <div className="font-bold text-gray-500 flex items-center hover:text-[#22223B] focus:text-[#22223B] active:text-[#22223B] transition-colors duration-300 glass-nav-item footer-black-underline">Explore more <span className="ml-2">→</span></div>
                  </div>
                </footer>
              </main>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
          <Route path="/enhance" element={<EnhancePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
          {showAbout && <AboutOverlay />}
        </div>
      </Router>
  );
}

function EnhancePage() {
  return (
    <div className="min-h-screen bg-red-50/60 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Main Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-red-100 p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full">AI Prompt Enhancement</span>
            <span className="bg-red-50 text-red-400 text-xs px-2 py-0.5 rounded-full">New</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Enhance your prompts instantly</h1>
          <p className="text-gray-700 mb-6">Paste or type your rough prompt below and let our AI optimize it for clarity, context, and effectiveness. Perfect for any AI model.</p>
          <textarea className="w-full h-32 p-4 border border-red-100 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-200" placeholder="Type your rough prompt here..."></textarea>
          <button className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition">Enhance Prompt</button>
          <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">Enhanced Prompt</div>
            <div className="text-gray-800 font-mono">"Summarize this meeting in 3 bullet points. Include key decisions and next steps."</div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white rounded-3xl shadow-lg border border-red-100 p-8 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-red-500 mb-2">How it works</h2>
          <ul className="text-gray-700 text-sm list-disc pl-4 space-y-2">
            <li>Paste or dictate your rough prompt</li>
            <li>Click "Enhance Prompt"</li>
            <li>Get a clear, effective prompt ready for any AI</li>
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-1">Why enhance?</h3>
            <p className="text-gray-600 text-xs">Well-crafted prompts get better, more accurate AI results. Our enhancer helps you get there, fast.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchPage() {
  return (
    <div className="min-h-screen bg-blue-50/60 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Main Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-blue-100 p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-500 text-xs font-bold px-2 py-0.5 rounded-full">Prompt Search</span>
            <span className="bg-blue-50 text-blue-400 text-xs px-2 py-0.5 rounded-full">New</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Search your prompt library</h1>
          <p className="text-gray-700 mb-6">Find, organize, and reuse your best prompts. Search across all your prompt history, categories, and projects in one place.</p>
          <div className="flex items-center gap-2 mb-4">
            <input className="flex-1 p-3 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Search prompts..." />
            <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition">Search</button>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">Results</div>
            <div className="text-gray-800 font-mono mb-2">"Brainstorm startup ideas for a student project"</div>
            <div className="text-gray-600 text-xs">Category: Project &nbsp; | &nbsp; Last used: 2 days ago</div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white rounded-3xl shadow-lg border border-blue-100 p-8 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-blue-500 mb-2">Tips for searching</h2>
          <ul className="text-gray-700 text-sm list-disc pl-4 space-y-2">
            <li>Use keywords or categories</li>
            <li>Filter by project or date</li>
            <li>Save your favorite prompts for quick access</li>
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-1">Why search?</h3>
            <p className="text-gray-600 text-xs">Quickly find and reuse your best prompts to save time and boost productivity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="min-h-screen bg-yellow-50/60 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Main Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-yellow-100 p-10 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-100 text-yellow-600 text-xs font-bold px-2 py-0.5 rounded-full">Prompt Projects</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Manage your prompt projects</h1>
          <p className="text-gray-700 mb-6">Organize, plan, and track your prompt-based projects. Collaborate, assign, and manage all your prompt workflows in one place.</p>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-400 mb-1">Project: Prompt Launch Plan</div>
            <div className="text-gray-800 font-mono mb-2">"Launch campaign prompt set"</div>
            <div className="text-gray-600 text-xs">Status: In Progress &nbsp; | &nbsp; Team: 3 members</div>
          </div>
          <button className="w-full py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition">Create New Project</button>
        </div>
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white rounded-3xl shadow-lg border border-yellow-100 p-8 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-yellow-600 mb-2">Project tips</h2>
          <ul className="text-gray-700 text-sm list-disc pl-4 space-y-2">
            <li>Break down large tasks into smaller prompts</li>
            <li>Assign prompts to team members</li>
            <li>Track progress and deadlines</li>
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-1">Why manage projects?</h3>
            <p className="text-gray-600 text-xs">Stay organized and ensure every prompt-based project is completed on time and with quality results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
