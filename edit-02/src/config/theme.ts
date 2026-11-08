// Visual identity (modern): deep ink backgrounds, calm blue as the primary colour,
// white text, soft warm yellow only for accents. Change colours/fonts here only.
export const theme = {
  blue: '#5B95F0',
  blueLight: '#A5C8FF',
  blueDeep: '#2457B8',
  navy: '#070B14',
  navy2: '#0E1628',
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.13)',
  blueGlow: 'rgba(91, 149, 240, 0.40)',
  yellow: '#F4C95D',
  yellowDeep: '#D9A93A',
  yellowGlow: 'rgba(244, 201, 93, 0.38)',
  black: '#05070C',
  g2: '#1C2536',
  g3: '#6B778C',
  g4: '#9AA7BD',
  white: '#FFFFFF',
  fontText: "'Tajawal', sans-serif",
  fontDisplay: "'Tajawal', sans-serif",
  fontElegant: "'Tajawal', sans-serif",
};

export const VIDEO = {width: 1080, height: 1920, fps: 30};

// Layout zones for this footage: the head sits at ~y 570-950, so overlays use the
// wall above it (TOP zone) or beside it; captions sit low on the frame.
export const ZONE = {topY: 250, kineticY: 1330, captionY: 1600};
