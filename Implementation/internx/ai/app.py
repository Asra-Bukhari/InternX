from flask import Flask, request, jsonify
from flask_cors import CORS
from proctor import analyze_frame

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Proctor server running"}), 200

@app.route("/proctor/analyze", methods=["POST"])
def analyze():
    """
    Receive a base64 webcam frame and return cheating analysis.

    Expected body:
    {
        "frame": "data:image/jpeg;base64,/9j/4AAQ..."
    }

    Response:
    {
        "cheating": true/false,
        "reason": "no_face" | "multiple_faces" | "looking_away" | null,
        "message": "Human readable description"
    }
    """
    data = request.get_json()

    if not data or "frame" not in data:
        return jsonify({"error": "No frame provided"}), 400

    result = analyze_frame(data["frame"])
    return jsonify(result), 200

if __name__ == "__main__":
    print("Starting InternX Proctor Server on port 7860...")
    app.run(host="0.0.0.0", port=7860, debug=False)