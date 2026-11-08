import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Caption, captions, kinetics, scenes} from '../config/edit';
import {ZONE, theme} from '../config/theme';
import {toFrame} from '../lib/time';
import {lerp, prog} from '../lib/anim';

const clean = (w: string) => w.replace(/[،,:.؟?]/g, '');
const placedCaps = captions.map((c) => ({...c, sf: toFrame(c.s), ef: toFrame(c.e)}));
const blocked = [
  ...kinetics.map((k) => [toFrame(k.s), toFrame(k.e)] as const),
  ...scenes.filter((s) => s.hideCaptions).map((s) => [toFrame(s.s), toFrame(s.e)] as const),
];

const Chunk: React.FC<{c: Caption & {sf: number; ef: number}; frame: number}> = ({c, frame}) => {
  const words = c.text.split(' ');
  const total = words.reduce((n, w) => n + w.length, 0);
  const span = Math.max(4, (c.ef - c.sf) * 0.8);
  const out = prog(frame, c.ef - 4, 4);
  let acc = 0;
  return (
    <div dir="rtl" style={{position: 'absolute', top: ZONE.captionY, left: 60, right: 60, transform: 'translateY(-50%)',
      textAlign: 'center', opacity: 1 - out, filter: `blur(${out * 6}px)`}}>
      {words.map((w, i) => {
        const start = c.sf + (acc / total) * span;
        acc += w.length;
        const p = prog(frame, start, 6);
        const hi = c.hi?.includes(w) || c.hi?.includes(clean(w));
        const latin = /[A-Za-z]/.test(w);
        return (
          <span key={i} style={{
            display: 'inline-block', margin: '0 9px', fontFamily: theme.fontText, fontWeight: hi ? 700 : 500,
            fontSize: latin ? 52 : 58, lineHeight: 1.35, color: hi ? theme.yellow : theme.white,
            textShadow: hi ? `0 0 22px ${theme.yellowGlow}, 0 2px 14px rgba(0,0,0,0.75)` : '0 2px 14px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.35)',
            opacity: p, transform: `translateY(${lerp(p, 14, 0)}px) scale(${lerp(p, 0.96, 1)})`, filter: `blur(${lerp(p, 7, 0)}px)`,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  if (blocked.some(([a, b]) => frame >= a && frame < b)) return null;
  const c = placedCaps.find((x) => frame >= x.sf && frame < x.ef);
  if (!c) return null;
  return <AbsoluteFill style={{pointerEvents: 'none'}}><Chunk c={c} frame={frame} /></AbsoluteFill>;
};
