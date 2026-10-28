"""Synthesize soft, formal UI sound effects (no music) into public/sfx/.

whoosh  - band-passed noise sweep, for titles/cards entering
click   - short soft tick, for highlighting a word or point
impact  - low muted thump, for section changes
pop     - gentle sine bubble, for icons/cards popping in
swish   - very short airy transition for cuts
"""
import pathlib, wave
import numpy as np

SR = 48000
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def save(name, x, peak=0.5):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    # tiny fades so nothing clicks at the edges
    n = int(0.004 * SR)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    st = np.stack([x, x], 1)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y


def sweep_noise(dur, f0, f1, env):
    t = np.arange(int(dur * SR)) / SR
    noise = rng.standard_normal(len(t))
    # time-varying low-pass via block processing, then remove the lows
    out = np.zeros_like(noise); acc = 0.0
    fc = f0 * (f1 / f0) ** (t / dur)
    for i in range(len(t)):
        a = np.exp(-2 * np.pi * fc[i] / SR)
        acc = (1 - a) * noise[i] + a * acc; out[i] = acc
    out = out - onepole_lp(out, 250)
    return out * env(t / dur)


# soft whoosh: rises then falls, 0.55s
save("whoosh", sweep_noise(0.55, 400, 5200, lambda u: np.sin(np.pi * u) ** 2.2), 0.42)
# short swish for cuts, 0.28s
save("swish", sweep_noise(0.28, 900, 6500, lambda u: np.sin(np.pi * u) ** 3), 0.30)

# subtle click: damped 2.4k + 5k partials, 60ms
t = np.arange(int(0.06 * SR)) / SR
click = (np.sin(2 * np.pi * 2400 * t) + 0.4 * np.sin(2 * np.pi * 5100 * t)) * np.exp(-t * 90)
save("click", click, 0.33)

# gentle pop: pitch drops 900->420 Hz, 120ms
t = np.arange(int(0.12 * SR)) / SR
f = 420 + 480 * np.exp(-t * 45)
pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32) * (1 - np.exp(-t * 900))
save("pop", pop, 0.38)

# light impact: 70Hz body + soft noise transient, 0.7s
t = np.arange(int(0.7 * SR)) / SR
f = 58 + 40 * np.exp(-t * 18)
body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
tr = onepole_lp(rng.standard_normal(len(t)), 1800) * np.exp(-t * 60) * 0.6
save("impact", body + tr, 0.55)
print("sfx written to", OUT)
