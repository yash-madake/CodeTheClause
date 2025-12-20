// src/components/SeniorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MockBackend } from '../utils/db';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import HealthScoreCard from './HealthScoreCard';
import MedicineTab from '../tabs/MedicineTab';
import ReportsTab from '../tabs/ReportsTab';
import WellnessTab from '../tabs/WellnessTab';
import AppointmentsTab from '../tabs/AppointmentsTab';

const ProfileTab = ({ data }) => {
    const user = data.user;
    return (
        <div className="p-8 pb-32">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                    <img 
                        src={user.photo || "https://ui-avatars.com/api/?name=" + user.name} 
                        className="w-24 h-24 rounded-full" 
                        alt="Profile" 
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-slate-500">{user.phone} • {user.role}</p>
                        {user.seniorId && (
                            <p className="text-sm text-blue-600 font-semibold mt-1">
                                Senior ID: {user.seniorId}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
                        <p className="font-semibold">{user.address}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Blood Group</label>
                        <p className="font-semibold">{user.bloodGroup}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Emergency Contact</label>
                        <p className="font-semibold">
                            {user.emergencyPrimary?.name} ({user.emergencyPrimary?.contact})
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SeniorDashboard = () => {
    const { currentUser, logout } = useAuth();
    const [tab, setTab] = useState('home');
    const [sideOpen, setSideOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [healthData, setHealthData] = useState(null);

    useEffect(() => {
        // Initialize and load data
        MockBackend.initDB();
        
        // Update user in backend if needed
        if (currentUser) {
            MockBackend.saveUser(currentUser);
            setHealthData(MockBackend.getData());
        }
    }, [currentUser]);

    const refreshData = () => setHealthData(MockBackend.getData());

    const addReminder = (text, time, day) => {
        const newReminders = [...healthData.reminders, { 
            id: Date.now(), 
            text, 
            time, 
            day, 
            completed: false 
        }];
        MockBackend.updateData({ ...healthData, reminders: newReminders });
        refreshData();
    };

    const deleteReminder = (id) => {
        const newReminders = healthData.reminders.filter(r => r.id !== id);
        MockBackend.updateData({ ...healthData, reminders: newReminders });
        refreshData();
    };

    if (!healthData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 relative">
            <Sidebar 
                activeTab={tab} 
                setTab={setTab} 
                onLogout={logout} 
                user={healthData.user} 
                isOpen={sideOpen} 
                closeMenu={() => setSideOpen(false)}
                userRole="senior"
            />

            <div className="flex-1 flex flex-col h-full w-full relative">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20">
                    <button onClick={() => setSideOpen(true)} className="text-slate-600 p-2">
                        <i className="ph-bold ph-list text-2xl"></i>
                    </button>
                    <span className="font-bold text-blue-900">SUSHRUTA</span>
                    <button onClick={() => setRightOpen(true)} className="text-slate-600 p-2">
                        <i className="ph-bold ph-calendar-blank text-2xl"></i>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto scroll-smooth">
                    {tab === 'home' && (
                        <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
                            <div className="flex justify-between items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                                        Namaste, {currentUser.name.split(' ')[0]} 🙏
                                    </h1>
                                    <p className="text-sm md:text-base text-slate-500">
                                        Here's your health summary.
                                    </p>
                                </div>
                            </div>
                            <HealthScoreCard data={healthData} refreshData={refreshData} />
                        </div>
                    )}
                    {tab === 'profile' && <ProfileTab data={healthData} />}
                    {tab === 'meds' && <MedicineTab data={healthData} refreshData={refreshData} />}
                    {tab === 'wellness' && <WellnessTab />}
                    {tab === 'reports' && <ReportsTab data={healthData} refreshData={refreshData} />}
                    {tab === 'appointments' && <AppointmentsTab data={healthData} user={currentUser} refreshData={refreshData} />}
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
