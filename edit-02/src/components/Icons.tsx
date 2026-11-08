import React from 'react';

type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties};
const svg = (size: number, children: React.ReactNode, style?: React.CSSProperties, vb = '0 0 48 48') => (
  <svg width={size} height={size} viewBox={vb} fill="none" style={style}>{children}</svg>
);

export const LockIcon: React.FC<P & {open?: number}> = ({size = 64, color = '#fff', stroke = 3.5, open = 0, style}) =>
  svg(size, <>
    <path d="M15 22v-6a9 9 0 0 1 18 0v6" stroke={color} strokeWidth={stroke} strokeLinecap="round"
      transform={`translate(0 ${-open * 5}) rotate(${open * -24} 33 22)`} />
    <rect x="10" y="22" width="28" height="20" rx="5" stroke={color} strokeWidth={stroke} />
    <circle cx="24" cy="31" r="2.6" fill={color} />
    <path d="M24 33v4" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </>, style);

export const UserIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <circle cx="24" cy="17" r="8" stroke={color} strokeWidth={stroke} />
    <path d="M9 41c1.5-8 7.5-12 15-12s13.5 4 15 12" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </>, style);

export const ServerIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <rect x="8" y="8" width="32" height="13" rx="3" stroke={color} strokeWidth={stroke} />
    <rect x="8" y="27" width="32" height="13" rx="3" stroke={color} strokeWidth={stroke} />
    <circle cx="15" cy="14.5" r="1.8" fill={color} /><circle cx="15" cy="33.5" r="1.8" fill={color} />
    <path d="M22 14.5h12M22 33.5h12" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </>, style);

export const MailIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <rect x="6" y="11" width="36" height="26" rx="4" stroke={color} strokeWidth={stroke} />
    <path d="M8 14l16 12 16-12" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
  </>, style);

export const CardIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <rect x="5" y="11" width="38" height="26" rx="4" stroke={color} strokeWidth={stroke} />
    <path d="M5 19h38M11 30h9" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </>, style);

export const CheckIcon: React.FC<P & {draw?: number}> = ({size = 64, color = '#fff', stroke = 5, draw = 1, style}) =>
  svg(size, <path d="M11 25l9 9 17-19" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    strokeDasharray={40} strokeDashoffset={40 * (1 - draw)} />, style);

export const CrossIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 5, style}) =>
  svg(size, <path d="M14 14l20 20M34 14L14 34" stroke={color} strokeWidth={stroke} strokeLinecap="round" />, style);

export const WarnIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <path d="M24 7L43 40H5L24 7z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    <path d="M24 19v10" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    <circle cx="24" cy="34.5" r="2.2" fill={color} />
  </>, style);

export const GearIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <circle cx="24" cy="24" r="6.5" stroke={color} strokeWidth={stroke} />
    <path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.6 10.6l4.2 4.2M33.2 33.2l4.2 4.2M10.6 37.4l4.2-4.2M33.2 14.8l4.2-4.2"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </>, style);

export const IncognitoIcon: React.FC<P> = ({size = 64, color = '#fff', stroke = 3.5, style}) =>
  svg(size, <>
    <path d="M6 23h36M12 23l3-12h18l3 12" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" />
    <circle cx="15" cy="33" r="6" stroke={color} strokeWidth={stroke} />
    <circle cx="33" cy="33" r="6" stroke={color} strokeWidth={stroke} />
    <path d="M21 33c2-1.6 4-1.6 6 0" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  </>, style);

export const ShieldPath = 'M100 10 L178 40 V100 C178 150 145 186 100 202 C55 186 22 150 22 100 V40 Z';
export const ShieldIcon: React.FC<P & {fill?: string}> = ({size = 64, color = '#fff', stroke = 10, fill = 'none', style}) =>
  svg(size, <>
    <path d={ShieldPath} stroke={color} strokeWidth={stroke} strokeLinejoin="round" fill={fill} />
    <path d="M66 104l24 24 46-50" stroke={color} strokeWidth={stroke * 1.2} strokeLinecap="round" strokeLinejoin="round" />
  </>, style, '0 0 200 212');

// ---- extra glyphs for edit 02 (all simple strokes, 48x48 grid) ----
const g = (size: number, children: React.ReactNode, style?: React.CSSProperties) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>{children}</svg>
);
type Q = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties};

export const CalcIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <rect x="11" y="6" width="26" height="36" rx="4" stroke={color} strokeWidth={stroke} />
  <rect x="16" y="11" width="16" height="7" rx="1.5" stroke={color} strokeWidth={stroke * 0.8} />
  {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={17.5 + c * 6.5} cy={25 + r * 5.6} r={1.7} fill={color} />))}
</>, style);

export const DbIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <ellipse cx="24" cy="11" rx="14" ry="5" stroke={color} strokeWidth={stroke} />
  <path d="M10 11v26c0 2.8 6.3 5 14 5s14-2.2 14-5V11M10 20c0 2.8 6.3 5 14 5s14-2.2 14-5M10 28.5c0 2.8 6.3 5 14 5s14-2.2 14-5" stroke={color} strokeWidth={stroke} />
</>, style);

export const CloudIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M14 36h21a8 8 0 0 0 1-15.9A11 11 0 0 0 15 18.5 8.8 8.8 0 0 0 14 36z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
</>, style);

export const ChartUpIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M7 40h34" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  <path d="M10 32l9-9 7 6 12-14" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  <path d="M30 15h8v8" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
</>, style);

export const BulbIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M17 30c-3-2.6-5-6.3-5-10a12 12 0 0 1 24 0c0 3.7-2 7.4-5 10v5H17v-5z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
  <path d="M19 41h10" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
</>, style);

export const BuildingIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <rect x="10" y="7" width="20" height="34" rx="2" stroke={color} strokeWidth={stroke} />
  <path d="M30 18h8v23h-8M5 41h38" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  {[0, 1, 2, 3].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={14.5 + c * 7} y={12 + r * 6.5} width={3.5} height={3.2} rx={0.6} fill={color} />))}
</>, style);

export const BookIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M24 12c-4-3-10-3-16-2v28c6-1 12-1 16 2 4-3 10-3 16-2V10c-6-1-12-1-16 2zM24 12v28" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
</>, style);

export const ListIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <rect x="9" y="6" width="30" height="36" rx="4" stroke={color} strokeWidth={stroke} />
  <path d="M15 17l3 3 5-6M15 29l3 3 5-6M27 18h6M27 30h6" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
</>, style);

export const RadarIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <circle cx="21" cy="21" r="12" stroke={color} strokeWidth={stroke} />
  <path d="M30 30l10 10" stroke={color} strokeWidth={stroke * 1.2} strokeLinecap="round" />
  <path d="M15 21h12M21 15v12" stroke={color} strokeWidth={stroke * 0.8} strokeLinecap="round" />
</>, style);

export const RefreshIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M38 22A14 14 0 0 0 12 16M10 26a14 14 0 0 0 26 6" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
  <path d="M11 8v8h8M37 40v-8h-8" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
</>, style);

export const BellIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M13 33V22a11 11 0 0 1 22 0v11l3 4H10l3-4z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
  <path d="M20 41a4 4 0 0 0 8 0" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
</>, style);

export const InstituteIcon: React.FC<Q> = ({size = 64, color = '#fff', stroke = 3.4, style}) => g(size, <>
  <path d="M6 18L24 8l18 10H6zM8 40h32M10 22v14M18 22v14M30 22v14M38 22v14" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" />
</>, style);
