"""Privacy check: composite the flower on every Nth frame using the track, then run
both face models on the result. Any face found = coverage failure (reported per frame).

Usage: python3 scripts/verify_cover.py <models-dir> [step] [source ids...]
Also used on the final render with --video <file> (no compositing, just detection).
"""
import json
import pathlib
import sys

import cv2
import mediapipe as mp
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODELS = pathlib.Path(sys.argv[1])
args = sys.argv[2:]
video_mode = "--video" in args
if video_mode:
    vid = pathlib.Path(args[args.index("--video") + 1])
    args = [a for a in args if a not in ("--video", str(vid))]
STEP = int(args[0]) if args else 3
IDS = args[1:] or [f"0{i}" for i in range(1, 8)]

BaseOptions = mp.tasks.BaseOptions
vision = mp.tasks.vision
lm = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=str(MODELS / "face_landmarker.task")),
    running_mode=vision.RunningMode.IMAGE, num_faces=1,
    min_face_detection_confidence=0.3, min_face_presence_confidence=0.3))
det = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(
    base_options=BaseOptions(model_asset_path=str(MODELS / "blaze_face_short_range.tflite")),
    running_mode=vision.RunningMode.IMAGE, min_detection_confidence=0.3))

flower = cv2.imread(str(ROOT / "public" / "flower.png"), cv2.IMREAD_UNCHANGED)
FLOWER_BOX = 1.12  # image box size relative to the tracked diameter (matches Remotion)


def composite(frame, cx, cy, d, rot):
    size = int(d * FLOWER_BOX)
    f = cv2.resize(flower, (size, int(size * flower.shape[0] / flower.shape[1])), interpolation=cv2.INTER_AREA)
    M = cv2.getRotationMatrix2D((f.shape[1] / 2, f.shape[0] / 2), -rot, 1.0)
    f = cv2.warpAffine(f, M, (f.shape[1], f.shape[0]), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    x0, y0 = int(cx - f.shape[1] / 2), int(cy - f.shape[0] / 2)
    H, W = frame.shape[:2]
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + f.shape[1]), min(H, y0 + f.shape[0])
    if xa >= xb or ya >= yb:
        return frame
    sub = f[ya - y0:yb - y0, xa - x0:xb - x0]
    a = sub[:, :, 3:4].astype(np.float32) / 255
    frame[ya:yb, xa:xb] = (sub[:, :, :3] * a + frame[ya:yb, xa:xb] * (1 - a)).astype(np.uint8)
    return frame


def faces(frame):
    image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    found = []
    if lm.detect(image).face_landmarks:
        found.append("landmarks")
    if det.detect(image).detections:
        found.append("detector")
    return found


def scan(path, track=None, label=""):
    cap = cv2.VideoCapture(str(path))
    i = checked = 0
    hits = []
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if i % STEP == 0:
            if track is not None:
                frame = composite(frame, *track[min(i, len(track) - 1)])
            f = faces(frame)
            checked += 1
            if f:
                hits.append((i, f))
        i += 1
    print(f"{label}: checked {checked} frames, faces found in {len(hits)}" + (f" -> {hits[:20]}" if hits else ""), flush=True)
    return hits


if video_mode:
    scan(vid, None, vid.name)
else:
    for sid in IDS:
        t = json.load(open(ROOT / "public" / "track" / f"source-{sid}.json"))["frames"]
        scan(ROOT / "assets" / f"source-{sid}.mp4", t, f"source-{sid}")
