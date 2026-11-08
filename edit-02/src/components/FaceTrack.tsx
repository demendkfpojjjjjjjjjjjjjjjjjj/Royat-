import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {VIDEO} from '../config/theme';
import {placed, segmentAt} from '../lib/time';
import {easeInOut} from '../lib/anim';

// The head sits around 40% of the frame height: zoom around it so it is never cropped.
export const CAM_ORIGIN = '50% 40%';

// Camera scale at a global frame (also used by overlays for parallax).
export const camScaleAt = (frame: number) => {
  const seg = segmentAt(frame);
  return interpolate(frame - seg.start, [0, seg.frames], seg.cam, {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut,
  });
};

const Shot: React.FC<{seg: (typeof placed)[number]}> = ({seg}) => {
  const f = useCurrentFrame();
  const scale = camScaleAt(seg.start + f);
  // Tiny drift so static shots still breathe.
  const dx = Math.sin((seg.start + f) / 70) * 4;
  const fade = interpolate(f, [0, 2, seg.frames - 2, seg.frames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{transform: `translateX(${dx}px) scale(${scale})`, transformOrigin: CAM_ORIGIN}}>
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

// Finishing: soft cinematic vignette + caption shade at the bottom.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 72% at 50% 40%, rgba(0,0,0,0) 55%, rgba(4,10,20,0.42) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 66%, rgba(5,10,18,0.62) 86%, rgba(5,10,18,0.78) 100%)'}} />
  </AbsoluteFill>
);
