import React from 'react';
import {Sequence} from 'remotion';
import {SceneType, scenes} from '../config/edit';
import {toFrame} from '../lib/time';
import {
  AudienceScene, FollowScene, FrameworkScene, IconsScene, IdeaScene, PdrScene, PercentScene,
  PillarsScene, RaceScene, RealityScene, RiskScene, SceneProps, SeriesScene,
} from '../scenes/Scenes';

const registry: Record<SceneType, React.FC<SceneProps>> = {
  icons: IconsScene, race: RaceScene, reality: RealityScene, risk: RiskScene, idea: IdeaScene,
  series: SeriesScene, percent: PercentScene, pillars: PillarsScene, framework: FrameworkScene,
  pdr: PdrScene, audience: AudienceScene, follow: FollowScene,
};

export const SceneLayer: React.FC = () => (
  <>
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
