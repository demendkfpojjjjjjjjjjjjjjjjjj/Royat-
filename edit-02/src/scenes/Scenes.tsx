import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {enter, lerp, prog} from '../lib/anim';
import {
  BellIcon, BookIcon, BuildingIcon, BulbIcon, CalcIcon, ChartUpIcon, CheckIcon, CloudIcon, DbIcon,
  GearIcon, InstituteIcon, ListIcon, RadarIcon, RefreshIcon, ServerIcon, ShieldIcon, UserIcon, WarnIcon,
} from '../components/Icons';
import {Glass, Glyph3D, Shell, Tile3D} from './Kit';

export type SceneProps = {beats: Record<string, number>; from: number; full: boolean};

const usePop = (at: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping: 14, stiffness: 180, mass: 0.7}});
};
const abs = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...s});
const T = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.fontText, ...s});
const D = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.fontDisplay, ...s});
const E = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.fontElegant, ...s});
const shadowTxt = '0 3px 14px rgba(0,0,0,0.7)';

// ---------------------------------------------------------------- 3 icons (systems / databases / cloud)
export const IconsScene: React.FC<SceneProps> = ({beats, full}) => {
  const items = [
    {b: beats.a, I: CalcIcon, t: 'أنظمة محاسبية'},
    {b: beats.b, I: DbIcon, t: 'قواعد بيانات'},
    {b: beats.c, I: CloudIcon, t: 'الخدمات السحابية'},
  ];
  return (
    <Shell full={full} topShade>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 150, display: 'flex', justifyContent: 'center', gap: 46})}>
        {items.map((it, i) => <IconItem key={i} {...it} spin={i * 40} />)}
      </div>
    </Shell>
  );
};
const IconItem: React.FC<{b: number; I: React.FC<{size?: number; color?: string}>; t: string; spin: number}> = ({b, I, t, spin}) => {
  const p = usePop(b);
  return (
    <div style={{width: 280, textAlign: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${lerp(p, 40, 0)}px) scale(${lerp(p, 0.6, 1)})`}}>
      <Tile3D size={170} spin={spin} style={{margin: '0 auto'}}><I size={96} color={theme.white} /></Tile3D>
      <div style={T({marginTop: 22, fontWeight: 700, fontSize: 40, color: theme.white, textShadow: shadowTxt})}>{t}</div>
    </div>
  );
};

// ---------------------------------------------------------------- race: technology vs. protection speed
export const RaceScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const pt = prog(f, 2, 12);
  const fast = prog(f, beats.bars, 34);
  const slow = prog(f, beats.slow, 70, (x) => x);
  const q = usePop(beats.q);
  const bar = (label: string, Icon: React.FC<{size?: number; color?: string}>, p: number, max: number, color: string, y: number, delay: number) => {
    const pin = prog(f, delay, 10);
    return (
      <div dir="rtl" style={abs({left: 90, right: 90, top: y, ...enter(pin, 20, 8)})}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18}}>
          <Tile3D size={74} tone={color === theme.blue ? 'blue' : 'yellow'} spin={y}><Icon size={44} color={color === theme.blue ? theme.white : theme.navy} /></Tile3D>
          <span style={D({fontWeight: 800, fontSize: 54, color: theme.white})}>{label}</span>
        </div>
        <div style={{height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.07)', border: `2px solid ${theme.glassBorder}`, overflow: 'hidden', direction: 'rtl'}}>
          <div style={{height: '100%', width: `${max * p * 100}%`, borderRadius: 20, background: `linear-gradient(270deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 24px ${color === theme.blue ? theme.blueGlow : theme.yellowGlow}`}} />
        </div>
      </div>
    );
  };
  return (
    <Shell full={full}>
      <div dir="rtl" style={abs({left: 60, right: 60, top: 300, textAlign: 'center', ...enter(pt, 20, 8)})}>
        <div style={T({fontWeight: 600, fontSize: 48, color: theme.blueLight})}>هل تطورت وسائل الحماية</div>
        <div style={E({fontWeight: 700, fontSize: 104, color: theme.white, lineHeight: 1.4})}>بنفس السرعة</div>
      </div>
      {bar('التقنية', ChartUpIcon, fast, 0.94, theme.blue, 640, 6)}
      {bar('الحماية', ShieldIconSmall, slow, 0.36, theme.yellow, 880, 10)}
      <div style={abs({left: 0, right: 0, top: 1090, textAlign: 'center', opacity: Math.min(1, q * 1.3),
        transform: `scale(${lerp(q, 0.4, 1)}) rotate(${Math.sin(f / 14) * 4}deg)`})}>
        <Glyph3D text="؟" size={260} />
      </div>
    </Shell>
  );
};
const ShieldIconSmall: React.FC<{size?: number; color?: string}> = ({size = 44, color = '#fff'}) => <ShieldIcon size={size} color={color} stroke={14} />;

// ---------------------------------------------------------------- MANDATORY 12-16s: "the reality" (full screen)
// The speaker is fully covered here. Title -> subline -> two growth cards, with a slow
// camera push, parallax between layers and a live chart in each card.
export const RealityScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const cam = f / d; // 0 -> 1 across the scene
  const pT = prog(f, Math.max(0, beats.title - 6), 12);
  const pS = prog(f, beats.sub, 10);
  const line = prog(f, beats.title + 6, 16);
  const dim = prog(f, beats.dim, 8);
  const card = (p: number, x: number, Icon: React.FC<{size?: number; color?: string}>, title: string, kind: 'bars' | 'line', start: number) => {
    const draw = prog(f, start + 6, 22);
    return (
      <div style={abs({left: x, top: 700 - cam * 26, width: 440, perspective: 1200,
        opacity: Math.min(1, p * 1.5) * (1 - dim * 0.4)})}>
        <Glass style={{padding: '34px 32px 30px', transform: `rotateX(${lerp(p, 28, 0)}deg) translateY(${lerp(p, 70, 0)}px)`, transformOrigin: '50% 100%'}}>
          <Tile3D size={84} spin={x}><Icon size={50} color={theme.white} /></Tile3D>
          <div style={D({marginTop: 22, fontWeight: 700, fontSize: 50, color: theme.white, lineHeight: 1.3, whiteSpace: 'nowrap'})}>{title}</div>
          <div style={{height: 210, marginTop: 24, borderRadius: 22, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative', overflow: 'hidden', direction: 'ltr'}}>
            {[0.25, 0.5, 0.75].map((g) => <div key={g} style={abs({left: 0, right: 0, top: `${g * 100}%`, height: 1, background: 'rgba(255,255,255,0.06)'})} />)}
            {kind === 'bars' ? (
              <div style={abs({left: 26, right: 26, bottom: 18, top: 18, display: 'flex', alignItems: 'flex-end', gap: 16})}>
                {[0.32, 0.48, 0.6, 0.78, 1].map((h, i) => {
                  const pb = prog(f, start + 6 + i * 4, 14);
                  return <div key={i} style={{flex: 1, height: `${h * 100 * pb}%`, borderRadius: 10,
                    background: i === 4 ? `linear-gradient(180deg, #FFE29A, ${theme.yellow})` : `linear-gradient(180deg, ${theme.blueLight}, ${theme.blue})`,
                    boxShadow: i === 4 ? `0 0 24px ${theme.yellowGlow}` : 'none'}} />;
                })}
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 376 230" preserveAspectRatio="none" style={abs({inset: 0})}>
                <defs>
                  <linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={theme.blue} stopOpacity="0.45" /><stop offset="1" stopColor={theme.blue} stopOpacity="0" /></linearGradient>
                </defs>
                <path d="M10 200 C 70 190, 100 160, 150 150 S 230 110, 270 80 S 340 40, 366 26 L366 230 L10 230 Z" fill="url(#lf)" opacity={draw} />
                <path d="M10 200 C 70 190, 100 160, 150 150 S 230 110, 270 80 S 340 40, 366 26" stroke={theme.blueLight} strokeWidth={5} fill="none"
                  strokeLinecap="round" strokeDasharray={480} strokeDashoffset={480 * (1 - draw)} />
                <circle cx={366} cy={26} r={9} fill={theme.yellow} opacity={draw > 0.95 ? 1 : 0} style={{filter: `drop-shadow(0 0 8px ${theme.yellowGlow})`}} />
              </svg>
            )}
          </div>
        </Glass>
      </div>
    );
  };
  return (
    <Shell full={full}>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 250 - cam * 50, textAlign: 'center'})}>
        <div style={D({fontWeight: 800, fontSize: 168, lineHeight: 1.3, display: 'inline-block',
          background: `linear-gradient(175deg, #FFFFFF 30%, ${theme.blueLight} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          filter: `drop-shadow(0 10px 40px ${theme.blueGlow}) blur(${lerp(pT, 14, 0)}px)`, opacity: pT, transform: `scale(${lerp(pT, 1.18, 1)})`})}>الحقيقة</div>
        <div style={{margin: '0 auto 22px', height: 7, borderRadius: 4, width: 220 * line, background: theme.yellow, boxShadow: `0 0 18px ${theme.yellowGlow}`}} />
        <div style={T({fontWeight: 500, fontSize: 56, color: theme.white, ...enter(pS, 16, 8)})}>
          أكثر الشركات <span style={{color: theme.yellow, fontWeight: 700}}>مهتمة</span>
        </div>
      </div>
      {card(prog(f, beats.left - 4, 16), 560, GearIcon, 'تطوّر أنظمة', 'bars', beats.left)}
      {card(prog(f, beats.right - 4, 16), 80, ChartUpIcon, 'توسّع خدماتها', 'line', beats.right)}
    </Shell>
  );
};

// ---------------------------------------------------------------- risk -> disaster (full, backlit silhouette)
export const RiskScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const phase2 = prog(f, beats.disaster - 40, 10);
  const p1a = prog(f, 2, 10), p1b = prog(f, beats.risk, 12), p1c = prog(f, beats.risk + 20, 10), p1d = prog(f, beats.ready, 10);
  const p2a = prog(f, beats.disaster - 38, 10), p2b = prog(f, beats.disaster, 12), p2c = prog(f, beats.after, 10);
  const crack = prog(f, beats.disaster, 16);
  const glow = 0.55 + 0.25 * Math.sin(f / 12) - crack * 0.25;
  const rings = [0, 1, 2].map((i) => ((f / 60 + i / 3) % 1));
  return (
    <Shell full={full}>
      {/* backlight like the reference's lit doorway */}
      <div style={abs({left: 140, top: 640, width: 800, height: 760, borderRadius: '50%',
        background: `radial-gradient(ellipse at 50% 60%, rgba(141,182,227,${glow}), rgba(91,143,201,${glow * 0.3}) 45%, rgba(0,0,0,0) 70%)`})} />
      {rings.map((r, i) => (
        <div key={i} style={abs({left: 540 - (180 + r * 360), top: 1040 - (180 + r * 360), width: (180 + r * 360) * 2, height: (180 + r * 360) * 2,
          borderRadius: '50%', border: `2px solid rgba(232,193,90,${0.35 * (1 - r) * Math.max(phase2, 0.35)})`})} />
      ))}
      <svg width={520} height={640} viewBox="0 0 520 640" style={abs({left: 280, top: 690})}>
        <rect x={110} y={40} width={200} height={600} fill="#04080E" />
        <rect x={310} y={190} width={130} height={450} fill="#060B13" />
        <rect x={40} y={300} width={70} height={340} fill="#060B13" />
        {Array.from({length: 12}).map((_, r) => Array.from({length: 4}).map((__, c) => (
          <rect key={`${r}${c}`} x={130 + c * 45} y={70 + r * 46} width={26} height={22} rx={3}
            fill={(r * 7 + c * 3) % 5 === 0 ? `rgba(232,193,90,${0.75 - crack * 0.5})` : 'rgba(141,182,227,0.16)'} />
        )))}
        <path d="M210 40 L196 160 L232 250 L188 360 L224 470 L200 640" stroke={theme.yellow} strokeWidth={6} fill="none"
          strokeDasharray={700} strokeDashoffset={700 * (1 - crack)} style={{filter: `drop-shadow(0 0 10px ${theme.yellowGlow})`}} />
        <path d="M232 250 L290 300 L310 290" stroke={theme.yellow} strokeWidth={4} fill="none" strokeDasharray={120} strokeDashoffset={120 * (1 - crack)} />
      </svg>
      <div style={abs({left: 0, right: 0, top: 1360, display: 'flex', justifyContent: 'center', opacity: phase2})}>
        <Tile3D size={110} tone="yellow"><WarnIcon size={64} color={theme.navy} stroke={4} /></Tile3D>
      </div>
      {/* phase 1: risks / readiness */}
      <div dir="rtl" style={abs({left: 50, right: 50, top: 230, textAlign: 'center', opacity: 1 - phase2})}>
        <div style={T({fontWeight: 600, fontSize: 50, color: theme.blueLight, ...enter(p1a, 14, 8)})}>ومش مدركة</div>
        <div style={E({fontWeight: 700, fontSize: 170, lineHeight: 1.35, color: theme.white, textShadow: `0 0 30px ${theme.blueGlow}`,
          opacity: p1b, transform: `scale(${lerp(p1b, 1.2, 1)})`, filter: `blur(${lerp(p1b, 14, 0)}px)`})}>للمخاطر</div>
        <div style={T({fontWeight: 600, fontSize: 48, color: theme.white, ...enter(p1c, 14, 8)})}>اللي بتواجهها</div>
        <div style={D({marginTop: 18, fontWeight: 800, fontSize: 56, color: theme.yellow, ...enter(p1d, 14, 8)})}>أو كيف تستعد لها</div>
      </div>
      {/* phase 2: discovered only after it happens */}
      <div dir="rtl" style={abs({left: 50, right: 50, top: 230, textAlign: 'center', opacity: phase2 * (1 - prog(f, d - 6, 6))})}>
        <div style={T({fontWeight: 600, fontSize: 50, color: theme.blueLight, ...enter(p2a, 14, 8)})}>فغالبًا ما بيكتشفوا</div>
        <div style={D({fontWeight: 800, fontSize: 130, lineHeight: 1.4, color: theme.yellow, textShadow: `0 0 30px ${theme.yellowGlow}`,
          opacity: p2b, transform: `scale(${lerp(p2b, 1.25, 1)})`, filter: `blur(${lerp(p2b, 14, 0)}px)`})}>حجم الكارثة</div>
        <div style={T({fontWeight: 600, fontSize: 50, color: theme.white, ...enter(p2c, 14, 8)})}>إلا بعد ما تحصل</div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- idea overlay
export const IdeaScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const pb = usePop(beats.bulb);
  const po = usePop(beats.owners);
  const ray = prog(f, beats.bulb, 20);
  return (
    <Shell full={full} topShade>
      <div style={abs({left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center', opacity: Math.min(1, pb * 1.4), transform: `scale(${lerp(pb, 0.5, 1)})`})}>
        <div style={{position: 'relative'}}>
          <div style={abs({inset: -60 - ray * 30, borderRadius: '50%', background: `radial-gradient(circle, rgba(232,193,90,${0.35 * ray}), rgba(0,0,0,0) 65%)`})} />
          <Tile3D size={170} tone="yellow"><BulbIcon size={100} color={theme.navy} stroke={3.8} /></Tile3D>
        </div>
      </div>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 340, textAlign: 'center', ...enter(prog(f, beats.bulb + 6, 10), 14, 8)})}>
        <span style={E({fontWeight: 700, fontSize: 88, color: theme.white, textShadow: `0 0 22px ${theme.blueGlow}, ${shadowTxt}`})}>فكرة سلسلة</span>
      </div>
      <div style={abs({left: 36, top: 660, opacity: Math.min(1, po * 1.4), transform: `translateX(${lerp(po, -60, 0)}px)`})}>
        <Glass style={{padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 16, width: 300}}>
          <Tile3D size={74}><BuildingIcon size={46} color={theme.white} /></Tile3D>
          <span style={T({fontWeight: 700, fontSize: 36, color: theme.white, lineHeight: 1.3})}>يا أصحاب<br />الشركات</span>
        </Glass>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- series title card (full)
export const SeriesScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const pe = usePop(beats.title - 6);
  const pt = prog(f, beats.title, 14);
  const pl = prog(f, beats.title - 4, 10);
  const line = prog(f, beats.title + 8, 18);
  return (
    <Shell full={full}>
      <div style={abs({left: 140, top: 230, width: 800, height: 800, borderRadius: '50%', opacity: 0.6,
        background: `conic-gradient(from ${f * 0.6}deg, rgba(141,182,227,0) 0deg, rgba(141,182,227,0.16) 20deg, rgba(141,182,227,0) 40deg, rgba(141,182,227,0) 90deg, rgba(141,182,227,0.12) 110deg, rgba(141,182,227,0) 130deg, rgba(141,182,227,0) 180deg, rgba(141,182,227,0.16) 200deg, rgba(141,182,227,0) 220deg, rgba(141,182,227,0) 270deg, rgba(141,182,227,0.12) 290deg, rgba(141,182,227,0) 310deg)`,
        maskImage: 'radial-gradient(circle, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 20%, transparent 70%)'})} />
      <div style={abs({left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center', transform: `scale(${lerp(pe, 0.4, 1)})`, opacity: Math.min(1, pe * 1.3)})}>
        <Tile3D size={250}><ShieldIcon size={150} color={theme.white} stroke={12} /></Tile3D>
      </div>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 780, textAlign: 'center'})}>
        <div style={T({fontWeight: 600, fontSize: 56, color: theme.blueLight, letterSpacing: 2, ...enter(pl, 14, 8)})}>سلسلة</div>
        <div style={D({fontWeight: 800, fontSize: 112, lineHeight: 1.35, color: theme.white, textShadow: `0 0 30px ${theme.blueGlow}`,
          opacity: pt, transform: `scale(${lerp(pt, 1.15, 1)})`, filter: `blur(${lerp(pt, 14, 0)}px)`})}>تأمين الشركات</div>
        <div style={{margin: '8px auto 0', height: 7, borderRadius: 4, width: 420 * line, background: theme.yellow, boxShadow: `0 0 20px ${theme.yellowGlow}`}} />
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- "no system is 100% secure" (overlay, kinetic)
export const PercentScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const p0 = prog(f, 2, 10);
  const p1 = prog(f, beats.top, 10);
  const pc = prog(f, beats.count, 12);
  const n = Math.round(100 * prog(f, beats.count, 14));
  const strike = prog(f, beats.strike, 10);
  return (
    <Shell full={full}>
      <div style={abs({left: 0, right: 0, top: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(5,12,22,0.65) 66%, rgba(5,12,22,0.8) 100%)'})} />
      <div dir="rtl" style={abs({left: 40, right: 40, top: 1180, textAlign: 'center'})}>
        <div style={T({fontWeight: 600, fontSize: 48, color: theme.blueLight, ...enter(p0, 14, 8)})}>لكن خلّنا نتفق</div>
        <div style={T({fontWeight: 700, fontSize: 56, color: theme.white, textShadow: shadowTxt, ...enter(p1, 14, 8)})}>إنه ما في أي نظام آمن</div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 4}}>
          <span style={D({fontWeight: 800, fontSize: 210, lineHeight: 1.25, direction: 'ltr', display: 'inline-block',
            color: theme.yellow, textShadow: `0 0 30px ${theme.yellowGlow}`, opacity: pc * (1 - strike * 0.35),
            transform: `scale(${lerp(pc, 1.25, 1)})`, filter: `blur(${lerp(pc, 14, 0)}px)`})}>{n}%</span>
          <svg width={560} height={260} style={abs({left: '50%', top: 0, marginLeft: -280})}>
            <path d="M40 200 L520 70" stroke={theme.white} strokeWidth={14} strokeLinecap="round" strokeDasharray={520} strokeDashoffset={520 * (1 - strike)}
              style={{filter: `drop-shadow(0 0 12px ${theme.yellowGlow})`}} />
          </svg>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- knowledge / protection / readiness (overlay)
export const PillarsScene: React.FC<SceneProps> = ({beats, full}) => {
  const ps = usePop(beats.shield);
  const f = useCurrentFrame();
  const rows = [
    {b: beats.a, I: BookIcon, t: 'المعرفة الصحيحة'},
    {b: beats.b, I: ShieldIconSmall, t: 'تطبيق وسائل الحماية'},
    {b: beats.c, I: ListIcon, t: 'الاستعداد لها'},
  ];
  return (
    <Shell full={full} topShade>
      <div style={abs({right: 40, top: 150, width: 690})}>
        {rows.map((r, i) => <PillarRow key={i} {...r} i={i} />)}
      </div>
      <div style={abs({left: 50, top: 190, opacity: Math.min(1, ps * 1.3), transform: `scale(${lerp(ps, 0.5, 1)})`})}>
        <div style={{position: 'relative'}}>
          <div style={abs({inset: -40, borderRadius: '50%', background: `radial-gradient(circle, rgba(232,193,90,${0.3 + 0.1 * Math.sin(f / 10)}), rgba(0,0,0,0) 65%)`})} />
          <Tile3D size={220} tone="yellow"><ShieldIcon size={130} color={theme.navy} stroke={13} /></Tile3D>
        </div>
      </div>
    </Shell>
  );
};
const PillarRow: React.FC<{b: number; I: React.FC<{size?: number; color?: string}>; t: string; i: number}> = ({b, I, t, i}) => {
  const p = usePop(b);
  return (
    <div style={{marginBottom: 18, opacity: Math.min(1, p * 1.4), transform: `translateX(${lerp(p, 80, 0)}px)`}}>
      <Glass style={{padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 20, borderRadius: 26}}>
        <Tile3D size={62} spin={i * 30}><I size={38} color={theme.white} /></Tile3D>
        <span style={T({fontWeight: 700, fontSize: 42, color: theme.white})}>{t}</span>
      </Glass>
    </div>
  );
};

// ---------------------------------------------------------------- framework (full, with own text)
export const FrameworkScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const p0 = prog(f, 2, 10);
  const p3 = prog(f, beats.three, 12);
  const pd = usePop(beats.doc);
  const pm = prog(f, beats.manage, 12);
  return (
    <Shell full={full}>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 250, textAlign: 'center'})}>
        <div style={T({fontWeight: 600, fontSize: 48, color: theme.blueLight, ...enter(p0, 14, 8)})}>في هذه السلسلة بغطي</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, opacity: p3,
          transform: `scale(${lerp(p3, 1.2, 1)})`, filter: `blur(${lerp(p3, 14, 0)}px)`}}>
          <Glyph3D text="٣" size={230} />
          <span style={D({fontWeight: 800, fontSize: 120, color: theme.white})}>محاور</span>
        </div>
      </div>
      <div style={abs({left: 90, right: 90, top: 760, opacity: Math.min(1, pd * 1.3), transform: `translateY(${lerp(pd, 60, 0)}px) perspective(1200px) rotateX(${lerp(pd, 25, 6)}deg)`})}>
        <Glass style={{padding: '40px 44px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <Tile3D size={120}><InstituteIcon size={76} color={theme.white} /></Tile3D>
            <div>
              <div style={T({fontWeight: 600, fontSize: 34, color: theme.blueLight})}>من إطار</div>
              <div style={D({fontWeight: 800, fontSize: 50, color: theme.white, lineHeight: 1.35})}>المعهد الأمريكي</div>
              <div style={T({fontWeight: 600, fontSize: 40, color: theme.white})}>للتقنية والمعايير</div>
            </div>
          </div>
          <div style={{marginTop: 26, display: 'flex', justifyContent: 'flex-start'}}>
            <span style={T({fontWeight: 700, fontSize: 30, color: theme.navy, background: theme.yellow, borderRadius: 16, padding: '4px 20px', direction: 'ltr'})}>NIST</span>
          </div>
        </Glass>
      </div>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 1250, textAlign: 'center', ...enter(pm, 14, 8)})}>
        <span style={T({fontWeight: 700, fontSize: 48, color: theme.white})}>لإدارة <span style={{color: theme.yellow}}>المخاطر</span> في المؤسسات</span>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- Protect / Detect / Recovery (overlay, 3D flip cards)
export const PdrScene: React.FC<SceneProps> = ({beats, full}) => {
  const items = [
    {b: beats.p, I: ShieldIconSmall, t: 'Protect'},
    {b: beats.d, I: RadarIcon, t: 'Detect'},
    {b: beats.r, I: RefreshIcon, t: 'Recovery'},
  ];
  return (
    <Shell full={full} topShade>
      <div style={abs({left: 30, right: 30, top: 150, display: 'flex', justifyContent: 'center', gap: 26, direction: 'ltr'})}>
        {items.map((it, i) => <FlipCard key={i} {...it} i={i} />)}
      </div>
    </Shell>
  );
};
const FlipCard: React.FC<{b: number; I: React.FC<{size?: number; color?: string}>; t: string; i: number}> = ({b, I, t, i}) => {
  const f = useCurrentFrame();
  const p = prog(f, b - 4, 14);
  const glowOn = prog(f, b + 6, 8);
  return (
    <div style={{perspective: 1000, width: 310, opacity: p > 0.02 ? 1 : 0}}>
      <div style={{transform: `rotateY(${lerp(p, -95, 0)}deg) translateY(${Math.sin((f + i * 20) / 24) * 6}px)`, transformOrigin: '50% 50%'}}>
        <Glass style={{padding: '30px 20px', textAlign: 'center', borderColor: glowOn > 0.5 ? 'rgba(232,193,90,0.55)' : theme.glassBorder,
          boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 ${30 * glowOn}px rgba(232,193,90,${0.25 * glowOn})`}}>
          <Tile3D size={110} spin={i * 40} style={{margin: '0 auto'}}><I size={66} color={theme.white} /></Tile3D>
          <div style={T({marginTop: 18, fontWeight: 700, fontSize: 46, color: theme.white, direction: 'ltr'})}>{t}</div>
          <div style={T({fontWeight: 600, fontSize: 28, color: theme.yellow, direction: 'ltr'})}>0{i + 1}</div>
        </Glass>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- audience chips beside the speaker
export const AudienceScene: React.FC<SceneProps> = ({beats, full}) => {
  const po = usePop(beats.owner);
  const pa = usePop(beats.admin);
  const chip = (p: number, side: 'left' | 'right', I: React.FC<{size?: number; color?: string}>, t: string) => (
    <div style={abs({[side]: 30, top: 640, opacity: Math.min(1, p * 1.4), transform: `translateX(${lerp(p, side === 'left' ? -70 : 70, 0)}px)`})}>
      <Glass style={{padding: '22px 22px', width: 290, textAlign: 'center'}}>
        <Tile3D size={92} style={{margin: '0 auto'}}><I size={56} color={theme.white} /></Tile3D>
        <div style={T({marginTop: 14, fontWeight: 700, fontSize: 40, color: theme.white})}>{t}</div>
      </Glass>
    </div>
  );
  return (
    <Shell full={full}>
      {chip(po, 'right', BuildingIcon, 'صاحب شركة')}
      {chip(pa, 'left', ServerIcon, 'إدارة الأنظمة')}
    </Shell>
  );
};

// ---------------------------------------------------------------- follow the page (overlay UI)
export const FollowScene: React.FC<SceneProps> = ({beats, full}) => {
  const f = useCurrentFrame();
  const pc = usePop(4);
  const tapped = prog(f, beats.tap, 6);
  const press = Math.sin(Math.min(1, Math.max(0, (f - beats.tap + 4) / 8)) * Math.PI);
  const bell = f > beats.bell ? Math.sin((f - beats.bell) / 2.2) * 18 * Math.exp(-(f - beats.bell) / 16) : 0;
  const cursor = prog(f, beats.tap - 14, 12);
  return (
    <Shell full={full} topShade>
      <div style={abs({left: 110, right: 110, top: 170, opacity: Math.min(1, pc * 1.3), transform: `translateY(${lerp(pc, -40, 0)}px)`})}>
        <Glass style={{padding: '28px 30px', display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 96, height: 96, borderRadius: 48, background: `linear-gradient(145deg, ${theme.blueLight}, ${theme.blueDeep})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 4px ${theme.yellow}`}}>
            <ShieldIcon size={56} color={theme.white} stroke={13} />
          </div>
          <div style={{flex: 1}}>
            <div style={D({fontWeight: 800, fontSize: 40, color: theme.white})}>تأمين الشركات</div>
            <div style={{width: 160, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.18)', marginTop: 10}} />
          </div>
          <div style={{position: 'relative'}}>
            <div style={{borderRadius: 26, padding: '14px 26px', transform: `scale(${1 - press * 0.08})`,
              background: tapped > 0.5 ? theme.yellow : theme.blue, display: 'flex', alignItems: 'center', gap: 10, minWidth: 180, justifyContent: 'center'}}>
              {tapped > 0.5 ? <CheckIcon size={34} color={theme.navy} stroke={6} draw={prog(f, beats.tap + 2, 8)} /> : null}
              <span style={T({fontWeight: 700, fontSize: 34, color: tapped > 0.5 ? theme.navy : theme.white})}>{tapped > 0.5 ? 'تمت المتابعة' : 'متابعة'}</span>
            </div>
            <div style={abs({left: 70 + (1 - cursor) * 120, top: 52 + (1 - cursor) * 90, width: 44, height: 44, borderRadius: 22,
              background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 14px rgba(0,0,0,0.4)', opacity: cursor * (1 - prog(f, beats.tap + 14, 8)),
              transform: `scale(${1 - press * 0.25})`})} />
          </div>
        </Glass>
      </div>
      <div style={abs({right: 120, top: 400, transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%', opacity: prog(f, beats.bell - 6, 8)})}>
        <Tile3D size={110} tone="yellow"><BellIcon size={66} color={theme.navy} stroke={3.8} /></Tile3D>
      </div>
    </Shell>
  );
};

export const _unused = {UserIcon};
