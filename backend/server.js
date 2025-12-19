// backend/server.js
const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allow React to talk to Node
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});