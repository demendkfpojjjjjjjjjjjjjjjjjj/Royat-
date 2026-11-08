import {Anchor, segments} from '../config/edit';
import {VIDEO} from '../config/theme';

const fps = VIDEO.fps;

export type PlacedSegment = (typeof segments)[number] & {
  start: number; // output frame
  frames: number;
  index: number;
};

let cursor = 0;
export const placed: PlacedSegment[] = segments.map((s, index) => {
  const frames = Math.round((s.to - s.from) * fps);
  const p = {...s, start: cursor, frames, index};
  cursor += frames;
  return p;
});
export const TOTAL_FRAMES = cursor;

// Map a source-time anchor to an output frame. Anchors that fall inside a
// removed pause snap to the next kept frame.
export const toFrame = (a: Anchor): number => {
  const same = placed.filter((p) => p.src === a.src);
  for (const p of same) {
    if (a.t >= p.from && a.t <= p.to) {
      return p.start + Math.min(p.frames, Math.round((a.t - p.from) * fps));
    }
  }
  const next = same.find((p) => p.from > a.t);
  if (next) return next.start;
  const last = same[same.length - 1];
  return last.start + last.frames;
};

export const segmentAt = (frame: number): PlacedSegment =>
  placed.find((p) => frame >= p.start && frame < p.start + p.frames) ?? placed[placed.length - 1];
