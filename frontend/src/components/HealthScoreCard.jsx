// src/components/HealthScoreCard.jsx
import React, { useEffect, useMemo } from 'react';
import { 
  Activity, Heart, Moon, Footprints, Pill, 
  CheckCircle2, Circle, Info 
} from 'lucide-react';

const HealthScoreCard = ({ data, onToggleExercise, onShowHistory, setLiveScore }) => {
    
    // --- SCORE CALCULATION ALGORITHM ---
    const { score, breakdown } = useMemo(() => {
        let tempScore = 0;
        let logData = {};

        if (!data || !data.vitals) return { score: 0, breakdown: {} };

        // 1. Medicine (30 pts)
        const dailyMeds = data.meds ? data.meds.filter(m => m.category === 'Daily Routine') : [];
        if (dailyMeds.length > 0) {
            const taken = dailyMeds.filter(m => m.taken).length;
            const medScore = (taken / dailyMeds.length) * 30;
            tempScore += medScore;
            logData.meds = { pts: medScore };
        } else {
            tempScore += 30; // Full points if no meds assigned
            logData.meds = { pts: 30 };
        }

        // 2. Blood Pressure (20 pts)
        const [sys, dia] = (data.vitals.bp || "0/0").split('/').map(Number);
        let bpPoints = 20;
        if (sys > 140 || dia > 90) bpPoints = 5;
        else if (sys > 130 || dia > 80) bpPoints = 10;
        else if (sys > 120) bpPoints = 15;
        tempScore += bpPoints;
        logData.bp = { pts: bpPoints };

        // 3. Heart Rate (10 pts)
        const hr = data.vitals.heartRate || 0;
        let hrPoints = (hr >= 60 && hr <= 100) ? 10 : 5;
        tempScore += hrPoints;
        logData.hr = { pts: hrPoints };

        // 4. Sleep (15 pts)
        let sleepVal = (typeof data.vitals.sleep === 'object') ? data.vitals.sleep.value : parseFloat(data.vitals.sleep) || 0;
        let sleepPoints = (sleepVal >= 7) ? 15 : (sleepVal >= 5 ? 8 : 2);
        tempScore += sleepPoints;
        logData.sleep = { pts: sleepPoints };

        // 5. Steps (15 pts)
        const steps = data.vitals.steps || 0;
        let stepPoints = (steps > 5000) ? 15 : (steps > 2000 ? 8 : 2);
        tempScore += stepPoints;
        logData.steps = { pts: stepPoints };

        // 6. Exercise (10 pts)
        if (data.vitals.exercise) {
            tempScore += 10;
            logData.ex = { pts: 10 };
        } else {
            logData.ex = { pts: 0 };
        }

        return { score: Math.round(tempScore), breakdown: logData };
    }, [data]);

    // Update parent state
    useEffect(() => {
        if (setLiveScore) setLiveScore(score);
    }, [score, setLiveScore]);

    // Helpers
    const getScoreColor = (s) => s < 50 ? '#ef4444' : s < 80 ? '#f59e0b' : '#10b981';
    const vitalsTotal = (parseInt(breakdown.bp?.pts||0) + parseInt(breakdown.hr?.pts||0));
    const sleepActivityTotal = (parseInt(breakdown.sleep?.pts||0) + parseInt(breakdown.steps?.pts||0));

    return (
        <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/60 overflow-hidden relative p-6 border border-slate-100 font-sans">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl pointer-events-none opacity-60"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">Daily Health Score</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">WHO Compliance Metrics</p>
                </div>
                <Info className="text-slate-300 w-5 h-5 cursor-pointer hover:text-blue-500 transition" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
                
                {/* Score Circle */}
                <div className="relative group cursor-pointer flex-none" onClick={onShowHistory}>
                    <svg viewBox="0 0 36 36" className="w-40 h-40 transform -rotate-90 drop-shadow-sm transition-transform duration-500 group-hover:scale-105">
                        <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                        <path 
                            stroke={getScoreColor(score)} 
                            strokeDasharray={`${score}, 100`} 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-1000 ease-out" 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black tracking-tight" style={{ color: getScoreColor(score) }}>{score}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <MetricItem icon={Pill} color="text-emerald-500" bg="bg-emerald-50" label="Meds" value={breakdown.meds?.pts} max={30} />
                    <MetricItem icon={Heart} color="text-blue-500" bg="bg-blue-50" label="Vitals" value={vitalsTotal} max={30} />
                    <MetricItem icon={Moon} color="text-indigo-500" bg="bg-indigo-50" label="Rest" value={sleepActivityTotal} max={30} />
                    <MetricItem icon={Footprints} color="text-orange-500" bg="bg-orange-50" label="Active" value={breakdown.ex?.pts} max={10} />
                </div>
            </div>

            {/* Toggle Button */}
            <button 
                onClick={onToggleExercise}
                className={`mt-6 w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 text-sm font-bold transition-all duration-300 active:scale-95
                    ${data.vitals?.exercise 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                    }`}
            >
                {data.vitals?.exercise ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                {data.vitals?.exercise ? "Exercise Recorded" : "Mark Exercise Complete"}
            </button>
        </div>
    );
};

const MetricItem = ({ icon: Icon, color, bg, label, value, max }) => (
    <div className={`p-3 rounded-xl border border-slate-100 ${bg} flex flex-col justify-center items-start`}>
        <Icon size={16} className={`${color} mb-1.5`} />
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</div>
        <div className={`text-lg font-bold ${color}`}>{Math.round(value)}<span className="text-[10px] text-slate-400 opacity-70 ml-0.5">/{max}</span></div>
    </div>
);

export default HealthScoreCard;