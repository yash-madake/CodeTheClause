// src/components/SeniorDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MockBackend } from '../utils/db';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import HealthScoreCard from './HealthScoreCard';
import Chart from 'chart.js/auto'; 
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
// --- IMPORT ALL FEATURE TABS ---
import MedicineTab from '../tabs/MedicineTab';
import ReportsTab from '../tabs/ReportsTab';
import WellnessTab from '../tabs/WellnessTab';
import socket from '../services/socket';
import AppointmentsTab from '../tabs/AppointmentsTab';
import MedicineShopTab from '../tabs/MedicineShopTab';
import GovernmentSchemesTab from '../tabs/GovernmentSchemesTab';
import EmotionalWellnessTab from '../tabs/EmotionalWellnessTab';
import InsuranceTab from '../tabs/InsuranceTab';
import AiAssistantTab from '../tabs/AiAssistantTab';
import GpsTab from '../tabs/GpsTab'; // --- ADDED THIS LINE ---
import { bluetooth } from '../services/bluetooth';
// ... [Keep Helper Components: ManualEntryModal, NotificationAlert, ChartModal, ProfileTab, DashboardContent unchanged] ...

// --- INTERNAL COMPONENT: PROFILE TAB ---
const ProfileTab = ({ data }) => {
    // ... [Keep existing ProfileTab code] ...
    const user = data.user || {};
    return (
        <div className="p-8 pb-32 animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">My Profile</h1>
            {/* ... Rest of profile tab code ... */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="relative">
                        <img 
                            src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" 
                            alt="Profile" 
                        />
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                            <i className="ph-bold ph-pencil-simple"></i>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                        <p className="text-slate-500 font-medium mt-1">{user.phone} • {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</p>
                        {user.seniorId && (
                            <span className="inline-block mt-3 px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100">
                                ID: {user.seniorId}
                            </span>
                        )}
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <i className="ph-fill ph-map-pin text-xl"></i>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
                                <p className="font-semibold text-slate-700">{user.address || "Not Set"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <i className="ph-fill ph-drop text-xl"></i>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
                                <p className="font-semibold text-slate-700">{user.bloodGroup || "Not Set"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400">
                                <i className="ph-fill ph-siren text-xl"></i>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-red-400 uppercase tracking-wider">Emergency Contact</label>
                                <p className="font-semibold text-slate-700">{user.emergencyPrimary?.name || "Not Set"}</p>
                                <p className="text-sm text-slate-500">{user.emergencyPrimary?.contact}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... [Keep ManualEntryModal, NotificationAlert, ChartModal, DashboardContent components exactly as before] ...
const ManualEntryModal = ({ metric, onClose, onSave }) => {
    const [val, setVal] = useState('');
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-bounce-in">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Update {metric}</h3>
                <input 
                    autoFocus
                    type={metric === 'BP' ? 'text' : 'number'} 
                    placeholder={metric === 'BP' ? '120/80' : 'Enter value'}
                    className="w-full p-3 border rounded-xl mb-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={val}
                    onChange={e => setVal(e.target.value)}
                />
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                    <button onClick={() => onSave(val)} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
};

const NotificationAlert = ({ reminder, onComplete, onClose }) => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white border-l-4 border-amber-500 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slide-down w-[90%] max-w-md">
        <div className="bg-amber-100 p-2 rounded-full text-amber-600"><i className="ph-fill ph-bell-ringing text-xl"></i></div>
        <div className="flex-1">
            <h4 className="font-bold text-slate-800">Reminder: {reminder.text}</h4>
            <p className="text-xs text-slate-500">{reminder.time}</p>
        </div>
        <div className="flex gap-2">
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><i className="ph-bold ph-x"></i></button>
            <button onClick={onComplete} className="px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-amber-600">Done</button>
        </div>
    </div>
);

const ChartModal = ({ type, history, currentVal, close }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            if (chartRef.current) chartRef.current.destroy();
            const ctx = canvasRef.current.getContext('2d');
            
            // Format labels (just last 7 entries)
            const labels = Array.from({length: history.length}, (_, i) => `Day ${i+1}`);

            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: type,
                        data: history,
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#2563EB',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false, grid: { borderDash: [5, 5] } }, x: { grid: { display: false } } }
                }
            });
        }
        return () => { if (chartRef.current) chartRef.current.destroy(); };
    }, [history, type]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={close}>
            <div className="bg-white p-6 rounded-3xl w-full max-w-lg h-[400px] shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{type} History</h3>
                        <p className="text-sm text-slate-500">Current: <span className="font-bold text-blue-600">{currentVal}</span></p>
                    </div>
                    <button onClick={close} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition"><i className="ph-bold ph-x"></i></button>
                </div>
                <div className="flex-1 relative w-full">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
};

// --- DASHBOARD CONTENT COMPONENT (From Your Request) ---
const DashboardContent = ({ data, refreshData, user, setTab }) => { 
    const [connected, setConnected] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [sosStep, setSosStep] = useState(0); 
    const [editingMetric, setEditingMetric] = useState(null);
    const [activeAlert, setActiveAlert] = useState(null); 
    const [liveScore, setLiveScore] = useState(0);

    // --- LIVE STATES ---
    const [liveSteps, setLiveSteps] = useState(data.vitals.steps);
    const [liveHeart, setLiveHeart] = useState(data.vitals.heartRate);
    const [liveBP, setLiveBP] = useState(data.vitals.bp);
    const [liveSleep, setLiveSleep] = useState(data.vitals.sleep);

    useEffect(() => {
        setLiveSteps(data.vitals.steps);
        setLiveHeart(data.vitals.heartRate);
        setLiveBP(data.vitals.bp);
        setLiveSleep(data.vitals.sleep);
    }, [data]);

    // Notification Logic (Merged Reminders + Appointments)
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            
            // --- 1. EXISTING REMINDER LOGIC ---
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; 
            const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            
            const { t, language, setLanguage } = useLanguage();
            const found = data.reminders.find(r => r.day === now.getDate() && r.time === formattedTime && !r.completed && !r.notified);
            if (found) setActiveAlert(found);

            // --- 2. NEW APPOINTMENT NOTIFICATION LOGIC (1 Hour Before) ---
            const appts = data.appointments || [];
            
            const foundAppt = appts.find(a => {
                if (a.status !== 'Confirmed' || a.notified) return false;
                
                const [year, month, day] = a.date.split('-').map(Number);
                const [appHours, appMinutes] = a.time.split(':').map(Number);
                
                const apptDate = new Date(year, month - 1, day, appHours, appMinutes);
                const diff = apptDate - now;

                return diff > 0 && diff <= 3600000 && diff > 3540000; 
            });

            if (foundAppt) {
                alert(`🔔 UPCOMING APPOINTMENT\n\nYou have an appointment with Dr. ${foundAppt.doctorName} at ${foundAppt.time} (in ~1 hour).`);
                
                const currentData = MockBackend.getData();
                const updatedAppts = currentData.appointments.map(ap => 
                    ap.id === foundAppt.id ? { ...ap, notified: true } : ap
                );
                MockBackend.updateData({ ...currentData, appointments: updatedAppts });
                refreshData();
            }

        }, 5000); 

        return () => clearInterval(interval);
    }, [data]);

    // Live Simulation Logic
    useEffect(() => {
        let interval;
        if(connected) {
            interval = setInterval(() => {
                setLiveSteps(prev => {
                    const newVal = Number(prev) + Math.floor(Math.random() * 3);
                    const current = MockBackend.getData();
                    current.vitals.steps = newVal;
                    MockBackend.updateData(current);
                    return newVal;
                });
                setLiveHeart(prev => 70 + Math.floor(Math.random() * 5));
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [connected]);

const handleSync = async () => {
        setSyncing(true);
        
        try {
            // 1. Try Real Bluetooth Connection
            await bluetooth.connect();
            setConnected(true);
            
            // 2. Start Listening to Live Data
            bluetooth.startStreaming((realHeartRate) => {
                console.log("Live Heart Rate:", realHeartRate);
                setLiveHeart(realHeartRate);
                
                // Optional: Update Steps/Sleep randomly based on "activity" to simulate other data
                // since standard BLE monitors often only send Heart Rate.
                setLiveSteps(prev => prev + Math.floor(Math.random() * 5)); 
            });

            setSyncing(false);
            alert("✅ Connected to Health Device!");

        } catch (error) {
            console.warn("Bluetooth failed or cancelled:", error);
            
            // 3. Fallback to Simulation if Real Device fails/cancelled
            if (!connected) {
                alert("⚠️ Could not connect to real device. Switching to Simulation Mode.");
                setTimeout(() => { 
                    setConnected(true); 
                    setSyncing(false); 
                    refreshData(); 
                }, 1000);
            } else {
                 setSyncing(false);
            }
        }
    };

   const handleSOS = () => {
    if (sosStep === 0) { 
        setSosStep(1); 
        setTimeout(() => setSosStep(0), 3000); 
    } else { 
        // 1. Prepare Alert Data
        const alertData = {
            seniorName: user.name,
            seniorId: user.seniorId,
            location: user.address || "Unknown Location",
            time: new Date().toLocaleTimeString(),
            message: "Emergency Assistance Required!"
        };

        // 2. Emit to Backend
        socket.emit('send_sos', alertData);

        // 3. Show Local Confirmation
        alert(` SOS ALERT SENT!\n\nNotifying Caretakers & Doctors immediately.`);
        setSosStep(0); 
    }
};

    const toggleMed = (id) => {
        const newMeds = data.meds.map(m => {
            if (m.id === id) {
                const isTaking = !m.taken;
                const newStock = typeof m.stock === 'number' ? (isTaking ? m.stock - 1 : m.stock + 1) : m.stock;
                return { ...m, taken: isTaking, stock: newStock };
            }
            return m;
        });
        MockBackend.updateData({ ...data, meds: newMeds });
        refreshData();
    };

    const completeReminder = () => {
        if(!activeAlert) return;
        const newReminders = data.reminders.map(r => r.id === activeAlert.id ? { ...r, completed: true } : r);
        MockBackend.updateData({ ...data, reminders: newReminders });
        refreshData();
        setActiveAlert(null);
    };

    const handleSaveManual = (val) => {
        if(val && editingMetric) {
            const newData = {...data};
            let key = '';
            let finalVal = val;
            let graphVal = parseInt(val, 10); 

            if(editingMetric.includes('Steps')) key = 'steps';
            else if(editingMetric.includes('BP')) { 
                key = 'bp'; 
                graphVal = parseInt(val.split('/')[0]); 
                finalVal = val; 
            }
            else if(editingMetric.includes('Sleep')) { 
                key = 'sleep'; 
                finalVal = val.display || val; 
                graphVal = val.value || parseFloat(val); 
            }
            else if(editingMetric.includes('Heart')) key = 'heart';

            if(key) {
                if(key === 'heart') newData.vitals.heartRate = graphVal;
                else if(key === 'steps') newData.vitals.steps = graphVal;
                else newData.vitals[key] = finalVal;
                
                MockBackend.updateData(newData);
                refreshData();
                
                if(key === 'steps') setLiveSteps(graphVal);
                if(key === 'heart') setLiveHeart(graphVal);
                if(key === 'bp') setLiveBP(finalVal);
                if(key === 'sleep') setLiveSleep(finalVal);
            }
            setEditingMetric(null);
        }
    };

    const getGraphValue = (metric) => {
        if (metric === 'Steps') return Number(liveSteps);
        if (metric === 'Heart Rate') return Number(liveHeart);
        if (metric.includes('Blood') || metric === 'BP') {
            return parseInt(String(liveBP).split('/')[0]) || 0;
        }
        if (metric === 'Sleep') {
            if (typeof liveSleep === 'object' && liveSleep.value) return liveSleep.value;
            return parseFloat(String(liveSleep)) || 0;
        }
        return 0;
    };

    const dailyMeds = data.meds.filter(m => m.category === 'Daily Routine').sort((a, b) => a.taken - b.taken);

    return (
        <div className="p-4 md:p-8 space-y-8 fade-in pb-32">
            {editingMetric && <ManualEntryModal metric={editingMetric} onClose={() => setEditingMetric(null)} onSave={handleSaveManual} />}
            {activeAlert && <NotificationAlert reminder={activeAlert} onComplete={completeReminder} onClose={() => setActiveAlert(null)} />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        {t('welcome')} {user.name.split(' ')[0]} 🙏
                    </h1>
                    <p className="text-sm md:text-base text-slate-500">
                        {language === 'en' ? "Here's your health summary." : "यहाँ आपका स्वास्थ्य सारांश है।"}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* LANGUAGE SWITCHER */}
                    <div className="bg-white px-3 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
                        <i className="ph-bold ph-translate text-indigo-600"></i>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-sm"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="mr">मराठी</option>
                        </select>
                    </div>

                    {/* SYNC BUTTON */}
                    <button onClick={handleSync} className={`shrink-0 flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-2.5 rounded-full font-bold shadow-md transition-all ${connected ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700'} ${syncing ? 'animate-pulse' : ''}`}>
                        <i className={`ph-bold ${connected ? 'ph-bluetooth-connected' : 'ph-bluetooth'} text-xl`}></i> 
                        <span className="hidden md:inline">{syncing ? 'Syncing...' : connected ? 'Live Sync On' : 'Connect Watch'}</span>
                    </button>
                </div>
            </div>

            {/* SOS BLOCK */}
            <div className={`p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-lg transition-all duration-300 bg-gradient-to-r from-red-500 to-red-700 text-white sos-pulse`}>
                <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="bg-white text-red-600 p-3 rounded-full shadow-lg shrink-0"><i className="ph-fill ph-siren text-3xl"></i></div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{sosStep === 1 ? 'CONFIRM EMERGENCY?' : 'SOS EMERGENCY'}</h3>
                        <p className="text-white/80 text-sm">{sosStep === 1 ? 'Tap again immediately to alert contacts' : `Press in case of immediate assistance`}</p>
                    </div>
                </div>
                <button onClick={handleSOS} className={`w-full md:w-auto ${sosStep === 1 ? 'bg-white text-red-700 animate-bounce' : 'bg-white text-red-600'} px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-50 transition uppercase tracking-wider`}>
                    {sosStep === 1 ? 'YES, ALERT!' : 'ALERT'}
                </button>
            </div>
            
            {/* HEALTH SCORE CARD */}
        <HealthScoreCard 
                data={data} 
                refreshData={refreshData} 
                onShowHistory={() => setSelectedMetric('Health Score')} 
                setLiveScore={setLiveScore}
                onToggleExercise={handleToggleExercise}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Steps Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 vital-card relative group">
                    <div className="absolute top-4 right-4 z-10"><button onClick={() => setEditingMetric('Daily Steps')} className="text-slate-300 hover:text-blue-600 p-1"><i className="ph-bold ph-plus-circle text-2xl"></i></button></div>
                    <div onClick={() => setSelectedMetric('Steps')}>
                        <div className="flex justify-between items-start mb-4"><div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><i className="ph-fill ph-sneaker-move text-2xl"></i></div></div>
                        <h3 className="text-4xl font-bold text-slate-800">{liveSteps}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Daily Steps</p>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden"><div className="bg-teal-500 h-full rounded-full transition-all duration-1000" style={{width: `${Math.min((liveSteps/(data.vitals.target||5000))*100, 100)}%`}}></div></div>
                    </div>
                </div>

                {/* 2. Heart Rate Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 vital-card relative">
                    <div className="absolute top-4 right-4 z-10 flex gap-3 items-center">
                        {connected && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                        <button onClick={(e) => {e.stopPropagation(); setEditingMetric('Heart Rate');}} className="text-slate-300 hover:text-blue-600 p-1"><i className="ph-bold ph-plus-circle text-2xl"></i></button>
                    </div>
                    <div onClick={() => setSelectedMetric('Heart Rate')}>
                        <div className="flex justify-between items-start mb-4"><div className="p-3 bg-red-50 text-red-600 rounded-xl"><i className="ph-fill ph-heartbeat text-2xl"></i></div></div>
                        <h3 className="text-4xl font-bold text-slate-800 pr-8">{liveHeart} <span className="text-lg text-slate-400 font-medium">bpm</span></h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Heart Rate</p>
                    </div>
                </div>

                {/* 3. BP Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 vital-card relative">
                    <div className="absolute top-4 right-4 z-10"><button onClick={() => setEditingMetric('BP')} className="text-slate-300 hover:text-blue-600 p-1"><i className="ph-bold ph-plus-circle text-2xl"></i></button></div>
                    <div onClick={() => setSelectedMetric('BP')}>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><i className="ph-fill ph-drop text-2xl"></i></div>
                        <h3 className="text-4xl font-bold text-slate-800">{liveBP}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Blood Pressure</p>
                    </div>
                </div>

                {/* 4. Sleep Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 vital-card relative">
                    <div className="absolute top-4 right-4 z-10"><button onClick={() => setEditingMetric('Sleep Duration')} className="text-slate-300 hover:text-blue-600 p-1"><i className="ph-bold ph-plus-circle text-2xl"></i></button></div>
                    <div onClick={() => setSelectedMetric('Sleep')}>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4"><i className="ph-fill ph-moon-stars text-2xl"></i></div>
                        <h3 className="text-4xl font-bold text-slate-800">
                            {typeof liveSleep === 'object' ? liveSleep.display : liveSleep} 
                            {typeof liveSleep !== 'object' && <span className="text-lg text-slate-400 ml-1">h</span>}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Sleep Duration</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2"><i className="ph-duotone ph-pill text-blue-600"></i> Daily Medication Tracker</h3>
                    <span onClick={() => setTab('meds')} className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">View All & SOS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dailyMeds.map(m => (
                        <div key={m.id} className={`p-4 border rounded-2xl transition-all flex flex-row justify-between items-center gap-4 ${m.taken ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-blue-100 hover:border-blue-300'}`}>
                            <div className="flex gap-3 items-center flex-1 min-w-0">
                                <div className={`p-3 rounded-full shrink-0 ${m.taken ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                                    <i className={`ph-fill ${m.type === 'Syrup' ? 'ph-drop' : 'ph-pill'} text-xl`}></i>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <p className={`font-bold text-lg leading-tight truncate ${m.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>{m.name}</p>
                                    <p className="text-xs text-slate-500">{m.dose} • {m.time || m.schedule}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {typeof m.stock === 'number' && <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>Stock: {m.stock}</span>}
                                        {m.expiry && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Exp: {m.expiry}</span>}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => toggleMed(m.id)} className={`px-4 py-2 rounded-xl font-bold text-sm transition shrink-0 ${m.taken ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}>
                                {m.taken ? 'Taken' : 'Take'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMetric && <ChartModal 
                type={selectedMetric} 
                history={
                    selectedMetric === 'Health Score' ? (data.history?.score || []) : 
                    selectedMetric === 'Steps' ? (data.history?.steps || []) :
                    selectedMetric === 'Heart Rate' ? (data.history?.heart || []) :
                    selectedMetric.includes('Blood') || selectedMetric === 'BP' ? (data.history?.bp || []) : 
                    (data.history?.sleep || [])
                }
                currentVal={
                    selectedMetric === 'Health Score' ? liveScore :
                    getGraphValue(selectedMetric)
                }
                close={() => setSelectedMetric(null)} 
            />}
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const SeniorDashboard = () => {
    const { currentUser, logout } = useAuth();
    const [tab, setTab] = useState('home');
    const [sideOpen, setSideOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    
    // Central Data State
    const [healthData, setHealthData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api.getDashboard();
                setHealthData(data);
            } catch (err) {
                console.error("Failed to load dashboard", err);
        }
    };
    loadData();
    }, [currentUser]);

    const refreshData = () => setHealthData(MockBackend.getData());

    const addReminder = (text, time, day) => {
        const newReminders = [...healthData.reminders, { id: Date.now(), text, time, day, completed: false }];
        MockBackend.updateData({ ...healthData, reminders: newReminders });
        refreshData();
    };

    const handleToggleExercise = async () => {
        try {
            // Call the real backend API to update status
            await api.updateVital('exercise', !data.vitals.exercise);
            // Refresh dashboard data to reflect changes
            refreshData();
        } catch (error) {
            console.error("Failed to toggle exercise:", error);
        }
    };

    const deleteReminder = (id) => {
        const newReminders = healthData.reminders.filter(r => r.id !== id);
        MockBackend.updateData({ ...healthData, reminders: newReminders });
        refreshData();
    };

    if (!healthData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
                    <p className="text-slate-500 font-medium">Loading Sushruta...</p>
                </div>
            </div>
        );
    }

    const LOGO_SRC = "https://image2url.com/images/1765805243191-d5f3a19d-770b-41d8-94c1-33d7216f45f0.png";

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 relative font-sans">
            <Sidebar 
                activeTab={tab} 
                setTab={setTab} 
                onLogout={logout} 
                user={healthData.user} 
                isOpen={sideOpen} 
                closeMenu={() => setSideOpen(false)} 
                userRole="senior"
            />

            <div className="flex-1 flex flex-col h-full w-full relative transition-all duration-300">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
                    <button onClick={() => setSideOpen(true)} className="text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition">
                        <i className="ph-bold ph-list text-2xl"></i>
                    </button>
                    
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
                        <span className="font-bold text-blue-900 flex items-center gap-2 text-lg">
                            <img 
                                src={LOGO_SRC} 
                                alt="Logo" 
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {e.target.style.display = 'none'}}
                            />
                            SUSHRUTA
                        </span>
                    </div>

                    <button onClick={() => setRightOpen(true)} className="text-slate-600 p-2 relative hover:bg-slate-50 rounded-lg transition">
                        <i className="ph-bold ph-calendar-blank text-2xl"></i>
                        {healthData.reminders.some(r => !r.completed && r.day === new Date().getDate()) && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto custom-scroll scroll-smooth">
                    {tab === 'home' && <DashboardContent data={healthData} refreshData={refreshData} user={healthData.user} setTab={setTab} />}
                    {tab === 'profile' && <ProfileTab data={healthData} />}
                    {tab === 'meds' && <MedicineTab data={healthData} refreshData={refreshData} />}
                    {tab === 'wellness' && <WellnessTab />}
                    {tab === 'assistant' && <AiAssistantTab />}
                    {tab === 'gps' && <GpsTab />}
                    {tab === 'reports' && <ReportsTab data={healthData} refreshData={refreshData} />}
                    {tab === 'appointments' && <AppointmentsTab data={healthData} user={healthData.user} refreshData={refreshData} />}
                    {tab === 'shop' && <MedicineShopTab />}
                    {tab === 'gov' && <GovernmentSchemesTab />}
                    {tab === 'joy' && <EmotionalWellnessTab data={healthData} refreshData={refreshData} />}
                    {tab === 'insurance' && <InsuranceTab data={healthData} refreshData={refreshData} />}
                </main>
            </div>

            <RightPanel 
                reminders={healthData.reminders} 
                isOpen={rightOpen} 
                closeMenu={() => setRightOpen(false)} 
                onAddReminder={addReminder} 
                onDeleteReminder={deleteReminder}
            />
        </div>
    );
};

export default SeniorDashboard;