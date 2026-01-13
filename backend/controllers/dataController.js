// This replaces your frontend/src/utils/db.js MockBackend
// In a real app, this would query MongoDB/PostgreSQL

let db = {
    user: { 
        name: 'Ramesh Kumar', phone: '9876543210', seniorId: 'SEN001',
        address: 'Mumbai, India', bloodGroup: 'O+', 
        emergencyPrimary: { name: 'Priya Kumar', contact: '9876543211' } 
    },
    meds: [
        { id: 1, name: "Metformin", type: "Tablet", category: "Daily Routine", dose: "500mg", qty: "1 Tab", stock: 15, taken: false },
        { id: 2, name: "Amlodipine", type: "Tablet", category: "Daily Routine", dose: "5mg", qty: "1 Tab", stock: 10, taken: false },
    ],
    vitals: { steps: 1240, target: 5000, bp: "120/80", heartRate: 72, sleep: "6.5", exercise: false },
    history: {
        score: [82, 84, 85, 83, 86],
        steps: [3200, 4500, 2800, 5100, 1240]
    },
    reminders: [],
    reports: []
};

exports.getDashboardData = (req, res) => {
    // In real auth, you would use req.user.id to fetch specific data
    res.json(db);
};

exports.updateVitals = (req, res) => {
    const { key, value } = req.body;
    if (db.vitals[key] !== undefined) {
        db.vitals[key] = value;
        res.json({ success: true, vitals: db.vitals });
    } else {
        res.status(400).json({ error: "Invalid vital key" });
    }
};

exports.toggleMedication = (req, res) => {
    const { id } = req.body;
    const med = db.meds.find(m => m.id === id);
    if (med) {
        med.taken = !med.taken;
        med.stock = med.taken ? med.stock - 1 : med.stock + 1;
        res.json({ success: true, med });
    } else {
        res.status(404).json({ error: "Medication not found" });
    }
};