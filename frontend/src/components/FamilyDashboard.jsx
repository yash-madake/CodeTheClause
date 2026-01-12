// src/components/FamilyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MockBackend } from '../utils/db';
import Sidebar from './Sidebar';
import MarketplaceTab from '../tabs/MarketplaceTab';
import TelemedicineTab from '../tabs/TelemedicineTab';

const FamilyDashboard = () => {
    const { currentUser, logout } = useAuth();
    const [tab, setTab] = useState('home');
    const [sideOpen, setSideOpen] = useState(false);
    const [healthData, setHealthData] = useState(null);

    useEffect(() => {
        MockBackend.initDB();
        setHealthData(MockBackend.getData());
    }, []);

    const refreshData = () => setHealthData(MockBackend.getData());

    if (!healthData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div>
                    <p className="text-slate-500 font-medium">Loading Family Dashboard...</p>
                </div>
            </div>
        );
    }

    const { user, vitals, history, bookings, reminders } = healthData;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 relative font-sans">
             <Sidebar
                activeTab={tab}
                setTab={setTab}
                onLogout={logout}
                user={currentUser}
                isOpen={sideOpen}
                closeMenu={() => setSideOpen(false)}
                userRole="family"
            />

            <div className="flex-1 flex flex-col h-full w-full relative transition-all duration-300">
                {/* Header */}
                 <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
                    <button onClick={() => setSideOpen(true)} className="text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition">
                        <i className="ph-bold ph-list text-2xl"></i>
                    </button>
                    <span className="font-bold text-orange-900 text-lg">Family Portal</span>
                    <div className="w-8"></div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 space-y-8">
                    {tab === 'home' && (
                        <div className="fade-in space-y-8">
                            {/* Intro */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <img
                                        src={user.photo || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                        alt={user.name}
                                        className="w-20 h-20 rounded-full border-4 border-white/30"
                                    />
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1">Monitoring: {user.name}</h1>
                                        <p className="opacity-90 flex items-center gap-2">
                                            <i className="ph-fill ph-map-pin"></i> {user.address || 'Location Tracking Active'}
                                        </p>
                                    </div>
                                    <div className="ml-auto bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/20">
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-wider opacity-80">Health Score</p>
                                            <p className="text-2xl font-bold">{history.score?.[history.score.length-1] || 86}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-green-400 flex items-center justify-center text-green-900">
                                            <i className="ph-bold ph-trend-up"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vitals Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl w-fit mb-3"><i className="ph-fill ph-heartbeat text-2xl"></i></div>
                                    <h3 className="text-2xl font-bold text-slate-800">{vitals.heartRate} <span className="text-sm text-slate-400">bpm</span></h3>
                                    <p className="text-sm text-slate-500">Heart Rate</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3"><i className="ph-fill ph-drop text-2xl"></i></div>
                                    <h3 className="text-2xl font-bold text-slate-800">{vitals.bp}</h3>
                                    <p className="text-sm text-slate-500">Blood Pressure</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit mb-3"><i className="ph-fill ph-sneaker-move text-2xl"></i></div>
                                    <h3 className="text-2xl font-bold text-slate-800">{vitals.steps}</h3>
                                    <p className="text-sm text-slate-500">Steps Today</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3"><i className="ph-fill ph-moon-stars text-2xl"></i></div>
                                    <h3 className="text-2xl font-bold text-slate-800">{vitals.sleep} <span className="text-sm text-slate-400">hrs</span></h3>
                                    <p className="text-sm text-slate-500">Sleep</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Recent Activity */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Alerts & Logs</h3>
                                    <div className="space-y-4">
                                        {reminders.filter(r => r.completed).slice(0, 3).map(r => (
                                            <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                                    <i className="ph-bold ph-check"></i>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-700">{r.text}</p>
                                                    <p className="text-xs text-slate-500">Completed at {r.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {reminders.filter(r => r.completed).length === 0 && (
                                            <p className="text-slate-400 text-center py-4">No recent activity logs.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Caregiver Bookings */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-lg mb-4 text-slate-800">Caregiver Bookings</h3>
                                    <div className="space-y-4">
                                        {(bookings || []).map(b => (
                                            <div key={b.id} className="flex items-center gap-4 p-3 border border-slate-100 rounded-xl">
                                                <img src={b.providerPhoto} className="w-12 h-12 rounded-full object-cover" alt="" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-800">{b.providerName}</p>
                                                    <p className="text-xs text-slate-500">{b.service} • {b.date}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                        ))}
                                        {(!bookings || bookings.length === 0) && (
                                            <p className="text-slate-400 text-center py-4">No active bookings.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'marketplace' && <MarketplaceTab user={currentUser} refreshData={refreshData} />}
                    {tab === 'telemedicine' && <TelemedicineTab />}
                </main>
            </div>
        </div>
    );
};

export default FamilyDashboard;