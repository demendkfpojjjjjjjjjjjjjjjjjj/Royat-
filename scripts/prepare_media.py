"""Clean audio + light video enhancement for each source clip.

Outputs H.264/AAC files into public/clips/ so Remotion (Chromium) can decode them.
All tweakable values live in the two chains below.
"""
import subprocess, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = ["source-01", "source-02", "source-03", "source-04"]

# Natural look: light denoise, gentle sharpening, mild contrast. No face filters.
VIDEO_CHAIN = ",".join([
    "scale=1080:1920:flags=lanczos,setsar=1",
    "hqdn3d=1.2:1.2:3:3",
    "unsharp=5:5:0.35:5:5:0.0",
    "eq=contrast=1.05:brightness=0.005:saturation=0.97:gamma=1.0",
])

# Voice: rumble cut, denoise, de-mud, presence, de-ess, light comp, loudness, limiter.
AUDIO_CHAIN = ",".join([
    "highpass=f=85",
    "lowpass=f=13000",
    "afftdn=nr=14:nf=-42:tn=1",
    "equalizer=f=220:t=q:w=1.0:g=-2.5",
    "equalizer=f=3200:t=q:w=1.2:g=2.0",
    "equalizer=f=9000:t=h:w=0.7:g=-1.0",
    "deesser=i=0.35",
    "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=160:makeup=1.5",
    "loudnorm=I=-16:TP=-2:LRA=7",
    "alimiter=limit=0.84:level=false",
    "aresample=48000",
])

for name in SOURCES:
    src = ROOT / "assets" / f"{name}.mp4"
    dst = ROOT / "public" / "clips" / f"{name}.mp4"
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-vf", VIDEO_CHAIN, "-af", AUDIO_CHAIN,
        "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-r", "30",
        "-g", "15",  # short GOP: fast, accurate seeking for jump cuts
        "-c:a", "aac", "-b:a", "256k", "-ac", "2",
        "-movflags", "+faststart", str(dst),
    ], check=True)
    print("prepared", dst.relative_to(ROOT))
