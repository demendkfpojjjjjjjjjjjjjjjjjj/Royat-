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

# Coverage target: the FEATURES (eyebrows, eyes, nose, mouth) must always be hidden,
# while the outer face edges may show (as in assets/like-this.jpg). The flower diameter is
# the features' extent x SAFETY, plus a motion margin.
SAFETY = 1.15
MOTION_GAIN = 1.4      # extra px of diameter per px/frame of head speed
MIN_D = 150            # never smaller than this (px, source scale)

# MediaPipe Face Mesh indices of the identifying features.
FEATURES = sorted(set([
    70, 63, 105, 66, 107, 55, 65, 52, 53, 46,            # right eyebrow
    300, 293, 334, 296, 336, 285, 295, 282, 283, 276,    # left eyebrow
    33, 7, 163, 144, 145, 153, 154, 155, 133, 246, 161, 160, 159, 158, 157, 173,      # right eye
    263, 249, 390, 373, 374, 380, 381, 382, 362, 466, 388, 387, 386, 385, 384, 398,  # left eye
    1, 2, 4, 5, 6, 19, 94, 97, 98, 168, 195, 197, 326, 327, 64, 294, 48, 278,         # nose
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 185, 40, 39, 37, 0, 267, 269, 270, 409,  # lips
]))

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
    raw, src, feats = [], [], []
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
            allp = np.array([[p.x * w, p.y * h] for p in r.face_landmarks[0]])
            pts = allp[FEATURES]
            x0, y0 = pts.min(0); x1, y1 = pts.max(0)
            le, re = allp[33], allp[263]
            roll = float(np.degrees(np.arctan2(re[1] - le[1], re[0] - le[0])))
            entry = [(x0 + x1) / 2, (y0 + y1) / 2, max(x1 - x0, y1 - y0), roll]
            src.append("lm")
            feats.append(pts.astype(np.float32))
        else:
            d = det.detect_for_video(image, ts)
            if d.detections:
                b = max(d.detections, key=lambda x: x.categories[0].score).bounding_box
                # BlazeFace's box spans roughly brows-to-chin: use it as the feature extent.
                entry = [b.origin_x + b.width / 2, b.origin_y + b.height * 0.45, max(b.width, b.height) * 0.95, None]
                src.append("det")
                feats.append(None)
            else:
                src.append("none")
                feats.append(None)
        raw.append(entry)
        i += 1
    cap.release()
    return raw, src, feats, fps, w, h


FLOWER_BOX = 1.12   # must match src/config/theme.ts
GUARD_GROW = 1.06   # feature outline grown by 6% before requiring full coverage
_flower = None


def flower_alpha(shape, cx, cy, d, rot):
    global _flower
    if _flower is None:
        _flower = cv2.imread(str(ROOT / "public" / "flower.png"), cv2.IMREAD_UNCHANGED)
    H, W = shape
    size = max(8, int(d * FLOWER_BOX))
    a = cv2.resize(_flower[:, :, 3], (size, int(size * _flower.shape[0] / _flower.shape[1])), interpolation=cv2.INTER_AREA)
    M = cv2.getRotationMatrix2D((a.shape[1] / 2, a.shape[0] / 2), -rot, 1.0)
    a = cv2.warpAffine(a, M, (a.shape[1], a.shape[0]), flags=cv2.INTER_LINEAR, borderValue=0)
    out = np.zeros((H, W), np.uint8)
    x0, y0 = int(round(cx - a.shape[1] / 2)), int(round(cy - a.shape[0] / 2))
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + a.shape[1]), min(H, y0 + a.shape[0])
    if xa < xb and ya < yb:
        out[ya:yb, xa:xb] = a[ya - y0:yb - y0, xa - x0:xb - x0]
    return out > 216


def guarantee(track, feats, shape):
    """Grow the diameter per frame until the (grown) feature outline is fully covered."""
    need = np.ones(len(track))
    for i, pts in enumerate(feats):
        if pts is None:
            continue
        c = pts.mean(0)
        hull = cv2.convexHull(((pts - c) * GUARD_GROW + c).astype(np.int32))
        face = np.zeros(shape, np.uint8)
        cv2.fillConvexPoly(face, hull, 1)
        face = face.astype(bool)
        cx, cy, d, rot = track[i]
        m = 1.0
        while m < 2.2 and (face & ~flower_alpha(shape, cx, cy, d * m, rot)).any():
            m += 0.03
        need[i] = m
    xp = np.pad(need, 3, mode="edge")
    need = np.array([xp[i:i + 7].max() for i in range(len(need))])  # hold the bigger size around each frame
    track = track.copy()
    track[:, 2] *= need
    return track, need


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
    outlier = (arr[:, 2] > med_size * 1.6) | (arr[:, 2] < med_size * 0.5) | ((off > med_size * 1.2) & (arr[:, 2] > med_size * 1.3))
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


if __name__ == "__main__":
    for sid in IDS:
        path = ROOT / "assets" / f"source-{sid}.mp4"
        raw, src, feats, fps, w, h = detect_clip(path)
        track = fill_and_smooth(raw)
        track, need = guarantee(track, feats, (h, w))
        print(f"  guarantee: enlarged {int((need > 1.0).sum())} frames (max x{need.max():.2f})", flush=True)
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
