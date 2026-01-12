import unittest
import os
import json
import sqlite3
from web_app import app
import database

class TestTelemedicine(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        self.client = app.test_client()

        # Use a separate test database
        database.DB_NAME = "test_telemedicine.db"
        database.init_db()

    def tearDown(self):
        # Clean up test database
        if os.path.exists("test_telemedicine.db"):
            os.remove("test_telemedicine.db")

    def test_start_call(self):
        payload = {
            "doctorId": 1,
            "doctorName": "Dr. Anjali Sharma"
        }

        response = self.client.post('/api/telemedicine/start',
                                  data=json.dumps(payload),
                                  content_type='application/json')

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('callId', data)

    def test_end_call(self):
        # Start a call first
        start_payload = {
            "doctorId": 1,
            "doctorName": "Dr. Anjali Sharma"
        }
        self.client.post('/api/telemedicine/start',
                        data=json.dumps(start_payload),
                        content_type='application/json')

        # End the call
        end_payload = {
            "doctorId": 1,
            "duration": 300
        }
        response = self.client.post('/api/telemedicine/end',
                                  data=json.dumps(end_payload),
                                  content_type='application/json')

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])

        # Verify DB update
        conn = sqlite3.connect("test_telemedicine.db")
        cursor = conn.cursor()
        cursor.execute("SELECT status, duration FROM consultations WHERE doctor_id=?", (1,))
        row = cursor.fetchone()
        conn.close()

        self.assertEqual(row[0], 'Completed')
        self.assertEqual(row[1], 300)

if __name__ == '__main__':
    unittest.main()
