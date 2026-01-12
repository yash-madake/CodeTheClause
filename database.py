import sqlite3
import datetime

DB_NAME = "chatbot.db"

def init_db():
    """Initializes the database with tables."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Chat History Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Bookings Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_id INTEGER NOT NULL,
            provider_name TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            booked_by TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Consultations Table (New)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS consultations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_id INTEGER NOT NULL,
            doctor_name TEXT,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_time DATETIME,
            duration INTEGER,
            status TEXT DEFAULT 'Active'
        )
    ''')

    conn.commit()
    conn.close()

def add_message(session_id, role, content):
    """Adds a chat message."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO conversations (session_id, role, content)
        VALUES (?, ?, ?)
    ''', (session_id, role, content))
    conn.commit()
    conn.close()

def get_history(session_id, limit=10):
    """Retrieves chat history."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT role, content FROM conversations
        WHERE session_id = ?
        ORDER BY timestamp ASC
    ''', (session_id,))
    rows = cursor.fetchall()
    conn.close()
    history = [{"role": row[0], "text": row[1]} for row in rows]
    return history[-limit:]

def add_booking(data):
    """Adds a new booking."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO bookings (provider_id, provider_name, service, date, time, booked_by, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (data['providerId'], data['providerName'], data['service'], data['date'], data['time'], data['bookedBy'], 'Pending'))
    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return booking_id

def get_bookings():
    """Retrieves all bookings."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, provider_name, service, date, time, status, booked_by FROM bookings
        ORDER BY timestamp DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "id": r[0], "providerName": r[1], "service": r[2],
            "date": r[3], "time": r[4], "status": r[5], "bookedBy": r[6]
        } for r in rows
    ]

# --- TELEMEDICINE FUNCTIONS ---
def start_consultation(doctor_id, doctor_name):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO consultations (doctor_id, doctor_name, status)
        VALUES (?, ?, 'Active')
    ''', (doctor_id, doctor_name))
    consultation_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return consultation_id

def end_consultation(doctor_id, duration):
    # This logic assumes we end the latest active call for this doctor
    # In a real app, we'd pass consultation_id
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE consultations
        SET status = 'Completed', end_time = CURRENT_TIMESTAMP, duration = ?
        WHERE doctor_id = ? AND status = 'Active'
    ''', (duration, doctor_id))
    conn.commit()
    conn.close()
