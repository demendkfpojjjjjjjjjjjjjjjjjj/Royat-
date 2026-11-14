// Modern flat identity: SOLID colours only (no gradients). Depth comes from translucent
// frosted glass (solid colour + transparency + backdrop blur), not from gradients.
export const theme = {
  navy: '#0B1630',
  blue: '#3B82F6',      // primary
  blueDeep: '#1E3A8A',
  sky: '#93C5FD',       // light blue for secondary text
  gold: '#F5C04A',      // accent, used sparingly
  ink: '#1A1405',       // text on gold
  white: '#FFFFFF',
  muted: '#B4C0D3',
  black: '#03060D',
  // frosted glass
  glass: 'rgba(11, 22, 48, 0.55)',
  glassStrong: 'rgba(8, 16, 36, 0.72)',
  glassLight: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  blur: 'blur(22px) saturate(140%)',
  font: "'Tajawal', sans-serif",
  // kept for older references
  electric: '#3B82F6', royal: '#1E3A8A', deep: '#1E3A8A', ice: '#93C5FD', goldDeep: '#F5C04A',
  goldGlow: 'rgba(0,0,0,0)', blueGlow: 'rgba(0,0,0,0)', navy2: '#0B1630', graphite: '#121A2B',
};

export const VIDEO = {width: 1080, height: 1920, fps: 30};

// The flower image box relative to the tracked diameter (must match scripts/verify_coverage.py).
export const FLOWER_BOX = 1.12;

// Captions sit in a frosted pill near the bottom edge.
export const CAPTION_Y = 1772;
