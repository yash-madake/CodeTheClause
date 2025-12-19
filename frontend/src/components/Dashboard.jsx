// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import HealthScoreCard from './components/HealthScoreCard';
import axios from 'axios'; // Ensure you have axios installed

export default function Dashboard() {
    const [liveScore, setLiveScore] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Initial State Structure
    const [healthData, setHealthData] = useState({
        meds: [],
        vitals: { bp: '0/0', heartRate: 0, sleep: 0, steps: 0, exercise: false }
    });

    // 1. Fetch Data from Backend
    const fetchData = async () => {
        try {
            // Replace with your actual backend URL
            const response = await axios.get('http://localhost:5000/api/health/daily-stats');
            setHealthData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching health data:", error);
            // Fallback mock data if server fails
            setHealthData({
                meds: [{ category: 'Daily Routine', taken: true }],
                vitals: { bp: '120/80', heartRate: 72, sleep: 7, steps: 4500, exercise: false }
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Handle Exercise Toggle (Backend Update)
    const handleToggleExercise = async () => {
        // Optimistic UI Update (Update screen before server responds)
        const previousState = { ...healthData };
        setHealthData(prev => ({
            ...prev,
            vitals: { ...prev.vitals, exercise: !prev.vitals.exercise }
        }));

        try {
            await axios.put('http://localhost:5000/api/health/toggle-exercise', {
                status: !previousState.vitals.exercise
            });
        } catch (error) {
            console.error("Sync failed, reverting:", error);
            setHealthData(previousState); // Revert on failure
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Patient Dashboard</h1>
            
            <div className="w-full max-w-md">
                {loading ? (
                    <div className="text-center text-slate-400">Loading Vitals...</div>
                ) : (
                    <HealthScoreCard 
                        data={healthData} 
                        onToggleExercise={handleToggleExercise}
                        setLiveScore={setLiveScore}
                    />
                )}
            </div>
            
            <div className="mt-8 text-sm text-slate-400">
                Live Calculated Score: <span className="font-mono text-slate-600">{liveScore}</span>
            </div>
        </div>
    );
}