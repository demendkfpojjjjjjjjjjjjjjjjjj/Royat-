import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Captions} from './components/Captions';
import {SceneLayer} from './components/SceneLayer';
import {SfxLayer} from './components/SfxLayer';
import {Stage} from './components/Stage';
import {Tracker} from './components/Tracker';
import {theme} from './config/theme';
import {loadFonts} from './lib/fonts';
import {TOTAL_FRAMES} from './lib/time';

loadFonts();

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 8, TOTAL_FRAMES - 18, TOTAL_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: theme.black}}>
      <AbsoluteFill style={{opacity: fade}}>
        <Stage />
        <SceneLayer />
        <Tracker />
        <Captions />
      </AbsoluteFill>
      <SfxLayer />
    </AbsoluteFill>
  );
};
