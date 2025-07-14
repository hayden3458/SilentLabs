import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const teamMembers = [
  {
    name: 'Dylan Kim',
    role: 'Co-Founder',
    bio: 'Student at University of Massachusetts Amherst',
    joinDate: '2025-06-29',
    avatar: '', // Placeholder for AI/stylized avatar
    socials: {
      linkedin: '#',
      github: '#',
    },
    fun: 'Avid foodie and plays piano.',
    skills: { Coding: 90, Design: 60, Leadership: 80 },
    prompt: 'Summarize this research paper in 3 bullet points.',
    location: {
      city: 'Amherst, MA',
      country: 'USA',
      coordinates: { lat: 42.3732, lng: -72.5199 },
      timezone: 'America/New_York',
      university: 'University of Massachusetts Amherst',
      story: 'Born in Seoul, South Korea, Dylan moved to the US at age 10. He discovered his passion for AI while building his first chatbot in high school. Now studying Computer Science at UMass Amherst, he dreams of making AI more accessible to everyone.',
      culturalBackground: 'Korean-American',
      languages: ['English', 'Korean'],
      localTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
      weather: 'Partly Cloudy, 72°F'
    }
  },
  {
    name: 'Mussa Zeb',
    role: 'Co-Founder',
    bio: 'Student at Columbia University',
    joinDate: '2025-06-29',
    avatar: '',
    socials: {
      linkedin: '#',
      github: '#',
    },
    fun: 'Enjoys chess and coffee.',
    skills: { Coding: 85, Design: 70, Leadership: 75 },
    prompt: 'Draft a polite follow-up email.',
    location: {
      city: 'New York, NY',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      timezone: 'America/New_York',
      university: 'Columbia University',
      story: 'Growing up in a small town in Pakistan, Mussa was fascinated by technology from an early age. His journey to Columbia University represents his belief in education as a bridge to innovation. He sees AI as the key to solving global challenges.',
      culturalBackground: 'Pakistani-American',
      languages: ['English', 'Urdu', 'Punjabi'],
      localTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
      weather: 'Sunny, 78°F'
    }
  },
  {
    name: 'Max Soltsman',
    role: 'Co-Founder',
    bio: 'Student at Macaulay Honors College',
    joinDate: '2025-06-29',
    avatar: '',
    socials: {
      linkedin: '#',
      github: '#',
    },
    fun: 'Grandmaster and swimmer.',
    skills: { Coding: 80, Design: 65, Leadership: 85 },
    prompt: 'Generate creative startup ideas.',
    location: {
      city: 'New York, NY',
      country: 'USA',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      timezone: 'America/New_York',
      university: 'Macaulay Honors College',
      story: 'A chess prodigy from Brooklyn, Max learned strategic thinking from the game board. His analytical mind naturally led him to AI and entrepreneurship. He believes the best solutions come from combining logic with creativity.',
      culturalBackground: 'American',
      languages: ['English', 'Russian'],
      localTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
      weather: 'Sunny, 78°F'
    }
  },
  {
    name: 'Hayden Wu',
    role: 'Co-Founder',
    bio: 'Student at Princeton University',
    joinDate: '2025-06-29',
    avatar: '',
    socials: {
      linkedin: '#',
      github: '#',
    },
    fun: 'Loves hiking and traveling.',
    skills: { Coding: 88, Design: 75, Leadership: 78 },
    prompt: 'Write a daily productivity plan.',
    location: {
      city: 'Princeton, NJ',
      country: 'USA',
      coordinates: { lat: 40.3573, lng: -74.6672 },
      timezone: 'America/New_York',
      university: 'Princeton University',
      story: 'Hayden\'s love for exploration began with family road trips across America. At Princeton, he studies Computer Science while pursuing his passion for sustainable technology. He envisions AI as a tool for environmental conservation.',
      culturalBackground: 'Chinese-American',
      languages: ['English', 'Mandarin'],
      localTime: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
      weather: 'Clear, 75°F'
    }
  },
];

const roles = ['All', ...Array.from(new Set(teamMembers.map(m => m.role)))];

const values = [
  { icon: '🌱', title: 'Start simple', desc: 'We believe in launching fast and learning as we go.' },
  { icon: '⚡', title: 'Learn fast', desc: 'Curiosity and iteration drive our progress.' },
  { icon: 'hand-click', title: 'With just one click', desc: 'Allowing you to access your data and needs from one page.' },
  { icon: '🎉', title: 'Have fun', desc: 'We keep our journey playful and creative.' },
];

// Timeline milestone data
const milestones = [
  { date: '2025-06-29', label: 'Promptly StartUp Founded' },
  { date: 'Projected 2025-09', label: 'MVP Launch' },
  { date: 'Projected 2025-11', label: 'Beta Release' },
  { date: 'Projected 2026 Spring', label: 'Public Launch' },
];

const Team: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('All');
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredMembers = selectedRole === 'All'
    ? teamMembers
    : teamMembers.filter(m => m.role === selectedRole);

  // Carousel navigation
  const prev = () => setCarouselIdx(i => (i === 0 ? filteredMembers.length - 1 : i - 1));
  const next = () => setCarouselIdx(i => (i === filteredMembers.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen bg-nature-glass text-white font-inter flex flex-col relative overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight text-white">Meet the Team</h1>
        <p className="text-lg md:text-xl text-white/90 font-light text-center max-w-2xl mb-8">The people behind Promptly StartUp. We're a small group of builders, designers, and dreamers, driven by a passion for better AI interactions.</p>
        {/* Role Filter Chips */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-1 rounded-full border transition-colors duration-200 font-medium text-sm ${selectedRole === role ? 'bg-glassgreen-500 text-glassblue-900 border-glassgreen-500' : 'bg-white/10 text-white/80 border-white/20 hover:bg-glassgreen-400 hover:text-glassblue-900'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </section>

      {/* Team Grid or Carousel */}
      {isMobile ? (
        <section className="w-full max-w-xs mx-auto flex flex-col items-center mb-16 px-4">
          <div className="flex items-center justify-between w-full mb-4">
            <button onClick={prev} className="p-2 rounded-full bg-white/20 hover:bg-glassgreen-500 transition"><span className="text-2xl">←</span></button>
            <span className="text-sm text-white/80">{carouselIdx + 1} / {filteredMembers.length}</span>
            <button onClick={next} className="p-2 rounded-full bg-white/20 hover:bg-glassgreen-500 transition"><span className="text-2xl">→</span></button>
          </div>
          <div className="w-full">
            {/* Reuse the flip card for carousel */}
            <div
              key={filteredMembers[carouselIdx].name}
              className={`relative group perspective-1000 h-72`}
            >
              <div className={`transition-transform duration-700 transform-style-preserve-3d h-full w-full`}>
                {/* Front Side */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-glass rounded-2xl shadow-glass p-6 flex flex-col items-center text-center transition-transform duration-700" style={{ zIndex: 2, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #4ADE80 0%, #38BDF8 100%)' }}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-glassgreen-500 to-glassblue-700 flex items-center justify-center mb-3 text-3xl font-bold text-white shadow-lg">
                    {filteredMembers[carouselIdx].name[0]}
                  </div>
                  <h2
                    className="text-lg font-bold text-white mb-1 cursor-pointer hover:underline hover:text-glassgreen-300 transition"
                    onClick={() => navigate(`/team/${encodeURIComponent(filteredMembers[carouselIdx].name)}`)}
                  >
                    {filteredMembers[carouselIdx].name}
                  </h2>
                  <span className="inline-block px-3 py-1 rounded-full bg-glassgreen-500/80 text-glassblue-900 text-xs font-semibold mb-2">{filteredMembers[carouselIdx].role}</span>
                  <p className="text-white/90 text-sm mb-2">{filteredMembers[carouselIdx].bio}</p>
                  <div className="flex space-x-3 mb-2">
                    <a href={filteredMembers[carouselIdx].socials.linkedin} className="hover:text-glassgreen-500" aria-label="LinkedIn"><svg width="20" height="20" fill="currentColor" className="inline"><path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6zM2 8h4v12H2V8zm2-4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg></a>
                    <a href={filteredMembers[carouselIdx].socials.github} className="hover:text-glassgreen-500" aria-label="GitHub"><svg width="20" height="20" fill="currentColor" className="inline"><path d="M10 2C5 2 1 6 1 11c0 4 2.9 7.4 6.8 8.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .5-1.2-2.2-.2-4.5-1.1-4.5-4.8 0-1 .4-1.8 1-2.5-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.5 1 2.5 0 3.7-2.3 4.6-4.5 4.8.3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5C16.1 18.4 19 15 19 11c0-5-4-9-9-9z"/></svg></a>
                  </div>
                  <div className="text-xs text-white/70 italic">{filteredMembers[carouselIdx].fun}</div>
                </div>
                {/* Back Side (Flip) */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-glass rounded-2xl shadow-glass p-6 flex flex-col items-center text-center transition-transform duration-700 rotate-y-180" style={{ zIndex: 1, backfaceVisibility: 'hidden' }}>
                  <div className="w-full flex flex-col items-center mb-2">
                    <span className="font-bold text-white mb-1">Skills</span>
                    <div className="flex gap-2 w-full justify-center">
                      {Object.entries(filteredMembers[carouselIdx].skills).map(([skill, val]) => (
                        <div key={skill} className="flex flex-col items-center">
                          <span className="text-xs text-white/80">{skill}</span>
                          <div className="w-2 h-16 bg-glassgreen-500 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 left-0 w-full bg-glassblue-700" style={{ height: `${val / 100 * 64}px` }} />
                          </div>
                          <span className="text-xs text-white/60">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative bg-white/80 text-glassblue-900 rounded-xl px-4 py-2 mt-2 mb-2 animate-pulse shadow-lg">
                    <span className="block text-xs font-mono">{filteredMembers[carouselIdx].prompt}</span>
                    <span className="absolute left-4 -bottom-2 w-3 h-3 bg-white/80 rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 mb-16">
          {filteredMembers.map((member) => (
            <div
              key={member.name}
              className={`relative group perspective-1000 h-72`}
            >
              <div className={`transition-transform duration-700 transform-style-preserve-3d h-full w-full`}>
                {/* Front Side */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-glass rounded-2xl shadow-glass p-6 flex flex-col items-center text-center transition-transform duration-700" style={{ zIndex: 2, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #4ADE80 0%, #38BDF8 100%)' }}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-glassgreen-500 to-glassblue-700 flex items-center justify-center mb-3 text-3xl font-bold text-white shadow-lg">
                    {member.name[0]}
                  </div>
                  <h2
                    className="text-lg font-bold text-white mb-1 cursor-pointer hover:underline hover:text-glassgreen-300 transition"
                    onClick={() => navigate(`/team/${encodeURIComponent(member.name)}`)}
                  >
                    {member.name}
                  </h2>
                  <span className="inline-block px-3 py-1 rounded-full bg-glassgreen-500/80 text-glassblue-900 text-xs font-semibold mb-2">{member.role}</span>
                  <p className="text-white/90 text-sm mb-2">{member.bio}</p>
                  <div className="flex space-x-3 mb-2">
                    <a href={member.socials.linkedin} className="hover:text-glassgreen-500" aria-label="LinkedIn"><svg width="20" height="20" fill="currentColor" className="inline"><path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6zM2 8h4v12H2V8zm2-4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg></a>
                    <a href={member.socials.github} className="hover:text-glassgreen-500" aria-label="GitHub"><svg width="20" height="20" fill="currentColor" className="inline"><path d="M10 2C5 2 1 6 1 11c0 4 2.9 7.4 6.8 8.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .5-1.2-2.2-.2-4.5-1.1-4.5-4.8 0-1 .4-1.8 1-2.5-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.5 1 2.5 0 3.7-2.3 4.6-4.5 4.8.3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5C16.1 18.4 19 15 19 11c0-5-4-9-9-9z"/></svg></a>
                  </div>
                  <div className="text-xs text-white/70 italic">{member.fun}</div>
                </div>
                {/* Back Side (Flip) */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-glass rounded-2xl shadow-glass p-6 flex flex-col items-center text-center transition-transform duration-700 rotate-y-180" style={{ zIndex: 1, backfaceVisibility: 'hidden' }}>
                  {/* Animated Skill Graph Placeholder */}
                  <div className="w-full flex flex-col items-center mb-2">
                    <span className="font-bold text-white mb-1">Skills</span>
                    {/* Radar/Bar chart placeholder */}
                    <div className="flex gap-2 w-full justify-center">
                      {Object.entries(member.skills).map(([skill, val]) => (
                        <div key={skill} className="flex flex-col items-center">
                          <span className="text-xs text-white/80">{skill}</span>
                          <div className="w-2 h-16 bg-glassgreen-500 rounded-full overflow-hidden relative">
                            <div className="absolute bottom-0 left-0 w-full bg-glassblue-700" style={{ height: `${val / 100 * 64}px` }} />
                          </div>
                          <span className="text-xs text-white/60">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Favorite Prompt Speech Bubble */}
                  <div className="relative bg-white/80 text-glassblue-900 rounded-xl px-4 py-2 mt-2 mb-2 animate-pulse shadow-lg">
                    <span className="block text-xs font-mono">{member.prompt}</span>
                    <span className="absolute left-4 -bottom-2 w-3 h-3 bg-white/80 rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Interactive Team Map Section */}
      <section className="w-full max-w-6xl mx-auto mb-12 px-4">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Where We're From</h2>
        <p className="text-white/80 text-center mb-6 max-w-2xl mx-auto">
          Explore our global team connections and discover the stories behind each team member's journey.
        </p>
      </section>

      {/* Timeline Section */}
      <section className="w-full max-w-2xl mx-auto mb-16 px-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Journey</h2>
        <div className="relative border-l-2 border-glassgreen-500 pl-8">
          {milestones.map((ms, idx) => (
            <div key={ms.date} className="mb-10 flex items-center group">
              <div className="absolute -left-4 w-8 h-8 flex items-center justify-center">
                <span className={`w-4 h-4 rounded-full bg-glassgreen-500 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-125 animate-bounce`} />
              </div>
              <div>
                <div className="text-sm text-white/80 font-semibold">{ms.date}</div>
                <div className="text-lg text-white font-bold">{ms.label}</div>
              </div>
            </div>
          ))}
          {/* Team member join dates */}
          {teamMembers.map((member, idx) => (
            <div key={member.name + '-join'} className="mb-10 flex items-center group">
              <div className="absolute -left-4 w-8 h-8 flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-glassblue-700 border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-125 animate-pulse" />
              </div>
              <div>
                <div className="text-sm text-white/80 font-semibold">{member.joinDate}</div>
                <div className="text-lg text-glassblue-100 font-bold">{member.name} joined</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center items-center mb-16 px-4">
        {values.map((val) => (
          <div key={val.title} className="flex-1 bg-white/20 backdrop-blur-glass rounded-2xl shadow-glass p-6 flex flex-col items-center text-center min-w-[180px] hover:scale-105 transition-transform duration-300">
            <div className="text-3xl mb-2">
              {val.icon === 'hand-click' ? (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 30C10 33 13 36 20 36C27 36 30 33 30 30V20C30 18.3431 28.6569 17 27 17C25.3431 17 24 18.3431 24 20V28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 28V12C20 10.3431 18.6569 9 17 9C15.3431 9 14 10.3431 14 12V28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12V8C20 6.34315 21.3431 5 23 5C24.6569 5 26 6.34315 26 8V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 12V6C20 4.34315 21.3431 3 23 3C24.6569 3 26 4.34315 26 6V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="20" y1="2" x2="20" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="28" y1="10" x2="33" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="7" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              ) : val.icon}
            </div>
            <h3 className="font-bold text-white mb-1">{val.title}</h3>
            <p className="text-white/90 text-sm">{val.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="flex flex-col items-center mb-12">
        <h2 className="text-2xl font-bold text-white mb-2">Want to join our story?</h2>
        <button className="px-6 py-2 rounded-full bg-glassgreen-500 text-glassblue-900 font-semibold shadow-glass hover:bg-glassgreen-400 transition">Contact Us</button>
      </section>
    </div>
  );
};

export default Team; 