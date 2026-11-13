"""Geometric privacy check (the authoritative one).

For every frame: find the identifying features on the ORIGINAL frame (eyebrows, eyes,
nose, mouth — convex hull of those MediaPipe landmarks, grown by 10% for safety), place
the flower exactly as the edit does, and measure the share of feature pixels under opaque
flower (alpha > 0.85). Every frame must be 100% covered. (The outer face edges are allowed
to show, as requested.)

Usage: python3 scripts/verify_coverage.py <models-dir> [source ids...]
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
FLOWER_BOX = 1.12   # must match FLOWER_BOX in src/config/theme.ts
GROW = float(__import__("os").environ.get("COVER_GROW", "1.10"))
sys.path.insert(0, str(ROOT / 'scripts'))
from track_face import FEATURES  # noqa: E402

vision = mp.tasks.vision
flower = cv2.imread(str(ROOT / "public" / "flower.png"), cv2.IMREAD_UNCHANGED)


def flower_mask(shape, cx, cy, d, rot):
    H, W = shape
    size = int(d * FLOWER_BOX)
    a = cv2.resize(flower[:, :, 3], (size, int(size * flower.shape[0] / flower.shape[1])), interpolation=cv2.INTER_AREA)
    M = cv2.getRotationMatrix2D((a.shape[1] / 2, a.shape[0] / 2), -rot, 1.0)
    a = cv2.warpAffine(a, M, (a.shape[1], a.shape[0]), flags=cv2.INTER_LINEAR, borderValue=0)
    out = np.zeros((H, W), np.uint8)
    x0, y0 = int(round(cx - a.shape[1] / 2)), int(round(cy - a.shape[0] / 2))
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + a.shape[1]), min(H, y0 + a.shape[0])
    if xa < xb and ya < yb:
        out[ya:yb, xa:xb] = a[ya - y0:yb - y0, xa - x0:xb - x0]
    return out > 216


worst_all = 1.0
for sid in IDS:
    lm = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(
        base_options=mp.tasks.BaseOptions(model_asset_path=str(MODELS / "face_landmarker.task")),
        running_mode=vision.RunningMode.VIDEO, num_faces=1,
        min_face_detection_confidence=0.3, min_face_presence_confidence=0.3, min_tracking_confidence=0.3))
    track = json.load(open(ROOT / "public" / "track" / f"source-{sid}.json"))["frames"]
    cap = cv2.VideoCapture(str(ROOT / "assets" / f"source-{sid}.mp4"))
    i, worst, worst_i, bad, nofaces = 0, 1.0, -1, [], 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        H, W = frame.shape[:2]
        r = lm.detect_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)), int(i * 1000 / 30))
        if r.face_landmarks:
            pts = np.array([[p.x * W, p.y * H] for p in r.face_landmarks[0]], np.float32)[FEATURES]
            c = pts.mean(0)
            hull = cv2.convexHull(((pts - c) * GROW + c).astype(np.int32))
            face = np.zeros((H, W), np.uint8)
            cv2.fillConvexPoly(face, hull, 1)
            face = face.astype(bool)
            cov = (face & flower_mask((H, W), *track[min(i, len(track) - 1)])).sum() / max(1, face.sum())
            if cov < worst:
                worst, worst_i = cov, i
            if cov < 0.999:
                bad.append((i, round(float(cov), 4)))
        else:
            nofaces += 1
        i += 1
    worst_all = min(worst_all, worst)
    print(f"source-{sid}: {i} frames, min coverage {worst*100:.2f}% (frame {worst_i}), frames <99.9%: {len(bad)}, no-landmark frames: {nofaces}" + (f" -> {bad[:15]}" if bad else ""), flush=True)
print(f"OVERALL min coverage {worst_all*100:.2f}%")
