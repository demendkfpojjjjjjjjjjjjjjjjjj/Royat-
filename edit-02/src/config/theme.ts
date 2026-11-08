// Visual identity: calm blue (primary) + black / white, soft yellow for accents only.
export const theme = {
  blue: '#5B8FC9',
  blueLight: '#8DB6E3',
  blueDeep: '#2A4E7E',
  navy: '#0B1524',
  navy2: '#122238',
  glass: 'rgba(12, 22, 38, 0.78)',
  glassBorder: 'rgba(141, 182, 227, 0.28)',
  blueGlow: 'rgba(91, 143, 201, 0.45)',
  yellow: '#E8C15A',
  yellowDeep: '#C9A23E',
  yellowGlow: 'rgba(232, 193, 90, 0.45)',
  black: '#08090B',
  g2: '#2A3442',
  g3: '#6B7685',
  g4: '#A9B2BE',
  white: '#FFFFFF',
  fontText: "'Plex', sans-serif",
  fontDisplay: "'Kufi', 'Plex', sans-serif",
  fontElegant: "'Amiri', 'Plex', serif",
};

export const VIDEO = {width: 1080, height: 1920, fps: 30};

// Layout zones for this footage: the head sits at ~y 570-950, so overlays use the
// wall above it (TOP zone) or the chest area under it; captions sit low on the frame.
export const ZONE = {topY: 250, kineticY: 1330, captionY: 1600};
