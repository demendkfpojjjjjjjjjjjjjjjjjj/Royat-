import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {easeOut, lerp, prog} from '../lib/anim';

export const DarkBg: React.FC<{drift?: number}> = ({drift = 0}) => (
  <AbsoluteFill style={{background: theme.black}}>
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        backgroundPosition: `${drift * 0.25}px ${drift * 0.5}px`,
        maskImage: 'radial-gradient(ellipse 70% 55% at 50% 40%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 40%, black 20%, transparent 80%)',
      }}
    />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 34%, rgba(230,193,90,0.10), rgba(0,0,0,0) 52%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

// Wraps every full-screen scene: soft cut in/out, motion blur, slow camera drift.
// variant 'paper' slides a white card in at an angle (reference: rotated white card entrance).
export const Shell: React.FC<{variant?: 'dark' | 'paper'; children: React.ReactNode}> = ({variant = 'dark', children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const pin = prog(f, 0, variant === 'paper' ? 12 : 9);
  const pout = prog(f, d - 6, 6);
  const bgIn = prog(f, 0, 5);
  const drift = interpolate(f, [0, d], [1, 1.035]);
  const content: React.CSSProperties =
    variant === 'paper'
      ? {
          transform: `translateX(${lerp(pin, 320, 0)}px) translateY(${lerp(pin, 80, 0)}px) rotate(${lerp(pin, -9, 0)}deg) scale(${drift + pout * 0.03})`,
          filter: `blur(${lerp(pin, 14, 0) + pout * 8}px)`,
          opacity: Math.min(1, pin * 1.6) * (1 - pout),
        }
      : {
          transform: `scale(${lerp(pin, 0.93, 1) * drift + pout * 0.03})`,
          filter: `blur(${lerp(pin, 12, 0) + pout * 8}px)`,
          opacity: pin * (1 - pout),
        };
  return (
    <AbsoluteFill style={{opacity: bgIn * (1 - pout * 0.999)}}>
      <DarkBg drift={f} />
      <AbsoluteFill style={{...content, transformOrigin: '50% 42%'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Paper: React.FC<{top: number; height: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, height, children, style}) => (
  <div
    dir="rtl"
    style={{
      position: 'absolute', left: 70, right: 70, top, height, borderRadius: 40,
      background: theme.paper, boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
      overflow: 'hidden', ...style,
    }}
  >
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
    {children}
  </div>
);

export {easeOut};
