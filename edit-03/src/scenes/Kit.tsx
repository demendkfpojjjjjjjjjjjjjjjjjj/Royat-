import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {lerp, prog} from '../lib/anim';

export const abs = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...s});
export const txt = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.font, ...s});

export const usePop = (at: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping: 16, stiffness: 170, mass: 0.75}});
};

// Scene wrapper: blur/scale reveal in, soft fade out. Full scenes sit on the shared backdrop.
export const Shell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const pin = prog(f, 0, 12);
  const pout = prog(f, d - 8, 8);
  return (
    <AbsoluteFill style={{opacity: pin * (1 - pout), filter: `blur(${lerp(pin, 10, 0) + pout * 8}px)`,
      transform: `scale(${lerp(pin, 0.97, 1) + pout * 0.02})`, transformOrigin: '50% 50%'}}>
      {children}
    </AbsoluteFill>
  );
};

// Glass card with a soft top highlight and an optional gold edge.
export const Glass: React.FC<{style?: React.CSSProperties; gold?: boolean; children: React.ReactNode}> = ({style, gold, children}) => (
  <div dir="rtl" style={{background: theme.glass, border: `1.5px solid ${gold ? 'rgba(242,196,98,0.55)' : theme.glassBorder}`, borderRadius: 30,
    boxShadow: `0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14)${gold ? `, 0 0 40px ${theme.goldGlow}` : ''}`,
    backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden', ...style}}>
    <div style={abs({left: 0, right: 0, top: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))', pointerEvents: 'none'})} />
    <div style={{position: 'relative'}}>{children}</div>
  </div>
);

// Icon badge: gradient squircle with depth (soft 3D tilt that drifts slowly).
export const Badge: React.FC<{size: number; tone?: 'blue' | 'gold' | 'glass'; children: React.ReactNode; tilt?: number; style?: React.CSSProperties}> = ({size, tone = 'blue', children, tilt = 0, style}) => {
  const f = useCurrentFrame();
  const bg = tone === 'blue' ? `linear-gradient(155deg, ${theme.electric} 0%, ${theme.blue} 40%, ${theme.royal} 75%, ${theme.deep} 100%)`
    : tone === 'gold' ? `linear-gradient(155deg, #FFE6A6 0%, ${theme.gold} 45%, ${theme.goldDeep} 100%)`
      : 'linear-gradient(155deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))';
  const glow = tone === 'blue' ? theme.blueGlow : tone === 'gold' ? theme.goldGlow : 'rgba(0,0,0,0)';
  return (
    <div style={{width: size, height: size, perspective: 700, ...style}}>
      <div style={{width: size, height: size, borderRadius: size * 0.3, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotateX(${10 + Math.sin((f + tilt) / 30) * 6}deg) rotateY(${-12 + Math.cos((f + tilt) / 36) * 10}deg)`,
        boxShadow: `0 ${size * 0.14}px ${size * 0.36}px ${glow}, inset 0 ${size * 0.04}px 0 rgba(255,255,255,0.35), inset 0 -${size * 0.06}px ${size * 0.12}px rgba(0,0,0,0.25)`,
        border: tone === 'glass' ? `1.5px solid ${theme.glassBorder}` : 'none'}}>
        {children}
      </div>
    </div>
  );
};

// Gradient headline text (white->ice or gold) with soft glow; no outline.
export const Headline: React.FC<{children: React.ReactNode; size: number; gold?: boolean; style?: React.CSSProperties}> = ({children, size, gold, style}) => (
  <span style={txt({fontWeight: 800, fontSize: size, lineHeight: 1.3, display: 'inline-block',
    background: gold ? `linear-gradient(170deg, #FFE9B0 0%, ${theme.gold} 55%, ${theme.goldDeep} 100%)` : `linear-gradient(175deg, #FFFFFF 35%, ${theme.ice} 100%)`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    filter: `drop-shadow(0 8px 28px ${gold ? theme.goldGlow : theme.blueGlow})`, ...style})}>{children}</span>
);

export const Chip: React.FC<{children: React.ReactNode; tone?: 'glass' | 'gold' | 'blue'; size?: number; style?: React.CSSProperties}> = ({children, tone = 'glass', size = 36, style}) => (
  <span dir="rtl" style={txt({display: 'inline-flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: size, borderRadius: 999, padding: `${size * 0.28}px ${size * 0.7}px`,
    color: tone === 'gold' ? '#1D1504' : theme.white,
    background: tone === 'gold' ? `linear-gradient(160deg, #FFE29A, ${theme.gold})` : tone === 'blue' ? `linear-gradient(160deg, ${theme.blue}, ${theme.royal})` : theme.glass,
    border: tone === 'glass' ? `1.5px solid ${theme.glassBorder}` : 'none',
    boxShadow: tone === 'gold' ? `0 10px 30px ${theme.goldGlow}` : tone === 'blue' ? `0 10px 30px ${theme.blueGlow}` : '0 10px 30px rgba(0,0,0,0.3)', ...style})}>{children}</span>
);

// Big glyph (numbers, ?, %) with gradient + glow.
export const Glyph: React.FC<{text: string; size: number; gold?: boolean}> = ({text, size, gold = true}) => (
  <Headline size={size} gold={gold} style={{lineHeight: 1.05}}>{text}</Headline>
);

// Rotating 3D rings (decorative depth around a focal element).
export const Rings: React.FC<{size: number; style?: React.CSSProperties; gold?: boolean}> = ({size, style, gold}) => {
  const f = useCurrentFrame();
  const c = gold ? '242,196,98' : '111,178,255';
  return (
    <div style={{position: 'absolute', width: size, height: size, ...style}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={abs({inset: i * size * 0.08, borderRadius: '50%', border: `${2 - i * 0.5}px solid rgba(${c},${0.45 - i * 0.12})`,
          transform: `perspective(900px) rotateX(${68 - i * 8}deg) rotateZ(${f * (0.8 + i * 0.4) * (i % 2 ? -1 : 1)}deg)`})} />
      ))}
    </div>
  );
};

// Entrance helper for list items: slide + blur + fade.
export const enterX = (p: number, dx = 60) => ({opacity: Math.min(1, p * 1.3), transform: `translateX(${lerp(Math.min(1, p), dx, 0)}px)`, filter: `blur(${lerp(Math.min(1, p), 8, 0)}px)`});
export const enterY = (p: number, dy = 40) => ({opacity: Math.min(1, p * 1.3), transform: `translateY(${lerp(Math.min(1, p), dy, 0)}px)`, filter: `blur(${lerp(Math.min(1, p), 8, 0)}px)`});
