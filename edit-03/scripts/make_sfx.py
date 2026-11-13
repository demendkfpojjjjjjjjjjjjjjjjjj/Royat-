"""Synthesize a layered, formal sound-design kit (no music) into public/sfx/.

whoosh      soft band-passed air sweep            titles / elements entering
air         long, very soft air movement           elements exiting, gentle moves
rwhoosh     reverse whoosh (swells into the cut)    before some transitions
riser       subtle filtered riser + faint tone      before an important reveal
impact      gentle mid impact with soft tail        a title/card landing
lowimpact   deep but soft sub drop                  important section changes
click       soft UI click                           highlighting a word
tick        tiny UI tick                            list items / counters
pop         light bubble pop                        icons and small elements
sweep       smooth digital sweep (tonal glide)      3D card / panel moves
cam         subtle camera-move air (low, wide)      noticeable zoom / push / pull
"""
import pathlib, wave
import numpy as np

SR = 48000
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(11)


def save(name, x, peak):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    n = int(0.004 * SR)
    ramp = np.linspace(0, 1, n) if x.ndim == 1 else np.linspace(0, 1, n)[:, None]
    x[:n] *= ramp; x[-n:] *= ramp[::-1]
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def lp(x, fc):
    fc = np.broadcast_to(fc, x.shape)
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)):
        a = np.exp(-2 * np.pi * fc[i] / SR); acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def air_sweep(dur, f0, f1, shape, hp=250, seed_shift=0):
    t = t_(dur); u = t / dur
    noise = np.random.default_rng(11 + seed_shift).standard_normal(len(t))
    y = lp(noise, f0 * (f1 / f0) ** u)
    y = y - lp(y, hp)
    return y * shape(u)


def stereo_wide(x, delay_ms=9):
    d = int(delay_ms * SR / 1000)
    r = np.concatenate([np.zeros(d), x[:-d]])
    return np.stack([x, 0.85 * r + 0.15 * x], 1)


save("whoosh", stereo_wide(air_sweep(0.55, 450, 5200, lambda u: np.sin(np.pi * u) ** 2.2)), 0.42)
save("air", stereo_wide(air_sweep(0.9, 300, 2600, lambda u: np.sin(np.pi * u) ** 1.6, seed_shift=1), 14), 0.30)
rw = air_sweep(0.7, 300, 6000, lambda u: u ** 2.6 * (1 - np.exp(-(1 - u) * 60)), seed_shift=2)
save("rwhoosh", stereo_wide(rw), 0.36)

t = t_(1.3); u = t / 1.3
riser = air_sweep(1.3, 300, 7000, lambda v: v ** 1.8 * (1 - np.exp(-(1 - v) * 40)), seed_shift=3)
tone = np.sin(2 * np.pi * np.cumsum(220 + 440 * u ** 2) / SR) * 0.12 * u ** 2 * (1 - np.exp(-(1 - u) * 40))
save("riser", stereo_wide(riser + tone), 0.30)

t = t_(0.8)
f = 90 + 70 * np.exp(-t * 20)
body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
tr = lp(rng.standard_normal(len(t)), 2400) * np.exp(-t * 55) * 0.7
tail = air_sweep(0.8, 2500, 500, lambda v: np.exp(-v * 5), seed_shift=4) * 0.25
save("impact", stereo_wide(body + tr + tail, 6), 0.50)

t = t_(1.1)
f = 42 + 38 * np.exp(-t * 14)
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.2) * (1 - np.exp(-t * 400))
save("lowimpact", sub + lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 30) * 0.25, 0.55)

t = t_(0.06)
save("click", (np.sin(2 * np.pi * 2300 * t) + 0.35 * np.sin(2 * np.pi * 5200 * t)) * np.exp(-t * 95), 0.30)
t = t_(0.035)
save("tick", np.sin(2 * np.pi * 3600 * t) * np.exp(-t * 160), 0.22)

t = t_(0.12)
f = 430 + 470 * np.exp(-t * 45)
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32) * (1 - np.exp(-t * 900)), 0.36)

t = t_(0.6); u = t / 0.6
glide = 600 * (2400 / 600) ** u
sw = (np.sin(2 * np.pi * np.cumsum(glide) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(glide * 1.505) / SR)) * np.sin(np.pi * u) ** 2 * 0.25
sw += air_sweep(0.6, 800, 6000, lambda v: np.sin(np.pi * v) ** 2, seed_shift=5) * 0.8
save("sweep", stereo_wide(sw, 12), 0.30)

save("cam", stereo_wide(air_sweep(1.0, 180, 1200, lambda v: np.sin(np.pi * v) ** 1.4, hp=80, seed_shift=6), 16), 0.28)
print("sfx kit written to", OUT)

# ---------------------------------------------------------------------------
# Edit 03 additions: a wider, layered kit so no sound repeats too often.
# ---------------------------------------------------------------------------
def env_ad(t, a, d):
    return (1 - np.exp(-t / max(a, 1e-4))) * np.exp(-t / d)


def tone(f, t):
    return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR)


def bell(freqs, dur, decay, amps=None):
    t = t_(dur)
    amps = amps or [1] * len(freqs)
    return sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / (decay * (1 + i * 0.3))) for i, (f, a) in enumerate(zip(freqs, amps)))


# soft downlifter: falling filtered air + falling tone
t = t_(0.9); u = t / 0.9
dl = air_sweep(0.9, 5000, 300, lambda v: (1 - v) ** 1.5 * (1 - np.exp(-v * 40)), seed_shift=7)
dl += tone(700 * (1 - 0.6 * u), t) * 0.08 * (1 - u) ** 2
save("downlifter", stereo_wide(dl), 0.30)

# deep soft hit: low sine + felt transient
t = t_(0.9)
save("deephit", stereo_wide(tone(55 + 50 * np.exp(-t * 16), t) * env_ad(t, 0.004, 0.32) + lp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 40) * 0.3, 5), 0.52)

# low cinematic thump (very soft, short)
t = t_(0.6)
save("thump", tone(48 + 30 * np.exp(-t * 22), t) * env_ad(t, 0.003, 0.18), 0.5)

# subtle bass hit with a hint of tone on top (focal points)
t = t_(1.0)
sub = tone(40 + 24 * np.exp(-t * 10), t) * env_ad(t, 0.006, 0.4) + 0.12 * tone(160, t) * env_ad(t, 0.002, 0.12)
save("subhit", sub, 0.5)

# digital click: two quick ticks
t = t_(0.08)
dc = np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 140)
dc[int(0.028 * SR):] += np.sin(2 * np.pi * 4200 * t[:len(t) - int(0.028 * SR)]) * np.exp(-t[:len(t) - int(0.028 * SR)] * 170) * 0.7
save("dclick", dc, 0.26)

# UI tap: rounded mid tap
t = t_(0.07)
save("tap", tone(1200 + 600 * np.exp(-t * 90), t) * env_ad(t, 0.0015, 0.018), 0.30)

# glass tap: bright inharmonic bell, short
save("glasstap", stereo_wide(bell([2650, 4170, 6020], 0.5, 0.09, [1, 0.5, 0.25]), 7), 0.24)

# glass shimmer: cluster of tiny bells fading in/out
t = t_(1.0)
sh = np.zeros_like(t)
for k, f in enumerate([3100, 3700, 4400, 5200, 6100, 7000]):
    st = int((0.05 + k * 0.09) * SR)
    seg = bell([f, f * 1.51], 1.0 - st / SR, 0.18, [1, 0.3])
    sh[st:st + len(seg)] += seg[:len(sh) - st] * (0.7 - k * 0.06)
save("shimmer", stereo_wide(sh, 11), 0.20)

# glass swipe: airy sweep + glassy ring at the end
gs = air_sweep(0.6, 1200, 9000, lambda v: np.sin(np.pi * v) ** 2, hp=900, seed_shift=8)
ring = np.zeros_like(gs); b = bell([3300, 5000], 0.3, 0.07, [1, 0.4]); ring[-len(b):] += b * 0.5
save("glassswipe", stereo_wide(gs + ring, 10), 0.28)

# bubble pop: rising pitch blip
t = t_(0.1)
save("bubble", tone(380 + 900 * (t / 0.1) ** 1.3, t) * env_ad(t, 0.004, 0.03), 0.30)

# card slide: short paper/glass slide
save("cardslide", stereo_wide(air_sweep(0.32, 2500, 700, lambda v: np.sin(np.pi * v) ** 1.2, hp=500, seed_shift=9) + 0.15 * bell([1800], 0.32, 0.04)), 0.26)

# card flip: two soft flaps
fl = np.zeros(int(0.3 * SR))
for st in (0, int(0.11 * SR)):
    s = air_sweep(0.12, 3000, 900, lambda v: np.sin(np.pi * v) ** 2, hp=700, seed_shift=10 + st)
    fl[st:st + len(s)] += s
save("cardflip", stereo_wide(fl), 0.26)

# magnetic snap: quick pull-in + click
t = t_(0.2)
mag = tone(200 + 900 * (t / 0.2) ** 3, t) * (t / 0.2) ** 2 * 0.4
cl = np.zeros_like(t); c = np.sin(2 * np.pi * 2800 * t_(0.03)) * np.exp(-t_(0.03) * 200); cl[-len(c):] = c
save("snap", mag + cl, 0.28)

# sparkle: rising glitter of short high bells (for gold accents)
t = t_(0.7)
sp = np.zeros_like(t)
for k in range(9):
    st = int(k * 0.06 * SR); f = 4200 + k * 380
    seg = bell([f], 0.25, 0.05)
    sp[st:st + len(seg)] += seg[:len(sp) - st] * (0.5 + 0.06 * k)
save("sparkle", stereo_wide(sp, 13), 0.18)

# digital scan: filtered noise sweep with a soft raster buzz
t = t_(0.8); u = t / 0.8
scan = air_sweep(0.8, 1500, 6000, lambda v: np.sin(np.pi * v) ** 1.5, hp=1200, seed_shift=11)
scan *= 0.6 + 0.4 * (np.sin(2 * np.pi * 38 * t) > 0)
save("scan", stereo_wide(scan, 9), 0.22)

# soft tech blip
t = t_(0.09)
save("blip", tone(1700, t) * env_ad(t, 0.002, 0.03) + 0.4 * tone(2550, t) * env_ad(t, 0.002, 0.02), 0.22)

# soft mechanical movement (gentle servo + clicks)
t = t_(0.7); u = t / 0.7
mech = tone(140 + 60 * u, t) * 0.25 * np.sin(np.pi * u) + lp(rng.standard_normal(len(t)), 1600) * 0.15 * np.sin(np.pi * u)
for st in (0.12, 0.38, 0.6):
    i0 = int(st * SR); c = np.sin(2 * np.pi * 2200 * t_(0.02)) * np.exp(-t_(0.02) * 250); mech[i0:i0 + len(c)] += c * 0.5
save("mech", stereo_wide(mech, 6), 0.22)

# glass resonance: long soft ring
save("resonance", stereo_wide(bell([880, 1320, 2210], 1.6, 0.6, [1, 0.5, 0.25]), 14), 0.16)

# clean notification tone (two-note)
t = t_(0.45)
nt = np.zeros_like(t); a1 = bell([1046], 0.25, 0.08); a2 = bell([1568], 0.3, 0.1)
nt[:len(a1)] += a1; nt[int(0.11 * SR):int(0.11 * SR) + len(a2)] += a2[:len(nt) - int(0.11 * SR)]
save("notify", nt, 0.22)

# short tonal hit for key words (soft pad-like hit, no melody)
t = t_(0.9)
th = (tone(330, t) + 0.6 * tone(495, t) + 0.3 * tone(660, t)) * env_ad(t, 0.01, 0.25)
th += lp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 30) * 0.2
save("tonal", stereo_wide(th, 8), 0.28)
print("edit-03 kit written")
