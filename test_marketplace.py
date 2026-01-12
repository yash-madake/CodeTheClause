import unittest
import os
import json
import sqlite3
from web_app import app
import database

class TestMarketplace(unittest.TestCase):
    def setUp(self):
        # Configure app for testing
        app.config['TESTING'] = True
        self.client = app.test_client()

        # Use a separate test database
        database.DB_NAME = "test_marketplace.db"
        database.init_db()

    def tearDown(self):
        # Clean up test database
        if os.path.exists("test_marketplace.db"):
            os.remove("test_marketplace.db")

    def test_get_caregivers(self):
        response = self.client.get('/api/marketplace/caregivers')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(len(data) > 0)
        self.assertEqual(data[0]['name'], "Sarah Jenkins")

    def test_book_service(self):
        payload = {
            "providerId": 1,
            "providerName": "Sarah Jenkins",
            "service": "Medical Care",
            "date": "2023-12-25",
            "time": "10:00",
            "bookedBy": "Test User"
        }

        response = self.client.post('/api/marketplace/book',
                                  data=json.dumps(payload),
                                  content_type='application/json')

        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])

        # Verify DB
        bookings = database.get_bookings()
        self.assertEqual(len(bookings), 1)
        self.assertEqual(bookings[0]['providerName'], "Sarah Jenkins")
        self.assertEqual(bookings[0]['status'], "Pending")

if __name__ == '__main__':
    unittest.main()
