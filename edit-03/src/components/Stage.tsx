import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Mode, compositions} from '../config/edit';
import {FLOWER_BOX, theme} from '../config/theme';
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

// ---------------------------------------------------------------- digital camera
// The video always fills the screen. A camera move is a gentle zoom/pan of the video
// itself; the pan is clamped to the zoom so no empty edge ever shows.
//   full  = whole frame (slow breathing push)
//   up    = push in, frame shifted up (space for explanations below)
//   down  = push in, frame shifted down (space above)
//   left / right = push in, frame shifted sideways (space on the other side)
export type Geom = {s: number; x: number; y: number};
export const GEOM: Record<Mode, Geom> = {
  full: {s: 1.0, x: 0, y: 0},
  up: {s: 1.12, x: 0, y: -105},
  down: {s: 1.12, x: 0, y: 105},
  left: {s: 1.12, x: -60, y: -30},
  right: {s: 1.12, x: 60, y: -30},
};
const TRANS = 26; // frames per camera move
const keys = compositions.map((c) => ({f: toFrame(c.at), g: GEOM[c.mode], mode: c.mode}));
const clampPan = (g: Geom): Geom => {
  const mx = (g.s - 1) * 540, my = (g.s - 1) * 960;
  return {s: g.s, x: Math.max(-mx, Math.min(mx, g.x)), y: Math.max(-my, Math.min(my, g.y))};
};

export const geomAt = (frame: number): Geom & {v: number; mode: Mode} => {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].f <= frame) i++;
  const cur = keys[i];
  const prev = i > 0 ? keys[i - 1].g : cur.g;
  const p = interpolate(frame, [cur.f, cur.f + TRANS], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const lerp = (a: number, b: number) => a + (b - a) * p;
  const v = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
  // slow breathing push so a held composition is never static (only ever zooms in)
  const breathe = 0.018 * (0.5 + 0.5 * Math.sin(frame / 95));
  const g = clampPan({s: lerp(prev.s, cur.g.s) + breathe, x: lerp(prev.x, cur.g.x), y: lerp(prev.y, cur.g.y)});
  return {...g, v, mode: cur.mode};
};

// ---------------------------------------------------------------- video + tracked flower
const Flower: React.FC<{src: string; frame: number}> = ({src, frame}) => {
  const tr = TRACKS[src];
  const [cx, cy, d, rot] = tr[Math.min(frame, tr.length - 1)];
  const size = d * FLOWER_BOX;
  const hgt = size * (567 / 577);
  return (
    <Img src={staticFile('flower.png')} style={{
      position: 'absolute', width: size, height: hgt, left: cx - size / 2, top: cy - hgt / 2,
      transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.30))', opacity: 1,
    }} />
  );
};

const Clip: React.FC<{c: (typeof placed)[number]}> = ({c}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(`clips/source-${c.src}.mp4`)} style={{width: '100%', height: '100%', objectFit: 'cover',
        filter: 'saturate(0.95) contrast(1.07) brightness(1.01)'}} />
      {/* cinematic grade: one flat cool tint, kept light so skin stays natural */}
      <AbsoluteFill style={{background: 'rgba(16, 40, 96, 0.10)', mixBlendMode: 'soft-light'}} />
      <Flower src={c.src} frame={f} />
    </AbsoluteFill>
  );
};

export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const g = geomAt(frame);
  return (
    <AbsoluteFill style={{background: theme.black, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${g.x}px, ${g.y}px) scale(${g.s})`, transformOrigin: '50% 50%',
        filter: g.v > 0.05 ? `blur(${(g.v * 2).toFixed(2)}px)` : 'none'}}>
        {placed.map((c) => (
          <Sequence key={c.src} from={c.start} durationInFrames={c.frames} name={`clip ${c.src}`}>
            <Clip c={c} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
