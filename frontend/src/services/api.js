import axios from 'axios';

// Node.js Backend URL
const API_URL = 'http://localhost:5000/api';
// Python Chatbot URL
const CHAT_URL = 'http://localhost:5001/api';

export const api = {
    // Dashboard Data
    getDashboard: async () => {
        try {
            const res = await axios.get(`${API_URL}/dashboard`);
            return res.data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    // Update Vitals (e.g., Steps, Exercise)
    updateVital: async (key, value) => {
        const res = await axios.put(`${API_URL}/vitals`, { key, value });
        return res.data;
    },

    // Toggle Medication
    toggleMed: async (id) => {
        const res = await axios.post(`${API_URL}/meds/toggle`, { id });
        return res.data;
    },

    // AI Chatbot
    sendMessage: async (message) => {
        const res = await axios.post(`${CHAT_URL}/chat`, { 
            message,
            session_id: "user-123" // You can make this dynamic later
        });
        return res.data;
    }
};