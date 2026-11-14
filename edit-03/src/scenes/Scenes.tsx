import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../config/theme';
import {seriesAxes} from '../config/edit';
import {lerp, prog} from '../lib/anim';
import {
  AppsIcon, BellIcon, BookIcon, BuildingIcon, CheckIcon, CloudIcon, CrossIcon, DbIcon, HostIcon, InstituteIcon,
  KeyIcon, LaptopIcon, LockIcon, MailIcon, NetworkIcon, PenIcon, PhoneIcon, QuestionIcon, RadarIcon, RefreshIcon,
  ServerIcon, ShieldIcon, UserIcon, WarnIcon,
} from '../components/Icons';
import {Badge, Chip, Glass, Glyph, Headline, Plate, Rings, Shell, abs, enterX, enterY, txt, usePop} from './Kit';

export type SceneProps = {beats: Record<string, number>; props: Record<string, string | number>};
type IconC = React.FC<{size?: number; color?: string; stroke?: number}>;
const Shield: IconC = ({size = 48, color = '#fff'}) => <ShieldIcon size={size} color={color} stroke={12} />;

// Layout zones (screen px) freed by each composition — see GEOM in Stage.tsx.
const BELOW = 1395;          // 'up'   : content from here down to ~1690
const ABOVE = 70;            // 'down' : content from here down to ~530
const RIGHT_PANEL = {left: 752, width: 300};   // 'left'  composition
const LEFT_PANEL = {left: 28, width: 300};     // 'right' composition

const W = theme.white;
const muted = theme.ice;

// ---------------------------------------------------------------- helpers
const Row: React.FC<{p: number; Icon: IconC; text: string; tone?: 'blue' | 'gold' | 'glass'; size?: number; dx?: number}> = ({p, Icon, text, tone = 'blue', size = 34, dx = 60}) => (
  <div style={{...enterX(p, dx), marginBottom: 18}}>
    <Glass style={{padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, borderRadius: 26}}>
      <Badge size={66} tone={tone}><Icon size={38} color={tone === 'gold' ? '#1D1504' : W} /></Badge>
      <span style={txt({fontWeight: 700, fontSize: size, color: W, lineHeight: 1.25})}>{text}</span>
    </Glass>
  </div>
);

const SidePanel: React.FC<{side: 'left' | 'right'; top?: number; children: React.ReactNode}> = ({side, top = 300, children}) => {
  const z = side === 'right' ? RIGHT_PANEL : LEFT_PANEL;
  return <div dir="rtl" style={abs({left: z.left, width: z.width, top})}>{children}</div>;
};

// ---------------------------------------------------------------- 01 question (below the card)
export const QuestionScene: React.FC<SceneProps> = ({beats}) => {
  const pq = usePop(beats.q - 6);
  const pa = usePop(beats.a), pb = usePop(beats.b);
  return (
    <Shell>
      <Plate top={BELOW - 40} height={330} />
      <div style={abs({left: 60, top: BELOW - 10, width: 230, height: 270, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: Math.min(1, pq * 1.3), transform: `scale(${lerp(pq, 0.5, 1)})`})}>
        <Rings size={240} gold style={{left: -5, top: 15}} />
        <Glyph text="؟" size={210} />
      </div>
      <div dir="rtl" style={abs({right: 60, left: 320, top: BELOW + 20})}>
        <div style={enterY(pq, 24)}><Headline size={50}>الأشياء اللي بتتأثر</Headline></div>
        <div style={enterY(pq, 24)}><Headline size={50} gold>أولًا بشركتك</Headline></div>
        <div style={{display: 'flex', gap: 16, marginTop: 18}}>
          <span style={enterY(pa, 20)}><Chip tone="blue">هجوم</Chip></span>
          <span style={enterY(pb, 20)}><Chip tone="gold">اختراق</Chip></span>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 02 episode title (above the card)
export const EpisodeScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pb = usePop(beats.badge), pt = prog(f, beats.title, 14), pz = prog(f, beats.az, 18);
  return (
    <Shell>
      <Plate top={ABOVE - 20} height={440} />
      <div dir="rtl" style={abs({left: 40, right: 40, top: ABOVE + 10, textAlign: 'center'})}>
        <div style={{opacity: Math.min(1, pb * 1.3), transform: `scale(${lerp(pb, 0.7, 1)})`}}><Chip tone="gold" size={34}>الحلقة الأولى</Chip></div>
        <div style={{marginTop: 18, opacity: pt, transform: `scale(${lerp(pt, 1.15, 1)})`, filter: `blur(${lerp(pt, 14, 0)}px)`}}>
          <Headline size={82}>سلسلة تأمين الشركات</Headline>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 10, opacity: pz}}>
          <Glyph text="أ" size={84} />
          <div style={{width: 360 * pz, height: 4, borderRadius: 2, background: theme.gold}} />
          <Glyph text="ي" size={84} />
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 03 host name + building concepts (right panel)
export const HostScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pn = usePop(beats.name);
  const layers = [0, 1, 2, 3];
  return (
    <Shell>
      <SidePanel side="right" top={330}>
        <div style={enterX(pn, 80)}>
          <Glass gold style={{padding: '26px 24px', textAlign: 'center'}}>
            <div style={txt({fontWeight: 500, fontSize: 28, color: muted})}>أنا</div>
            <Headline size={78} gold>رؤيت</Headline>
          </Glass>
        </div>
        <div style={{position: 'relative', height: 420, marginTop: 70, perspective: 900}}>
          {layers.map((i) => {
            const p = prog(f, beats.build + i * 6, 14);
            return (
              <div key={i} style={abs({left: 30, right: 30, bottom: i * 78, height: 70, borderRadius: 18,
                background: i === 3 ? theme.gold : 'rgba(59,130,246,0.55)', backdropFilter: theme.blur,
                border: '1.5px solid rgba(191,217,255,0.4)', boxShadow: `0 18px 40px rgba(0,0,0,0.35)`,
                transform: `rotateX(52deg) rotateZ(${-8 + Math.sin((f + i * 20) / 40) * 3}deg) translateY(${lerp(p, -220, 0)}px)`, opacity: Math.min(1, p * 1.5)})} />
            );
          })}
        </div>
        <div style={{...enterY(prog(f, beats.build + 10, 14), 20), textAlign: 'center', marginTop: 10}}>
          <span style={txt({fontWeight: 800, fontSize: 40, color: W, lineHeight: 1.3})}>مفاهيم حماية <span style={{color: theme.gold}}>سيبرانية</span></span>
        </div>
      </SidePanel>
    </Shell>
  );
};

// ---------------------------------------------------------------- 04 learning path (below)
export const PathScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const steps: [number, IconC, string][] = [[beats.a, Shield, 'الأساسيات'], [beats.b, RadarIcon, 'الاستجابة للحوادث'], [beats.c, RefreshIcon, 'استمرارية العمل']];
  const line = prog(f, beats.a, beats.c - beats.a + 10, (x) => x);
  return (
    <Shell>
      <Plate top={BELOW - 30} height={310} />
      <div style={abs({left: 150, right: 150, top: BELOW + 60, height: 4, borderRadius: 2, background: 'rgba(191,217,255,0.15)'})}>
        <div style={abs({right: 0, top: 0, height: 4, width: `${line * 100}%`, borderRadius: 2, background: theme.gold})} />
      </div>
      <div dir="rtl" style={abs({left: 40, right: 40, top: BELOW + 10, display: 'flex', justifyContent: 'space-between'})}>
        {steps.map(([b, I, t], i) => {
          const p = usePopLocal(b);
          return (
            <div key={i} style={{width: 300, textAlign: 'center', opacity: Math.min(1, p * 1.3), transform: `translateY(${lerp(p, 30, 0)}px)`}}>
              <Badge size={104} tone={i === 2 ? 'gold' : 'blue'} tilt={i * 30} style={{margin: '0 auto'}}><I size={58} color={i === 2 ? '#1D1504' : W} /></Badge>
              <div style={txt({marginTop: 16, fontWeight: 700, fontSize: 36, color: W, lineHeight: 1.25})}>{t}</div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};
const usePopLocal = usePop;

// ---------------------------------------------------------------- 05 framework (above)
export const FrameworkScene: React.FC<SceneProps> = ({beats}) => {
  const pc = usePop(beats.card), ps = usePop(beats.std);
  return (
    <Shell>
      <div style={abs({left: 90, right: 90, top: ABOVE + 40, perspective: 1200, opacity: Math.min(1, pc * 1.3),
        transform: `translateY(${lerp(pc, 40, 0)}px)`})}>
        <Glass style={{padding: '30px 34px', transform: `rotateX(${lerp(pc, 30, 4)}deg)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <Badge size={120}><InstituteIcon size={74} color={W} /></Badge>
            <div>
              <div style={txt({fontWeight: 500, fontSize: 32, color: muted})}>بناءً على إطار</div>
              <div style={txt({fontWeight: 800, fontSize: 54, color: W, lineHeight: 1.3})}>المعهد الأمريكي</div>
              <div style={{...enterY(ps, 14), display: 'flex', alignItems: 'center', gap: 14}}>
                <span style={txt({fontWeight: 700, fontSize: 40, color: theme.gold})}>للمعايير والتقنية</span>
                <Chip tone="gold" size={26} style={{direction: 'ltr'}}>NIST</Chip>
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 06 no 100% protection (kinetic, lower, full frame)
export const PercentScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const p0 = prog(f, beats.care, 10), p1 = prog(f, beats.none, 10), pn = prog(f, beats.num, 14), ps = prog(f, beats.strike, 10);
  const n = Math.round(100 * pn);
  return (
    <Shell>
      <div style={abs({left: 40, right: 40, top: 1220, height: 470, borderRadius: 36, background: theme.glassStrong, backdropFilter: theme.blur, border: `1.5px solid ${theme.glassBorder}`})} />
      <div dir="rtl" style={abs({left: 40, right: 40, top: 1250, textAlign: 'center'})}>
        <div style={{...enterY(p0, 16)}}><Chip tone="glass" size={34}>لكن خلّي بالك</Chip></div>
        <div style={{...enterY(p1, 16), marginTop: 16}}><span style={txt({fontWeight: 700, fontSize: 54, color: W})}>لا يوجد شيء اسمه حماية</span></div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <span style={{display: 'inline-block', direction: 'ltr', opacity: pn * (1 - ps * 0.3), transform: `scale(${lerp(pn, 1.25, 1)})`, filter: `blur(${lerp(pn, 14, 0)}px)`}}>
            <Glyph text={`${n}%`} size={200} />
          </span>
          <svg width={560} height={240} style={abs({left: '50%', top: 10, marginLeft: -280})}>
            <path d="M40 190 L520 60" stroke={W} strokeWidth={12} strokeLinecap="round" strokeDasharray={520} strokeDashoffset={520 * (1 - ps)}
               />
          </svg>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 07 the basics (above)
export const BasicsScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pq = prog(f, beats.q, 10), pt = prog(f, beats.title, 14);
  return (
    <Shell>
      <Plate top={ABOVE - 10} height={410} />
      <div dir="rtl" style={abs({left: 40, right: 40, top: ABOVE + 20, textAlign: 'center'})}>
        <div style={enterY(pq, 16)}><Chip size={32}>جوابًا على السؤال اللي فوق</Chip></div>
        <div style={{marginTop: 14, opacity: pt, transform: `scale(${lerp(pt, 1.2, 1)})`, filter: `blur(${lerp(pt, 14, 0)}px)`}}>
          <Headline size={110} gold>الأساسيات</Headline>
        </div>
        <div style={enterY(prog(f, beats.title + 8, 12), 14)}><span style={txt({fontWeight: 700, fontSize: 44, color: W})}>اللي لازم شركتك تحميها</span></div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 08 unknown asset (full)
export const UnknownScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const sweep = (f - beats.scan) * 4;
  const ph = usePop(beats.hidden);
  const x1 = usePop(beats.x1), x2 = usePop(beats.x2);
  const known: [number, number, IconC][] = [[-230, -120, LaptopIcon], [220, -170, DbIcon], [-190, 210, CloudIcon], [240, 170, PhoneIcon]];
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 230, textAlign: 'center', ...enterY(prog(f, 4, 12), 20)})}>
        <span style={txt({fontWeight: 700, fontSize: 48, color: muted})}>الشي اللي انت</span><br />
        <Headline size={80}>مش عارف إنه موجود</Headline>
      </div>
      <div style={abs({left: 540 - 330, top: 980 - 330, width: 660, height: 660})}>
        {[1, 0.7, 0.4].map((k) => <div key={k} style={abs({inset: (1 - k) * 330, borderRadius: '50%', border: '1.5px solid rgba(111,178,255,0.28)'})} />)}
        <div style={abs({inset: 0, borderRadius: '50%', opacity: f > beats.scan ? 1 : 0,
          background: 'rgba(147,197,253,0.22)', clipPath: `polygon(50% 50%, ${50 + 70 * Math.cos(sweep * Math.PI / 180)}% ${50 + 70 * Math.sin(sweep * Math.PI / 180)}%, ${50 + 70 * Math.cos((sweep + 40) * Math.PI / 180)}% ${50 + 70 * Math.sin((sweep + 40) * Math.PI / 180)}%)`})} />
        {known.map(([x, y, I], i) => {
          const p = prog(f, beats.scan + i * 6, 10);
          return <div key={i} style={abs({left: 330 + x - 45, top: 330 + y - 45, opacity: p, transform: `scale(${lerp(p, 0.6, 1)})`})}><Badge size={90} tilt={i * 25}><I size={50} color={W} /></Badge></div>;
        })}
        <div style={abs({left: 330 - 60, top: 330 - 60, opacity: Math.min(1, ph * 1.2), transform: `scale(${lerp(ph, 0.4, 1)})`})}>
          <Badge size={120} tone="glass"><QuestionIcon size={70} color={theme.gold} /></Badge>
        </div>
      </div>
      <div dir="rtl" style={abs({left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center', gap: 22})}>
        {[[x1, 'ما بتقدر تحميه'], [x2, 'ولا تكتشف']].map(([p, t], i) => (
          <span key={i} style={{opacity: Math.min(1, (p as number) * 1.3), transform: `translateY(${lerp(p as number, 30, 0)}px)`}}>
            <Chip size={36}><CrossIcon size={34} color={theme.gold} stroke={5} />{t as string}</Chip>
          </span>
        ))}
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 09 notepad (left panel)
export const NotepadScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pp = usePop(beats.pad), pen = usePop(beats.pen);
  const lines = [0, 1, 2, 3, 4];
  return (
    <Shell>
      <SidePanel side="left" top={520}>
        <div style={{perspective: 1000, ...enterX(pp, -80)}}>
          <div style={{background: 'rgba(255,255,255,0.88)', backdropFilter: theme.blur, borderRadius: 26, padding: '34px 26px', height: 520,
            transform: 'rotateY(16deg) rotateZ(-3deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.35)'}}>
            <div style={txt({fontWeight: 800, fontSize: 40, color: theme.deep, textAlign: 'center'})}>سجّل بعدي</div>
            {lines.map((i) => (
              <div key={i} style={{height: 3, borderRadius: 2, marginTop: 52, background: 'rgba(15,42,92,0.15)', position: 'relative'}}>
                <div style={abs({right: 0, top: -2, height: 7, borderRadius: 4, background: theme.royal,
                  width: `${prog(f, beats.write + i * 5, 10) * (90 - i * 9)}%`})} />
              </div>
            ))}
          </div>
          <div style={abs({left: 30 + Math.sin(f / 3) * 6, top: 470 - prog(f, beats.write, 30) * 250, opacity: Math.min(1, pen * 1.3), transform: `rotate(-35deg) scale(${lerp(pen, 0.6, 1)})`})}>
            <Badge size={84} tone="gold"><PenIcon size={48} color="#1D1504" /></Badge>
          </div>
        </div>
      </SidePanel>
    </Shell>
  );
};

// ---------------------------------------------------------------- 10 asset section title (below)
const ITEM_ICONS: Record<string, IconC> = {user: UserIcon, laptop: LaptopIcon, network: NetworkIcon, apps: AppsIcon, db: DbIcon, cloud: CloudIcon};
export const ItemScene: React.FC<SceneProps> = ({beats, props}) => {
  const f = useCurrentFrame();
  const pn = prog(f, 2, 16), pt = prog(f, beats.title, 14);
  const I = ITEM_ICONS[props.icon as string] ?? Shield;
  const extra = beats.tp !== undefined ? usePop(beats.tp) : 0;
  return (
    <Shell>
      <Plate top={BELOW - 30} height={300} />
      <div dir="rtl" style={abs({left: 50, right: 50, top: BELOW - 5, display: 'flex', alignItems: 'center', gap: 26})}>
        <div style={{position: 'relative', width: 210, height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
          <Rings size={230} gold style={{left: -10, top: 0}} />
          <span style={{opacity: pn, transform: `translateY(${lerp(pn, 60, 0)}px)`, filter: `blur(${lerp(pn, 12, 0)}px)`, direction: 'ltr'}}>
            <Glyph text={`0${props.n}`} size={150} />
          </span>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, ...enterY(pt, 20)}}>
            <Badge size={86}><I size={50} color={W} /></Badge>
            <span style={txt({fontWeight: 500, fontSize: 30, color: muted})}>الأصل {props.n} من 6</span>
          </div>
          <div style={{...enterY(pt, 24), marginTop: 10}}><Headline size={(props.title as string).length > 14 ? 52 : 66}>{props.title}</Headline></div>
          {beats.tp !== undefined ? <div style={{opacity: Math.min(1, extra * 1.3), marginTop: 6}}><Chip tone="gold" size={30} style={{direction: 'ltr'}}>Third party</Chip></div> : null}
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 11 account types (right panel)
export const AccountsScene: React.FC<SceneProps> = ({beats}) => (
  <Shell>
    <SidePanel side="right" top={560}>
      <Row p={usePop(beats.mail)} Icon={MailIcon} text="البريد الإلكتروني" />
      <Row p={usePop(beats.admin)} Icon={KeyIcon} text="حسابات الإدارة" tone="gold" />
      <Row p={usePop(beats.all)} Icon={UserIcon} text="كل الحسابات" />
    </SidePanel>
  </Shell>
);

// ---------------------------------------------------------------- 12 who gets in + permissions (above)
export const AccessScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pw = usePop(beats.who), pg = usePop(beats.gate), pp = prog(f, beats.perm, 16), pm = prog(f, beats.more, 18), warn = usePop(beats.warn);
  const flow = prog(f, beats.gate, 20);
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 50, right: 50, top: ABOVE + 10})}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{...enterX(pw, 60), display: 'flex', gap: 8}}>
            {[0, 1, 2].map((i) => <Badge key={i} size={74} tone={i === 2 ? 'gold' : 'blue'} tilt={i * 20}><UserIcon size={42} color={i === 2 ? '#1D1504' : W} /></Badge>)}
          </div>
          <div style={{flex: 1, height: 4, margin: '0 18px', borderRadius: 2, background: 'rgba(191,217,255,0.18)', position: 'relative'}}>
            <div style={abs({right: 0, top: 0, height: 4, width: `${flow * 100}%`, background: theme.electric, borderRadius: 2})} />
          </div>
          <div style={{opacity: Math.min(1, pg * 1.3), transform: `scale(${lerp(pg, 0.6, 1)})`}}><Badge size={96} tone="glass"><LockIcon size={56} color={theme.gold} open={0} /></Badge></div>
        </div>
        <div style={{...enterY(pw, 14), marginTop: 10}}><span style={txt({fontWeight: 700, fontSize: 40, color: W})}>مين يقدر يدخل؟</span></div>
        <Glass style={{marginTop: 18, padding: '18px 22px', ...enterY(pp, 20)}}>
          <div style={txt({fontWeight: 700, fontSize: 32, color: muted, marginBottom: 12})}>الصلاحيات</div>
          <div style={{position: 'relative', height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.07)'}}>
            <div style={abs({right: 0, top: 0, bottom: 0, width: `${pp * 58}%`, borderRadius: 15, background: theme.blue})} />
            <div style={abs({right: '58%', top: 0, bottom: 0, width: `${pm * 30}%`, borderRadius: 15, background: theme.gold})} />
            <div style={abs({right: '58%', top: -10, bottom: -10, width: 3, background: W, opacity: pp})} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
            <span style={txt({fontWeight: 700, fontSize: 30, color: theme.electric, opacity: pp})}>تكفي</span>
            <span style={txt({fontWeight: 700, fontSize: 30, color: theme.gold, opacity: pm})}>ولا أكثر؟</span>
          </div>
        </Glass>
      </div>
      <div style={abs({right: 60, top: 10, opacity: Math.min(1, warn * 1.3), transform: `scale(${lerp(warn, 0.6, 1)})`})}>
        <Chip tone="gold" size={30}><WarnIcon size={30} color="#1D1504" />مشاكل كثير</Chip>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 13 devices: every device is a gap (full)
export const DevicesScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const grid: [number, number, IconC][] = [];
  const icons = [LaptopIcon, PhoneIcon, LaptopIcon, ServerIcon, LaptopIcon, PhoneIcon, LaptopIcon, PhoneIcon, ServerIcon];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) grid.push([c, r, icons[r * 3 + c]]);
  const bad = 4;
  const spread = prog(f, beats.spread, 30);
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 200, textAlign: 'center', ...enterY(prog(f, 3, 12), 20)})}>
        <span style={txt({fontWeight: 700, fontSize: 48, color: muted})}>كل جهاز منهم</span><br />
        <Headline size={86} gold>يعتبر ثغرة</Headline>
      </div>
      <svg width={1080} height={1920} style={abs({left: 0, top: 0})}>
        {grid.map(([c, r], i) => grid.slice(i + 1).filter(([c2, r2]) => Math.abs(c2 - c) + Math.abs(r2 - r) === 1).map(([c2, r2], j) => {
          const lit = spread > 0 && (i === bad || grid.indexOf(grid.find((g) => g[0] === c2 && g[1] === r2)!) === bad || spread > 0.6);
          return <line key={`${i}-${j}`} x1={270 + c * 270} y1={720 + r * 270} x2={270 + c2 * 270} y2={720 + r2 * 270}
            stroke={lit ? theme.gold : 'rgba(111,178,255,0.3)'} strokeWidth={lit ? 4 : 2} strokeDasharray="8 8" strokeDashoffset={-f * 1.5} opacity={lit ? 0.4 + 0.6 * spread : 1} />;
        }))}
      </svg>
      {grid.map(([c, r, I], i) => {
        const p = prog(f, 4 + i * 2, 12);
        const isBad = i === bad && f > beats.one;
        const infected = spread > 0 && (i === bad || spread > 0.25 + ((i * 37) % 9) / 14);
        const ring = f > beats.gaps ? ((f - beats.gaps + i * 4) % 40) / 40 : 0;
        return (
          <div key={i} style={abs({left: 270 + c * 270 - 60, top: 720 + r * 270 - 60, width: 120, height: 120, opacity: p, transform: `scale(${lerp(p, 0.6, 1)})`})}>
            {f > beats.gaps ? <div style={abs({inset: -ring * 40, borderRadius: '50%', border: `2px solid rgba(${infected ? '242,196,98' : '111,178,255'},${0.6 * (1 - ring)})`})} /> : null}
            <Badge size={120} tone={isBad || infected ? 'gold' : 'blue'} tilt={i * 13}><I size={64} color={isBad || infected ? '#1D1504' : W} /></Badge>
          </div>
        );
      })}
      <div dir="rtl" style={abs({left: 0, right: 0, top: 1460, textAlign: 'center', ...enterY(prog(f, beats.spread, 12), 20)})}>
        <Chip size={38}><WarnIcon size={36} color={theme.gold} />مشاكل لبقية العمل</Chip>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 14 closest example (above)
export const ExampleScene: React.FC<SceneProps> = ({beats}) => {
  const pe = usePop(beats.ex), pn = usePop(beats.name);
  return (
    <Shell>
      <Plate top={ABOVE + 20} height={300} />
      <div dir="rtl" style={abs({left: 40, right: 40, top: ABOVE + 40, textAlign: 'center'})}>
        <div style={{opacity: Math.min(1, pe * 1.3), transform: `scale(${lerp(pe, 0.7, 1)})`}}><Chip size={36}>وأقرب مثال</Chip></div>
        <div style={{marginTop: 26, perspective: 1000, opacity: Math.min(1, pn * 1.3)}}>
          <Glass gold style={{display: 'inline-block', padding: '20px 56px', transform: `rotateY(${lerp(pn, 80, 0)}deg)`}}>
            <Headline size={96} gold style={{direction: 'ltr'}}>Binance</Headline>
          </Glass>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 15 how systems are reached, open vs restricted (right panel)
export const ConnectScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const ph = usePop(beats.how);
  const toggled = prog(f, beats.closed, 10);
  const shownOpen = prog(f, beats.open, 10);
  return (
    <Shell>
      <SidePanel side="right" top={330}>
        <div style={{...enterX(ph, 60), textAlign: 'center'}}>
          <Badge size={120} style={{margin: '0 auto'}}><BuildingIcon size={70} color={W} /></Badge>
          <div style={txt({fontWeight: 800, fontSize: 38, color: W, marginTop: 14, lineHeight: 1.3})}>كيف يتم الاتصال<br />بأنظمة الشركة</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 40}}>
          {[LaptopIcon, CloudIcon, PhoneIcon].map((I, i) => {
            const p = prog(f, beats.how + 6 + i * 5, 12);
            return <div key={i} style={{opacity: p, transform: `translateY(${lerp(p, 30, 0)}px)`}}><Badge size={78} tone="glass" tilt={i * 20}><I size={44} color={theme.electric} /></Badge></div>;
          })}
        </div>
        <Glass style={{marginTop: 46, padding: '22px 20px', ...enterY(shownOpen, 20)}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span style={txt({fontWeight: 700, fontSize: 32, color: toggled > 0.5 ? theme.muted : theme.gold})}>مفتوح</span>
            <div style={{width: 110, height: 56, borderRadius: 28, background: toggled > 0.5 ? theme.royal : 'rgba(242,196,98,0.3)', position: 'relative', direction: 'ltr'}}>
              <div style={abs({top: 6, left: 6 + toggled * 54, width: 44, height: 44, borderRadius: 22, background: W, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'})} />
            </div>
            <span style={txt({fontWeight: 700, fontSize: 32, color: toggled > 0.5 ? theme.electric : theme.muted})}>محصور</span>
          </div>
        </Glass>
      </SidePanel>
    </Shell>
  );
};

// ---------------------------------------------------------------- 16 lateral movement through the network (full)
export const LateralScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const nodes: [number, number, IconC][] = [[540, 760, ServerIcon], [260, 920, LaptopIcon], [820, 920, DbIcon], [300, 1220, PhoneIcon], [780, 1220, AppsIcon], [540, 1380, CloudIcon], [540, 1070, NetworkIcon]];
  const order = [1, 6, 0, 2, 4, 5, 3];
  const pb = usePop(beats.breach);
  const spread = prog(f, beats.spread, 46, (x) => x);
  const pq = usePop(beats.q);
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 210, textAlign: 'center', ...enterY(prog(f, 3, 12), 20)})}>
        <span style={txt({fontWeight: 700, fontSize: 46, color: muted})}>لو حصل اختراق لوحدة من الشبكات</span><br />
        <Headline size={72}>هل المهاجم بيقدر يدخل</Headline><br />
        <Headline size={72} gold>لبقية الأنظمة؟</Headline>
      </div>
      <svg width={1080} height={1920} style={abs({left: 0, top: 0})}>
        {nodes.map(([x, y], i) => i === 6 ? null : (
          <line key={i} x1={x} y1={y} x2={540} y2={1070} stroke="rgba(111,178,255,0.3)" strokeWidth={2} strokeDasharray="6 10" strokeDashoffset={-f} />
        ))}
        {order.slice(0, -1).map((a, k) => {
          const b = order[k + 1];
          const p = Math.max(0, Math.min(1, spread * (order.length - 1) - k));
          if (p <= 0) return null;
          const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
          return <line key={`p${k}`} x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={theme.gold} strokeWidth={5} strokeLinecap="round"
             />;
        })}
      </svg>
      {nodes.map(([x, y, I], i) => {
        const p = prog(f, 4 + i * 3, 12);
        const k = order.indexOf(i);
        const hit = (i === 1 && f > beats.breach) || (spread * (order.length - 1) >= k && k > 0 && f > beats.spread);
        return (
          <div key={i} style={abs({left: x - 55, top: y - 55, opacity: p, transform: `scale(${lerp(p, 0.6, 1) * (i === 1 ? 1 + 0.12 * Math.sin(pb * Math.PI) : 1)})`})}>
            <Badge size={110} tone={hit ? 'gold' : 'blue'} tilt={i * 17}><I size={60} color={hit ? '#1D1504' : W} /></Badge>
          </div>
        );
      })}
      <div style={abs({left: 120, top: 760, opacity: f > beats.attacker ? Math.min(1, prog(f, beats.attacker, 10) * 1.3) : 0})}>
        <Chip tone="gold" size={28}><WarnIcon size={28} color="#1D1504" />المهاجم</Chip>
      </div>
      <div style={abs({left: 0, right: 0, top: 1480, display: 'flex', justifyContent: 'center', opacity: Math.min(1, pq * 1.3), transform: `scale(${lerp(pq, 0.6, 1)})`})}>
        <Chip size={36}>كامل ولا لا؟</Chip>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 17 systems: what if it stops one day (left panel)
export const SystemsScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const boom = usePop(beats.boom), prot = usePop(beats.protect);
  const rows: [IconC, string][] = [[AppsIcon, 'نظام'], [ServerIcon, 'نظام'], [CloudIcon, 'نظام']];
  return (
    <Shell>
      <SidePanel side="left" top={300}>
        <div style={{...enterY(prog(f, beats.list - 4, 12), 16), textAlign: 'center', marginBottom: 20}}>
          <span style={txt({fontWeight: 800, fontSize: 38, color: W, lineHeight: 1.3})}>كل الأنظمة اللي<br />داخل الشركة</span>
        </div>
        {rows.map(([I], i) => {
          const p = usePop(beats.list + i * 5);
          const w = prog(f, beats.write + i * 6, 14);
          const stop = f > beats.stop + i * 3;
          return (
            <div key={i} style={{...enterX(p, -70), marginBottom: 16}}>
              <Glass style={{padding: '16px 18px', borderRadius: 24}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                  <Badge size={62} tone={stop ? 'gold' : 'blue'} tilt={i * 20}><I size={36} color={stop ? '#1D1504' : W} /></Badge>
                  <div style={{flex: 1}}>
                    <div style={{height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.18)', width: '80%'}} />
                    <div style={{height: 10, borderRadius: 5, background: theme.electric, marginTop: 10, width: `${w * 70}%`}} />
                  </div>
                </div>
                {stop ? <div style={txt({fontWeight: 700, fontSize: 26, color: theme.gold, marginTop: 10})}>توقف يوم واحد؟</div> : null}
              </Glass>
            </div>
          );
        })}
        <div style={{display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10}}>
          <span style={{opacity: Math.min(1, boom * 1.3), transform: `scale(${lerp(boom, 0.6, 1)})`}}><Chip tone="gold" size={30}><WarnIcon size={30} color="#1D1504" />مصايب</Chip></span>
          <span style={{opacity: Math.min(1, prot * 1.3), transform: `scale(${lerp(prot, 0.6, 1)})`}}><Badge size={66}><Shield size={38} color={W} /></Badge></span>
        </div>
      </SidePanel>
    </Shell>
  );
};

// ---------------------------------------------------------------- 18 data is the most important asset (above)
const Cylinder: React.FC<{size: number; glow?: number}> = ({size, glow = 0}) => {
  const f = useCurrentFrame();
  const disks = [0, 1, 2];
  return (
    <div style={{position: 'relative', width: size, height: size * 1.1}}>
      {disks.map((i) => (
        <div key={i} style={abs({left: 0, right: 0, top: i * size * 0.3 + Math.sin((f + i * 10) / 30) * 3, height: size * 0.42, borderRadius: '50%',
          background: i === 0 ? theme.sky : theme.blue,
          border: '1.5px solid rgba(191,217,255,0.5)', boxShadow: `0 12px 30px rgba(0,0,0,0.35), 0 0 ${40 * glow}px ${theme.goldGlow}`})} />
      )).reverse()}
    </div>
  );
};
export const DataAssetScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pa = usePop(beats.asset), pm = prog(f, beats.most, 14);
  return (
    <Shell>
      <Plate top={ABOVE - 10} height={420} />
      <div dir="rtl" style={abs({left: 60, right: 60, top: ABOVE + 20, display: 'flex', alignItems: 'center', gap: 34})}>
        <div style={{position: 'relative', flex: 'none', opacity: Math.min(1, pa * 1.3), transform: `scale(${lerp(pa, 0.6, 1)})`}}>
          <Rings size={300} gold={pm > 0.5} style={{left: -40, top: -30}} />
          <Cylinder size={220} glow={pm} />
        </div>
        <div>
          <div style={enterY(pa, 16)}><span style={txt({fontWeight: 700, fontSize: 44, color: W})}>من ضمن الأصول</span></div>
          <div style={{marginTop: 10, opacity: pm, transform: `scale(${lerp(pm, 1.15, 1)})`, filter: `blur(${lerp(pm, 12, 0)}px)`, transformOrigin: 'right center'}}>
            <Headline size={70} gold>وأهم شي</Headline><br /><Headline size={54}>لازم نحميه</Headline>
          </div>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 19 data access / recovery (right panel)
export const DataAccessScene: React.FC<SceneProps> = ({beats}) => (
  <Shell>
    <SidePanel side="right" top={520}>
      <Row p={usePop(beats.who)} Icon={UserIcon} text="مين بيوصل لها" />
      <Row p={usePop(beats.restore)} Icon={RefreshIcon} text="تقدر تسترجعها؟" tone="gold" />
      <Row p={usePop(beats.loss)} Icon={WarnIcon} text="فقد أو خلل" />
    </SidePanel>
  </Shell>
);

// ---------------------------------------------------------------- 20 third parties (left panel)
export const ThirdPartyScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const ph = usePop(beats.host), pm = usePop(beats.mail);
  const scan = f > beats.which ? ((f - beats.which) % 36) / 36 : -1;
  return (
    <Shell>
      <SidePanel side="left" top={330}>
        <div style={{textAlign: 'center', ...enterY(prog(f, 2, 12), 16)}}>
          <Badge size={110} style={{margin: '0 auto'}}><BuildingIcon size={64} color={W} /></Badge>
          <div style={txt({fontWeight: 800, fontSize: 34, color: W, marginTop: 10})}>شركتك</div>
        </div>
        <div style={{height: 70, width: 4, margin: '10px auto', background: theme.gold, opacity: Math.max(ph, pm), borderRadius: 2}} />
        <Row p={ph} Icon={HostIcon} text="شركة الاستضافة" dx={-60} />
        <Row p={pm} Icon={MailIcon} text="مزود البريد" dx={-60} />
        {scan >= 0 ? (
          <Glass gold style={{marginTop: 10, padding: '16px 18px', textAlign: 'center'}}>
            <span style={txt({fontWeight: 700, fontSize: 30, color: theme.gold})}>أي جهة تقدر توصل؟</span>
            <div style={{height: 4, borderRadius: 2, marginTop: 12, background: 'rgba(255,255,255,0.12)', position: 'relative'}}>
              <div style={abs({right: `${scan * 80}%`, width: '20%', top: 0, bottom: 0, borderRadius: 2, background: theme.gold})} />
            </div>
          </Glass>
        ) : null}
      </SidePanel>
    </Shell>
  );
};

// ---------------------------------------------------------------- 21 breaches started from third parties (full)
export const BreachScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pm = prog(f, beats.many, 14), ps = prog(f, beats.start, 30), pe = usePop(beats.ext);
  const inner: [number, number, IconC][] = [[420, 1000, ServerIcon], [660, 1000, DbIcon], [420, 1230, LaptopIcon], [660, 1230, AppsIcon]];
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 220, textAlign: 'center'})}>
        <div style={{opacity: pm, transform: `scale(${lerp(pm, 1.15, 1)})`, filter: `blur(${lerp(pm, 12, 0)}px)`}}><Headline size={78}>حصلت اختراقات كثيرة</Headline></div>
        <div style={enterY(prog(f, beats.start, 12), 16)}><span style={txt({fontWeight: 700, fontSize: 46, color: muted})}>وكانت البداية بسبب</span></div>
        <div style={{opacity: Math.min(1, pe * 1.3), transform: `scale(${lerp(pe, 0.7, 1)})`}}><Headline size={80} gold>جهات خارجية</Headline></div>
      </div>
      <div style={abs({left: 300, top: 880, width: 480, height: 470, borderRadius: 40, border: '2px dashed rgba(191,217,255,0.4)'})}>
        <div style={abs({top: -26, right: 30})}><Chip size={28}><BuildingIcon size={28} color={W} />الشركة</Chip></div>
      </div>
      <svg width={1080} height={1920} style={abs({left: 0, top: 0})}>
        <path d="M150 1110 C 250 1110, 300 1050, 420 1000" stroke={theme.gold} strokeWidth={5} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - ps)}  />
        {inner.slice(1).map(([x, y], i) => <line key={i} x1={420} y1={1000} x2={420 + (x - 420) * Math.max(0, ps * 2 - 1)} y2={1000 + (y - 1000) * Math.max(0, ps * 2 - 1)} stroke={theme.gold} strokeWidth={4} opacity={0.8} />)}
      </svg>
      <div style={abs({left: 90, top: 1050, ...enterX(prog(f, 4, 12), -40)})}><Badge size={120} tone="gold"><HostIcon size={68} color="#1D1504" /></Badge></div>
      {inner.map(([x, y, I], i) => {
        const hit = ps > (i === 0 ? 0.45 : 0.6 + i * 0.1);
        return <div key={i} style={abs({left: x - 50, top: y - 50, opacity: prog(f, 3 + i * 3, 12)})}><Badge size={100} tone={hit ? 'gold' : 'blue'} tilt={i * 20}><I size={54} color={hit ? '#1D1504' : W} /></Badge></div>;
      })}
    </Shell>
  );
};

// ---------------------------------------------------------------- 22 summary checklist (above)
const ASSETS: [IconC, string][] = [[UserIcon, 'الحسابات والهوية'], [LaptopIcon, 'الأجهزة'], [NetworkIcon, 'الشبكات وطرق الدخول'], [AppsIcon, 'البرامج والأنظمة'], [DbIcon, 'البيانات'], [CloudIcon, 'الجهات الخارجية']];
export const SummaryScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pn = usePop(beats.notall), pr = prog(f, beats.rely, 14);
  const fade = prog(f, beats.notall - 12, 10);
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 50, right: 50, top: ABOVE - 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, opacity: 1 - fade, filter: `blur(${fade * 10}px)`})}>
        {ASSETS.map(([I, t], i) => {
          const p = usePop(beats.list + i * 3);
          const c = prog(f, beats.basics + i * 4, 8);
          return (
            <div key={i} style={enterY(p, 24)}>
              <Glass style={{padding: '12px 14px', borderRadius: 22, display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 46, height: 46, borderRadius: 14, background: c > 0 ? theme.gold : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><CheckIcon size={36} color="#1D1504" stroke={6} draw={c} /></div>
                <I size={34} color={theme.electric} />
                <span style={txt({fontWeight: 700, fontSize: 28, color: W, lineHeight: 1.2})}>{t}</span>
              </Glass>
            </div>
          );
        })}
      </div>
      <div dir="rtl" style={abs({left: 40, right: 40, top: ABOVE + 60, textAlign: 'center'})}>
        <div style={{opacity: Math.min(1, pn * 1.3), transform: `scale(${lerp(pn, 0.7, 1)})`}}><Chip size={38}>ومش كل شيء</Chip></div>
        <div style={{marginTop: 18, opacity: pr, filter: `blur(${lerp(pr, 12, 0)}px)`}}>
          <span style={txt({fontWeight: 700, fontSize: 42, color: W})}>لازم تعرف إيش الحاجة اللي</span><br />
          <Headline size={66} gold>شركتك تعتمد عليها</Headline>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 23 next episode (below)
export const NextEpScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pb = prog(f, beats.basics, 12), pn = usePop(beats.next);
  return (
    <Shell>
      <Plate top={BELOW - 25} height={300} />
      <div dir="rtl" style={abs({left: 50, right: 50, top: BELOW, display: 'flex', alignItems: 'center', gap: 26})}>
        <div style={{perspective: 1000, opacity: Math.min(1, pn * 1.3), flex: 'none'}}>
          <Glass gold style={{width: 220, height: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `rotateY(${lerp(pn, -90, -10)}deg)`}}>
            <span style={txt({fontWeight: 500, fontSize: 28, color: muted})}>الحلقة</span>
            <span style={{direction: 'ltr'}}><Glyph text="02" size={110} /></span>
          </Glass>
        </div>
        <div>
          <div style={enterY(pb, 16)}><span style={txt({fontWeight: 700, fontSize: 38, color: muted})}>مش بس الأساسيات</span></div>
          <div style={{...enterY(pn, 20), marginTop: 8}}><Headline size={70}>الحلقة القادمة</Headline></div>
        </div>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 24 common admin mistakes (full)
export const MistakesScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pt = prog(f, beats.title, 14), ps = prog(f, beats.simple, 16), pb = prog(f, beats.big, 24);
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 300, textAlign: 'center'})}>
        <div style={enterY(prog(f, 3, 12), 16)}><Chip tone="gold" size={32}>الحلقة القادمة</Chip></div>
        <div style={{marginTop: 22, opacity: pt, transform: `scale(${lerp(pt, 1.15, 1)})`, filter: `blur(${lerp(pt, 14, 0)}px)`}}>
          <Headline size={90}>الأخطاء الإدارية</Headline><br /><Headline size={90} gold>الشائعة</Headline>
        </div>
      </div>
      <div style={abs({left: 190, top: 900, width: 700, height: 420, perspective: 1200})}>
        <Glass style={{width: '100%', height: '100%', transform: 'rotateX(16deg)'}}>
          <svg width={700} height={420} style={abs({left: 0, top: 0})}>
            <path d="M330 30 L350 120 L320 190" stroke={theme.ice} strokeWidth={4} fill="none" strokeDasharray={200} strokeDashoffset={200 * (1 - ps)} />
            <path d="M320 190 L380 260 L330 330 L360 400 M380 260 L470 300 L560 280 M330 330 L230 360 L150 340 M350 120 L440 140 L520 100 M350 120 L250 110 L170 150"
              stroke={theme.gold} strokeWidth={5} fill="none" strokeDasharray={1400} strokeDashoffset={1400 * (1 - pb)}  />
          </svg>
        </Glass>
      </div>
      <div dir="rtl" style={abs({left: 0, right: 0, top: 1380, display: 'flex', justifyContent: 'center', gap: 22})}>
        <span style={enterY(ps, 20)}><Chip size={34}>تبدو بسيطة</Chip></span>
        <span style={enterY(pb, 20)}><Chip tone="gold" size={34}>مشاكل كبيرة</Chip></span>
      </div>
    </Shell>
  );
};

// ---------------------------------------------------------------- 25 outro (lower kinetic, full frame)
export const OutroScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const pw = prog(f, beats.wait, 12), pb = prog(f, beats.bye, 14);
  return (
    <Shell>
      <div style={abs({left: 40, right: 40, top: 1300, height: 420, borderRadius: 36, background: theme.glassStrong, backdropFilter: theme.blur, border: `1.5px solid ${theme.glassBorder}`})} />
      <div dir="rtl" style={abs({left: 40, right: 40, top: 1330, textAlign: 'center'})}>
        <div style={enterY(pw, 16)}><span style={txt({fontWeight: 700, fontSize: 46, color: W})}>انتظرونا للحلقة القادمة</span></div>
        <div style={{marginTop: 8, opacity: pb, transform: `scale(${lerp(pb, 1.2, 1)})`, filter: `blur(${lerp(pb, 14, 0)}px)`}}><Headline size={120} gold>ودمتم بخير</Headline></div>
        <div style={{...enterY(prog(f, beats.bye + 10, 12), 12), marginTop: 6}}><Chip size={28}><Shield size={28} color={theme.electric} />سلسلة تأمين الشركات</Chip></div>
      </div>
      {f > d - 2 ? null : null}
    </Shell>
  );
};

export const _icons = {BellIcon, BookIcon};

// ---------------------------------------------------------------- series roadmap: the 11 axes (full)
export const RoadmapScene: React.FC<SceneProps> = ({beats}) => {
  const f = useCurrentFrame();
  const pt = prog(f, 2, 12);
  const active = f >= beats.response ? 8 : f >= beats.basics ? 0 : -1;
  return (
    <Shell>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 150, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', ...enterY(pt, 20)})}>
        <Headline size={64}>محاور السلسلة</Headline>
        <span style={txt({fontWeight: 600, fontSize: 28, color: theme.sky})}>عدد الحلقات</span>
      </div>
      <div dir="rtl" style={abs({left: 40, right: 40, top: 265})}>
        {seriesAxes.map(([title, eps], i) => {
          const p = usePop(beats.list + i * 4);
          const on = i === active;
          const done = active >= 0 && i < active;
          const long = title.length > 32;
          return (
            <div key={i} style={{...enterX(p, 70), marginBottom: 10}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 22,
                background: on ? theme.gold : theme.glass, backdropFilter: theme.blur,
                border: `1.5px solid ${on ? theme.gold : theme.glassBorder}`, transform: `scale(${on ? 1.03 : 1})`}}>
                <div style={{width: 56, height: 56, borderRadius: 16, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? theme.ink : done ? theme.blue : theme.glassLight,
                  fontFamily: theme.font, fontWeight: 800, fontSize: 28, color: on ? theme.gold : theme.white}}>{i + 1}</div>
                <span style={txt({flex: 1, minWidth: 0, fontWeight: 700, fontSize: long ? 27 : 31, lineHeight: 1.25, color: on ? theme.ink : theme.white})}>{title}</span>
                <span style={txt({flex: 'none', minWidth: 74, textAlign: 'center', fontWeight: 800, fontSize: 26, padding: '6px 12px', borderRadius: 999,
                  background: on ? theme.ink : 'rgba(59,130,246,0.35)', color: on ? theme.gold : theme.white, direction: 'ltr'})}>{eps}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
};
