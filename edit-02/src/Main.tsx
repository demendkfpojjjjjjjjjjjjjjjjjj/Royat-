import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {FaceTrack, Grade} from './components/FaceTrack';
import {KineticLayer} from './components/KineticLayer';
import {SceneLayer} from './components/SceneLayer';
import {SfxLayer} from './components/SfxLayer';
import {theme} from './config/theme';
import {loadFonts} from './lib/fonts';
import {TOTAL_FRAMES} from './lib/time';

loadFonts();

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 6, TOTAL_FRAMES - 16, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: theme.black}}>
      <AbsoluteFill style={{opacity: fade}}>
        <FaceTrack />
        <Grade />
        <SceneLayer />
        <KineticLayer />
        <Captions />
      </AbsoluteFill>
      <SfxLayer />
    </AbsoluteFill>
  );
};
