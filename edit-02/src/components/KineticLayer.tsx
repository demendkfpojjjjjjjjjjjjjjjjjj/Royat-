import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {kinetics} from '../config/edit';
import {ZONE, theme} from '../config/theme';
import {toFrame} from '../lib/time';
import {enter, lerp, prog} from '../lib/anim';

const items = kinetics.map((k) => ({
  ...k, sf: toFrame(k.s), ef: toFrame(k.e), tf: k.topAt ? toFrame(k.topAt) : toFrame(k.s),
  bf: toFrame(k.bigAt), btf: k.bottomAt ? toFrame(k.bottomAt) : toFrame(k.bigAt) + 6,
}));

// Reference-style kinetic typography: small sans words + one big styled word with glow.
export const KineticLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const k = items.find((x) => frame >= x.sf && frame < x.ef);
  if (!k) return null;
  const shade = prog(frame, k.sf, 8) * (1 - prog(frame, k.ef - 6, 6));
  const out = prog(frame, k.ef - 6, 6);
  const pTop = prog(frame, k.tf, 8);
  const pBig = prog(frame, k.bf, 11);
  const pBot = prog(frame, k.btf, 8);
  const elegant = k.font === 'elegant';
  const size = elegant ? Math.min(200, Math.floor(1700 / k.big.length)) : Math.min(170, Math.floor(1400 / k.big.length));
  const glow = 22 + 8 * Math.sin((frame - k.bf) / 9);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 48%, rgba(5,12,22,0.62) 72%, rgba(5,12,22,0.75) 100%)', opacity: shade}} />
      <div dir="rtl" style={{position: 'absolute', left: 40, right: 40, top: ZONE.kineticY + 120, transform: 'translateY(-50%)',
        textAlign: 'center', opacity: 1 - out, filter: `blur(${out * 8}px)`}}>
        {k.top ? (
          <div style={{fontFamily: theme.fontText, fontWeight: 600, fontSize: 52, color: theme.white,
            textShadow: '0 3px 14px rgba(0,0,0,0.75)', ...enter(pTop, 16, 8)}}>{k.top}</div>
        ) : null}
        <div style={{
          fontFamily: elegant ? theme.fontElegant : theme.fontDisplay, fontWeight: elegant ? 700 : 800,
          fontSize: size, lineHeight: elegant ? 1.35 : 1.3, margin: '0 0 4px',
          color: elegant ? theme.white : theme.yellow,
          textShadow: elegant
            ? `0 0 ${glow}px ${theme.blueGlow}, 0 4px 20px rgba(0,0,0,0.7)`
            : `0 0 ${glow}px ${theme.yellowGlow}, 0 4px 18px rgba(0,0,0,0.65)`,
          opacity: pBig, transform: `scale(${lerp(pBig, 1.2, 1)})`, filter: `blur(${lerp(pBig, 16, 0)}px)`,
        }}>
          {k.big}
        </div>
        {elegant ? <div style={{margin: '-6px auto 10px', height: 5, borderRadius: 3, width: 260 * prog(frame, k.bf + 5, 14), background: theme.yellow,
          boxShadow: `0 0 16px ${theme.yellowGlow}`}} /> : null}
        {k.bottom ? (
          <div style={{fontFamily: theme.fontText, fontWeight: 600, fontSize: 48, color: theme.blueLight,
            textShadow: '0 3px 14px rgba(0,0,0,0.75)', ...enter(pBot, 14, 8)}}>{k.bottom}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
