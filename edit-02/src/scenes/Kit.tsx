import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {lerp, prog} from '../lib/anim';

// Modern backdrop: deep ink + slowly drifting aurora blobs + fine dot grid.
export const Backdrop: React.FC<{t: number}> = ({t}) => {
  const a = Math.sin(t / 90), b = Math.cos(t / 110);
  return (
    <AbsoluteFill style={{background: theme.navy, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1100, height: 1100, left: -300 + a * 80, top: -260 + b * 60, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(66,128,232,0.38), rgba(66,128,232,0) 62%)', filter: 'blur(20px)'}} />
      <div style={{position: 'absolute', width: 1000, height: 1000, right: -360 - b * 70, top: 520 + a * 60, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(118,92,230,0.22), rgba(118,92,230,0) 62%)', filter: 'blur(20px)'}} />
      <div style={{position: 'absolute', width: 900, height: 900, left: 60 + b * 50, bottom: -520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(244,201,93,0.12), rgba(244,201,93,0) 62%)', filter: 'blur(20px)'}} />
      <AbsoluteFill style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1.6px, transparent 1.7px)', backgroundSize: '44px 44px',
        backgroundPosition: `${t * 0.2}px ${t * 0.35}px`,
        maskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 10%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 10%, transparent 80%)',
      }} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,12,0) 70%, rgba(5,7,12,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

// Scene wrapper. Full scenes sit on the shared Backdrop (drawn once per run of
// consecutive full scenes in SceneLayer, so the speaker never flashes between them).
export const Shell: React.FC<{full: boolean; topShade?: boolean; children: React.ReactNode}> = ({full, topShade, children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const pin = prog(f, 0, 10);
  const pout = prog(f, d - 7, 7);
  const drift = 1 + 0.035 * (f / d);
  return (
    <AbsoluteFill>
      {!full && topShade ? (
        <AbsoluteFill style={{opacity: pin * (1 - pout),
          background: 'linear-gradient(180deg, rgba(5,8,15,0.74) 0%, rgba(5,8,15,0.46) 22%, rgba(5,8,15,0) 35%)'}} />
      ) : null}
      <AbsoluteFill style={{
        transform: `translateY(${lerp(pin, 30, 0)}px) scale(${lerp(pin, 0.96, 1) * (full ? drift : 1) + pout * 0.025})`, transformOrigin: '50% 42%',
        filter: `blur(${lerp(pin, 10, 0) + pout * 8}px)`, opacity: pin * (1 - pout),
      }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// Modern icon badge: flat gradient squircle, hairline inner border, soft coloured glow,
// gentle float (replaces the old glossy 3D tiles).
export const Tile3D: React.FC<{size: number; children: React.ReactNode; tone?: 'blue' | 'yellow' | 'glass'; spin?: number; style?: React.CSSProperties}> = ({size, children, tone = 'blue', spin = 0, style}) => {
  const f = useCurrentFrame();
  const bg = tone === 'blue'
    ? `linear-gradient(160deg, #7FB0FF 0%, ${theme.blue} 48%, ${theme.blueDeep} 100%)`
    : tone === 'yellow'
      ? `linear-gradient(160deg, #FFE29A 0%, ${theme.yellow} 50%, ${theme.yellowDeep} 100%)`
      : 'linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))';
  const glow = tone === 'blue' ? theme.blueGlow : tone === 'yellow' ? theme.yellowGlow : 'rgba(0,0,0,0)';
  const y = Math.sin((f + spin) / 26) * size * 0.025;
  return (
    <div style={{width: size, height: size, transform: `translateY(${y}px)`, ...style}}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.3, background: bg, position: 'relative',
        boxShadow: `0 ${size * 0.12}px ${size * 0.36}px ${glow}, inset 0 0 0 1.5px rgba(255,255,255,0.22)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  );
};

export const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div dir="rtl" style={{
    background: 'linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.035))',
    border: `1.5px solid ${theme.glassBorder}`, borderRadius: 32,
    boxShadow: '0 30px 70px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.10)', backdropFilter: 'blur(14px)', ...style,
  }}>
    {children}
  </div>
);

// Big glyph with a modern gradient fill and soft glow (replaces the old extruded 3D text).
export const Glyph3D: React.FC<{text: string; size: number; color?: string; depth?: string}> = ({text, size}) => (
  <span style={{fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: size, lineHeight: 1.1, display: 'inline-block',
    background: `linear-gradient(170deg, #FFE7A8 0%, ${theme.yellow} 55%, ${theme.yellowDeep} 100%)`,
    WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
    filter: `drop-shadow(0 10px 30px ${theme.yellowGlow})`}}>{text}</span>
);
