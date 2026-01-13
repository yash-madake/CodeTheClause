from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import ask_senior_care_bot, LANGUAGE_MAP

app = Flask(__name__)
CORS(app)  # Allows React to communicate with this API

# In-memory session store
SESSIONS = {}

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Handle POST /api/chat requests: validate input, generate a chatbot reply in the requested language, persist conversation history for the session, and return the reply.
    
    Expects a JSON payload with the keys:
    - `message` (string): user message to send to the chatbot (required; must not be empty).
    - `language` (string, optional): user language name; resolves to a language code using the application's language map (defaults to English).
    - `session_id` (string, optional): identifier for the conversation session (defaults to "default").
    
    Returns:
    A JSON response with the chatbot reply:
    - On success: `{"reply": "<bot reply>"}` (HTTP 200).
    - On validation failure when `message` is empty: `{"reply": "", "error": "Empty message"}` (HTTP 400).
    
    Side effects:
    - Appends the user message and the chatbot reply to the in-memory SESSIONS store under the given `session_id`.
    """
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