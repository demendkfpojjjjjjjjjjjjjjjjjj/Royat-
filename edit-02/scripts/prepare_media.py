"""Voice cleanup + light, natural video enhancement for each source clip.

Outputs H.264/AAC into public/clips/ (Chromium can't decode the HEVC originals).
"""
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = ["source-01", "source-02", "source-03", "source-04"]

# Natural look: light temporal denoise, gentle sharpening, slightly calmer saturation.
# The face sticker / person are untouched (no face filters, no smoothing).
VIDEO_CHAIN = ",".join([
    "scale=1080:1920:flags=lanczos,setsar=1",
    "hqdn3d=1.4:1.4:3.5:3.5",
    "unsharp=5:5:0.3:5:5:0.0",
    "eq=contrast=1.05:saturation=0.93:gamma=1.0",
])

# "Pro mic" voice chain (identity/pitch untouched):
#   rumble cut -> FFT denoise -> NLM denoise (hiss) -> gentle expander (room tail between words)
#   -> de-box EQ -> presence/air -> de-esser -> 3:1 comp -> -14 LUFS (mobile) -> -1.5 dBTP limiter
AUDIO_CHAIN = ",".join([
    "highpass=f=90:poles=2",
    "lowpass=f=14000",
    "afftdn=nr=16:nf=-44:tn=1",
    "anlmdn=s=0.0007:p=0.002:r=0.006",
    "equalizer=f=320:t=q:w=1.1:g=-3",
    "equalizer=f=140:t=q:w=1.0:g=1.2",
    "equalizer=f=3000:t=q:w=1.3:g=2.2",
    "equalizer=f=10000:t=h:w=0.7:g=1.2",
    "deesser=i=0.4:m=0.5:f=0.5",
    "acompressor=threshold=-22dB:ratio=3:attack=6:release=150:makeup=2",
    # mild downward expander after the comp: keeps pauses quiet instead of lifted
    "agate=threshold=0.02:ratio=2:range=0.2:attack=5:release=160:knee=3",
])
# Two-pass *linear* loudnorm (no dynamic pumping), then a true-peak safety limiter.
TARGET = "I=-14:TP=-1.5:LRA=7"
LIMIT = "alimiter=limit=0.84:level=false,aresample=48000"

def measure(src):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(src), "-vn", "-af",
                        f"{AUDIO_CHAIN},loudnorm={TARGET}:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    j = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
    return (f"loudnorm={TARGET}:linear=true:measured_I={j['input_i']}:measured_TP={j['input_tp']}"
            f":measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}")


for name in SOURCES:
    src = ROOT / "assets" / f"{name}.mp4"
    dst = ROOT / "public" / "clips" / f"{name}.mp4"
    audio = f"{AUDIO_CHAIN},{measure(src)},{LIMIT}"
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-vf", VIDEO_CHAIN, "-af", audio,
        "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-r", "30", "-g", "15",
        "-c:a", "aac", "-b:a", "256k", "-ac", "2", "-movflags", "+faststart", str(dst),
    ], check=True)
    print("prepared", dst.relative_to(ROOT))
