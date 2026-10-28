import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {enter, lerp, prog} from '../lib/anim';
import {
  CardIcon, CheckIcon, CrossIcon, GearIcon, IncognitoIcon, LockIcon, MailIcon,
  ServerIcon, ShieldIcon, ShieldPath, UserIcon, WarnIcon,
} from '../components/Icons';
import {Paper, Shell} from './Shell';

export type SceneProps = {beats: Record<string, number>; props: Record<string, string | number | boolean>};

const usePop = (at: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping: 15, stiffness: 190, mass: 0.7}});
};

const T = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.fontText, ...s});
const D = (s: React.CSSProperties): React.CSSProperties => ({fontFamily: theme.fontDisplay, ...s});
const abs = (s: React.CSSProperties): React.CSSProperties => ({position: 'absolute', ...s});

// ---------------------------------------------------------------- cyber
export const CyberScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const draw = prog(f, 2, 26);
  const scan = ((f % 48) / 48);
  const pl = prog(f, beats.label, 10);
  const ps = prog(f, beats.sub, 10);
  const line = prog(f, beats.label + 4, 14);
  return (
    <Shell>
      {[0, 1, 2].map((i) => {
        const r = ((f / 70 + i / 3) % 1);
        return <div key={i} style={abs({left: 540 - (230 + r * 260), top: 650 - (230 + r * 260), width: (230 + r * 260) * 2, height: (230 + r * 260) * 2,
          borderRadius: '50%', border: `2px solid rgba(255,255,255,${0.12 * (1 - r)})`})} />;
      })}
      <svg width={400} height={424} viewBox="0 0 200 212" style={abs({left: 340, top: 438})}>
        <defs><clipPath id="sh"><path d={ShieldPath} /></clipPath></defs>
        <path d={ShieldPath} fill={theme.yellowSoft} opacity={draw} />
        <g clipPath="url(#sh)">
          <rect x={0} y={scan * 230 - 20} width={200} height={3} fill={theme.yellow} opacity={0.65 * draw} />
          <rect x={0} y={scan * 230 - 60} width={200} height={40} fill="url(#fade)" opacity={0.5 * draw} />
        </g>
        <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={theme.yellow} stopOpacity="0" /><stop offset="1" stopColor={theme.yellow} stopOpacity="0.25" /></linearGradient></defs>
        <path d={ShieldPath} stroke={theme.yellow} strokeWidth={5} strokeLinejoin="round" fill="none"
          strokeDasharray={640} strokeDashoffset={640 * (1 - draw)} />
      </svg>
      <div style={abs({left: 476, top: 580, opacity: draw})}><LockIcon size={128} color={theme.white} stroke={3} /></div>
      <div dir="rtl" style={abs({left: 0, right: 0, top: 960, textAlign: 'center'})}>
        <div style={D({fontWeight: 800, fontSize: 96, color: theme.white, ...enter(pl, 20, 10)})}>أمن سيبراني</div>
        <div style={{margin: '18px auto 0', height: 6, borderRadius: 3, width: 380 * line, background: theme.yellow, boxShadow: `0 0 18px ${theme.yellowGlow}`}} />
        <div style={T({marginTop: 22, fontWeight: 600, fontSize: 46, color: theme.g4, ...enter(ps, 14, 8)})}>كل يوم</div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- checklist
const ROWS = ['الروابط المخفية', 'HTTPS والقفل', 'صلاحيات الإدارة'];
export const ChecklistScene: React.FC<SceneProps> = ({beats, props}) => {
  const f = useCurrentFrame();
  const done = props.mode === 'done';
  const stamp = usePop(beats.stamp ?? 99999);
  const ok = usePop(beats.ok ?? 99999);
  const ph = prog(f, 4, 12);
  return (
    <Shell variant="paper">
      <Paper top={300} height={940}>
        <div style={abs({right: 64, top: 64, display: 'flex', alignItems: 'center', gap: 36, ...enter(ph, 16, 6)})}>
          <div style={{width: 150, height: 150, borderRadius: 32, background: theme.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 14px 30px rgba(201,164,63,0.35)'}}>
            <span style={D({fontWeight: 800, fontSize: 110, color: theme.ink, lineHeight: 1})}>٣</span>
          </div>
          <div>
            <div style={D({fontWeight: 800, fontSize: 60, color: theme.ink, lineHeight: 1.3})}>{done ? 'الفحوص الثلاثة' : 'حاجات تفحصها'}</div>
            <div style={T({fontWeight: 600, fontSize: 40, color: theme.g3})}>{done ? '' : 'الآن'}</div>
          </div>
        </div>
        {ROWS.map((r, i) => {
          const p = prog(f, beats.rows + i * 5, 12);
          const c = done ? prog(f, beats[`c${i + 1}`], 9) : 0;
          return (
            <div key={i} style={abs({right: 64, left: 64, top: 270 + i * 155, height: 135, display: 'flex', alignItems: 'center', gap: 34,
              borderTop: `2px solid ${theme.g5}`, ...enter(p, 26, 8)})}>
              <span style={T({fontWeight: 600, fontSize: 36, color: theme.g3, width: 60})}>0{i + 1}</span>
              <span style={T({fontWeight: 700, fontSize: 54, color: theme.ink, flex: 1})}>{r}</span>
              <div style={{width: 76, height: 76, borderRadius: 18, border: `4px solid ${c > 0 ? theme.yellowDeep : theme.g5}`,
                background: c > 0 ? theme.yellow : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: `scale(${1 + 0.15 * Math.sin(c * Math.PI)})`}}>
                <CheckIcon size={58} color={theme.ink} stroke={6} draw={c} />
              </div>
            </div>
          );
        })}
        {!done ? (
          <div style={abs({left: 70, bottom: 56, transform: `rotate(-7deg) scale(${lerp(stamp, 1.6, 1)})`, opacity: Math.min(1, stamp * 1.3),
            background: theme.ink, borderRadius: 26, padding: '14px 40px', border: `3px solid ${theme.yellow}`})}>
            <span style={D({fontWeight: 800, fontSize: 52, color: theme.yellow})}>ولا ريال</span>
          </div>
        ) : (
          <div style={abs({left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', opacity: Math.min(1, ok * 1.3),
            transform: `translateY(${lerp(ok, 30, 0)}px)`})}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, background: theme.ink, borderRadius: 40, padding: '14px 42px'}}>
              <CheckIcon size={50} color={theme.yellow} stroke={6} />
              <span style={T({fontWeight: 700, fontSize: 46, color: theme.white})}>بدون أي مشاكل</span>
            </div>
          </div>
        )}
      </Paper>
    </Shell>
  );
};

// ---------------------------------------------------------------- section title
export const SectionScene: React.FC<SceneProps> = ({props}) => {
  const f = useCurrentFrame();
  const pl = prog(f, 2, 10);
  const pn = prog(f, 4, 16);
  const line = prog(f, 10, 16);
  const pt = prog(f, 12, 12);
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 0, right: 0, top: 470, textAlign: 'center'})}>
        <div style={T({fontWeight: 600, fontSize: 46, color: theme.g4, letterSpacing: 1, ...enter(pl, 14, 6)})}>{props.label}</div>
        <div style={{height: 380, overflow: 'hidden', position: 'relative'}}>
          <div style={D({fontWeight: 800, fontSize: 330, lineHeight: '380px', color: theme.yellow,
            textShadow: `0 0 50px ${theme.yellowGlow}`, transform: `translateY(${lerp(pn, 300, 0)}px)`, filter: `blur(${lerp(pn, 10, 0)}px)`})}>
            {props.num}
          </div>
        </div>
        <div style={{margin: '0 auto 34px', height: 5, borderRadius: 3, width: 460 * line, background: theme.g2}} />
        <div style={D({fontWeight: 800, fontSize: 92, color: theme.white, ...enter(pt, 22, 10)})}>{props.title}</div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- browser (private window, popups, redirect)
const Skeleton: React.FC<{w: number; h?: number; c?: string; style?: React.CSSProperties}> = ({w, h = 22, c = theme.g2, style}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: c, ...style}} />
);
export const BrowserScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const p1 = usePop(beats.pop1);
  const p2 = usePop(beats.pop2);
  const rd = prog(f, beats.redirect, 12);
  const chip = usePop(beats.redirect + 4);
  return (
    <Shell>
      <div style={abs({left: 80, right: 80, top: 300, height: 940, borderRadius: 30, background: theme.g1, border: `2px solid ${theme.g2}`,
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)', overflow: 'hidden'})}>
        <div style={{height: 96, background: '#141414', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 14, direction: 'ltr'}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: 20, height: 20, borderRadius: 10, background: theme.g3}} />)}
          <div dir="rtl" style={{marginLeft: 30, display: 'flex', alignItems: 'center', gap: 14, background: theme.g1, borderRadius: '18px 18px 0 0',
            padding: '14px 28px', marginTop: 22, height: 74}}>
            <IncognitoIcon size={40} color={theme.yellow} stroke={3.6} />
            <span style={T({fontWeight: 600, fontSize: 34, color: theme.white})}>نافذة خاصة</span>
          </div>
        </div>
        <div style={{margin: '24px 30px', height: 76, borderRadius: 38, background: '#0F0F0F', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, direction: 'ltr',
          border: `2px solid ${rd > 0 ? theme.yellow : theme.g2}`}}>
          <div style={{width: 24, height: 24, borderRadius: 12, border: `3px solid ${theme.g3}`}} />
          <div style={{position: 'relative', height: 50, flex: 1}}>
            <span style={T({position: 'absolute', top: 2, fontWeight: 500, fontSize: 36, color: theme.g4, opacity: 1 - rd, transform: `translateY(${-rd * 30}px)`})}>your-site.com</span>
            <span style={T({position: 'absolute', top: 2, fontWeight: 600, fontSize: 36, color: theme.yellow, opacity: rd, transform: `translateY(${(1 - rd) * 30}px)`})}>unknown-redirect.xyz</span>
          </div>
        </div>
        <div style={{padding: '20px 60px', opacity: 1 - rd * 0.6, transform: `translateX(${-rd * 60}px)`}} dir="rtl">
          <Skeleton w={560} h={44} c={theme.g2} />
          <Skeleton w={760} style={{marginTop: 36}} /><Skeleton w={700} style={{marginTop: 22}} /><Skeleton w={520} style={{marginTop: 22}} />
          <div style={{marginTop: 44, height: 300, borderRadius: 24, background: '#202020'}} />
          <Skeleton w={640} style={{marginTop: 36}} /><Skeleton w={430} style={{marginTop: 22}} />
        </div>
      </div>
      {[{p: p1, x: 150, y: 640, r: -4}, {p: p2, x: 370, y: 820, r: 3}].map((w, i) => (
        <div key={i} dir="rtl" style={abs({left: w.x, top: w.y, width: 560, height: 300, borderRadius: 24, background: theme.g2,
          borderTop: `10px solid ${theme.yellow}`, boxShadow: '0 30px 70px rgba(0,0,0,0.7)', padding: 34,
          transform: `rotate(${w.r}deg) scale(${lerp(w.p, 0.5, 1)})`, opacity: Math.min(1, w.p * 1.4)})}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={T({fontWeight: 700, fontSize: 42, color: theme.white})}>نافذة منبثقة</span>
            <CrossIcon size={40} color={theme.g4} stroke={4} />
          </div>
          <Skeleton w={420} c={theme.g3} style={{marginTop: 40, opacity: 0.6}} />
          <Skeleton w={300} c={theme.g3} style={{marginTop: 20, opacity: 0.6}} />
          <div style={{marginTop: 34, width: 200, height: 56, borderRadius: 28, background: theme.yellow, opacity: 0.85}} />
        </div>
      ))}
      <div dir="rtl" style={abs({left: 120, top: 512, transform: `scale(${chip})`, opacity: Math.min(1, chip * 1.3),
        display: 'flex', alignItems: 'center', gap: 12, background: theme.yellow, borderRadius: 30, padding: '10px 30px', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'})}>
        <span style={T({fontWeight: 700, fontSize: 36, color: theme.ink})}>تحويل ↩</span>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- door (backdoor left open)
export const DoorScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const ajar = prog(f, 4, 16);
  const open = prog(f, beats.open, 22);
  const angle = -8 * ajar - 40 * open;
  const light = 0.25 * ajar + 0.75 * open;
  return (
    <Shell>
      <div style={abs({left: 350, top: 1110, width: 380, height: 0, borderTop: `3px solid ${theme.g2}`})} />
      <div style={abs({left: 300, top: 1113, width: 480, height: 200, opacity: light * 0.8,
        background: 'linear-gradient(180deg, rgba(230,193,90,0.35), rgba(230,193,90,0))', clipPath: 'polygon(14% 0, 86% 0, 100% 100%, 0 100%)'})} />
      <div style={abs({left: 350, top: 470, width: 380, height: 640, borderRadius: '190px 190px 0 0', overflow: 'hidden',
        background: `radial-gradient(ellipse at 50% 60%, rgba(230,193,90,${0.9 * light}), rgba(230,193,90,${0.25 * light}) 70%, #050505)`})} />
      <div style={abs({left: 350, top: 470, width: 380, height: 640, perspective: 1400})}>
        <div style={{width: '100%', height: '100%', borderRadius: '190px 190px 0 0', background: 'linear-gradient(90deg, #232323, #1A1A1A)',
          border: `3px solid ${theme.g2}`, transformOrigin: '0% 50%', transform: `rotateY(${angle}deg)`, position: 'relative',
          boxShadow: `inset 0 0 0 26px rgba(0,0,0,0.25)`}}>
          <div style={abs({right: 46, top: 340, width: 26, height: 26, borderRadius: 13, background: theme.g4})} />
        </div>
      </div>
      <div style={abs({left: 336, top: 456, width: 408, height: 660, borderRadius: '204px 204px 0 0', border: `6px solid ${theme.g3}`, borderBottom: 'none'})} />
    </Shell>
  );
};

// ---------------------------------------------------------------- https + lock
export const HttpsScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pbar = prog(f, 2, 12);
  const ps = prog(f, beats.https, 10);
  const pl = prog(f, beats.lock, 10);
  const ring = prog(f, beats.lock, 24);
  const r1 = usePop(beats.https + 3);
  const r2 = usePop(beats.lock + 3);
  return (
    <Shell>
      <div style={abs({left: 70, right: 70, top: 560, height: 160, borderRadius: 80, background: theme.g1,
        border: `3px solid ${pl > 0.5 ? theme.yellow : theme.g2}`, display: 'flex', alignItems: 'center', padding: '0 46px', gap: 26, direction: 'ltr',
        boxShadow: pl > 0 ? `0 0 ${60 * pl}px rgba(230,193,90,${0.25 * pl})` : 'none', ...enter(pbar, 30, 10)})}>
        <div style={{position: 'relative', width: 84, height: 84}}>
          <div style={abs({inset: -40 * ring, borderRadius: '50%', border: `3px solid rgba(230,193,90,${0.7 * (1 - ring)})`, opacity: pl > 0 ? 1 : 0})} />
          <LockIcon size={84} color={pl > 0.5 ? theme.yellow : theme.g3} stroke={3.6} open={1 - pl} />
        </div>
        <span style={T({fontWeight: 600, fontSize: 60, color: theme.white, whiteSpace: 'nowrap'})}>
          http
          <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', maxWidth: 40 * ps, color: theme.yellow,
            textShadow: `0 0 20px ${theme.yellowGlow}`}}>s</span>
          ://<span style={{color: theme.g4}}>your-site.com</span>
        </span>
      </div>
      <div dir="rtl" style={abs({left: 0, right: 0, top: 830, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28})}>
        {[{p: r1, t: 'HTTPS'}, {p: r2, t: 'القفل'}].map((x, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, width: 460, background: theme.g1, border: `2px solid ${theme.g2}`,
            borderRadius: 26, padding: '20px 34px', opacity: Math.min(1, x.p * 1.3), transform: `translateY(${lerp(x.p, 30, 0)}px)`}}>
            <div style={{width: 64, height: 64, borderRadius: 16, background: theme.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CheckIcon size={50} color={theme.ink} stroke={6} draw={Math.min(1, x.p)} />
            </div>
            <span style={T({fontWeight: 700, fontSize: 52, color: theme.white})}>{x.t}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- data flow without protection
export const DataFlowScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pf = prog(f, 3, 12);
  const pn = prog(f, 6, 12);
  const lock = usePop(beats.open);
  const fields = [UserIcon, MailIcon, CardIcon];
  const node = (x: number, label: string, Icon: React.FC<{size?: number; color?: string}>) => (
    <div style={abs({left: x - 110, top: 780, width: 220, textAlign: 'center', ...enter(pn, 20, 8)})}>
      <div style={{width: 200, height: 200, margin: '0 auto', borderRadius: 100, background: theme.g1, border: `3px solid ${theme.g2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon size={100} color={theme.white} />
      </div>
      <div dir="rtl" style={T({marginTop: 20, fontWeight: 700, fontSize: 46, color: theme.white})}>{label}</div>
    </div>
  );
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 220, right: 220, top: 330, borderRadius: 28, background: theme.g1, border: `2px solid ${theme.g2}`,
        padding: '30px 40px', ...enter(pf, 24, 8)})}>
        {fields.map((Icon, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: i ? 22 : 0}}>
            <Icon size={46} color={theme.g4} />
            <div style={{flex: 1, height: 46, borderRadius: 14, background: '#111', border: `2px solid ${theme.g2}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 8}}>
              {Array.from({length: 7 + i * 2}).map((_, k) => <div key={k} style={{width: 12, height: 12, borderRadius: 6, background: theme.g3}} />)}
            </div>
          </div>
        ))}
      </div>
      <div style={abs({left: 320, right: 320, top: 878, height: 0, borderTop: `4px dashed ${theme.g3}`, opacity: pn})} />
      {node(820, 'العميل', UserIcon)}
      {node(260, 'الموقع', ServerIcon)}
      {Array.from({length: 4}).map((_, i) => {
        const start = beats.send + i * 12 - 30;
        const t = ((f - start) % 48) / 30;
        if (f < start || t > 1) return null;
        const x = lerp(t, 720, 330);
        const Icon = fields[i % 3];
        return (
          <div key={i} style={abs({left: x - 46, top: 834, width: 92, height: 88, borderRadius: 18, background: theme.ink,
            border: `3px solid ${theme.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: Math.min(1, Math.min(t, 1 - t) * 8), filter: 'blur(0.6px)'})}>
            <Icon size={52} color={theme.yellow} />
          </div>
        );
      })}
      <div dir="rtl" style={abs({left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', opacity: Math.min(1, lock * 1.3),
        transform: `scale(${lerp(lock, 0.6, 1)})`})}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: theme.yellow, borderRadius: 34, padding: '12px 36px',
          boxShadow: `0 0 40px ${theme.yellowGlow}`}}>
          <LockIcon size={56} color={theme.ink} stroke={4} open={1} />
          <span style={T({fontWeight: 700, fontSize: 46, color: theme.ink})}>من دون حماية</span>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- admin panel
export const AdminScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const ph = prog(f, 4, 12);
  const full = [0, 1, 3, 4];
  const former = [3, 4];
  return (
    <Shell variant="paper">
      <Paper top={250} height={1030}>
        <div style={abs({right: 56, left: 56, top: 50, display: 'flex', alignItems: 'center', gap: 22, ...enter(ph, 14, 6)})}>
          <div style={{width: 92, height: 92, borderRadius: 24, background: theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <GearIcon size={58} color={theme.yellow} />
          </div>
          <span style={D({fontWeight: 800, fontSize: 62, color: theme.ink})}>لوحة الإدارة</span>
        </div>
        <div style={abs({right: 56, left: 56, top: 186, display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${theme.g5}`, paddingBottom: 14, opacity: ph})}>
          <span style={T({fontWeight: 600, fontSize: 32, color: theme.g3})}>الحساب</span>
          <span style={T({fontWeight: 600, fontSize: 32, color: theme.g3})}>الصلاحية</span>
        </div>
        {[0, 1, 2, 3, 4].map((i) => {
          const p = prog(f, 8 + i * 4, 12);
          const pfull = full.includes(i) ? prog(f, beats.full + i * 2, 8) : 0;
          const pformer = former.includes(i) ? prog(f, beats.former + (i - 3) * 4, 10) : 0;
          const pulse = former.includes(i) && f > beats.stale ? 0.5 + 0.5 * Math.sin((f - beats.stale) / 4) : 0;
          return (
            <div key={i} style={abs({right: 40, left: 40, top: 250 + i * 150, height: 128, borderRadius: 26, padding: '0 18px',
              display: 'flex', alignItems: 'center', gap: 24,
              background: `rgba(230,193,90,${0.2 * pformer})`, border: `3px solid rgba(201,164,63,${pformer * (0.5 + 0.5 * pulse)})`, ...enter(p, 20, 6)})}>
              <div style={{width: 84, height: 84, borderRadius: 42, background: pformer > 0.5 ? 'transparent' : theme.g5,
                border: `3px ${pformer > 0.5 ? 'dashed' : 'solid'} ${pformer > 0.5 ? theme.g3 : theme.g5}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <UserIcon size={54} color={pformer > 0.5 ? theme.g3 : theme.white} />
              </div>
              <div style={{flex: 1}}>
                <Skeleton w={230 - i * 12} h={22} c={theme.g5} />
                {pformer > 0 ? (
                  <div style={{marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 10, background: theme.ink, borderRadius: 18, padding: '4px 18px',
                    opacity: pformer, transform: `translateY(${lerp(pformer, 10, 0)}px)`}}>
                    <WarnIcon size={30} color={theme.yellow} />
                    <span style={T({fontWeight: 600, fontSize: 28, color: theme.white})}>موظف سابق</span>
                  </div>
                ) : <Skeleton w={150} h={16} c={theme.g5} style={{marginTop: 14, opacity: 0.6}} />}
              </div>
              <div style={{position: 'relative', width: 270, height: 62}}>
                <div style={abs({inset: 0, borderRadius: 31, background: theme.g5, opacity: 1 - pfull})} />
                <div style={abs({inset: 0, borderRadius: 31, background: theme.yellow, opacity: pfull, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `scale(${lerp(pfull, 0.85, 1)})`})}>
                  <span style={T({fontWeight: 700, fontSize: 30, color: theme.ink})}>صلاحيات كاملة</span>
                </div>
              </div>
            </div>
          );
        })}
      </Paper>
    </Shell>
  );
};

// ---------------------------------------------------------------- built secure vs. patched after breaking
export const CompareScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const ph = prog(f, 4, 12);
  const pr = usePop(beats.right);
  const pl = usePop(beats.left);
  const blocks = (broken: boolean, p: number) => (
    <div style={{position: 'relative', height: 330, width: 300, margin: '0 auto'}}>
      {[0, 1, 2].map((k) => (
        <div key={k} style={abs({left: 30 + (k === 1 ? 0 : 0), bottom: k * 92, width: 240, height: 82, borderRadius: 14,
          background: broken ? theme.g5 : theme.ink, border: `3px solid ${broken ? theme.g4 : theme.ink}`,
          transform: `translateY(${lerp(Math.min(1, p * (1.3 - k * 0.15)), -260, 0)}px) rotate(${broken ? (k - 1) * 4 : 0}deg)`,
          opacity: Math.min(1, p * 1.5)})} />
      ))}
      {broken ? (
        <svg width={300} height={330} style={abs({left: 0, top: 0, opacity: p})}>
          <path d="M150 40 L132 120 L166 170 L140 250 L158 330" stroke={theme.paper} strokeWidth={10} fill="none" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
  const col = (side: 'right' | 'left', p: number) => {
    const good = side === 'right';
    return (
      <div style={abs({[side]: 0, top: 210, width: '50%', textAlign: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${lerp(p, 40, 0)}px)`})}>
        <div style={{display: 'inline-block', borderRadius: 30, padding: '10px 32px', background: good ? theme.yellow : theme.g5}}>
          <span style={T({fontWeight: 700, fontSize: 40, color: theme.ink})}>{good ? 'من أول يوم' : 'بعد ما ينكسر'}</span>
        </div>
        <div style={{marginTop: 40}}>{blocks(!good, p)}</div>
        <div style={{marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
          {good ? <ShieldIcon size={70} color={theme.yellowDeep} stroke={14} /> : <CrossIcon size={60} color={theme.g4} stroke={6} />}
          <span style={D({fontWeight: 800, fontSize: 64, color: good ? theme.ink : theme.g3})}>{good ? 'آمن' : 'يتصلّح'}</span>
        </div>
      </div>
    );
  };
  return (
    <Shell variant="paper">
      <Paper top={290} height={960}>
        <div style={abs({left: 0, right: 0, top: 50, textAlign: 'center', ...enter(ph, 16, 8)})}>
          <span style={D({fontWeight: 800, fontSize: 84, color: theme.ink})}>الحل</span>
          <div style={{margin: '6px auto 0', width: 150, height: 8, borderRadius: 4, background: theme.yellow}} />
        </div>
        <div style={abs({left: '50%', top: 230, bottom: 70, width: 2, background: theme.g5, opacity: ph})} />
        {col('right', pr)}
        {col('left', pl)}
      </Paper>
    </Shell>
  );
};

// ---------------------------------------------------------------- building secure apps from the start
export const BuildScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pp = prog(f, 2, 14);
  const badge = usePop(beats.secure);
  const ring = prog(f, beats.secure, 26);
  const layers = [
    {h: 54, c: theme.yellow, w: '45%'}, {h: 230, c: theme.g2, w: '100%'}, {h: 70, c: theme.g2, w: '100%'},
    {h: 70, c: theme.g2, w: '100%'}, {h: 70, c: theme.g2, w: '100%'}, {h: 84, c: theme.yellow, w: '100%'},
  ];
  return (
    <Shell>
      <div style={abs({left: 330, top: 330, width: 420, height: 840, borderRadius: 64, border: `6px solid ${theme.g3}`, background: theme.g1,
        padding: '60px 36px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', ...enter(pp, 40, 10)})}>
        {layers.map((l, i) => {
          const p = prog(f, 6 + i * 5, 10);
          return <div key={i} style={{height: l.h, width: l.w, marginRight: 'auto', marginLeft: 0, borderRadius: 16, background: l.c,
            marginBottom: 22, opacity: p * (l.c === theme.yellow ? 0.9 : 1), transform: `translateX(${lerp(p, -60, 0)}px)`}} />;
        })}
      </div>
      <div style={abs({left: 640, top: 960, width: 240, height: 240})}>
        <div style={abs({inset: -70 * ring, borderRadius: '50%', border: `3px solid rgba(230,193,90,${0.6 * (1 - ring)})`, opacity: badge > 0.01 ? 1 : 0})} />
        <div style={{width: 240, height: 240, borderRadius: 120, background: theme.ink, border: `5px solid ${theme.yellow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge})`, boxShadow: `0 0 50px ${theme.yellowGlow}`}}>
          <ShieldIcon size={140} color={theme.yellow} stroke={12} />
        </div>
      </div>
      <div dir="rtl" style={abs({left: 560, top: 1220, width: 400, textAlign: 'center', opacity: Math.min(1, badge * 1.3),
        transform: `translateY(${lerp(badge, 20, 0)}px)`})}>
        <span style={D({fontWeight: 800, fontSize: 54, color: theme.yellow, textShadow: `0 0 24px ${theme.yellowGlow}`})}>أمان عالي</span>
      </div>
    </Shell>
  );
};
