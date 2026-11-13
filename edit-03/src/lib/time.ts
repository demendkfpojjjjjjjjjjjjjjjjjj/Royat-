import {Anchor, clips} from '../config/edit';
import {VIDEO} from '../config/theme';

// Every clip plays in full, back to back: nothing is trimmed.
export type PlacedClip = (typeof clips)[number] & {start: number; index: number};
let cursor = 0;
export const placed: PlacedClip[] = clips.map((c, index) => {
  const p = {...c, start: cursor, index};
  cursor += c.frames;
  return p;
});
export const TOTAL_FRAMES = cursor;

// Source-time anchor -> output frame.
export const toFrame = (a: Anchor): number => {
  const c = placed.find((p) => p.src === a.src)!;
  return c.start + Math.min(c.frames, Math.max(0, Math.round(a.t * VIDEO.fps)));
};

export const clipAt = (frame: number): PlacedClip =>
  placed.find((p) => frame >= p.start && frame < p.start + p.frames) ?? placed[placed.length - 1];
