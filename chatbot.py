from google import genai
import os
from datetime import datetime
from gtts import gTTS
import playsound
import uuid
import time
import re

# ================= CONFIG =================
MODEL_NAME = "gemini-2.5-flash"
MAX_TURNS = 6
COOLDOWN_SECONDS = 1.2

client = genai.Client()  # Reads GEMINI_API_KEY automatically

SYSTEM_INSTRUCTION = """
You are a Senior Care Assistant chatbot called 'SeniorCare Ally'.

Goals:
- Help older adults and family caregivers with daily questions.
- Be calm, polite, and easy to understand.
- Encourage safety, dignity, and independence.

Rules:
- You are NOT a doctor and cannot diagnose or prescribe.
- For serious symptoms (chest pain, breathing trouble, confusion, falls, suicidal thoughts),
  clearly advise contacting a doctor or emergency services immediately.
- Use short paragraphs and simple language.
- Offer practical advice: routines, reminders, fall prevention, medication organization,
  emotional well-being, light exercise, and diet.
- If unsure, say so and suggest professional help.

Style:
- Respectful, supportive, non-judgmental.
"""

# ================= LANGUAGE =================
LANGUAGE_MAP = {
    "english": "en",
    "hindi": "hi",
    "marathi": "mr",
    "tamil": "ta",
    "telugu": "te",
    "bengali": "bn",
    "gujarati": "gu",
    "kannada": "kn",
    "malayalam": "ml",
    "punjabi": "pa"
}

LANGUAGE_INSTRUCTION_MAP = {
    "en": "Respond in simple English.",
    "hi": "Respond only in simple Hindi.",
    "mr": "Respond only in simple Marathi.",
    "ta": "Respond only in simple Tamil.",
    "te": "Respond only in simple Telugu.",
    "bn": "Respond only in simple Bengali.",
    "gu": "Respond only in simple Gujarati.",
    "kn": "Respond only in simple Kannada.",
    "ml": "Respond only in simple Malayalam.",
    "pa": "Respond only in simple Punjabi."
}

FALLBACK_MESSAGES = {
    "en": "I’m taking a short pause. Please try again in a moment.",
    "hi": "मैं थोड़ी देर के लिए रुक रहा हूँ। कृपया कुछ समय बाद फिर कोशिश करें।",
    "mr": "मी थोडा वेळ थांबत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.",
    "ta": "நான் சிறிது நேரம் இடைவேளை எடுக்கிறேன். தயவுசெய்து சிறிது நேரத்திற்குப் பிறகு முயற்சிக்கவும்.",
    "te": "నేను కొద్దిసేపు విరామం తీసుకుంటున్నాను. దయచేసి కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.",
    "bn": "আমি একটু বিরতি নিচ্ছি। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।",
    "gu": "હું થોડા સમય માટે વિરામ લઈ રહ્યો છું. કૃપા કરીને થોડા સમય પછી ફરી પ્રયત્ન કરો.",
    "kn": "ನಾನು ಸ್ವಲ್ಪ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    "ml": "ഞാൻ അല്പസമയം ഇടവേള എടുക്കുന്നു. ദയവായി കുറച്ച് സമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക.",
    "pa": "ਮੈਂ ਥੋੜ੍ਹੀ ਦੇਰ ਲਈ ਰੁਕ ਰਿਹਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਸਮੇਂ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
}

# ================= SPEECH CLEANER =================
def clean_for_speech(text):
    # Remove markdown, symbols, bullets
    text = re.sub(r'[*#_`~>|<={}\[\]();]', '', text)

    # Replace colons with pauses
    text = text.replace(":", ".")

    # Remove stray dashes
    text = text.replace("-", " ")

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)

    return text.strip()

# ================= TEXT TO SPEECH =================
def speak_text(text, lang_code):
    try:
        clean_text = clean_for_speech(text)
        filename = f"voice_{uuid.uuid4()}.mp3"
        tts = gTTS(text=clean_text, lang=lang_code, slow=False)
        tts.save(filename)
        playsound.playsound(filename)
        os.remove(filename)
    except Exception:
        pass  # TTS should never crash the app

# ================= CONTEXT =================
def build_context(history, user_message):
    contents = []
    for turn in history:
        contents.append({
            "role": turn["role"],
            "parts": [{"text": turn["text"]}],
        })
    contents.append({
        "role": "user",
        "parts": [{"text": user_message}],
    })
    return contents

# ================= GEMINI =================
def ask_senior_care_bot(history, user_message, lang_code):
    if len(history) > MAX_TURNS:
        history[:] = history[-MAX_TURNS:]

    time.sleep(COOLDOWN_SECONDS)

    contents = build_context(history, user_message)

    language_instruction = LANGUAGE_INSTRUCTION_MAP.get(
        lang_code, "Respond in simple English."
    )

    config = {
        "system_instruction": SYSTEM_INSTRUCTION + "\n\n" + language_instruction,
        "max_output_tokens": 200,
        "temperature": 0.6,
    }

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
            config=config,
        )

        if hasattr(response, "text") and response.text:
            return response.text.strip()

        if getattr(response, "candidates", None):
            parts = response.candidates[0].content.parts
            return "".join(p.text for p in parts if hasattr(p, "text")).strip()

    except Exception:
        return FALLBACK_MESSAGES.get(
            lang_code,
            "I’m taking a short pause. Please try again."
        )

# ================= CLI CHAT =================
def run_cli_chat():
    print("\n=== SeniorCare Ally ===")
    print("A supportive AI companion for seniors and caregivers.\n")

    print("Available languages:")
    for lang in LANGUAGE_MAP:
        print("-", lang.capitalize())

    choice = input("\nChoose your language: ").strip().lower()
    lang_code = LANGUAGE_MAP.get(choice, "en")

    print("\nType 'exit' to quit.\n")

    history = []
    session_start = datetime.now().strftime("%Y-%m-%d %H:%M")

    history.append({
        "role": "user",
        "text": f"Conversation started at {session_start}."
    })

    while True:
        user_message = input("You: ").strip()

        if user_message.lower() in {"exit", "quit"}:
            goodbye = {
                "en": "Take care. Wishing you good health and peace.",
                "hi": "अपना ध्यान रखें। आपको अच्छे स्वास्थ्य की शुभकामनाएँ।"
            }.get(lang_code, "Take care.")

            print("\nSeniorCare Ally:", goodbye)
            speak_text(goodbye, lang_code)
            break

        if not user_message:
            continue

        history.append({"role": "user", "text": user_message})

        reply = ask_senior_care_bot(history, user_message, lang_code)
        history.append({"role": "model", "text": reply})

        print("\nSeniorCare Ally:", reply, "\n")
        speak_text(reply, lang_code)

# ================= RUN =================
if __name__ == "__main__":
    run_cli_chat()




