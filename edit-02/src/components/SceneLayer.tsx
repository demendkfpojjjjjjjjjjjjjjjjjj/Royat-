import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {SceneType, scenes} from '../config/edit';
import {toFrame} from '../lib/time';
import {Backdrop} from '../scenes/Kit';
import {
  AudienceScene, FollowScene, FrameworkScene, IconsScene, IdeaScene, PdrScene, PercentScene,
  PillarsScene, RaceScene, RealityScene, RiskScene, SceneProps, SeriesScene,
} from '../scenes/Scenes';

const registry: Record<SceneType, React.FC<SceneProps>> = {
  icons: IconsScene, race: RaceScene, reality: RealityScene, risk: RiskScene, idea: IdeaScene,
  series: SeriesScene, percent: PercentScene, pillars: PillarsScene, framework: FrameworkScene,
  pdr: PdrScene, audience: AudienceScene, follow: FollowScene,
};

// Consecutive full scenes share one backdrop, so the footage never flashes between them.
const runs: [number, number][] = [];
for (const s of scenes.filter((x) => x.full)) {
  const a = toFrame(s.s), b = toFrame(s.e);
  const last = runs[runs.length - 1];
  if (last && a <= last[1] + 1) last[1] = Math.max(last[1], b);
  else runs.push([a, b]);
}

const BackdropRun: React.FC<{from: number; dur: number}> = ({from, dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, dur - 6, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}><Backdrop t={from + f} /></AbsoluteFill>;
};

export const SceneLayer: React.FC = () => (
  <>
    {runs.map(([a, b], i) => (
      <Sequence key={`bg${i}`} from={a} durationInFrames={b - a} name="backdrop">
        <BackdropRun from={a} dur={b - a} />
      </Sequence>
    ))}
    {scenes.map((s, i) => {
      const from = toFrame(s.s);
      const dur = toFrame(s.e) - from;
      const beats = Object.fromEntries(Object.entries(s.beats ?? {}).map(([k, a]) => [k, toFrame(a) - from]));
      const C = registry[s.type];
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`scene ${s.type}`}>
          <C beats={beats} from={from} full={s.full} />
        </Sequence>
      );
    })}
  </>
);
