import React from 'react';
import {useCurrentFrame} from 'remotion';
import {scenes, tracker} from '../config/edit';
import {theme} from '../config/theme';
import {toFrame} from '../lib/time';
import {prog} from '../lib/anim';

const s = toFrame(tracker.s), e = toFrame(tracker.e);
const steps = tracker.steps.map(toFrame);
const fullRanges = scenes.filter((x) => x.full).map((x) => [toFrame(x.s), toFrame(x.e)] as const);

// "Asset 1..6" progress HUD at the top while the six assets are listed.
export const Tracker: React.FC = () => {
  const f = useCurrentFrame();
  if (f < s || f >= e) return null;
  const o = prog(f, s, 12) * (1 - prog(f, e - 10, 10)) * (fullRanges.some(([a, b]) => f >= a && f < b) ? 0.85 : 1);
  let cur = 0;
  steps.forEach((st, i) => { if (f >= st) cur = i; });
  return (
    <div dir="rtl" style={{position: 'absolute', top: 26, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', padding: '10px 18px', borderRadius: 999,
        background: theme.glass, border: '1.5px solid rgba(191,217,255,0.16)', backdropFilter: theme.blur}}>
        {steps.map((st, i) => {
          const done = i < cur, active = i === cur;
          const p = active ? prog(f, st, 12) : 1;
          return (
            <div key={i} style={{width: active ? 40 + 40 * p : 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? theme.gold : done ? theme.blue : 'rgba(255,255,255,0.08)',
              boxShadow: 'none', fontFamily: theme.font, fontWeight: 800, fontSize: 22,
              color: active ? theme.ink : done ? theme.white : theme.muted}}>{i + 1}</div>
          );
        })}
      </div>
    </div>
  );
};
