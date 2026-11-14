// ---------------------------------------------------------------------------
// Episode 1 of "سلسلة تأمين الشركات" — editorial plan.
// NOTHING IS CUT: every clip plays in full, in order (frame counts below are the
// exact source frame counts). All times are SOURCE seconds of the named clip.
// ---------------------------------------------------------------------------

export type SrcId = '01' | '02' | '03' | '04' | '05' | '06' | '07';
export type Anchor = {src: SrcId; t: number};
export const at = (src: SrcId, t: number): Anchor => ({src, t});

export const clips: {src: SrcId; frames: number}[] = [
  {src: '01', frames: 611}, {src: '02', frames: 608}, {src: '03', frames: 610}, {src: '04', frames: 609},
  {src: '05', frames: 619}, {src: '06', frames: 614}, {src: '07', frames: 539},
];

// ---------------------------------------------------------------- composition (digital camera)
// The video is never zoomed past the full frame (no crop of face/hands). Instead it
// becomes a floating glass card that moves to free space for the explanations:
//   full  = full frame            up    = card up, explanation below
//   down  = card down, text above left  = card left, panel on the right
//   right = card right, panel left
// Full-screen scenes (scenes with full: true) cover the card for a few seconds.
export type Mode = 'full' | 'up' | 'down' | 'left' | 'right';
export const compositions: {at: Anchor; mode: Mode}[] = [
  {at: at('01', 0.0), mode: 'up'},
  {at: at('01', 4.9), mode: 'down'},
  {at: at('01', 9.36), mode: 'left'},
  {at: at('01', 13.24), mode: 'up'},
  {at: at('01', 16.7), mode: 'down'},
  {at: at('01', 19.5), mode: 'full'},
  {at: at('02', 2.36), mode: 'down'},
  {at: at('02', 12.9), mode: 'right'},
  {at: at('02', 15.1), mode: 'up'},
  {at: at('02', 18.3), mode: 'left'},
  {at: at('03', 1.24), mode: 'down'},
  {at: at('03', 9.84), mode: 'up'},
  {at: at('03', 19.0), mode: 'down'},
  {at: at('04', 1.88), mode: 'up'},
  {at: at('04', 4.66), mode: 'left'},
  {at: at('04', 16.72), mode: 'up'},
  {at: at('04', 18.96), mode: 'right'},
  {at: at('05', 9.84), mode: 'up'},
  {at: at('05', 12.18), mode: 'down'},
  {at: at('05', 16.02), mode: 'left'},
  {at: at('06', 0.3), mode: 'up'},
  {at: at('06', 4.86), mode: 'right'},
  {at: at('06', 18.16), mode: 'down'},
  {at: at('07', 4.4), mode: 'up'},
  {at: at('07', 15.0), mode: 'full'},
];

// ---------------------------------------------------------------- captions
// `hi` = gold words. `uncertain` = not fully audible (see NOTES.md); unclear words are left out.
export type Caption = {s: Anchor; e: Anchor; text: string; hi?: string[]; uncertain?: boolean};
export const captions: Caption[] = [
  {s: at('01', 0.0), e: at('01', 1.16), text: 'هل بتقدر', uncertain: true},
  {s: at('01', 1.16), e: at('01', 3.32), text: 'الأشياء اللي بتتأثر أولًا بشركتك', hi: ['أولًا']},
  {s: at('01', 3.32), e: at('01', 4.96), text: 'إذا حصل لها هجوم أو اختراق؟', hi: ['هجوم', 'اختراق؟']},
  {s: at('01', 5.0), e: at('01', 6.7), text: 'أهلًا فيك بالحلقة الأولى', hi: ['الأولى']},
  {s: at('01', 6.7), e: at('01', 8.22), text: 'من سلسلة تأمين الشركات', hi: ['تأمين']},
  {s: at('01', 8.22), e: at('01', 9.4), text: 'من الألف إلى الياء'},
  {s: at('01', 9.4), e: at('01', 10.7), text: 'أنا رؤيت، وبهذه السلسلة', hi: ['رؤيت،']},
  {s: at('01', 10.7), e: at('01', 13.3), text: 'بنبني مع بعض مفاهيم حماية سيبرانية', hi: ['سيبرانية']},
  {s: at('01', 13.3), e: at('01', 14.56), text: 'من الأساسيات', hi: ['الأساسيات']},
  {s: at('01', 14.56), e: at('01', 16.74), text: 'إلى الاستجابة للحوادث واستمرارية العمل'},
  {s: at('01', 16.74), e: at('01', 18.5), text: 'بناءً على إطار المعهد الأمريكي'},
  {s: at('01', 18.5), e: at('01', 19.54), text: 'للمعايير والتقنية'},
  {s: at('02', 2.42), e: at('02', 4.6), text: 'جوابًا على السؤال اللي فوق'},
  {s: at('02', 4.64), e: at('02', 7.6), text: 'لازم تعرف إيش الأساسيات اللي لازم شركتك تحميها', hi: ['الأساسيات']},
  {s: at('02', 7.96), e: at('02', 10.04), text: 'لأنه الشي اللي انت مش عارف إنه موجود'},
  {s: at('02', 10.04), e: at('02', 12.96), text: 'ما بتقدرش تحميه ولا تكتشف إذا حصل له مشكلة', hi: ['تحميه', 'تكتشف']},
  {s: at('02', 13.0), e: at('02', 15.16), text: 'فجيب ورقة وقلم وسجّل بعدي', hi: ['وسجّل']},
  {s: at('02', 15.16), e: at('02', 18.3), text: 'أول شي: لازم تحمي الحسابات والهوية', hi: ['الحسابات', 'والهوية']},
  {s: at('02', 18.3), e: at('03', 0.0), text: 'زي البريد الإلكتروني، حسابات', hi: ['البريد']},
  {s: at('03', 0.0), e: at('03', 1.24), text: 'الإدارة وكل الحسابات', hi: ['الإدارة']},
  {s: at('03', 1.28), e: at('03', 4.04), text: 'لازم تعرف مين يقدر يدخل هذه الحسابات', hi: ['مين']},
  {s: at('03', 4.04), e: at('03', 7.48), text: 'وإذا قدر يدخل، هل عنده الصلاحيات اللي تكفي ولا أكثر؟', hi: ['الصلاحيات'], uncertain: true},
  {s: at('03', 7.48), e: at('03', 9.8), text: 'لأن هذه النقطة تسبب لك مشاكل كثير'},
  {s: at('03', 9.88), e: at('03', 11.4), text: 'ثاني شي: الأجهزة', hi: ['الأجهزة']},
  {s: at('03', 11.4), e: at('03', 13.66), text: 'سواء أجهزة الموظفين والأجهزة بشكل عام'},
  {s: at('03', 13.66), e: at('03', 15.36), text: 'كل جهاز منهم يعتبر ثغرة', hi: ['ثغرة']},
  {s: at('03', 15.4), e: at('03', 17.2), text: 'فإذا جهاز واحد منهم مش محمي', hi: ['واحد']},
  {s: at('03', 17.2), e: at('03', 19.04), text: 'بيسبب مشاكل لبقية العمل'},
  {s: at('03', 19.06), e: at('04', 0.0), text: 'وأقرب مثال'},
  {s: at('04', 0.0), e: at('04', 1.3), text: 'اللي حصل على Binance', hi: ['Binance'], uncertain: true},
  {s: at('04', 1.9), e: at('04', 4.6), text: 'ثالث شي: الشبكات وطرق الدخول', hi: ['الشبكات']},
  {s: at('04', 4.7), e: at('04', 7.56), text: 'ضروري تعرف كيف يتم الاتصال بأنظمة الشركة'},
  {s: at('04', 7.56), e: at('04', 9.72), text: 'هل الوصول مفتوح ولا محصور؟', hi: ['مفتوح', 'محصور؟']},
  {s: at('04', 9.72), e: at('04', 12.64), text: 'ولو مثلًا حصل اختراق لوحدة من الشبكات أو الأجهزة', hi: ['اختراق']},
  {s: at('04', 12.64), e: at('04', 15.84), text: 'هل المهاجم بيقدر يدخل لبقية الأنظمة كامل ولا لا؟', hi: ['المهاجم']},
  {s: at('04', 15.84), e: at('04', 16.74), text: 'فهذه نقطة'},
  {s: at('04', 16.76), e: at('04', 18.96), text: 'أربعة: البرامج والأنظمة', hi: ['البرامج']},
  {s: at('04', 18.98), e: at('05', 1.14), text: 'جميل كذا، كل الأنظمة اللي داخل الشركة حقك'},
  {s: at('05', 1.14), e: at('05', 4.72), text: 'اكتب قدام كل واحد إيش بيحصل للشركة', hi: ['اكتب']},
  {s: at('05', 4.72), e: at('05', 7.3), text: 'إذا هذا النظام توقف يوم واحد بس', hi: ['توقف']},
  {s: at('05', 7.3), e: at('05', 9.7), text: 'بتطلع مصايب، فلازم تحميه', hi: ['مصايب،']},
  {s: at('05', 9.86), e: at('05', 12.2), text: 'خمسة: البيانات', hi: ['البيانات']},
  {s: at('05', 12.2), e: at('05', 14.38), text: 'هذه اللي نعتبرها من ضمن الأصول'},
  {s: at('05', 14.38), e: at('05', 16.04), text: 'وأهم شي لازم نحميه', hi: ['وأهم']},
  {s: at('05', 16.04), e: at('05', 17.8), text: 'لازم تعرف مين بيوصل لها', hi: ['مين']},
  {s: at('05', 17.8), e: at('06', 0.3), text: 'وهل بتقدر تسترجعها إذا حصل لها فقد أو خلل', hi: ['تسترجعها']},
  {s: at('06', 0.3), e: at('06', 3.7), text: 'وآخر نقطة: الخدمات والجهات الخارجية', hi: ['الخارجية']},
  {s: at('06', 3.7), e: at('06', 4.86), text: 'Third party'},
  {s: at('06', 4.86), e: at('06', 8.1), text: 'زي شركة الاستضافة، مزود البريد عندك'},
  {s: at('06', 8.1), e: at('06', 12.9), text: 'فانت تحتاج تعرف بالضبط أي من هذه الجهات تقدر توصل لها ولا لا', hi: ['بالضبط']},
  {s: at('06', 13.28), e: at('06', 15.6), text: 'لأنه حصلت اختراقات كثيرة', hi: ['اختراقات']},
  {s: at('06', 15.6), e: at('06', 18.1), text: 'وكانت بداية الاختراق بسبب جهات خارجية', hi: ['خارجية']},
  {s: at('06', 18.18), e: at('07', 0.5), text: 'فهذه كانت بس الأساسيات اللي لازم تحميها'},
  {s: at('07', 0.5), e: at('07', 1.6), text: 'ومش كل شيء'},
  {s: at('07', 1.6), e: at('07', 4.44), text: 'فأنت لازم تعرف إيش الحاجة اللي شركتك تعتمد عليها', hi: ['تعتمد']},
  {s: at('07', 4.44), e: at('07', 6.2), text: 'مش بس تلتزم ببعض الأساسيات'},
  {s: at('07', 6.2), e: at('07', 8.2), text: 'بالحلقة القادمة من هذه السلسلة', hi: ['القادمة']},
  {s: at('07', 8.2), e: at('07', 10.8), text: 'بنتكلم عن الأخطاء الإدارية الشائعة', hi: ['الأخطاء', 'الإدارية']},
  {s: at('07', 10.8), e: at('07', 12.4), text: 'اللي قد تبدو إنها بسيطة'},
  {s: at('07', 12.4), e: at('07', 15.04), text: 'لكنها بتكون سبب لمشاكل كبيرة', hi: ['كبيرة']},
];

// ---------------------------------------------------------------- explainer scenes
// full: true covers the frame; otherwise elements live in the space the composition frees.
// `cues` = sound design for that scene: [beat name | 'in', sound, gain?].
export type SceneType =
  | 'question' | 'episode' | 'host' | 'path' | 'framework' | 'percent' | 'basics' | 'unknown'
  | 'notepad' | 'item' | 'accounts' | 'access' | 'devices' | 'example' | 'connect' | 'lateral'
  | 'systems' | 'dataAsset' | 'dataAccess' | 'thirdParty' | 'breach' | 'summary' | 'nextEp'
  | 'mistakes' | 'outro' | 'roadmap';
export type Cue = [string, SfxName, number?];
export type Scene = {
  type: SceneType; s: Anchor; e: Anchor; full?: boolean; hideCaptions?: boolean;
  beats?: Record<string, Anchor>; props?: Record<string, string | number>; cues?: Cue[];
};

export const scenes: Scene[] = [
  {type: 'question', s: at('01', 0.05), e: at('01', 4.9),
    beats: {q: at('01', 1.2), a: at('01', 3.96), b: at('01', 4.44)},
    cues: [['in', 'glassswipe'], ['q', 'tonal', 0.8], ['a', 'tap'], ['b', 'tap', 0.9]]},
  {type: 'episode', s: at('01', 4.96), e: at('01', 9.36),
    beats: {badge: at('01', 5.72), title: at('01', 6.78), az: at('01', 8.3)},
    cues: [['badge', 'riser', 0.7], ['title', 'deephit', 0.8], ['title', 'shimmer', 0.7], ['az', 'sweep', 0.7]]},
  {type: 'host', s: at('01', 9.4), e: at('01', 11.66),
    beats: {name: at('01', 9.54), build: at('01', 11.72)},
    cues: [['name', 'cardslide'], ['build', 'mech'], ['build', 'snap', 0.8]]},
  // Series roadmap (the 11 axes) while she describes what the series covers.
  {type: 'roadmap', s: at('01', 11.7), e: at('01', 16.7), full: true,
    beats: {list: at('01', 11.72), basics: at('01', 13.42), response: at('01', 14.6), continuity: at('01', 15.72)},
    cues: [['in', 'glassswipe'], ['list', 'cardslide'], ['basics', 'tonal', 0.5], ['basics', 'sparkle', 0.6], ['response', 'blip'], ['continuity', 'notify', 0.7]]},
  {type: 'framework', s: at('01', 16.76), e: at('01', 19.5),
    beats: {card: at('01', 17.26), std: at('01', 18.54)},
    cues: [['card', 'cardflip'], ['std', 'glasstap']]},
  {type: 'percent', s: at('01', 19.54), e: at('02', 2.36), hideCaptions: true,
    beats: {care: at('01', 19.58), none: at('02', 0.0), num: at('02', 1.42), strike: at('02', 1.9)},
    cues: [['care', 'rwhoosh'], ['num', 'tonal'], ['strike', 'dclick'], ['strike', 'downlifter', 0.6]]},
  {type: 'basics', s: at('02', 2.42), e: at('02', 7.9),
    beats: {q: at('02', 3.04), title: at('02', 5.46)},
    cues: [['q', 'tap', 0.8], ['title', 'deephit', 0.7], ['title', 'sparkle', 0.7]]},
  {type: 'unknown', s: at('02', 7.96), e: at('02', 12.96), full: true,
    beats: {scan: at('02', 8.3), hidden: at('02', 9.56), x1: at('02', 10.62), x2: at('02', 11.2)},
    cues: [['in', 'rwhoosh'], ['in', 'thump', 0.6], ['scan', 'scan'], ['hidden', 'blip'], ['x1', 'dclick'], ['x2', 'dclick', 0.9]]},
  {type: 'notepad', s: at('02', 13.0), e: at('02', 15.12),
    beats: {pad: at('02', 13.56), pen: at('02', 13.92), write: at('02', 14.3)},
    cues: [['pad', 'cardslide'], ['pen', 'pop'], ['write', 'mech', 0.6]]},
  // ---- the six assets
  {type: 'item', s: at('02', 15.16), e: at('02', 18.3), props: {n: 1, title: 'الحسابات والهوية', icon: 'user'},
    beats: {title: at('02', 16.34)}, cues: [['in', 'riser', 0.8], ['title', 'subhit', 0.38], ['title', 'tonal', 0.35]]},
  {type: 'accounts', s: at('02', 18.34), e: at('03', 1.24),
    beats: {mail: at('02', 18.7), admin: at('03', 0.0), all: at('03', 0.42)},
    cues: [['mail', 'pop'], ['admin', 'bubble'], ['all', 'snap']]},
  {type: 'access', s: at('03', 1.28), e: at('03', 9.84),
    beats: {who: at('03', 2.1), gate: at('03', 4.44), perm: at('03', 5.66), more: at('03', 6.8), warn: at('03', 8.36)},
    cues: [['who', 'tap'], ['gate', 'glasstap'], ['perm', 'sweep', 0.7], ['more', 'tonal', 0.6], ['warn', 'notify', 0.8]]},
  {type: 'item', s: at('03', 9.9), e: at('03', 13.66), props: {n: 2, title: 'الأجهزة', icon: 'laptop'},
    beats: {title: at('03', 10.7)}, cues: [['in', 'riser', 0.8], ['title', 'subhit', 0.38], ['title', 'shimmer', 0.5]]},
  {type: 'devices', s: at('03', 13.66), e: at('03', 19.04), full: true,
    beats: {gaps: at('03', 14.84), one: at('03', 15.94), spread: at('03', 17.24)},
    cues: [['in', 'glassswipe'], ['gaps', 'scan'], ['one', 'dclick'], ['spread', 'thump', 0.7], ['spread', 'resonance', 0.6]]},
  {type: 'example', s: at('03', 19.06), e: at('04', 1.88),
    beats: {ex: at('03', 19.52), name: at('04', 0.76)},
    cues: [['ex', 'tap'], ['name', 'cardflip']]},
  {type: 'item', s: at('04', 1.94), e: at('04', 4.66), props: {n: 3, title: 'الشبكات وطرق الدخول', icon: 'network'},
    beats: {title: at('04', 2.8)}, cues: [['in', 'riser', 0.8], ['title', 'subhit', 0.38], ['title', 'tonal', 0.35]]},
  {type: 'connect', s: at('04', 4.74), e: at('04', 9.72),
    beats: {how: at('04', 5.92), open: at('04', 8.12), closed: at('04', 8.9)},
    cues: [['how', 'blip'], ['open', 'glasstap'], ['closed', 'snap']]},
  {type: 'lateral', s: at('04', 9.72), e: at('04', 16.72), full: true,
    beats: {breach: at('04', 10.4), attacker: at('04', 12.84), spread: at('04', 13.64), q: at('04', 15.26)},
    cues: [['in', 'rwhoosh'], ['breach', 'thump', 0.8], ['attacker', 'scan'], ['spread', 'sweep', 0.8], ['q', 'tonal', 0.7]]},
  {type: 'item', s: at('04', 16.76), e: at('04', 18.96), props: {n: 4, title: 'البرامج والأنظمة', icon: 'apps'},
    beats: {title: at('04', 17.54)}, cues: [['in', 'riser', 0.8], ['title', 'subhit', 0.38], ['title', 'sparkle', 0.5]]},
  {type: 'systems', s: at('04', 19.0), e: at('05', 9.8),
    beats: {list: at('04', 19.76), write: at('05', 1.52), stop: at('05', 5.62), day: at('05', 6.44), boom: at('05', 7.9), protect: at('05', 8.66)},
    cues: [['list', 'cardslide'], ['write', 'mech', 0.6], ['stop', 'dclick'], ['day', 'tick'], ['boom', 'deephit', 0.8], ['protect', 'shimmer', 0.7]]},
  {type: 'item', s: at('05', 9.86), e: at('05', 12.18), props: {n: 5, title: 'البيانات', icon: 'db'},
    beats: {title: at('05', 11.14)}, cues: [['in', 'riser', 0.8], ['title', 'subhit', 0.38], ['title', 'tonal', 0.35]]},
  {type: 'dataAsset', s: at('05', 12.2), e: at('05', 16.02),
    beats: {asset: at('05', 13.48), most: at('05', 14.44)},
    cues: [['asset', 'glasstap'], ['most', 'sparkle'], ['most', 'tonal', 0.6]]},
  {type: 'dataAccess', s: at('05', 16.04), e: at('06', 0.3),
    beats: {who: at('05', 16.94), restore: at('05', 18.46), loss: at('05', 19.96)},
    cues: [['who', 'tap'], ['restore', 'sweep', 0.7], ['loss', 'dclick']]},
  {type: 'item', s: at('06', 0.34), e: at('06', 4.86), props: {n: 6, title: 'الخدمات والجهات الخارجية', icon: 'cloud'},
    beats: {title: at('06', 1.62), tp: at('06', 3.78)}, cues: [['in', 'riser', 0.8], ['title', 'subhit', 0.38], ['tp', 'cardflip', 0.8]]},
  {type: 'thirdParty', s: at('06', 4.92), e: at('06', 13.2),
    beats: {host: at('06', 5.12), mail: at('06', 6.08), which: at('06', 10.1)},
    cues: [['host', 'pop'], ['mail', 'bubble'], ['which', 'scan', 0.8]]},
  {type: 'breach', s: at('06', 13.28), e: at('06', 18.12), full: true,
    beats: {many: at('06', 14.02), start: at('06', 15.7), ext: at('06', 17.04)},
    cues: [['in', 'rwhoosh'], ['many', 'thump', 0.7], ['start', 'sweep', 0.8], ['ext', 'deephit', 0.7]]},
  {type: 'summary', s: at('06', 18.18), e: at('07', 4.4),
    beats: {list: at('06', 18.6), basics: at('06', 19.04), notall: at('07', 0.52), rely: at('07', 2.68)},
    cues: [['list', 'cardslide'], ['basics', 'snap'], ['notall', 'tap'], ['rely', 'sparkle', 0.7]]},
  {type: 'nextEp', s: at('07', 4.44), e: at('07', 8.16),
    beats: {basics: at('07', 5.6), next: at('07', 6.22)},
    cues: [['basics', 'tap', 0.8], ['next', 'cardflip'], ['next', 'shimmer', 0.6]]},
  {type: 'mistakes', s: at('07', 8.2), e: at('07', 15.0), full: true,
    beats: {title: at('07', 8.94), simple: at('07', 11.24), big: at('07', 13.3)},
    cues: [['in', 'rwhoosh'], ['title', 'deephit', 0.8], ['simple', 'glasstap'], ['big', 'thump', 0.8], ['big', 'resonance', 0.5]]},
  {type: 'outro', s: at('07', 15.04), e: at('07', 17.97), hideCaptions: true,
    beats: {wait: at('07', 15.04), bye: at('07', 16.68)},
    cues: [['wait', 'air'], ['bye', 'tonal', 0.8], ['bye', 'shimmer', 0.7]]},
];

// The series' axes (title, number of episodes) shown by the roadmap scene.
export const seriesAxes: [string, string][] = [
  ['أساسيات حماية الشركة', '1'],
  ['أخطاء إدارية وتقنية شائعة', '1'],
  ['الهجمات الحديثة (التصيّد الذكي + Deepfake)', '2'],
  ['حماية الهويات السحابية والحسابات والبيانات', '2'],
  ['أمن نقاط النهاية والعمل عن بعد', '1'],
  ['الثغرات المتقدمة + Zero-day + الموردين', '2'],
  ['التوعية + الامتثال + أمن أدوات الذكاء الاصطناعي', '2'],
  ['المراقبة واكتشاف الأنشطة المشبوهة', '1'],
  ['الاستجابة للحوادث والتعافي', '3'],
  ['Red / Blue / Purple Team + قياس النضج', '2'],
  ['التأمين السيبراني + قصص حوادث حقيقية', '2–3'],
];

// Asset tracker HUD (6 segments) shown while the six assets are being listed.
export const tracker = {
  s: at('02', 15.16), e: at('06', 18.18),
  steps: [at('02', 15.16), at('03', 9.9), at('04', 1.94), at('04', 16.76), at('05', 9.86), at('06', 0.34)],
};

// ---------------------------------------------------------------- sound design (no music)
export type SfxName =
  | 'whoosh' | 'air' | 'rwhoosh' | 'riser' | 'downlifter' | 'impact' | 'deephit' | 'thump' | 'subhit'
  | 'click' | 'dclick' | 'tap' | 'tick' | 'glasstap' | 'shimmer' | 'glassswipe' | 'pop' | 'bubble'
  | 'sweep' | 'cardslide' | 'cardflip' | 'snap' | 'sparkle' | 'scan' | 'blip' | 'cam' | 'mech'
  | 'resonance' | 'notify' | 'tonal';
// Camera moves between compositions rotate through these (never the same twice in a row).
export const CAMERA_SOUNDS: SfxName[] = ['cam', 'air', 'whoosh', 'glassswipe'];
// Master SFX level against the voice (voice normalised to -14 LUFS).
export const SFX_GAIN = 0.28;
