import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {emphases} from '../config/edit';
import {VIDEO} from '../config/theme';
import {placed, toFrame} from '../lib/time';
import {easeInOut} from '../lib/anim';

// Face sits around 47% height in these selfie shots: zoom around it so it is never cropped.
const ORIGIN = '50% 44%';
const emphasisWindows = emphases.map((e) => [toFrame(e.s), toFrame(e.e)] as const);

const Shot: React.FC<{seg: (typeof placed)[number]}> = ({seg}) => {
  const f = useCurrentFrame();
  const g = seg.start + f;
  // Slow digital push-in inside each shot.
  const push = interpolate(f, [0, seg.frames], [0, 0.03], {easing: easeInOut});
  // Gentle extra push while an emphasis keyword is on screen.
  let bump = 0;
  for (const [a, b] of emphasisWindows) {
    if (g >= a - 10 && g <= b + 10) {
      bump = Math.max(bump, interpolate(g, [a - 10, a + 8, b - 4, b + 10], [0, 0.035, 0.035, 0], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut,
      }));
    }
  }
  const scale = seg.zoom + push + bump;
  const fade = interpolate(f, [0, 2, seg.frames - 2, seg.frames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: ORIGIN}}>
      <OffthreadVideo
        src={staticFile(`clips/source-${seg.src}.mp4`)}
        trimBefore={Math.round(seg.from * VIDEO.fps)}
        volume={() => fade}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </AbsoluteFill>
  );
};

export const FaceTrack: React.FC = () => (
  <AbsoluteFill>
    {placed.map((seg) => (
      <Sequence key={seg.index} from={seg.start} durationInFrames={seg.frames} name={`shot ${seg.src} ${seg.from}-${seg.to}`}>
        <Shot seg={seg} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

// Light finishing grade on top of the footage: soft vignette + caption shade.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 82%, rgba(0,0,0,0.7) 100%)'}} />
  </AbsoluteFill>
);
