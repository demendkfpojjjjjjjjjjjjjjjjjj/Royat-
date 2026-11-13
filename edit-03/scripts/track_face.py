"""Face tracking for the privacy flower.

For every frame of every source clip, find the face with MediaPipe Face Landmarker
(478 landmarks), fall back to the BlazeFace detector when landmarks fail, fill gaps,
smooth, and write public/track/source-XX.json:

    {"fps": 30, "w": 1080, "h": 1920, "frames": [[cx, cy, d, rot], ...]}

cx, cy  = centre of the flower in source pixels
d       = flower diameter in source pixels (face size x SAFETY + motion margin)
rot     = head roll in degrees (the flower turns with the head)

Usage: python3 scripts/track_face.py <models-dir> [source ids...]
Models: face_landmarker.task, blaze_face_short_range.tflite (MediaPipe model zoo).
"""
import json
import pathlib
import sys

import cv2
import mediapipe as mp
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODELS = pathlib.Path(sys.argv[1])
IDS = sys.argv[2:] or [f"0{i}" for i in range(1, 8)]

# Coverage: the flower diameter relative to the face-oval size. The face oval from the
# landmarks spans forehead-to-chin; 1.45x adds a safe margin on every side.
SAFETY = 1.3
MOTION_GAIN = 2.5      # extra px of diameter per px/frame of head speed
MIN_D = 260            # never smaller than this (px, source scale)

BaseOptions = mp.tasks.BaseOptions
vision = mp.tasks.vision


def make_landmarker():
    opts = vision.FaceLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=str(MODELS / "face_landmarker.task")),
        running_mode=vision.RunningMode.VIDEO, num_faces=1,
        min_face_detection_confidence=0.3, min_face_presence_confidence=0.3, min_tracking_confidence=0.3)
    return vision.FaceLandmarker.create_from_options(opts)


def make_detector():
    opts = vision.FaceDetectorOptions(
        base_options=BaseOptions(model_asset_path=str(MODELS / "blaze_face_short_range.tflite")),
        running_mode=vision.RunningMode.VIDEO, min_detection_confidence=0.3)
    return vision.FaceDetector.create_from_options(opts)


def detect_clip(path):
    cap = cv2.VideoCapture(str(path))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    lm, det = make_landmarker(), make_detector()
    raw, src = [], []
    i = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        ts = int(i * 1000 / fps)
        r = lm.detect_for_video(image, ts)
        entry = None
        if r.face_landmarks:
            pts = np.array([[p.x * w, p.y * h] for p in r.face_landmarks[0]])
            x0, y0 = pts.min(0); x1, y1 = pts.max(0)
            le, re = pts[33], pts[263]
            roll = float(np.degrees(np.arctan2(re[1] - le[1], re[0] - le[0])))
            entry = [(x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0), roll]
            src.append("lm")
        else:
            d = det.detect_for_video(image, ts)
            if d.detections:
                b = max(d.detections, key=lambda x: x.categories[0].score).bounding_box
                # BlazeFace boxes are tighter than the landmark oval: grow them.
                entry = [b.origin_x + b.width / 2, b.origin_y + b.height * 0.45, max(b.width, b.height) * 1.3, None]
                src.append("det")
            else:
                src.append("none")
        raw.append(entry)
        i += 1
    cap.release()
    return raw, src, fps, w, h


def fill_and_smooth(raw):
    n = len(raw)
    arr = np.full((n, 4), np.nan)
    for i, e in enumerate(raw):
        if e is not None:
            arr[i, :3] = e[:3]
            arr[i, 3] = np.nan if e[3] is None else e[3]
    idx = np.arange(n)

    # Outlier rejection: objects passing in front of the face (a book, a hand) can make
    # the models report a face that is suddenly far bigger or displaced. Compare each
    # frame with the rolling median of its +-15 neighbours and drop the outliers, so
    # they get interpolated from the clean frames around them.
    def rolling_median(x, r):
        xp = np.pad(x, r, mode="edge")
        return np.array([np.nanmedian(xp[i:i + 2 * r + 1]) for i in range(len(x))])

    med_size = rolling_median(arr[:, 2], 15)
    med_cx, med_cy = rolling_median(arr[:, 0], 15), rolling_median(arr[:, 1], 15)
    off = np.hypot(arr[:, 0] - med_cx, arr[:, 1] - med_cy)
    outlier = (arr[:, 2] > med_size * 1.35) | (arr[:, 2] < med_size * 0.65) | (off > med_size * 0.45)
    arr[outlier] = np.nan
    print(f"  outlier frames removed: {int(outlier.sum())}", flush=True)

    for k in range(4):
        good = ~np.isnan(arr[:, k])
        if good.sum() == 0:
            arr[:, k] = [540, 760, 420, 0][k]
        else:
            arr[:, k] = np.interp(idx, idx[good], arr[good, k])

    def smooth(x, sigma):
        r = int(3 * sigma)
        k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
        xp = np.pad(x, r, mode="edge")
        return np.convolve(xp, k, mode="valid")

    def rolling_max(x, r):
        xp = np.pad(x, r, mode="edge")
        return np.array([xp[i:i + 2 * r + 1].max() for i in range(len(x))])

    cx = smooth(arr[:, 0], 1.2)
    cy = smooth(arr[:, 1], 1.2)
    size = smooth(rolling_max(arr[:, 2], 4), 1.5)
    rot = smooth(np.clip(arr[:, 3], -40, 40), 2.0)
    speed = np.hypot(np.gradient(arr[:, 0]), np.gradient(arr[:, 1]))
    speed = rolling_max(smooth(speed, 1.0), 3)
    d = np.maximum(MIN_D, size * SAFETY + speed * MOTION_GAIN)
    return np.stack([cx, cy, d, rot], 1)


for sid in IDS:
    path = ROOT / "assets" / f"source-{sid}.mp4"
    raw, src, fps, w, h = detect_clip(path)
    track = fill_and_smooth(raw)
    out = ROOT / "public" / "track" / f"source-{sid}.json"
    json.dump({"fps": round(fps, 3), "w": w, "h": h,
               "frames": [[round(float(v), 1) for v in row] for row in track]}, open(out, "w"))
    stats = {k: src.count(k) for k in ("lm", "det", "none")}
    # longest run of frames without any detection (filled by interpolation)
    longest = run = 0
    for s in src:
        run = run + 1 if s == "none" else 0
        longest = max(longest, run)
    print(f"source-{sid}: {len(src)} frames  landmarks={stats['lm']} detector={stats['det']} none={stats['none']} longest-gap={longest}", flush=True)
    json.dump({"src": src}, open(ROOT / "analysis" / f"track-sources-{sid}.json", "w"))
