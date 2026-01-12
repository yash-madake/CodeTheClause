import unittest
import os
import json
import sqlite3
import base64
from web_app import app
import database

class TestBackend(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        self.client = app.test_client()

        # Use a separate test database
        database.DB_NAME = "test_chatbot.db"
        database.init_db()

    def tearDown(self):
        # Clean up test database
        if os.path.exists("test_chatbot.db"):
            os.remove("test_chatbot.db")

    def test_chat_endpoint(self):
        # Mocking or simulating chatbot response would be ideal,
        # but for integration test we check structure.
        # Note: This test assumes Ollama is running or handles connection error gracefully.
        # If Ollama is not running, chatbot.py returns a fallback message.

        payload = {
            "message": "Hello",
            "language": "english",
            "session_id": "test_session"
        }

        response = self.client.post('/api/chat',
                                  data=json.dumps(payload),
                                  content_type='application/json')

        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        # Check response structure
        self.assertIn('reply', data)
        self.assertIn('audio', data)

        # Verify reply is not empty
        self.assertTrue(len(data['reply']) > 0)

        # Verify audio is base64
        # Even fallback message generates audio
        if data['audio']:
            try:
                base64.b64decode(data['audio'])
            except Exception:
                self.fail("Audio is not valid base64")

        # Verify database persistence
        history = database.get_history("test_session")
        self.assertTrue(len(history) >= 2) # User message + Bot reply
        self.assertEqual(history[-2]['text'], "Hello") # User message
        self.assertEqual(history[-1]['text'], data['reply']) # Bot reply

if __name__ == '__main__':
    unittest.main()
