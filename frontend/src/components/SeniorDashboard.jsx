import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto'; // Ensure you have chart.js installed or use CDN

const SeniorDashboard = ({ user, onLogout }) => {
    // --- MOCK DATABASE ---
    const MockBackend = {
        DB_KEY: 'sushruta_db_v_final_reset', 
        initDB: () => {
            try {
                const now = new Date();
                const todayStr = now.toDateString(); 
                let data = null;
                try {
                    const raw = localStorage.getItem(MockBackend.DB_KEY);
                    if (raw) data = JSON.parse(raw);
                } catch (e) { localStorage.removeItem(MockBackend.DB_KEY); }

                if (!data) {
                    data = {
                        lastLogin: todayStr,
                        user: { ...user, emergencyPrimary: { name: '', contact: '', relation: 'Guardian' }, caretaker: { name: '', contact: '' }, doctor: { name: '', contact: '' } },
                        meds: [
                            { id: 1, name: "Metformin", type: "Tablet", category: "Daily Routine", dose: "500mg", qty: "1 Tab", stock: 15, expiry: "Dec 2025", schedule: "Morning", instructions: "After Breakfast", taken: false },
                            { id: 2, name: "Amlodipine", type: "Tablet", category: "Daily Routine", dose: "5mg", qty: "1 Tab", stock: 10, expiry: "Jan 2026", schedule: "Night", instructions: "Before Sleep", taken: false },
                        ],
                        vitals: { steps: 120, target: 5000, bp: "120/80", heartRate: 72, sleep: "6.5", exercise: false }, 
                        history: { dates: [], steps: [3200, 4500, 2800, 5100, 4200, 3800], heart: [72, 75, 68, 74, 71, 70], bp: [122, 118, 125, 120, 119, 121], sleep: [6.5, 7.0, 5.5, 8.0, 6.2, 7.1], score: [0, 0, 0, 0, 0, 86] },
                        reports: [], reminders: [], appointments: [], wellnessLogs: [], customVideos: {} 
                    };
                    const start = 7; const end = 23;
                    for (let h = start; h <= end; h++) {
                        const ampm = h >= 12 ? 'PM' : 'AM'; const hour = h % 12 || 12; const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                        data.reminders.push({ id: `water-${h}-${Date.now()}`, text: "Drink Water", time: timeStr, day: now.getDate(), completed: false });
                    }
                    localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(data));
                } else {
                    if (data.lastLogin !== todayStr) {
                        // Daily Reset Logic
                        data.history.steps.shift(); data.history.steps.push(data.vitals.steps || 0);
                        data.history.heart.shift(); data.history.heart.push(data.vitals.heartRate || 70);
                        data.history.sleep.shift(); data.history.sleep.push(parseFloat(data.vitals.sleep) || 0);
                        data.vitals.steps = 0; data.vitals.sleep = "0"; data.vitals.exercise = false;
                        data.reminders = data.reminders.filter(r => r.text !== "Drink Water"); 
                        const start = 7; const end = 23;
                        for (let h = start; h <= end; h++) {
                            const ampm = h >= 12 ? 'PM' : 'AM'; const hour = h % 12 || 12; const timeStr = `${hour.toString().padStart(2, '0')}:00 ${ampm}`;
                            data.reminders.push({ id: `water-${h}-${Date.now()}`, text: "Drink Water", time: timeStr, day: now.getDate(), completed: false });
                        }
                        data.meds = data.meds.map(m => ({...m, taken: false}));
                        data.lastLogin = todayStr;
                        localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(data));
                    }
                }
            } catch (err) { console.error("InitDB Error:", err); }
        },
        getData: () => { try { return JSON.parse(localStorage.getItem(MockBackend.DB_KEY)); } catch (e) { return null; } },
        updateData: (newData) => { try { localStorage.setItem(MockBackend.DB_KEY, JSON.stringify(newData)); return true; } catch (e) { alert("Storage Full!"); return false; } },
        getStorageSize: () => { let total = 0; for (let x in localStorage) { if (localStorage.hasOwnProperty(x)) total += ((localStorage[x].length * 2) / 1024 / 1024); } return total.toFixed(2); }
    };

    // Initialize DB only once on mount
    useEffect(() => {
        MockBackend.initDB();
    }, []);

    const [healthData, setHealthData] = useState(MockBackend.getData());
    const refreshData = () => setHealthData(MockBackend.getData());
    
    const [tab, setTab] = useState('home');
    const [sideOpen, setSideOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);

    // --- Sub-Components (Inline for simplicity, as per original file) ---

    const HealthScoreCard = ({ data, refreshData, onShowHistory, setLiveScore }) => {
        const [score, setScore] = useState(0);
        const [breakdown, setBreakdown] = useState({});
        
        useEffect(() => {
            if(!data) return;
            let tempScore = 0;
            let log = {};
    
            // Meds (30)
            const dailyMeds = data.meds.filter(m => m.category === 'Daily Routine');
            if (dailyMeds.length > 0) {
                const taken = dailyMeds.filter(m => m.taken).length;
                const medScore = (taken / dailyMeds.length) * 30;
                tempScore += medScore;
                log.meds = { pts: medScore.toFixed(0) };
            } else { tempScore += 30; log.meds = { pts: 30 }; }
    
            // BP (20)
            const [sys, dia] = data.vitals.bp.split('/').map(Number);
            let bpPoints = 20;
            if (sys > 140 || dia > 90) bpPoints = 5; 
            else if (sys > 130 || dia > 80) bpPoints = 10;
            else if (sys > 120) bpPoints = 15;
            tempScore += bpPoints;
            log.bp = { pts: bpPoints };
    
            // HR (10)
            const hr = data.vitals.heartRate;
            let hrPoints = (hr >= 60 && hr <= 100) ? 10 : 5;
            tempScore += hrPoints;
            log.hr = { pts: hrPoints };
    
            // Sleep (15)
            let sleepVal = (typeof data.vitals.sleep === 'object') ? data.vitals.sleep.value : parseFloat(data.vitals.sleep) || 0;
            let sleepPoints = (sleepVal >= 7) ? 15 : (sleepVal >= 5 ? 8 : 2);
            tempScore += sleepPoints;
            log.sleep = { pts: sleepPoints };
    
            // Steps (15)
            const steps = data.vitals.steps;
            let stepPoints = (steps > 5000) ? 15 : (steps > 2000 ? 8 : 2);
            tempScore += stepPoints;
            log.steps = { pts: stepPoints };
    
            // Exercise (10)
            if (data.vitals.exercise) { tempScore += 10; log.ex = { pts: 10 }; } 
            else { log.ex = { pts: 0 }; }
    
            const finalScore = Math.round(tempScore);
            setScore(finalScore);
            setBreakdown(log);
            if(setLiveScore) setLiveScore(finalScore); 
        }, [data]);
    
        const toggleExercise = () => {
            const newData = {...data};
            newData.vitals.exercise = !newData.vitals.exercise;
            MockBackend.updateData(newData);
            refreshData();
        };
    
        const vitalsTotal = (parseInt(breakdown.bp?.pts||0) + parseInt(breakdown.hr?.pts||0));
        const sleepActivityTotal = (parseInt(breakdown.sleep?.pts||0) + parseInt(breakdown.steps?.pts||0));
    
        return (
            <div className="bg-white rounded-[20px] shadow-sm overflow-hidden relative p-6 border border-slate-100">
                <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="flex-none flex flex-col items-center justify-center w-40 cursor-pointer group" onClick={onShowHistory}>
                        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-slate-100">
                             <span className="text-4xl font-bold text-blue-900">{score}</span>
                             <span className="absolute bottom-6 text-[10px] text-slate-400">/ 100</span>
                        </div>
                        <div className="-mt-4 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm z-20 flex items-center gap-1">
                            DAILY SCORE <i className="ph-bold ph-chart-line-up"></i>
                        </div>
                    </div>
    
                    <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                        <div className="bg-slate-50 rounded-xl p-4"><div><h4 className="text-xs text-slate-500 mb-1">Meds Taken</h4><div className="text-base font-bold text-emerald-500">{breakdown.meds?.pts || 0}/30</div></div></div>
                        <div className="bg-slate-50 rounded-xl p-4"><div><h4 className="text-xs text-slate-500 mb-1">Vitals (BP/HR)</h4><div className="text-base font-bold text-blue-500">{vitalsTotal}/30</div></div></div>
                        <div className="bg-slate-50 rounded-xl p-4"><div><h4 className="text-xs text-slate-500 mb-1">Sleep & Activity</h4><div className="text-base font-bold text-purple-500">{sleepActivityTotal}/30</div></div></div>
                        <div className="bg-slate-50 rounded-xl p-4"><div><h4 className="text-xs text-slate-500 mb-1">Exercise</h4><div className="text-base font-bold text-orange-500">{breakdown.ex?.pts || 0}/10</div></div></div>
                    </div>
                </div>
                <div onClick={toggleExercise} className={`mt-6 rounded-lg p-3 text-center text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition select-none ${data.vitals.exercise ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    <i className={`ph-fill ${data.vitals.exercise ? 'ph-check-circle' : 'ph-circle'}`}></i>
                    {data.vitals.exercise ? 'Exercise Recorded' : 'Mark Exercise as Done'}
                </div>
            </div>
        );
    };

    const DashboardContent = () => {
        if (!healthData) return null;
        return (
            <div className="p-4 md:p-8 space-y-8 pb-32">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Namaste, {healthData.user.name.split(' ')[0]} 🙏</h1>
                    </div>
                </div>
                <HealthScoreCard data={healthData} refreshData={refreshData} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-4xl font-bold text-slate-800">{healthData.vitals.steps}</h3>
                        <p className="text-sm font-medium text-slate-500">Daily Steps</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-4xl font-bold text-slate-800">{healthData.vitals.heartRate} <span className="text-lg text-slate-400">bpm</span></h3>
                        <p className="text-sm font-medium text-slate-500">Heart Rate</p>
                    </div>
                </div>
            </div>
        );
    };

    if (!healthData) return <div>Loading...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 relative font-[Outfit]">
            {/* Sidebar */}
            <aside className={`absolute inset-y-0 left-0 z-40 w-64 bg-white border-r shadow-xl transform transition-transform duration-300 md:static md:translate-x-0 ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="text-blue-900 font-bold text-xl">SUSHRUTA</div>
                    <button onClick={() => setSideOpen(false)} className="md:hidden text-slate-400"><i className="ph-bold ph-x text-xl"></i></button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {['home', 'meds', 'reports', 'wellness'].map(id => (
                        <button key={id} onClick={() => { setTab(id); setSideOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${tab === id ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-500'}`}>
                            <span className="capitalize">{id}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button onClick={onLogout} className="text-red-500 font-bold flex items-center gap-2"><i className="ph-bold ph-sign-out"></i> Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full w-full relative">
                <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20">
                    <button onClick={() => setSideOpen(true)} className="text-slate-600"><i className="ph-bold ph-list text-2xl"></i></button>
                    <span className="font-bold text-blue-900">SUSHRUTA</span>
                    <div className="w-8"></div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scroll scroll-smooth">
                    {tab === 'home' && <DashboardContent />}
                    {tab === 'meds' && <div className="p-8">Medicine Component Placeholder</div>}
                    {tab === 'reports' && <div className="p-8">Reports Component Placeholder</div>}
                    {tab === 'wellness' && <div className="p-8">Wellness Component Placeholder</div>}
                </main>
            </div>
        </div>
    );
};

export default SeniorDashboard;