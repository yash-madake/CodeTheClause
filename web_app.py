from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# Import your existing functions and constants from chatbot.py
# Make sure chatbot.py is in the same folder as this file.
from chatbot import ask_senior_care_bot, LANGUAGE_MAP

app = Flask(__name__)
CORS(app)  # allow browser JS to call this API

# Simple in‑memory session store: {session_id: history_list}
SESSIONS = {}


@app.route("/")
def index():
    # Serves templates/index.html
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    # Get JSON data from the request body
    data = request.get_json() or {}

    user_message = (data.get("message") or "").strip()
    language = (data.get("language") or "english").lower()
    session_id = data.get("session_id") or "default"

    if not user_message:
        return jsonify({"reply": "", "error": "Empty message"}), 400

    # Map "english" -> "en", "hindi" -> "hi", etc.
    lang_code = LANGUAGE_MAP.get(language, "en")

    # Get or create history for this session
    history = SESSIONS.get(session_id, [])

    # Call your existing Gemini-based bot
    reply = ask_senior_care_bot(history, user_message, lang_code)

    # Update history for context
    history.append({"role": "user", "text": user_message})
    history.append({"role": "model", "text": reply})
    SESSIONS[session_id] = history

    # Return reply as JSON
    return jsonify({"reply": reply})


if __name__ == "__main__":
    # debug=True for local development; set to False in production
    app.run(host="0.0.0.0", port=5000, debug=True)
