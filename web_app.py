from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import database
import chatbot

app = Flask(__name__)
CORS(app)  # allow browser JS to call this API

# Initialize database
database.init_db()

@app.route("/")
def index():
    return render_template("index.html")

# --- CHAT API ---
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = (data.get("message") or "").strip()
    language = (data.get("language") or "english").lower()
    session_id = data.get("session_id") or "default"

    if not user_message:
        return jsonify({"reply": "", "error": "Empty message"}), 400

    lang_code = chatbot.LANGUAGE_MAP.get(language, "en")
    history = database.get_history(session_id)
    reply = chatbot.ask_senior_care_bot(history, user_message, lang_code)

    database.add_message(session_id, "user", user_message)
    database.add_message(session_id, "model", reply)

    audio_base64 = chatbot.generate_audio_base64(reply, lang_code)

    return jsonify({
        "reply": reply,
        "audio": audio_base64
    })

# --- MARKETPLACE API ---
@app.route("/api/marketplace/caregivers", methods=["GET"])
def get_caregivers():
    # Mock Data for now (could be moved to DB later)
    providers = [
        {"id": 1, "name": "Sarah Jenkins", "role": "Certified Nurse", "rate": "$25/hr", "trustScore": 98, "specialty": "Medical Care"},
        {"id": 2, "name": "David Chen", "role": "Physiotherapist", "rate": "$40/hr", "trustScore": 95, "specialty": "Therapy"},
        {"id": 3, "name": "Maria Rodriguez", "role": "Home Companion", "rate": "$18/hr", "trustScore": 92, "specialty": "Companionship"},
        {"id": 4, "name": "James Wilson", "role": "Emergency EMT", "rate": "$50/hr", "trustScore": 99, "specialty": "Emergency"}
    ]
    return jsonify(providers)

@app.route("/api/marketplace/book", methods=["POST"])
def book_service():
    data = request.get_json() or {}
    if not data.get('providerId') or not data.get('date'):
        return jsonify({"error": "Missing required fields"}), 400

    booking_id = database.add_booking(data)
    return jsonify({"success": True, "bookingId": booking_id, "message": "Booking request sent successfully!"})

# --- TELEMEDICINE API ---
@app.route("/api/telemedicine/start", methods=["POST"])
def start_call():
    data = request.get_json() or {}
    call_id = database.start_consultation(data.get('doctorId'), data.get('doctorName'))
    return jsonify({"success": True, "callId": call_id})

@app.route("/api/telemedicine/end", methods=["POST"])
def end_call():
    data = request.get_json() or {}
    database.end_consultation(data.get('doctorId'), data.get('duration'))
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
