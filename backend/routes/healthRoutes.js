// backend/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Route to get all data for the Score Card
router.get('/daily-stats', healthController.getDailyStats);

// Route to toggle exercise status
router.put('/toggle-exercise', healthController.toggleExercise);

module.exports = router;