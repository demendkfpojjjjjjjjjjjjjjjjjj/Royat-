import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {SceneType, scenes} from '../config/edit';
import {toFrame} from '../lib/time';
import {theme} from '../config/theme';
import * as S from '../scenes/Scenes';

const registry: Record<SceneType, React.FC<S.SceneProps>> = {
  question: S.QuestionScene, episode: S.EpisodeScene, host: S.HostScene, path: S.PathScene, framework: S.FrameworkScene,
  percent: S.PercentScene, basics: S.BasicsScene, unknown: S.UnknownScene, notepad: S.NotepadScene, item: S.ItemScene,
  accounts: S.AccountsScene, access: S.AccessScene, devices: S.DevicesScene, example: S.ExampleScene, connect: S.ConnectScene,
  lateral: S.LateralScene, systems: S.SystemsScene, dataAsset: S.DataAssetScene, dataAccess: S.DataAccessScene,
  thirdParty: S.ThirdPartyScene, breach: S.BreachScene, summary: S.SummaryScene, nextEp: S.NextEpScene,
  mistakes: S.MistakesScene, outro: S.OutroScene, roadmap: S.RoadmapScene,
};

// Full-screen scenes: a deep frosted-glass layer over the video (solid tint + strong blur).
const FullBackdrop: React.FC<{from: number; dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // masked reveal: a soft circular wipe opening from the centre
  const r = interpolate(f, [0, 12], [0, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: o, clipPath: f < 12 ? `circle(${r}% at 50% 45%)` : undefined,
      background: theme.glassStrong, backdropFilter: 'blur(34px) saturate(130%)'}} />
  );
};

export const SceneLayer: React.FC = () => (
  <>
    {scenes.map((s, i) => {
      const from = toFrame(s.s);
      const dur = Math.max(1, toFrame(s.e) - from);
      const beats = Object.fromEntries(Object.entries(s.beats ?? {}).map(([k, a]) => [k, toFrame(a) - from]));
      const C = registry[s.type];
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`scene ${s.type}`}>
          {s.full ? <FullBackdrop from={from} dur={dur} /> : null}
          <C beats={beats} props={s.props ?? {}} />
        </Sequence>
      );
    })}
  </>
);
