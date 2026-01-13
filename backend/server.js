const express = require('express');
const cors = require('cors');
const http = require('http'); // Import HTTP
const { Server } = require('socket.io'); // Import Socket.io
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// --- SOCKET.IO SETUP ---
const server = http.createServer(app); // Wrap express app
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow your React frontend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Listen for SOS signal from Senior
    socket.on('send_sos', (data) => {
        console.log("🚨 SOS RECEIVED:", data);
        // Broadcast to everyone (Caretakers/Doctors)
        socket.broadcast.emit('receive_sos', data);
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
    });
});

// Change app.listen to server.listen
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});