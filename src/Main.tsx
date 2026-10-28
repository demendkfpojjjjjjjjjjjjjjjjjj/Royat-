import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {EmphasisLayer} from './components/EmphasisLayer';
import {FaceTrack, Grade} from './components/FaceTrack';
import {SceneLayer} from './components/SceneLayer';
import {SfxLayer} from './components/SfxLayer';
import {theme} from './config/theme';
import {loadFonts} from './lib/fonts';
import {TOTAL_FRAMES} from './lib/time';

loadFonts();

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 6, TOTAL_FRAMES - 14, TOTAL_FRAMES], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{background: theme.black}}>
      <AbsoluteFill style={{opacity: fade}}>
        <FaceTrack />
        <Grade />
        <SceneLayer />
        <EmphasisLayer />
        <Captions />
      </AbsoluteFill>
      <SfxLayer />
    </AbsoluteFill>
  );
};
