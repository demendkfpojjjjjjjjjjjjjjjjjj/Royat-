import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Mode, compositions, scenes} from '../config/edit';
import {FLOWER_BOX, VIDEO, theme} from '../config/theme';
import {placed, toFrame} from '../lib/time';
import {easeInOut} from '../lib/anim';
import t01 from '../../public/track/source-01.json';
import t02 from '../../public/track/source-02.json';
import t03 from '../../public/track/source-03.json';
import t04 from '../../public/track/source-04.json';
import t05 from '../../public/track/source-05.json';
import t06 from '../../public/track/source-06.json';
import t07 from '../../public/track/source-07.json';

const TRACKS: Record<string, number[][]> = {
  '01': t01.frames, '02': t02.frames, '03': t03.frames, '04': t04.frames,
  '05': t05.frames, '06': t06.frames, '07': t07.frames,
};

// ---------------------------------------------------------------- composition geometry
// The card is never larger than the frame, so nothing of the original image is cropped.
export type Geom = {s: number; x: number; y: number};
export const GEOM: Record<Mode, Geom> = {
  full: {s: 1, x: 0, y: 0},
  up: {s: 0.68, x: 0, y: -250},
  down: {s: 0.68, x: 0, y: 250},
  left: {s: 0.66, x: -175, y: -60},
  right: {s: 0.66, x: 175, y: -60},
};
const TRANS = 22; // frames per camera move
const keys = compositions.map((c) => ({f: toFrame(c.at), g: GEOM[c.mode], mode: c.mode}));

export const geomAt = (frame: number): Geom & {v: number; mode: Mode} => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].f <= frame) i++;
  const cur = keys[i];
  const prev = i > 0 ? keys[i - 1].g : cur.g;
  const p = interpolate(frame, [cur.f, cur.f + TRANS], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const lerp = (a: number, b: number) => a + (b - a) * p;
  // velocity (0..1) for motion blur
  const v = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
  // gentle living drift so a static composition still breathes
  const drift = Math.sin(frame / 80) * 6;
  return {s: lerp(prev.s, cur.g.s), x: lerp(prev.x, cur.g.x), y: lerp(prev.y, cur.g.y) + drift * (cur.g.s < 1 ? 1 : 0), v, mode: cur.mode};
};

// ---------------------------------------------------------------- backdrop (behind the card)
const Cube: React.FC<{size: number; rx: number; ry: number; style: React.CSSProperties; tone?: 'blue' | 'gold'}> = ({size, rx, ry, style, tone = 'blue'}) => {
  const face = (tr: string, shade: number) => (
    <div style={{position: 'absolute', width: size, height: size, transform: tr,
      background: tone === 'gold'
        ? `linear-gradient(145deg, rgba(242,196,98,${0.32 * shade}), rgba(201,149,47,${0.12 * shade}))`
        : `linear-gradient(145deg, rgba(111,178,255,${0.30 * shade}), rgba(45,91,216,${0.10 * shade}))`,
      border: `1px solid ${tone === 'gold' ? 'rgba(242,196,98,0.45)' : 'rgba(191,217,255,0.32)'}`, backdropFilter: 'blur(2px)'}} />
  );
  const h = size / 2;
  return (
    <div style={{position: 'absolute', width: size, height: size, perspective: 900, ...style}}>
      <div style={{position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
        {face(`translateZ(${h}px)`, 1)}{face(`rotateY(180deg) translateZ(${h}px)`, 0.6)}
        {face(`rotateY(90deg) translateZ(${h}px)`, 0.8)}{face(`rotateY(-90deg) translateZ(${h}px)`, 0.8)}
        {face(`rotateX(90deg) translateZ(${h}px)`, 1.1)}{face(`rotateX(-90deg) translateZ(${h}px)`, 0.5)}
      </div>
    </div>
  );
};

export const Backdrop: React.FC<{t: number; px?: number; py?: number}> = ({t, px = 0, py = 0}) => {
  const a = Math.sin(t / 95), b = Math.cos(t / 120);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 120% 80% at 50% 35%, ${theme.navy2}, ${theme.navy} 60%, ${theme.black})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 1200, height: 1200, left: -380 + a * 90 + px * 0.2, top: -300 + b * 70 + py * 0.2, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,91,216,0.42), rgba(45,91,216,0) 62%)', filter: 'blur(24px)'}} />
      <div style={{position: 'absolute', width: 1000, height: 1000, right: -420 - b * 60 + px * 0.15, top: 760 + a * 70 + py * 0.15, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(111,178,255,0.20), rgba(111,178,255,0) 62%)', filter: 'blur(24px)'}} />
      <div style={{position: 'absolute', width: 800, height: 800, left: 140 + b * 40, bottom: -560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(242,196,98,0.10), rgba(242,196,98,0) 62%)', filter: 'blur(24px)'}} />
      {/* perspective floor grid */}
      <div style={{position: 'absolute', left: -540, right: -540, bottom: -200, height: 900, transform: 'perspective(700px) rotateX(68deg)', transformOrigin: '50% 100%',
        backgroundImage: 'linear-gradient(rgba(111,178,255,0.14) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(111,178,255,0.14) 1.5px, transparent 1.5px)',
        backgroundSize: '90px 90px', backgroundPosition: `${px * 0.5}px ${t * 1.2}px`,
        maskImage: 'linear-gradient(180deg, transparent, black 40%, black 70%, transparent)', WebkitMaskImage: 'linear-gradient(180deg, transparent, black 40%, black 70%, transparent)'}} />
      {/* floating 3D shapes (background parallax layer) */}
      <Cube size={120} rx={t * 0.6} ry={t * 0.9} style={{left: 70 - px * 0.25, top: 240 - py * 0.2}} />
      <Cube size={70} rx={-t * 0.8} ry={t * 0.5} style={{right: 90 - px * 0.3, top: 1420 - py * 0.25}} tone="gold" />
      <Cube size={56} rx={t * 0.4} ry={-t * 0.7} style={{right: 160 - px * 0.2, top: 300 - py * 0.15}} />
      <div style={{position: 'absolute', left: 540 - 420 - px * 0.1, top: 960 - 420 - py * 0.1, width: 840, height: 840, borderRadius: '50%',
        border: '1.5px solid rgba(111,178,255,0.16)', transform: `perspective(1200px) rotateX(70deg) rotateZ(${t * 0.3}deg)`}} />
      <div style={{position: 'absolute', left: 540 - 560 - px * 0.08, top: 960 - 560 - py * 0.08, width: 1120, height: 1120, borderRadius: '50%',
        border: '1px dashed rgba(242,196,98,0.14)', transform: `perspective(1200px) rotateX(70deg) rotateZ(${-t * 0.2}deg)`}} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the video card + flower
const Flower: React.FC<{src: string; frame: number}> = ({src, frame}) => {
  const tr = TRACKS[src];
  const [cx, cy, d, rot] = tr[Math.min(frame, tr.length - 1)];
  const size = d * FLOWER_BOX;
  return (
    <Img src={staticFile('flower.png')} style={{
      position: 'absolute', width: size, height: size * (567 / 577), left: cx - size / 2, top: cy - (size * 567 / 577) / 2,
      transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.35))', opacity: 1,
    }} />
  );
};

const Clip: React.FC<{c: (typeof placed)[number]}> = ({c}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(`clips/source-${c.src}.mp4`)} style={{width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(0.96) contrast(1.06) brightness(1.01)'}} />
      {/* cinematic grade: cool shadows, gentle vignette (kept light so skin stays natural) */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,50,120,0.18), rgba(5,10,24,0.05) 45%, rgba(5,10,24,0.30))', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 75% at 50% 42%, rgba(0,0,0,0) 58%, rgba(3,6,13,0.42) 100%)'}} />
      <Flower src={c.src} frame={f} />
    </AbsoluteFill>
  );
};

// Full-screen scenes: the card is hidden under them (the backdrop of the scene covers it).
const fullRanges = scenes.filter((s) => s.full).map((s) => [toFrame(s.s), toFrame(s.e)] as const);

export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const g = geomAt(frame);
  const radius = interpolate(g.s, [0.66, 1], [44, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const framed = g.s < 0.995;
  return (
    <AbsoluteFill>
      <Backdrop t={frame} px={g.x} py={g.y} />
      <AbsoluteFill style={{transform: `translate(${g.x}px, ${g.y}px) scale(${g.s})`, transformOrigin: '50% 50%',
        filter: g.v > 0.05 ? `blur(${(g.v * 2.2).toFixed(2)}px)` : 'none'}}>
        {framed ? <div style={{position: 'absolute', inset: -3, borderRadius: radius + 3, background: 'linear-gradient(160deg, rgba(191,217,255,0.55), rgba(76,134,245,0.15) 40%, rgba(242,196,98,0.35))',
          boxShadow: `0 60px 140px rgba(0,0,0,0.6), 0 0 80px ${theme.blueGlow}`}} /> : null}
        <AbsoluteFill style={{borderRadius: radius, overflow: 'hidden', background: theme.black}}>
          {placed.map((c) => (
            <Sequence key={c.src} from={c.start} durationInFrames={c.frames} name={`clip ${c.src}`}>
              <Clip c={c} />
            </Sequence>
          ))}
          {/* light sweep across the glass when the card moves */}
          {g.v > 0.02 ? <AbsoluteFill style={{background: `linear-gradient(115deg, rgba(255,255,255,0) ${30 + g.v * 20}%, rgba(255,255,255,${0.10 * g.v}) ${40 + g.v * 20}%, rgba(255,255,255,0) ${50 + g.v * 20}%)`}} /> : null}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export {fullRanges, VIDEO};
