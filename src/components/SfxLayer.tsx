import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {SFX_GAIN, SfxName, emphases, extraSfx, scenes} from '../config/edit';
import {toFrame} from '../lib/time';

type Cue = {frame: number; name: SfxName; volume: number};

// Entrances get their sound automatically; everything else comes from `extraSfx`.
const cues: Cue[] = [
  ...scenes.map((s) => ({
    frame: toFrame(s.s) - 3,
    name: (s.type === 'section' ? 'impact' : 'whoosh') as SfxName,
    volume: s.type === 'section' ? 0.85 : 0.75,
  })),
  ...emphases.map((e) => ({frame: toFrame(e.bigAt) - 4, name: 'whoosh' as SfxName, volume: 0.6})),
  ...extraSfx.map((x) => ({frame: toFrame(x.at), name: x.name, volume: x.volume ?? 1})),
];

export const SfxLayer: React.FC = () => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.frame)} durationInFrames={30} name={`sfx ${c.name}`} layout="none">
        <Audio src={staticFile(`sfx/${c.name}.wav`)} volume={SFX_GAIN * c.volume} />
      </Sequence>
    ))}
  </>
);
