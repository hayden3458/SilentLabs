import React, { useRef, useState } from 'react';

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({ children, onClick, className, type = 'button' }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [pulse, setPulse] = useState<{ x: number; y: number; key: number } | null>(null);

  // Track mouse position relative to button
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle click for pulse glow
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPulse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      key: Date.now(),
    });
    if (onClick) onClick(e);
  };

  // Button dimensions (smaller)
  const width = 220;
  const height = 40;
  const borderRadius = 20;

  // Glow size and position (smaller)
  const glowSize = 80;
  const glowX = mouse.x - glowSize / 2;
  const glowY = mouse.y - glowSize / 2;

  return (
    <button
      ref={btnRef}
      type={type}
      className={`liquid-glass-btn2 ${className || ''} ${hovered ? 'hovered' : ''}`}
      style={{
        width,
        height,
        borderRadius,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 8px 32px 0 rgba(30,30,60,0.18)',
        outline: 'none',
        cursor: 'pointer',
        transition: 'box-shadow 0.25s, transform 0.18s',
        transform: hovered ? 'scale(1.045) translateY(-2px)' : 'scale(1)',
        padding: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
      tabIndex={0}
      aria-pressed={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Interactive Glow (follows cursor) */}
      <div
        className="liquid-glass-btn2-glow"
        style={{
          position: 'absolute',
          left: glowX,
          top: glowY,
          width: glowSize,
          height: glowSize,
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s',
          zIndex: 1,
          filter: 'blur(48px)',
          background: 'radial-gradient(circle at 50% 50%, #ffb6ea 0%, #f7cba0 40%, #7dbac1 80%, #a18fff 100%)',
        }}
      />
      {/* Pulse Glow on Click */}
      {pulse && (
        <div
          key={pulse.key}
          className="liquid-glass-btn2-pulse"
          style={{
            position: 'absolute',
            left: pulse.x - glowSize / 2,
            top: pulse.y - glowSize / 2,
            width: glowSize,
            height: glowSize,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 2,
            filter: 'blur(48px)',
            background: 'radial-gradient(circle at 50% 50%, #ffb6ea 0%, #f7cba0 40%, #7dbac1 80%, #a18fff 100%)',
            animation: 'liquid-glass-btn2-pulse-anim 0.7s cubic-bezier(0.23,1,0.32,1)',
          }}
          onAnimationEnd={() => setPulse(null)}
        />
      )}
      {/* Inner shadow (pseudo-element alternative) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: borderRadius,
          pointerEvents: 'none',
          boxShadow: 'inset 0 2px 12px 0 rgba(255,255,255,0.22)',
          zIndex: 3,
        }}
      />
      {/* Button Text */}
      <span
        style={{
          position: 'relative',
          zIndex: 4,
          display: 'inline-block',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          fontWeight: 700,
          fontSize: 18,
          color: '#23272f',
          letterSpacing: '0.01em',
          textShadow: '0 2px 12px rgba(255,255,255,0.12)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {children}
      </span>
      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes liquid-glass-btn2-pulse-anim {
          0% {
            opacity: 0.7;
            transform: scale(0.7);
          }
          60% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(2.2);
          }
        }
      `}</style>
    </button>
  );
};

export default LiquidGlassButton; 