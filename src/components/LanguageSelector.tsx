import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English (US)' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ko', label: 'Korean' },
];

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={selectorRef}>
      <button
        className="flex items-center px-3 py-1 rounded border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-glassgreen-500 transition shadow-glass"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <svg className="mr-2 text-gray-900" width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" fill="none"/>
          <ellipse cx="32" cy="32" rx="12" ry="30" stroke="currentColor" strokeWidth="3" fill="none"/>
          {/* Equator */}
          <line x1="2" y1="32" x2="62" y2="32" stroke="currentColor" strokeWidth="3"/>
          {/* Upper latitude (tangent to circle) */}
          <line x1="8.5" y1="16.5" x2="55.5" y2="16.5" stroke="currentColor" strokeWidth="3"/>
          {/* Lower latitude (tangent to circle) */}
          <line x1="8.5" y1="47.5" x2="55.5" y2="47.5" stroke="currentColor" strokeWidth="3"/>
          <line x1="32" y1="2" x2="32" y2="62" stroke="currentColor" strokeWidth="3"/>
        </svg>
        <span className="text-gray-900">{t(current.label)}</span>
        <svg className="ml-2 text-gray-900" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
      </button>
      {open && (
        <ul className="absolute z-20 mt-2 w-44 bg-white/80 backdrop-blur-glass border border-white/30 rounded-xl shadow-glass py-2 text-gray-900 font-inter" role="listbox">
          {languages.map(lang => (
            <li
              key={lang.code}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-glassgreen-100/40 rounded transition ${i18n.language === lang.code ? 'font-semibold' : ''}`}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              role="option"
              aria-selected={i18n.language === lang.code}
            >
              <span className="flex-1">{t(lang.label)}</span>
              {i18n.language === lang.code && (
                <svg className="ml-2 text-glassgreen-500" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"/></svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector; 