// src/tabs/EmotionalWellnessTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MockBackend } from '../utils/db';

const EmotionalWellnessTab = ({ data, refreshData }) => {
    const [mood, setMood] = useState(null);
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathText, setBreathText] = useState("Tap to Breathe");
    const [breathPhase, setBreathPhase] = useState('idle');
    const [gratitudeInput, setGratitudeInput] = useState("");
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', link: '' });

    const wellnessLogs = data.wellnessLogs || [];

    // --- DEFAULT CONTENT ---
    const defaultLibrary = {
        "Anxious": [
            { id: 'def1', title: "Gayatri Mantra", type: "Spiritual", dur: "16 min", icon: "ph-om", color: "bg-orange-100 text-orange-600", link: "https://www.youtube.com/watch?v=fMUZKVLLyQI" },
            { id: 'def2', title: "OM Meditation", type: "Meditation", dur: "16 min", icon: "ph-infinity", color: "bg-blue-100 text-blue-600", link: "https://www.youtube.com/watch?v=fd02L-6WYMs" },
        ],
        "Low": [
            { id: 'def4', title: "Hanuman Gayatri", type: "Spiritual", dur: "16 min", icon: "ph-hands-praying", color: "bg-red-100 text-red-600", link: "https://www.youtube.com/watch?v=N_fgWcbq4no" },
            { id: 'def6', title: "Laughter Yoga", type: "Comedy", dur: "8 min", icon: "ph-smiley", color: "bg-yellow-100 text-yellow-600", link: "https://www.youtube.com/watch?v=ViTeOl0RBHE" }
        ],
        "Happy": [
            { id: 'def7', title: "Hasya Kavi Sammelan", type: "Comedy", dur: "5 min", icon: "ph-microphone-stage", color: "bg-pink-100 text-pink-600", link: "https://www.youtube.com/watch?v=LP97G_Ryqb4" },
            { id: 'def9', title: "Surya Namaskar", type: "Yoga", dur: "14 min", icon: "ph-sun", color: "bg-amber-100 text-amber-600", link: "https://www.youtube.com/watch?v=_Fv5_6mPy_w" }
        ],
        "Okay": [
            { id: 'def11', title: "Morning Bhajans", type: "Spiritual", dur: "15 min", icon: "ph-radio", color: "bg-orange-50 text-orange-600", link: "https://www.youtube.com/watch?v=3j3J9J9J9J9" }
        ]
    };

    const [library, setLibrary] = useState(defaultLibrary);

    useEffect(() => {
        const merged = { ...defaultLibrary };
        if (data.customVideos) {
            Object.keys(data.customVideos).forEach(key => {
                if (merged[key]) merged[key] = [...(data.customVideos[key] || []), ...merged[key]];
            });
        }
        setLibrary(merged);
    }, [data.customVideos]);

    // Breathing Logic
    useEffect(() => {
        let interval;
        if (breathingActive) {
            let phaseCounter = 0;
            const cycle = () => {
                if(phaseCounter === 0) { setBreathText("Inhale..."); setBreathPhase('inhale'); setTimeout(() => { phaseCounter = 1; cycle(); }, 4000); } 
                else if(phaseCounter === 1) { setBreathText("Hold..."); setBreathPhase('hold'); setTimeout(() => { phaseCounter = 2; cycle(); }, 7000); } 
                else { setBreathText("Exhale..."); setBreathPhase('exhale'); setTimeout(() => { phaseCounter = 0; cycle(); }, 8000); }
            };
            cycle();
        } else { setBreathText("Tap to Breathe"); setBreathPhase('idle'); }
        return () => clearTimeout(interval);
    }, [breathingActive]);

    const logMood = (m) => {
        setMood(m);
        MockBackend.updateData({ ...MockBackend.getData(), wellnessLogs: [{ id: Date.now(), type: 'mood', val: m, date: new Date().toLocaleDateString() }, ...(data.wellnessLogs || [])] });
        refreshData();
    };

    const saveGratitude = () => {
        if(!gratitudeInput.trim()) return;
        const now = new Date();
        const newLog = { 
            id: Date.now(), type: 'gratitude', text: gratitudeInput, 
            date: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        };
        MockBackend.updateData({ ...MockBackend.getData(), wellnessLogs: [newLog, ...(data.wellnessLogs || [])] });
        setGratitudeInput(""); refreshData();
    };

    const moods = [
        { icon: "ph-smiley", label: "Happy", color: "from-yellow-300 to-amber-400", shadow: "shadow-yellow-200" },
        { icon: "ph-smiley-meh", label: "Okay", color: "from-blue-300 to-cyan-400", shadow: "shadow-blue-200" },
        { icon: "ph-smiley-sad", label: "Low", color: "from-slate-300 to-gray-400", shadow: "shadow-gray-200" },
        { icon: "ph-lightning", label: "Anxious", color: "from-orange-300 to-red-400", shadow: "shadow-orange-200" },
    ];

    const breathColors = {
        idle: 'from-sky-400 to-indigo-500',
        inhale: 'from-cyan-400 to-blue-500',
        hold: 'from-violet-500 to-purple-600',
        exhale: 'from-amber-400 to-orange-500'
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600"><i className="ph-fill ph-heart"></i></span>
                    Emotional Wellbeing 
                </h1>
                <p className="text-slate-500 ml-14">Your sanctuary for mental calm and spiritual joy.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. MOOD CHECK-IN */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 flex flex-col h-[520px] relative overflow-hidden">
                    <div className="shrink-0 mb-6">
                        <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                            <i className="ph-fill ph-heartbeat text-rose-500 text-xl"></i> How is your spirit today?
                        </h3>
                        <div className="flex justify-between gap-3">
                            {moods.map((m) => (
                                <button key={m.label} onClick={() => logMood(m.label)} className="flex flex-col items-center gap-3 group">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg bg-gradient-to-br ${m.color} ${m.shadow} transition-all duration-300 transform ${mood === m.label ? 'scale-110 ring-4 ring-offset-2 ring-blue-100 -translate-y-2' : 'group-hover:-translate-y-1 group-hover:shadow-xl'}`}>
                                        <i className={`ph-fill ${m.icon}`}></i>
                                    </div>
                                    <span className={`text-xs font-bold transition-colors ${mood === m.label ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {mood ? (
                        <div className="flex-1 flex flex-col min-h-0 border-t border-slate-100 pt-6 animate-fade-in">
                            <div className="overflow-y-auto pr-2 flex-1 space-y-3 pb-2">
                                {library[mood]?.map((item, idx) => (
                                    <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full group relative">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-50 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                                <i className={`ph-fill ${item.icon}`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-slate-700 text-sm group-hover:text-blue-700 truncate transition-colors">{item.title}</h5>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{item.type}</span>
                                                    <span className="text-[10px] text-slate-400">{item.dur}</span>
                                                </div>
                                            </div>
                                            <i className="ph-fill ph-play-circle text-3xl text-slate-200 group-hover:text-blue-500 transition-colors"></i>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 pb-10">
                            <i className="ph-fill ph-hand-tap text-4xl text-slate-300 mb-4"></i>
                            <p className="text-slate-400 font-medium">Select a mood above to<br/>see your personalized playlist.</p>
                        </div>
                    )}
                </div>

                {/* 2. BREATHING EXERCISE */}
                <div className={`rounded-[2rem] p-8 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden h-[520px] transition-all duration-1000 bg-gradient-to-br ${breathColors[breathPhase]}`}>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-64 h-64 rounded-full border-8 border-white/20 flex flex-col items-center justify-center mb-10 transition-all duration-[4000ms] ease-in-out relative backdrop-blur-sm bg-white/5 ${breathPhase === 'inhale' || breathPhase === 'hold' ? 'scale-110 border-white/40 shadow-[0_0_60px_rgba(255,255,255,0.4)]' : 'scale-90 shadow-none'}`}>
                            <span className="text-4xl font-bold tracking-widest text-white drop-shadow-lg text-center leading-tight">
                                {breathText}
                            </span>
                        </div>
                        <button onClick={() => setBreathingActive(!breathingActive)} className="bg-white text-slate-800 px-12 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 text-lg group">
                            {breathingActive ? 'Stop' : 'Start Session'}
                        </button>
                    </div>
                </div>

                {/* 3. GRATITUDE JOURNAL */}
                <div className="lg:col-span-2 bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-[2rem] border border-orange-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-white text-orange-500 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100 text-2xl"><i className="ph-fill ph-book-open-text"></i></div>
                        <div><h3 className="font-bold text-2xl text-orange-900">Gratitude Timeline</h3><p className="text-sm text-orange-800/60 font-medium">Capture the good moments.</p></div>
                    </div>
                    
                    <div className="bg-white p-2 pl-6 rounded-2xl shadow-sm border border-orange-100 flex gap-4 mb-10 focus-within:ring-4 focus-within:ring-orange-100 transition-all items-center">
                        <i className="ph-bold ph-pencil-simple text-orange-300 text-xl"></i>
                        <textarea value={gratitudeInput} onChange={e => setGratitudeInput(e.target.value)} placeholder="What made you smile today?" rows="1" className="flex-1 py-4 bg-transparent border-none outline-none text-slate-700 resize-none placeholder:text-slate-400 font-medium text-lg"></textarea>
                        <button onClick={saveGratitude} className="bg-gradient-to-br from-orange-400 to-amber-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition shrink-0"><i className="ph-bold ph-paper-plane-right text-xl"></i></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {wellnessLogs.filter(l => l.type === 'gratitude').slice(0, 3).map(l => (
                            <div key={l.id} className="bg-white p-6 rounded-3xl border border-orange-100/50 shadow-sm relative flex flex-col justify-between min-h-[140px]">
                                <div>
                                    <i className="ph-fill ph-quotes text-orange-200 text-3xl mb-2 block"></i>
                                    <p className="text-slate-700 text-base font-medium leading-relaxed line-clamp-3">{l.text}</p>
                                </div>
                                <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{l.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmotionalWellnessTab;