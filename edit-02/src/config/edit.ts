// ---------------------------------------------------------------------------
// Editorial timeline for "سلسلة تأمين الشركات" (intro episode).
// Every time is in SOURCE seconds of the clip named by its id, so trimming a
// segment re-maps captions, scenes and SFX automatically.
// ---------------------------------------------------------------------------

export type SrcId = '01' | '02' | '03' | '04';
export type Anchor = {src: SrcId; t: number};
export const at = (src: SrcId, t: number): Anchor => ({src, t});

// Kept ranges in playback order. Removed: the filler "وووو" (01 6.44-7.02) and the
// silent pauses. `cam` = digital camera move across the shot: [startScale, endScale].
export type Segment = {src: SrcId; from: number; to: number; cam: [number, number]};
export const segments: Segment[] = [
  {src: '01', from: 0.0, to: 3.0, cam: [1.0, 1.06]},     // slow push-in on the hook
  {src: '01', from: 3.0, to: 6.44, cam: [1.1, 1.08]},    // punch + drift
  {src: '01', from: 7.02, to: 11.3, cam: [1.08, 1.02]},  // (under the full-screen question)
  {src: '01', from: 11.3, to: 15.53, cam: [1.0, 1.15]},  // MANDATORY 12-16s: steady push-in
  {src: '02', from: 0.0, to: 3.64, cam: [1.16, 1.06]},   // pull-out as the idea resolves
  {src: '02', from: 3.66, to: 6.86, cam: [1.04, 1.04]},
  {src: '02', from: 6.86, to: 9.68, cam: [1.04, 1.04]},
  {src: '02', from: 9.7, to: 15.37, cam: [1.12, 1.0]},   // zoom-out to the "big picture"
  {src: '03', from: 0.0, to: 1.06, cam: [1.0, 1.0]},
  {src: '03', from: 1.4, to: 4.24, cam: [1.0, 1.08]},
  {src: '03', from: 4.24, to: 10.52, cam: [1.1, 1.03]},
  {src: '03', from: 10.52, to: 15.93, cam: [1.02, 1.02]},
  {src: '04', from: 0.0, to: 3.72, cam: [1.05, 1.0]},
  {src: '04', from: 4.12, to: 9.4, cam: [1.0, 1.1]},     // push-in to "تحديدًا لك"
  {src: '04', from: 9.76, to: 14.0, cam: [1.06, 1.0]},
];

// Captions: short chunks revealed word by word. `hi` = calm-yellow words.
// `uncertain` = not fully audible (listed in NOTES.md).
export type Caption = {s: Anchor; e: Anchor; text: string; hi?: string[]; uncertain?: boolean};
export const captions: Caption[] = [
  {s: at('01', 0.0), e: at('01', 1.22), text: 'لأن أغلب الشركات أصبح'},
  {s: at('01', 2.98), e: at('01', 4.58), text: 'من أنظمة محاسبية وقواعد', hi: ['محاسبية']},
  {s: at('01', 4.58), e: at('01', 6.44), text: 'بيانات إلى الخدمات السحابية', hi: ['السحابية']},
  {s: at('01', 7.02), e: at('01', 8.92), text: 'لكن هل تطورت وسائل حماية', hi: ['حماية']},
  {s: at('01', 8.92), e: at('01', 10.12), text: 'هذه الشركات بنفس'},
  {s: at('01', 10.12), e: at('01', 11.3), text: 'سرعة اعتمادها على التقنية؟', hi: ['سرعة']},
  {s: at('01', 11.3), e: at('01', 12.04), text: 'التقنية؟'},
  {s: at('01', 12.04), e: at('01', 13.44), text: 'الحقيقة إنه أكثر الشركات', hi: ['الحقيقة']},
  {s: at('01', 13.44), e: at('01', 14.9), text: 'مهتمة إنها تطوّر أنظمة', hi: ['تطوّر']},
  {s: at('01', 14.9), e: at('02', 1.0), text: 'وتوسّع خدماتها، بس', hi: ['وتوسّع']},
  {s: at('02', 3.66), e: at('02', 5.1), text: 'ومش مدركة للمخاطر', hi: ['للمخاطر']},
  {s: at('02', 5.1), e: at('02', 6.84), text: 'اللي بتواجهها أو كيف تستعد لها'},
  {s: at('02', 6.86), e: at('02', 8.22), text: 'فغالبًا ما بيكتشفوا'},
  {s: at('02', 8.22), e: at('02', 9.68), text: 'حجم الكارثة إلا بعد ما تحصل', hi: ['الكارثة']},
  {s: at('02', 9.7), e: at('02', 11.36), text: 'من هنا جيت لكم بفكرة', hi: ['بفكرة']},
  {s: at('02', 11.36), e: at('02', 12.78), text: 'سلسلة عظيمة لكم'},
  {s: at('02', 12.78), e: at('02', 14.04), text: 'يا أصحاب الشركات', hi: ['الشركات']},
  {s: at('02', 14.04), e: at('03', 0.32), text: 'وهي سلسلة تأمين الشركات', hi: ['تأمين']},
  {s: at('03', 4.24), e: at('03', 5.44), text: 'لكن المعرفة الصحيحة', hi: ['المعرفة']},
  {s: at('03', 5.44), e: at('03', 6.72), text: 'وتطبيق وسائل الحماية', hi: ['الحماية']},
  {s: at('03', 6.72), e: at('03', 7.76), text: 'والاستعداد لها'},
  {s: at('03', 7.76), e: at('03', 9.76), text: 'ممكن تغنيك عن مخاطرها', hi: ['تغنيك']},
  {s: at('03', 10.52), e: at('03', 12.36), text: 'في هذه السلسلة بغطي ثلاث محاور', hi: ['ثلاث']},
  {s: at('03', 12.36), e: at('03', 14.04), text: 'من إطار المعهد الأمريكي'},
  {s: at('03', 14.04), e: at('03', 15.22), text: 'للتقنية والمعايير'},
  {s: at('03', 15.22), e: at('04', 1.16), text: 'لإدارة المخاطر في المؤسسات', uncertain: true},
  {s: at('04', 1.16), e: at('04', 3.72), text: 'اللي هم Protect, Detect and Recovery', hi: ['Protect,', 'Detect', 'Recovery']},
  {s: at('04', 4.12), e: at('04', 5.28), text: 'فإذا انت صاحب شركة', hi: ['صاحب']},
  {s: at('04', 5.28), e: at('04', 7.5), text: 'وتشتغل بإدارة الأنظمة داخل الشركة', hi: ['الأنظمة']},
  {s: at('04', 9.76), e: at('04', 11.18), text: 'فتابعوا الصفحة عشان', hi: ['فتابعوا']},
  {s: at('04', 11.18), e: at('04', 12.9), text: 'تكونوا أول بأول داخل هذه السلسلة', hi: ['بأول']},
];

// Kinetic keyword moments (reference: small words around one big styled word).
// `font`: 'elegant' (Amiri, like the reference's serif) or 'display' (Kufi, bold).
export type Kinetic = {
  s: Anchor; e: Anchor; top?: string; topAt?: Anchor; big: string; bigAt: Anchor;
  bottom?: string; bottomAt?: Anchor; font: 'elegant' | 'display';
};
export const kinetics: Kinetic[] = [
  {s: at('01', 1.22), e: at('01', 2.98), top: 'اعتمادها الكلي على', big: 'التقنية', bigAt: at('01', 2.34), font: 'elegant'},
  {s: at('02', 1.0), e: at('02', 3.64), top: 'ما تعطي', big: 'الأمن السيبراني', bigAt: at('02', 1.52), bottom: 'الاهتمام الكافي', bottomAt: at('02', 2.4), font: 'display'},
  {s: at('04', 7.5), e: at('04', 9.4), top: 'هذه السلسلة بتكون', big: 'تحديدًا لك', bigAt: at('04', 8.52), font: 'elegant'},
  {s: at('04', 12.9), e: at('04', 14.0), big: 'ودمتم بخير', bigAt: at('04', 12.94), font: 'elegant'},
];

// Explainer scenes. 'full' scenes replace the frame; 'overlay' scenes keep the
// speaker visible and place elements in the free wall area / beside the body.
export type SceneType =
  | 'icons' | 'race' | 'reality' | 'risk' | 'idea' | 'series'
  | 'percent' | 'pillars' | 'framework' | 'pdr' | 'audience' | 'follow';
export type Scene = {
  type: SceneType; s: Anchor; e: Anchor; full: boolean; hideCaptions?: boolean;
  beats?: Record<string, Anchor>;
};
export const scenes: Scene[] = [
  {type: 'icons', s: at('01', 2.98), e: at('01', 6.44), full: false,
    beats: {a: at('01', 3.16), b: at('01', 4.18), c: at('01', 5.4)}},
  {type: 'race', s: at('01', 7.02), e: at('01', 11.3), full: true,
    beats: {bars: at('01', 7.6), slow: at('01', 8.52), q: at('01', 10.12)}},
  // MANDATORY window (output 00:12 -> 00:16 lies inside this scene).
  {type: 'reality', s: at('01', 11.3), e: at('02', 1.6), full: false,
    beats: {title: at('01', 12.04), sub: at('01', 12.58), left: at('01', 14.1), right: at('01', 14.9), dim: at('02', 0.82)}},
  {type: 'risk', s: at('02', 3.66), e: at('02', 9.68), full: true, hideCaptions: true,
    beats: {risk: at('02', 4.38), ready: at('02', 5.82), disaster: at('02', 8.22), after: at('02', 8.92)}},
  {type: 'idea', s: at('02', 9.7), e: at('02', 14.04), full: false,
    beats: {bulb: at('02', 10.74), owners: at('02', 12.94)}},
  {type: 'series', s: at('02', 14.04), e: at('03', 1.06), full: true,
    beats: {title: at('02', 14.5)}},
  {type: 'percent', s: at('03', 1.4), e: at('03', 4.7), full: false, hideCaptions: true,
    beats: {top: at('03', 2.52), count: at('03', 3.3), strike: at('03', 4.0)}},
  {type: 'pillars', s: at('03', 4.24), e: at('03', 10.52), full: false,
    beats: {a: at('03', 4.48), b: at('03', 5.44), c: at('03', 6.72), shield: at('03', 8.32)}},
  {type: 'framework', s: at('03', 10.52), e: at('04', 1.16), full: true, hideCaptions: true,
    beats: {three: at('03', 11.54), doc: at('03', 12.52), manage: at('03', 15.22)}},
  {type: 'pdr', s: at('04', 1.16), e: at('04', 3.72), full: false,
    beats: {p: at('04', 1.74), d: at('04', 2.48), r: at('04', 3.22)}},
  {type: 'audience', s: at('04', 4.12), e: at('04', 7.5), full: false,
    beats: {owner: at('04', 4.4), admin: at('04', 5.74)}},
  {type: 'follow', s: at('04', 9.76), e: at('04', 12.9), full: false,
    beats: {tap: at('04', 10.3), bell: at('04', 11.2)}},
];

// Sound design (no music). Each cue is placed on the frame of the motion it supports.
// Kinetic keywords also get an automatic soft whoosh on their big word.
export type SfxName =
  | 'whoosh' | 'air' | 'rwhoosh' | 'riser' | 'impact' | 'lowimpact'
  | 'click' | 'tick' | 'pop' | 'sweep' | 'cam';
export const sfx: {at: Anchor; name: SfxName; gain?: number; lead?: number}[] = [
  // hook
  {at: at('01', 0.05), name: 'cam', gain: 0.8},
  {at: at('01', 3.16), name: 'pop'}, {at: at('01', 4.18), name: 'pop'}, {at: at('01', 5.4), name: 'pop'},
  // full-screen question
  {at: at('01', 7.02), name: 'rwhoosh', lead: 18},
  {at: at('01', 7.02), name: 'impact', gain: 0.7},
  {at: at('01', 7.6), name: 'sweep', gain: 0.8},
  {at: at('01', 8.52), name: 'tick'},
  {at: at('01', 10.12), name: 'pop'},
  {at: at('01', 11.3), name: 'air'},
  // MANDATORY 12-16s: graded build — riser into the title, impact on it, then sweeps on each 3D card
  {at: at('01', 12.04), name: 'riser', lead: 36, gain: 0.9},
  {at: at('01', 12.04), name: 'lowimpact', gain: 0.75},
  {at: at('01', 12.04), name: 'click', gain: 0.8},
  {at: at('01', 12.58), name: 'whoosh', gain: 0.7},
  {at: at('01', 13.2), name: 'cam', gain: 0.7},
  {at: at('01', 14.1), name: 'sweep'},
  {at: at('01', 14.3), name: 'tick', gain: 0.8},
  {at: at('01', 14.9), name: 'sweep', gain: 0.9},
  {at: at('01', 15.1), name: 'tick', gain: 0.8},
  {at: at('02', 0.82), name: 'air', gain: 0.8},
  // risk
  {at: at('02', 3.66), name: 'rwhoosh', lead: 18},
  {at: at('02', 3.66), name: 'lowimpact', gain: 0.6},
  {at: at('02', 4.38), name: 'whoosh', gain: 0.7},
  {at: at('02', 5.82), name: 'click', gain: 0.8},
  {at: at('02', 8.22), name: 'impact', gain: 0.85},
  {at: at('02', 8.92), name: 'air', gain: 0.7},
  // idea + series title
  {at: at('02', 9.7), name: 'cam', gain: 0.7},
  {at: at('02', 10.74), name: 'pop'},
  {at: at('02', 12.94), name: 'whoosh', gain: 0.7},
  {at: at('02', 14.04), name: 'riser', lead: 30, gain: 0.7},
  {at: at('02', 14.5), name: 'lowimpact', gain: 0.85},
  {at: at('02', 14.5), name: 'impact', gain: 0.6},
  // 100%
  {at: at('03', 1.4), name: 'air', gain: 0.7},
  {at: at('03', 2.52), name: 'whoosh', gain: 0.6},
  {at: at('03', 3.3), name: 'sweep', gain: 0.7},
  {at: at('03', 4.0), name: 'click'},
  // pillars
  {at: at('03', 4.48), name: 'pop'}, {at: at('03', 5.44), name: 'pop'}, {at: at('03', 6.72), name: 'pop'},
  {at: at('03', 8.32), name: 'impact', gain: 0.6},
  // framework
  {at: at('03', 10.52), name: 'rwhoosh', lead: 18},
  {at: at('03', 11.54), name: 'lowimpact', gain: 0.7},
  {at: at('03', 12.52), name: 'sweep', gain: 0.8},
  {at: at('03', 15.22), name: 'tick'},
  // Protect / Detect / Recovery
  {at: at('04', 1.16), name: 'air', gain: 0.7},
  {at: at('04', 1.74), name: 'sweep', gain: 0.7}, {at: at('04', 2.48), name: 'sweep', gain: 0.7}, {at: at('04', 3.22), name: 'sweep', gain: 0.7},
  // audience + follow
  {at: at('04', 4.12), name: 'cam', gain: 0.6},
  {at: at('04', 4.4), name: 'pop'}, {at: at('04', 5.74), name: 'pop'},
  {at: at('04', 10.3), name: 'click'},
  {at: at('04', 11.2), name: 'tick'}, {at: at('04', 11.35), name: 'tick', gain: 0.8},
];

// Master SFX level against the voice (voice is normalised to -14 LUFS).
export const SFX_GAIN = 0.3;
