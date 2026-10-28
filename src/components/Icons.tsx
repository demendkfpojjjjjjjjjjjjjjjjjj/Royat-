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
