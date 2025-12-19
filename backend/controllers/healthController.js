// backend/controllers/healthController.js

// Mock Database (Replace this with your MongoDB/SQL queries)
let mockDB = {
    meds: [
        { id: 1, name: 'Aspirin', category: 'Daily Routine', taken: true },
        { id: 2, name: 'Vitamin D', category: 'Daily Routine', taken: true },
        { id: 3, name: 'Metformin', category: 'Daily Routine', taken: false }
    ],
    vitals: {
        bp: '122/81',
        heartRate: 74,
        sleep: 6.5,
        steps: 3200,
        exercise: false
    }
};

// GET: /api/health/daily-stats
exports.getDailyStats = async (req, res) => {
    try {
        // In a real app: const data = await HealthModel.findOne({ userId: req.user.id });
        
        // Send data in the exact structure the React component expects
        res.status(200).json({
            meds: mockDB.meds,
            vitals: mockDB.vitals
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// PUT: /api/health/toggle-exercise
exports.toggleExercise = async (req, res) => {
    try {
        const { status } = req.body;
        
        // Update database
        mockDB.vitals.exercise = status;
        
        res.status(200).json({ 
            success: true, 
            exercise: mockDB.vitals.exercise 
        });
    } catch (error) {
        res.status(500).json({ message: "Update Failed", error });
    }
};