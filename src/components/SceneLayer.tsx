import React from 'react';
import {Sequence} from 'remotion';
import {SceneType, scenes} from '../config/edit';
import {toFrame} from '../lib/time';
import {
  AdminScene, BrowserScene, BuildScene, ChecklistScene, CompareScene, CyberScene,
  DataFlowScene, DoorScene, HttpsScene, SceneProps, SectionScene,
} from '../scenes/Scenes';

const registry: Record<SceneType, React.FC<SceneProps>> = {
  cyber: CyberScene, checklist: ChecklistScene, section: SectionScene, browser: BrowserScene,
  door: DoorScene, https: HttpsScene, dataflow: DataFlowScene, admin: AdminScene,
  compare: CompareScene, build: BuildScene,
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
          <C beats={beats} props={s.props ?? {}} />
        </Sequence>
      );
    })}
  </>
);
