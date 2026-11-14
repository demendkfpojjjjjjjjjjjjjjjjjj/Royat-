import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Caption, captions, scenes} from '../config/edit';
import {CAPTION_Y, theme} from '../config/theme';
import {toFrame} from '../lib/time';
import {lerp, prog} from '../lib/anim';

const clean = (w: string) => w.replace(/[،,:.؟?]/g, '');
const placedCaps = captions.map((c) => ({...c, sf: toFrame(c.s), ef: toFrame(c.e)}));
const blocked = scenes.filter((s) => s.hideCaptions).map((s) => [toFrame(s.s), toFrame(s.e)] as const);

// Captions: a dark glass pill near the bottom; words reveal as spoken; gold for key words.
const Chunk: React.FC<{c: Caption & {sf: number; ef: number}; frame: number}> = ({c, frame}) => {
  const words = c.text.split(' ');
  const total = words.reduce((n, w) => n + w.length, 0);
  const span = Math.max(4, (c.ef - c.sf) * 0.8);
  const pin = prog(frame, c.sf, 6), out = prog(frame, c.ef - 4, 4);
  const long = c.text.length > 30;
  let acc = 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: CAPTION_Y, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)'}}>
      <div dir="rtl" style={{maxWidth: 960, padding: '14px 30px 18px', borderRadius: 30, textAlign: 'center',
        background: theme.glass, border: `1.5px solid ${theme.glassBorder}`,
        boxShadow: '0 14px 40px rgba(0,0,0,0.3)', backdropFilter: theme.blur,
        opacity: pin * (1 - out), transform: `translateY(${lerp(pin, 14, 0)}px)`, filter: `blur(${out * 6}px)`}}>
        {words.map((w, i) => {
          const start = c.sf + (acc / total) * span;
          acc += w.length;
          const p = prog(frame, start, 6);
          const hi = c.hi?.includes(w) || c.hi?.includes(clean(w));
          return (
            <span key={i} style={{display: 'inline-block', margin: '0 7px', fontFamily: theme.font, fontWeight: hi ? 800 : 500,
              fontSize: long ? 44 : 50, lineHeight: 1.4, color: hi ? theme.gold : theme.white,
              textShadow: 'none',
              opacity: lerp(p, 0.18, 1), filter: `blur(${lerp(p, 4, 0)}px)`, transform: `translateY(${lerp(p, 6, 0)}px)`}}>{w}</span>
          );
        })}
      </div>
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
