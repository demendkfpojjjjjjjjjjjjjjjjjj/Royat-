import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {emphases} from '../config/edit';
import {theme} from '../config/theme';
import {toFrame} from '../lib/time';
import {enter, lerp, prog} from '../lib/anim';

const items = emphases.map((e) => ({
  ...e, sf: toFrame(e.s), ef: toFrame(e.e), bf: toFrame(e.bigAt), btf: e.bottomAt ? toFrame(e.bottomAt) : toFrame(e.bigAt) + 6,
}));

export const EmphasisLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const e = items.find((x) => frame >= x.sf && frame < x.ef);
  if (!e) return null;
  const shade = prog(frame, e.sf, 8) * (1 - prog(frame, e.ef - 6, 6));
  const out = prog(frame, e.ef - 6, 6);
  const pTop = prog(frame, e.sf, 8);
  const pBig = prog(frame, e.bf, 10);
  const pBot = prog(frame, e.btf, 8);
  const bigSize = Math.min(180, Math.floor(1500 / e.big.length));
  // Faint breathing glow once the keyword has landed.
  const glow = 22 + 10 * Math.sin((frame - e.bf) / 9);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.7) 100%)', opacity: shade}} />
      <div
        dir="rtl"
        style={{
          position: 'absolute', left: 50, right: 50, top: 1380, transform: 'translateY(-50%)',
          textAlign: 'center', opacity: 1 - out, filter: `blur(${out * 8}px)`,
        }}
      >
        <div style={{fontFamily: theme.fontText, fontWeight: 600, fontSize: 54, color: theme.white,
          textShadow: '0 2px 12px rgba(0,0,0,0.7)', ...enter(pTop, 16, 8)}}>
          {e.top}
        </div>
        <div
          style={{
            fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: bigSize, lineHeight: 1.25,
            color: theme.yellow, margin: '6px 0',
            textShadow: `0 0 ${glow}px ${theme.yellowGlow}, 0 0 60px rgba(230,193,90,0.25), 0 4px 18px rgba(0,0,0,0.6)`,
            opacity: pBig,
            transform: `scale(${lerp(pBig, 1.22, 1)})`,
            filter: `blur(${lerp(pBig, 16, 0)}px)`,
          }}
        >
          {e.big}
        </div>
        {e.bottom ? (
          <div style={{fontFamily: theme.fontText, fontWeight: 500, fontSize: 48, color: theme.g5,
            textShadow: '0 2px 12px rgba(0,0,0,0.7)', ...enter(pBot, 14, 8)}}>
            {e.bottom}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
