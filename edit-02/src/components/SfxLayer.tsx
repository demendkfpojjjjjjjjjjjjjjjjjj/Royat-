import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {SFX_GAIN, SfxName, kinetics, sfx} from '../config/edit';
import {toFrame} from '../lib/time';

const LEN: Record<SfxName, number> = {
  whoosh: 18, air: 28, rwhoosh: 22, riser: 40, impact: 26, lowimpact: 34,
  click: 4, tick: 3, pop: 6, sweep: 20, cam: 32,
};

// `lead` = frames the sound starts BEFORE its anchor (risers / reverse whooshes end on the hit).
const cues = [
  ...sfx.map((c) => ({frame: toFrame(c.at) - (c.lead ?? 0), name: c.name, gain: c.gain ?? 1})),
  ...kinetics.map((k) => ({frame: toFrame(k.bigAt) - 4, name: 'whoosh' as SfxName, gain: 0.6})),
];

export const SfxLayer: React.FC = () => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.frame)} durationInFrames={LEN[c.name] + 6} name={`sfx ${c.name}`} layout="none">
        <Audio src={staticFile(`sfx/${c.name}.wav`)} volume={SFX_GAIN * c.gain} />
      </Sequence>
    ))}
  </>
);
