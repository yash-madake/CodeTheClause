// src/utils/db.js

export const DB = {
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    get: (key) => JSON.parse(localStorage.getItem(key)) || null,
    init: () => {
        if (!localStorage.getItem('users')) {
            // Initialize with demo users
            const demoUsers = [
                {
                    role: 'senior',
                    seniorId: 'SEN001',
                    name: 'Ramesh Kumar',
                    phone: '9876543210',
                    pin: '1234',
                    dob: '1950-05-15',
                    gender: 'Male',
                    bloodGroup: 'O+',
                    address: 'Mumbai, Maharashtra',
                    emergencyPrimary: { name: 'Priya Kumar', contact: '9876543211', relation: 'Daughter' },
                    emergencyName: 'Priya Kumar',
                    emergencyPhone: '9876543211',
                    meds: [
                        { id: 1, name: "Metformin", type: "Tablet", category: "Daily Routine", dose: "500mg", qty: "1 Tab", stock: 15, expiry: "Dec 2025", schedule: "Morning", instructions: "After Breakfast", taken: false },
                        { id: 2, name: "Amlodipine", type: "Tablet", category: "Daily Routine", dose: "5mg", qty: "1 Tab", stock: 10, expiry: "Jan 2026", schedule: "Night", instructions: "Before Sleep", taken: false },
                    ]
                },
                {
                    role: 'doctor',
                    name: 'Anjali Sharma',
                    phone: '9876543220',
                    pin: '5678',
                    specialization: 'Cardiologist',
                    regNo: 'MED12345',
                    clinic: 'City Heart Hospital',
                    city: 'Mumbai'
                },
                {
                    role: 'caretaker',
                    name: 'Sunita Devi',
                    phone: '9876543230',
                    pin: '9012',
                    relation: 'Professional Nurse',
                    address: 'Mumbai'
                },
                {
                    role: 'family',
                    name: 'Priya Kumar',
                    phone: '9876543240',
                    pin: '3456',
                    relation: 'Daughter',
                    address: 'Pune, Maharashtra'
                }
            ];
            localStorage.setItem('users', JSON.stringify(demoUsers));
        }
    }
};

export const MockBackend = {
    DB_KEY: 'sushruta_db_v_final_reset', 

    initDB: () => {
        try {
            const now = new Date();
            const todayStr = now.toDateString(); 
            let data = null;

            try {
                const raw = localStorage.getItem(MockBackend.DB_KEY);
                if (raw) data = JSON.parse(raw);
            } catch (e) {
                localStorage.removeItem(MockBackend.DB_KEY);
            }

            if (!data) {
                // Seed Data
                data = {
                    lastLogin: todayStr,
                    user: { 
                        name: '', phone: '', pin: '', dob: '', gender: '', address: '', language: '', photo: '', 
                        emergencyPrimary: { name: '', contact: '', relation: 'Guardian' }, 
                        caretaker: { name: '', contact: '' },
                        doctor: { name: '', contact: '' },
                        emergencySecondary: {}, hospitalPref: '', bloodGroup: '', allergies: '', chronicConditions: '', history: '', surgeries: '', treatments: '' 
                    },
                    meds: [
                        { id: 1, name: "Metformin", type: "Tablet", category: "Daily Routine", dose: "500mg", qty: "1 Tab", stock: 15, expiry: "Dec 2025", schedule: "Morning", instructions: "After Breakfast", taken: false },
                        { id: 2, name: "Amlodipine", type: "Tablet", category: "Daily Routine", dose: "5mg", qty: "1 Tab", stock: 10, expiry: "Jan 2026", schedule: "Night", instructions: "Before Sleep", taken: false },
                    ],
                    vitals: { steps: 120, target: 5000, bp: "120/80", heartRate: 72, sleep: "6.5", exercise: false }, 
                    history: {
                        dates: [], 
                        steps: [3200, 4500, 2800, 5100, 4200, 3800], 
                        heart: [72, 75, 68, 74, 71, 70],
                        bp: [122, 118, 125, 120, 119, 121],
                        sleep: [6.5, 7.0, 5.5, 8.0, 6.2, 7.1],
                        score: [0, 0, 0, 0, 0, 86] 
                    },
                    reports: [], reminders: [], appointments: [], wellnessLogs: [], customVideos: {}, bookings: []
                };
                
                // Water Reminders
                const start = 7; const end = 23;
                for (let h = start; h <= end; h++) {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const hour = h % 12 || 12;
                    const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                    data.reminders.push({ id: `water-${h}-${Date.now()}`, text: "Drink Water", time: timeStr, day: now.getDate(), completed: false });
                }
                
                localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(data));
            } 
            else if (data.lastLogin !== todayStr) {
                // Daily Reset Logic
                data.history.steps.shift(); data.history.steps.push(data.vitals.steps || 0);
                data.history.heart.shift(); data.history.heart.push(data.vitals.heartRate || 70);
                data.history.sleep.shift(); data.history.sleep.push(parseFloat(data.vitals.sleep) || 0);
                
                data.vitals.steps = 0; data.vitals.sleep = "0"; data.vitals.exercise = false;
                data.reminders = data.reminders.filter(r => r.text !== "Drink Water"); 
                
                const start = 7; const end = 23;
                for (let h = start; h <= end; h++) {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const hour = h % 12 || 12;
                    const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                    data.reminders.push({ id: `water-${h}-${Date.now()}`, text: "Drink Water", time: timeStr, day: now.getDate(), completed: false });
                }
                data.meds = data.meds.map(m => ({...m, taken: false}));
                data.lastLogin = todayStr;
                MockBackend.updateData(data);
            }
        } catch (err) {
            console.error("InitDB Error:", err);
        }
    },

    getData: () => {
        try { return JSON.parse(localStorage.getItem(MockBackend.DB_KEY)); } catch (e) { return null; }
    },

    saveUser: (user) => {
        const data = MockBackend.getData();
        if(data) {
            data.user = { ...data.user, ...user };
            MockBackend.updateData(data);
        }
    },

    updateData: (newData) => {
        try {
            localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(newData));
            return true;
        } catch (e) {
            alert("⚠️ STORAGE FULL! Please delete some Custom Videos or Reports.");
            return false;
        }
    },

    getStorageSize: () => {
        let total = 0;
        for (let x in localStorage) {
            if (localStorage.hasOwnProperty(x)) {
                total += ((localStorage[x].length * 2) / 1024 / 1024);
            }
        }
        return total.toFixed(2);
    }
};

// Initialize immediately
DB.init();
MockBackend.initDB();
