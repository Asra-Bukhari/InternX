import cv2
import numpy as np
import base64
import os

# ─── Load OpenCV's built-in face and eye detectors ───────────────────────────
# These cascade files come bundled with opencv-python — no download needed
CASCADE_BASE = os.path.join(os.path.dirname(cv2.__file__), "data")

face_cascade = cv2.CascadeClassifier(
    os.path.join(CASCADE_BASE, "haarcascade_frontalface_default.xml")
)
eye_cascade = cv2.CascadeClassifier(
    os.path.join(CASCADE_BASE, "haarcascade_eye.xml")
)

# ─── Helper: decode base64 frame ─────────────────────────────────────────────
def decode_frame(base64_string):
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_bytes = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return frame

# ─── Main analysis function ───────────────────────────────────────────────────
def analyze_frame(base64_frame):
    try:
        frame = decode_frame(base64_frame)
        if frame is None:
            return {"cheating": False, "reason": None, "error": "Could not decode frame"}

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        h, w = frame.shape[:2]

        # ── Detect faces ─────────────────────────────────────────────────────
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(80, 80)
        )

        num_faces = len(faces)

        # ── Check 1: No face detected ────────────────────────────────────────
        if num_faces == 0:
            return {
                "cheating": True,
                "reason": "no_face",
                "message": "No face detected — student may have left the screen"
            }

        # ── Check 2: Multiple faces detected ────────────────────────────────
        if num_faces > 1:
            return {
                "cheating": True,
                "reason": "multiple_faces",
                "message": f"{num_faces} faces detected — unauthorized person present"
            }

        # ── Check 3: Looking away (eye detection inside face region) ─────────
        # If eyes are not detected inside the face, student is likely looking away
        fx, fy, fw, fh = faces[0]
        face_region_gray = gray[fy:fy+fh, fx:fx+fw]

        eyes = eye_cascade.detectMultiScale(
            face_region_gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(20, 20)
        )

        if len(eyes) == 0:
            return {
                "cheating": True,
                "reason": "looking_away",
                "message": "Eyes not visible — student may be looking away"
            }

        # ── Check 4: Face position — is face centered in frame? ──────────────
        face_center_x = fx + fw // 2
        face_center_y = fy + fh // 2

        # Allow face to be within middle 70% of frame horizontally
        left_bound  = w * 0.15
        right_bound = w * 0.85
        top_bound   = h * 0.10
        bottom_bound = h * 0.90

        if face_center_x < left_bound or face_center_x > right_bound:
            direction = "left" if face_center_x < left_bound else "right"
            return {
                "cheating": True,
                "reason": "looking_away",
                "message": f"Face too far to the {direction} — student may be looking away"
            }

        if face_center_y < top_bound or face_center_y > bottom_bound:
            direction = "up" if face_center_y < top_bound else "down"
            return {
                "cheating": True,
                "reason": "looking_away",
                "message": f"Face too far {direction} — student may be looking away"
            }

        # ── All checks passed ────────────────────────────────────────────────
        return {"cheating": False, "reason": None}

    except Exception as e:
        return {"cheating": False, "reason": None, "error": str(e)}