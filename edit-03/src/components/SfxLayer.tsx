import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {CAMERA_SOUNDS, SFX_GAIN, SfxName, compositions, scenes} from '../config/edit';
import {toFrame} from '../lib/time';

// Frames a sound starts BEFORE its anchor so risers / reverse whooshes land on the hit.
const LEAD: Partial<Record<SfxName, number>> = {riser: 36, rwhoosh: 20};
const LEN: Partial<Record<SfxName, number>> = {riser: 42, resonance: 50, shimmer: 32, downlifter: 30, subhit: 32, deephit: 28, tonal: 28, cam: 32, air: 28};

type Cue = {frame: number; name: SfxName; gain: number};
const cues: Cue[] = [];
for (const s of scenes) {
  const from = toFrame(s.s);
  for (const [beat, name, gain] of s.cues ?? []) {
    const at = beat === 'in' ? from : toFrame(s.beats![beat]);
    cues.push({frame: at - (LEAD[name] ?? 0), name, gain: gain ?? 1});
  }
}
// camera moves between compositions: rotating set so the same sound never repeats back to back
compositions.slice(1).forEach((c, i) => {
  cues.push({frame: toFrame(c.at) - 2, name: CAMERA_SOUNDS[i % CAMERA_SOUNDS.length], gain: 0.55});
});

export const SfxLayer: React.FC = () => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.frame)} durationInFrames={(LEN[c.name] ?? 22) + 8} name={`sfx ${c.name}`} layout="none">
        <Audio src={staticFile(`sfx/${c.name}.wav`)} volume={SFX_GAIN * c.gain} />
      </Sequence>
    ))}
  </>
);
export const SFX_CUES = cues;
