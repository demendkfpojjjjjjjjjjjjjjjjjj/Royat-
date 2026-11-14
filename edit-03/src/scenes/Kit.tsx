import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {lerp, prog} from '../lib/anim';

// Modern flat kit: solid colours, translucent frosted glass, soft shadows. No gradients.
export const abs = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...s});
export const txt = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.font, ...s});

export const usePop = (at: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping: 18, stiffness: 170, mass: 0.75}});
};

// Scene wrapper: blur reveal in, soft fade out.
export const Shell: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const pin = prog(f, 0, 12);
  const pout = prog(f, d - 8, 8);
  return (
    <AbsoluteFill style={{opacity: pin * (1 - pout), filter: `blur(${lerp(pin, 10, 0) + pout * 8}px)`,
      transform: `scale(${lerp(pin, 0.98, 1) + pout * 0.015})`, transformOrigin: '50% 50%'}}>
      {children}
    </AbsoluteFill>
  );
};

// Frosted glass card: solid translucent fill + backdrop blur + hairline border.
export const Glass: React.FC<{style?: React.CSSProperties; gold?: boolean; strong?: boolean; children: React.ReactNode}> = ({style, gold, strong, children}) => (
  <div dir="rtl" style={{background: strong ? theme.glassStrong : theme.glass, backdropFilter: theme.blur,
    border: `1.5px solid ${gold ? 'rgba(245,192,74,0.7)' : theme.glassBorder}`, borderRadius: 28,
    boxShadow: '0 20px 50px rgba(0,0,0,0.28)', position: 'relative', overflow: 'hidden', ...style}}>
    {children}
  </div>
);

// Flat icon badge (solid squircle) with a gentle float.
export const Badge: React.FC<{size: number; tone?: 'blue' | 'gold' | 'glass'; children: React.ReactNode; tilt?: number; style?: React.CSSProperties}> = ({size, tone = 'blue', children, tilt = 0, style}) => {
  const f = useCurrentFrame();
  const bg = tone === 'blue' ? theme.blue : tone === 'gold' ? theme.gold : theme.glassLight;
  return (
    <div style={{width: size, height: size, ...style}}>
      <div style={{width: size, height: size, borderRadius: size * 0.3, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${Math.sin((f + tilt) / 28) * size * 0.03}px)`,
        backdropFilter: tone === 'glass' ? theme.blur : undefined,
        border: tone === 'glass' ? `1.5px solid ${theme.glassBorder}` : 'none',
        boxShadow: '0 12px 28px rgba(0,0,0,0.25)'}}>
        {children}
      </div>
    </div>
  );
};

// Solid headline text (white or gold) with a soft legibility shadow.
export const Headline: React.FC<{children: React.ReactNode; size: number; gold?: boolean; style?: React.CSSProperties}> = ({children, size, gold, style}) => (
  <span style={txt({fontWeight: 800, fontSize: size, lineHeight: 1.3, display: 'inline-block', color: gold ? theme.gold : theme.white,
    textShadow: '0 4px 18px rgba(0,0,0,0.35)', ...style})}>{children}</span>
);

export const Chip: React.FC<{children: React.ReactNode; tone?: 'glass' | 'gold' | 'blue'; size?: number; style?: React.CSSProperties}> = ({children, tone = 'glass', size = 36, style}) => (
  <span dir="rtl" style={txt({display: 'inline-flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: size, borderRadius: 999, padding: `${size * 0.28}px ${size * 0.7}px`,
    color: tone === 'gold' ? theme.ink : theme.white,
    background: tone === 'gold' ? theme.gold : tone === 'blue' ? theme.blue : theme.glass,
    backdropFilter: tone === 'glass' ? theme.blur : undefined,
    border: tone === 'glass' ? `1.5px solid ${theme.glassBorder}` : 'none',
    boxShadow: '0 10px 26px rgba(0,0,0,0.25)', ...style})}>{children}</span>
);

// Big glyph (numbers, ?, %): solid gold or white.
export const Glyph: React.FC<{text: string; size: number; gold?: boolean}> = ({text, size, gold = true}) => (
  <Headline size={size} gold={gold} style={{lineHeight: 1.05}}>{text}</Headline>
);

// Minimal orbit: one thin solid ring with a small dot travelling on it.
export const Rings: React.FC<{size: number; style?: React.CSSProperties; gold?: boolean}> = ({size, style, gold}) => {
  const f = useCurrentFrame();
  const c = gold ? theme.gold : theme.sky;
  const a = (f * 2.2 * Math.PI) / 180;
  return (
    <div style={{position: 'absolute', width: size, height: size, ...style}}>
      <div style={abs({inset: 0, borderRadius: '50%', border: `2px solid ${c}`, opacity: 0.35})} />
      <div style={abs({left: size / 2 + Math.cos(a) * size / 2 - 7, top: size / 2 + Math.sin(a) * size / 2 - 7, width: 14, height: 14, borderRadius: 7, background: c})} />
    </div>
  );
};

export const enterX = (p: number, dx = 60) => ({opacity: Math.min(1, p * 1.3), transform: `translateX(${lerp(Math.min(1, p), dx, 0)}px)`, filter: `blur(${lerp(Math.min(1, p), 8, 0)}px)`});
export const enterY = (p: number, dy = 40) => ({opacity: Math.min(1, p * 1.3), transform: `translateY(${lerp(Math.min(1, p), dy, 0)}px)`, filter: `blur(${lerp(Math.min(1, p), 8, 0)}px)`});

// Frosted backing plate for a group of texts placed over the video.
export const Plate: React.FC<{top: number; height: number; left?: number; right?: number}> = ({top, height, left = 36, right = 36}) => (
  <div style={abs({left, right, top, height, borderRadius: 36, background: theme.glass, backdropFilter: theme.blur,
    border: `1.5px solid ${theme.glassBorder}`, boxShadow: '0 20px 50px rgba(0,0,0,0.25)'})} />
);
