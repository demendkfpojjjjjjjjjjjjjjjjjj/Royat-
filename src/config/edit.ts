// ---------------------------------------------------------------------------
// Editorial timeline. Every time below is in SOURCE seconds of the clip named
// by its id ('01'..'04'), so trimming a segment never breaks a caption or a
// scene: they are re-mapped to the output timeline automatically.
// ---------------------------------------------------------------------------

export type SrcId = '01' | '02' | '03' | '04';
export type Anchor = {src: SrcId; t: number};
export const at = (src: SrcId, t: number): Anchor => ({src, t});

// Kept speech ranges, in playback order. Long pauses between them are removed.
// `zoom` is the punch-in level for that shot (jump-cut feel, like the reference).
export type Segment = {src: SrcId; from: number; to: number; zoom: number};
export const segments: Segment[] = [
  {src: '01', from: 0.3, to: 3.0, zoom: 1.0},
  {src: '01', from: 3.22, to: 5.12, zoom: 1.12},
  {src: '01', from: 5.4, to: 9.46, zoom: 1.0},
  {src: '01', from: 9.64, to: 17.5, zoom: 1.08},
  {src: '02', from: 0.0, to: 8.28, zoom: 1.0},
  {src: '02', from: 8.3, to: 18.22, zoom: 1.1},
  {src: '02', from: 18.44, to: 21.16, zoom: 1.04},
  {src: '02', from: 21.36, to: 23.2, zoom: 1.12},
  {src: '03', from: 0.0, to: 4.8, zoom: 1.0},
  {src: '03', from: 5.08, to: 14.66, zoom: 1.08},
  {src: '04', from: 0.0, to: 6.72, zoom: 1.0},
  {src: '04', from: 6.9, to: 18.6, zoom: 1.1},
];

// Captions: short chunks, words revealed as they are spoken.
// `hi` = words drawn in calm yellow. `uncertain` = not fully audible (see NOTES.md).
export type Caption = {s: Anchor; e: Anchor; text: string; hi?: string[]; uncertain?: boolean};
export const captions: Caption[] = [
  {s: at('01', 0.3), e: at('01', 1.68), text: 'الهاكر عشان يخترقك', hi: ['الهاكر']},
  {s: at('01', 1.68), e: at('01', 3.0), text: 'ما يحتاج إنه يهكّرك', hi: ['يهكّرك']},
  {s: at('01', 5.42), e: at('01', 6.8), text: 'خليني أوريك اللي نسويه', uncertain: true},
  {s: at('01', 6.8), e: at('01', 8.08), text: 'كأمن سيبراني كل يوم', hi: ['سيبراني']},
  {s: at('01', 8.08), e: at('01', 9.46), text: 'وأغلب الناس ما تعرفوش'},
  {s: at('01', 9.66), e: at('01', 11.68), text: 'ثلاث حاجات تقدر تفحصها الآن', hi: ['ثلاث']},
  {s: at('01', 11.68), e: at('01', 13.3), text: 'من دون ما تدفع ولا ريال', hi: ['ريال']},
  {s: at('01', 13.5), e: at('01', 15.5), text: 'النقطة الأولى: الروابط المخفية', hi: ['المخفية']},
  {s: at('01', 15.52), e: at('01', 17.5), text: 'افتح موقعك بنافذة خاصة', hi: ['خاصة']},
  {s: at('02', 0.0), e: at('02', 1.94), text: 'وشوف إذا فيه نوافذ منبثقة', hi: ['منبثقة']},
  {s: at('02', 1.94), e: at('02', 3.62), text: 'أو تحويلات ما تعرفها', hi: ['تحويلات'], uncertain: true},
  {s: at('02', 3.62), e: at('02', 5.14), text: 'إذا إيوه، فهذا أول علامة', hi: ['علامة']},
  {s: at('02', 5.14), e: at('02', 6.12), text: 'إنه فيه حد دخل'},
  {s: at('02', 6.12), e: at('02', 8.28), text: 'وساب لك باب يرجع يوصله بعدين', hi: ['باب'], uncertain: true},
  {s: at('02', 8.3), e: at('02', 9.68), text: 'النقطة الثانية: تأكد', hi: ['الثانية']},
  {s: at('02', 9.68), e: at('02', 11.0), text: 'إن الرابط حقك', uncertain: true},
  {s: at('02', 11.0), e: at('02', 13.1), text: 'فيه HTTPS وفيه القفل', hi: ['HTTPS', 'القفل']},
  {s: at('02', 13.18), e: at('02', 14.96), text: 'لأنه إذا ما فيه، معناه'},
  {s: at('02', 14.96), e: at('02', 16.76), text: 'إن أي بيانات يدخلها عميلك', hi: ['بيانات']},
  {s: at('02', 16.76), e: at('02', 18.22), text: 'تنرسل من دون حماية', hi: ['حماية']},
  {s: at('02', 21.36), e: at('02', 22.36), text: 'والنقطة الثالثة اللي هي'},
  {s: at('02', 22.36), e: at('03', 0.9), text: 'أكبر مشكلة بالأمن السيبراني', hi: ['أكبر']},
  {s: at('03', 0.9), e: at('03', 2.78), text: 'اللي هي صلاحيات الإدارة', hi: ['صلاحيات']},
  {s: at('03', 2.78), e: at('03', 4.8), text: 'بتدخل على لوحة الإدارة عندك', hi: ['لوحة', 'الإدارة']},
  {s: at('03', 5.08), e: at('03', 6.42), text: 'وتشوف كم حساب'},
  {s: at('03', 6.42), e: at('03', 7.5), text: 'عنده صلاحيات كاملة', hi: ['كاملة']},
  {s: at('03', 7.6), e: at('03', 9.1), text: 'أغلب الشركات تكتشف'},
  {s: at('03', 9.1), e: at('03', 10.78), text: 'إنه فيه حسابات لموظفين سابقين', hi: ['سابقين']},
  {s: at('03', 10.78), e: at('03', 11.94), text: 'وما أحد حذفها', uncertain: true},
  {s: at('03', 14.0), e: at('04', 1.1), text: 'هذي الفحوص تكشف المشكلة', hi: ['تكشف']},
  {s: at('04', 1.1), e: at('04', 3.4), text: 'لكن الحل إن الموقع أو التطبيق', hi: ['الحل']},
  {s: at('04', 3.4), e: at('04', 5.1), text: 'ينبني من أول يوم وهو آمن', hi: ['آمن'], uncertain: true},
  {s: at('04', 5.1), e: at('04', 6.72), text: 'مش يتصلّح بعد ما ينكسر', hi: ['ينكسر']},
  {s: at('04', 6.9), e: at('04', 8.0), text: 'وهذا اللي نشتغل عليه'},
  {s: at('04', 8.0), e: at('04', 8.98), text: 'بـ ستوكس سوفت', hi: ['ستوكس', 'سوفت'], uncertain: true},
  {s: at('04', 8.98), e: at('04', 10.56), text: 'نبني التطبيقات من البداية'},
  {s: at('04', 10.56), e: at('04', 11.54), text: 'بأمان عالي', hi: ['بأمان', 'عالي']},
  {s: at('04', 11.54), e: at('04', 13.26), text: 'فإذا طلعت من الفحوص الثلاثة', hi: ['الثلاثة']},
  {s: at('04', 13.26), e: at('04', 14.58), text: 'بدون أي مشاكل'},
];

// Emphasis moments (reference: big glowing keyword over the speaker, small words around it).
// Captions are hidden while an emphasis block is on screen.
export type Emphasis = {
  s: Anchor; e: Anchor; top: string; big: string; bottom?: string;
  bigAt: Anchor; bottomAt?: Anchor;
};
export const emphases: Emphasis[] = [
  {s: at('01', 3.22), e: at('01', 5.12), top: 'يكفي إنه يستنّاك', big: 'تغلط', bottom: 'بس', bigAt: at('01', 4.46), bottomAt: at('01', 4.88)},
  {s: at('02', 18.44), e: at('02', 21.16), top: 'وهذي مشكلة', big: 'قانونية', bottom: 'قبل ما تكون مشكلة تقنية', bigAt: at('02', 19.08), bottomAt: at('02', 19.5)},
  {s: at('03', 11.94), e: at('03', 14.0), top: 'كل حساب زايد يعتبر', big: 'ثغرة مفتوحة', bigAt: at('03', 13.12)},
  {s: at('04', 14.58), e: at('04', 18.6), top: 'فمبروك عليك، انت من', big: 'القلة القليلة', bottom: 'اللي الأمان عندهم عالي', bigAt: at('04', 16.04), bottomAt: at('04', 16.98)},
];

// Full-screen explainer scenes (B-roll / UI mockups). `beats` are moments inside
// the scene, tied to the spoken words, used to time each animation.
export type SceneType =
  | 'cyber' | 'checklist' | 'section' | 'browser' | 'door'
  | 'https' | 'dataflow' | 'admin' | 'compare' | 'build';
export type Scene = {
  type: SceneType; s: Anchor; e: Anchor;
  beats?: Record<string, Anchor>;
  props?: Record<string, string | number | boolean>;
};
export const scenes: Scene[] = [
  {type: 'cyber', s: at('01', 5.42), e: at('01', 8.08), beats: {label: at('01', 6.8), sub: at('01', 7.64)}},
  {type: 'checklist', s: at('01', 9.66), e: at('01', 13.3),
    beats: {rows: at('01', 10.4), stamp: at('01', 12.7)}, props: {mode: 'intro'}},
  {type: 'section', s: at('01', 13.5), e: at('01', 15.5), props: {num: '01', label: 'النقطة الأولى', title: 'الروابط المخفية'}},
  {type: 'browser', s: at('01', 15.52), e: at('02', 3.62),
    beats: {pop1: at('02', 1.0), pop2: at('02', 1.45), redirect: at('02', 2.1)}},
  {type: 'door', s: at('02', 5.14), e: at('02', 8.28), beats: {open: at('02', 6.7)}},
  {type: 'section', s: at('02', 8.3), e: at('02', 9.68), props: {num: '02', label: 'النقطة الثانية', title: 'HTTPS والقفل'}},
  {type: 'https', s: at('02', 9.68), e: at('02', 13.1), beats: {https: at('02', 11.1), lock: at('02', 12.3)}},
  {type: 'dataflow', s: at('02', 13.18), e: at('02', 18.22), beats: {send: at('02', 15.3), open: at('02', 17.3)}},
  {type: 'section', s: at('03', 0.9), e: at('03', 2.78), props: {num: '03', label: 'النقطة الثالثة', title: 'صلاحيات الإدارة'}},
  {type: 'admin', s: at('03', 2.78), e: at('03', 11.94), beats: {full: at('03', 6.42), former: at('03', 9.7), stale: at('03', 11.0)}},
  {type: 'compare', s: at('04', 1.1), e: at('04', 6.72), beats: {right: at('04', 3.4), left: at('04', 5.1)}},
  {type: 'build', s: at('04', 8.98), e: at('04', 11.54), beats: {secure: at('04', 10.56)}},
  {type: 'checklist', s: at('04', 11.54), e: at('04', 14.58),
    beats: {rows: at('04', 11.6), c1: at('04', 12.3), c2: at('04', 12.65), c3: at('04', 13.0), ok: at('04', 13.4)}, props: {mode: 'done'}},
];

// Extra sound-effect cues tied to beats (entrances of scenes/emphasis get SFX automatically).
export type SfxName = 'whoosh' | 'swish' | 'click' | 'pop' | 'impact';
export const extraSfx: {at: Anchor; name: SfxName; volume?: number}[] = [
  {at: at('01', 6.8), name: 'click'},
  {at: at('01', 10.4), name: 'pop'},
  {at: at('01', 12.7), name: 'click'},
  {at: at('02', 1.0), name: 'pop'},
  {at: at('02', 1.45), name: 'pop'},
  {at: at('02', 2.1), name: 'swish'},
  {at: at('02', 6.7), name: 'swish'},
  {at: at('02', 11.1), name: 'click'},
  {at: at('02', 12.3), name: 'click'},
  {at: at('02', 15.3), name: 'swish', volume: 0.7},
  {at: at('02', 17.3), name: 'pop'},
  {at: at('03', 6.42), name: 'click'},
  {at: at('03', 9.7), name: 'pop'},
  {at: at('04', 3.4), name: 'pop'},
  {at: at('04', 5.1), name: 'pop'},
  {at: at('04', 10.56), name: 'pop'},
  {at: at('04', 12.3), name: 'click'},
  {at: at('04', 12.65), name: 'click'},
  {at: at('04', 13.0), name: 'click'},
];

// Global SFX level relative to the voice (voice is normalised to -16 LUFS).
export const SFX_GAIN = 0.32;
