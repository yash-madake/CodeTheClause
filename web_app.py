from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import ask_senior_care_bot, LANGUAGE_MAP

app = Flask(__name__)
CORS(app)  # Allows React to communicate with this API

# In-memory session store
SESSIONS = {}

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = (data.get("message") or "").strip()
    language = (data.get("language") or "english").lower()
    session_id = data.get("session_id") or "default"

    if not user_message:
        return jsonify({"reply": "", "error": "Empty message"}), 400

    lang_code = LANGUAGE_MAP.get(language, "en")
    history = SESSIONS.get(session_id, [])
    
    # Generate reply
    reply = ask_senior_care_bot(history, user_message, lang_code)

    # Update history
    history.append({"role": "user", "text": user_message})
    history.append({"role": "model", "text": reply})
    SESSIONS[session_id] = history

    return jsonify({"reply": reply})

if __name__ == "__main__":
    # CHANGED PORT TO 5001
    app.run(host="0.0.0.0", port=5001, debug=True)