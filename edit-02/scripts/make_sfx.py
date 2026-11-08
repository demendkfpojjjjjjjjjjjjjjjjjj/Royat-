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
