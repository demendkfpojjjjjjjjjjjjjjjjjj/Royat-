import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {VIDEO} from './config/theme';
import {TOTAL_FRAMES} from './lib/time';

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
);
