import {Easing, interpolate} from 'remotion';

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

// 0 -> 1 progress starting at `start`, lasting `dur` frames.
export const prog = (frame: number, start: number, dur: number, ease = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

// Soft entrance used everywhere: fade + rise + motion blur that resolves.
export const enter = (p: number, rise = 24, blur = 10) => ({
  opacity: p,
  transform: `translateY(${lerp(p, rise, 0)}px)`,
  filter: `blur(${lerp(p, blur, 0)}px)`,
});
