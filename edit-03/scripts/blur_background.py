"""Light portrait-style background blur.

For every frame of public/clips/source-XX.mp4: segment the person with MediaPipe's
selfie multiclass model, feather + temporally smooth the mask, blur only the background
lightly, and re-encode (audio copied untouched, frame count unchanged) to
public/clips/source-XX.mp4 (the originals are moved to public/clips_sharp/ once).

Usage: python3 scripts/blur_background.py <models-dir> [ids...] [--test]
"""
import pathlib
import shutil
import subprocess
import sys

import cv2
import mediapipe as mp
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODELS = pathlib.Path(sys.argv[1])
args = sys.argv[2:]
TEST = "--test" in args
IDS = [a for a in args if not a.startswith("--")] or [f"0{i}" for i in range(1, 8)]

BLUR_SIGMA = 7.0      # "light" blur of the background (px at 1080x1920)
FEATHER = 21          # mask edge softening (px)
EMA = 0.55            # temporal smoothing of the mask (weight of the current frame)
DILATE = 9            # grow the person mask a little so edges/hands stay sharp

vision = mp.tasks.vision
SHARP = ROOT / "public" / "clips_sharp"


def segmenter():
    return vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=str(MODELS / "selfie_multiclass_256x256.tflite")),
        running_mode=vision.RunningMode.VIDEO, output_confidence_masks=True, output_category_mask=False))


def person_mask(seg, frame, ts, prev):
    h, w = frame.shape[:2]
    r = seg.segment_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)), ts)
    bg = r.confidence_masks[0].numpy_view().astype(np.float32)        # class 0 = background
    m = np.clip(1.0 - bg, 0, 1)
    m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (DILATE, DILATE)))
    m = cv2.GaussianBlur(m, (0, 0), FEATHER / 3)
    if prev is not None:
        m = EMA * m + (1 - EMA) * prev
    return m


def process(sid):
    src = SHARP / f"source-{sid}.mp4"
    dst = ROOT / "public" / "clips" / f"source-{sid}.mp4"
    if not src.exists():
        SHARP.mkdir(exist_ok=True)
        shutil.copy2(dst, src)
    cap = cv2.VideoCapture(str(src))
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    seg = segmenter()
    if TEST:
        out_frames = []
        for i in range(0, 600, 1):
            ok, frame = cap.read()
            if not ok:
                break
            m = person_mask(seg, frame, int(i * 1000 / 30), out_frames[-1][1] if out_frames else None)
            if i in (30, 200, 400):
                bgb = cv2.GaussianBlur(frame, (0, 0), BLUR_SIGMA)
                comp = (frame * m[..., None] + bgb * (1 - m[..., None])).astype(np.uint8)
                out_frames.append((comp, m))
            elif out_frames:
                out_frames[-1] = (out_frames[-1][0], m)
            else:
                out_frames.append((None, m))
        return [c for c, _ in out_frames if c is not None]
    tmp = dst.with_suffix(".tmp.mp4")
    enc = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", "30", "-i", "-",
        "-i", str(src), "-map", "0:v", "-map", "1:a", "-c:a", "copy",
        "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-g", "15", "-movflags", "+faststart", str(tmp),
    ], stdin=subprocess.PIPE)
    prev, i = None, 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        m = person_mask(seg, frame, int(i * 1000 / 30), prev)
        prev = m
        bgb = cv2.GaussianBlur(frame, (0, 0), BLUR_SIGMA)
        comp = (frame.astype(np.float32) * m[..., None] + bgb.astype(np.float32) * (1 - m[..., None])).astype(np.uint8)
        enc.stdin.write(comp.tobytes())
        i += 1
    enc.stdin.close()
    enc.wait()
    tmp.replace(dst)
    print(f"source-{sid}: {i} frames blurred -> {dst.relative_to(ROOT)}", flush=True)


if TEST:
    shots = process(IDS[0])
    cv2.imwrite(str(pathlib.Path("/tmp") / "blur-test.jpg"), np.hstack([cv2.resize(s, (360, 640)) for s in shots]))
    print("test written to analysis/blur-test.jpg")
else:
    for sid in IDS:
        process(sid)
