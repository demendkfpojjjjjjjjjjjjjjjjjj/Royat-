import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {lerp, prog} from '../lib/anim';

export const NavyBg: React.FC<{drift: number}> = ({drift}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 38%, ${theme.navy2}, ${theme.navy} 70%, #05090F)`}}>
    <AbsoluteFill style={{
      backgroundImage: 'linear-gradient(rgba(141,182,227,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(141,182,227,0.06) 1px, transparent 1px)',
      backgroundSize: '80px 80px', backgroundPosition: `${drift * 0.3}px ${drift * 0.6}px`,
      maskImage: 'radial-gradient(ellipse 70% 55% at 50% 42%, black 15%, transparent 78%)',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 42%, black 15%, transparent 78%)',
    }} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(91,143,201,0.16), rgba(0,0,0,0) 55%)'}} />
  </AbsoluteFill>
);

// Scene wrapper. full: navy backdrop + content; overlay: speaker stays visible.
// In/out: fade + scale + motion blur; slow camera drift inside the scene.
export const Shell: React.FC<{full: boolean; topShade?: boolean; children: React.ReactNode}> = ({full, topShade, children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const pin = prog(f, 0, 9);
  const pout = prog(f, d - 7, 7);
  const drift = interpolate(f, [0, d], [1, 1.035]);
  return (
    <AbsoluteFill style={{opacity: full ? prog(f, 0, 5) * (1 - pout) : 1}}>
      {full ? <NavyBg drift={f} /> : null}
      {!full && topShade ? (
        <AbsoluteFill style={{opacity: pin * (1 - pout),
          background: 'linear-gradient(180deg, rgba(6,12,22,0.72) 0%, rgba(6,12,22,0.45) 22%, rgba(6,12,22,0) 34%)'}} />
      ) : null}
      <AbsoluteFill style={{
        transform: `scale(${lerp(pin, 0.94, 1) * (full ? drift : 1) + pout * 0.03})`, transformOrigin: '50% 40%',
        filter: `blur(${lerp(pin, 12, 0) + pout * 8}px)`, opacity: pin * (1 - pout),
      }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Glossy 3D icon tile (reference: shiny 3D emoji-like icons). Slowly turns in 3D.
export const Tile3D: React.FC<{size: number; children: React.ReactNode; tone?: 'blue' | 'yellow' | 'glass'; spin?: number; style?: React.CSSProperties}> = ({size, children, tone = 'blue', spin = 0, style}) => {
  const f = useCurrentFrame();
  const bg = tone === 'blue'
    ? `linear-gradient(145deg, ${theme.blueLight} 0%, ${theme.blue} 45%, ${theme.blueDeep} 100%)`
    : tone === 'yellow'
      ? `linear-gradient(145deg, #F6DD8E 0%, ${theme.yellow} 45%, ${theme.yellowDeep} 100%)`
      : 'linear-gradient(145deg, rgba(40,64,98,0.95), rgba(14,26,44,0.95))';
  const ry = -14 + Math.sin((f + spin) / 28) * 10;
  const rx = 10 + Math.cos((f + spin) / 34) * 5;
  return (
    <div style={{perspective: 900, width: size, height: size, ...style}}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.26, background: bg, position: 'relative',
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`, transformStyle: 'preserve-3d',
        boxShadow: `inset 0 ${size * 0.05}px ${size * 0.09}px rgba(255,255,255,0.45), inset 0 -${size * 0.08}px ${size * 0.14}px rgba(0,0,0,0.28), 0 ${size * 0.16}px ${size * 0.3}px rgba(0,0,0,0.5)`,
        border: tone === 'glass' ? `2px solid ${theme.glassBorder}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{position: 'absolute', inset: '6% 10% 52% 10%', borderRadius: size * 0.2, background: 'linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0))'}} />
        <div style={{transform: 'translateZ(20px)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))'}}>{children}</div>
      </div>
    </div>
  );
};

export const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div dir="rtl" style={{background: theme.glass, border: `2px solid ${theme.glassBorder}`, borderRadius: 30,
    boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', ...style}}>
    {children}
  </div>
);

// Extruded 3D glyph (reference: glossy 3D question mark).
export const Glyph3D: React.FC<{text: string; size: number; color?: string; depth?: string}> = ({text, size, color = theme.yellow, depth = '#9C7A22'}) => {
  const layers = Array.from({length: 10}, (_, i) => `${i + 1}px ${i + 1}px 0 ${depth}`).join(', ');
  return (
    <span style={{fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: size, lineHeight: 1, color,
      textShadow: `${layers}, 14px 18px 30px rgba(0,0,0,0.55), 0 0 40px ${theme.yellowGlow}`}}>{text}</span>
  );
};
