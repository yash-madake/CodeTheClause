// src/App.jsx
import React, { useState, useEffect } from 'react';
import { MockBackend } from './utils/db';

// Components
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import Auth from './components/Auth';
import HealthScoreCard from './components/HealthScoreCard';

// Tabs
import MedicineTab from './tabs/MedicineTab';
import ReportsTab from './tabs/ReportsTab';
import WellnessTab from './tabs/WellnessTab';
import GovernmentSchemesTab from './tabs/GovernmentSchemesTab';
import EmotionalWellnessTab from './tabs/EmotionalWellnessTab';
import InsuranceTab from './tabs/InsuranceTab';
import MedicineShopTab from './tabs/MedicineShopTab';
import AppointmentsTab from './tabs/AppointmentsTab';

// Profile Component (Internal for simplicity or move to tabs/ProfileTab.jsx)
const ProfileTab = ({ data, refreshData }) => {
    const user = data.user;
    return (
        <div className="p-8 pb-32">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                    <img src={user.photo || "https://ui-avatars.com/api/?name=" + user.name} className="w-24 h-24 rounded-full" alt="Profile" />
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-slate-500">{user.phone} • {user.role}</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                     <div><label className="text-xs font-bold text-slate-400 uppercase">Address</label><p className="font-semibold">{user.address}</p></div>
                     <div><label className="text-xs font-bold text-slate-400 uppercase">Blood Group</label><p className="font-semibold">{user.bloodGroup}</p></div>
                     <div><label className="text-xs font-bold text-slate-400 uppercase">Emergency Contact</label><p className="font-semibold">{user.emergencyPrimary?.name} ({user.emergencyPrimary?.contact})</p></div>
                </div>
            </div>
        </div>
    );
};

// AI Assistant Component (Simple Internal)
const AiAssistantTab = () => {
    return (
        <div className="p-8 pb-32 flex flex-col items-center justify-center text-center h-full">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-4xl text-blue-500 mb-4"><i className="ph-fill ph-robot"></i></div>
            <h2 className="text-2xl font-bold text-slate-800">AI Health Assistant</h2>
            <p className="text-slate-500 max-w-md mt-2">I am here to help answer your health questions. (Feature coming in v2.0)</p>
        </div>
    );
};

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [tab, setTab] = useState('home');
    const [sideOpen, setSideOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);
    const [healthData, setHealthData] = useState(null);

    // Initial Load
    useEffect(() => {
        const session = sessionStorage.getItem('activeUser');
        if (session) {
            setCurrentUser(JSON.parse(session));
            setHealthData(MockBackend.getData());
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        sessionStorage.setItem('activeUser', JSON.stringify(user));
        MockBackend.saveUser(user);
        setHealthData(MockBackend.getData());
    };

    const handleLogout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('activeUser');
    };

    const refreshData = () => setHealthData(MockBackend.getData());

    const addReminder = (text, time, day) => {
        const newReminders = [...healthData.reminders, { id: Date.now(), text, time, day, completed: false }];
        MockBackend.updateData({ ...healthData, reminders: newReminders });
        refreshData();
    };

    const deleteReminder = (id) => {
        const newReminders = healthData.reminders.filter(r => r.id !== id);
        MockBackend.updateData({ ...healthData, reminders: newReminders });
        refreshData();
    };

    // If not logged in, show Auth
    if (!currentUser) return <Auth onLogin={handleLogin} />;
    
    // If logged in but data loading
    if (!healthData) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 relative">
            <Sidebar 
                activeTab={tab} 
                setTab={setTab} 
                onLogout={handleLogout} 
                user={healthData.user} 
                isOpen={sideOpen} 
                closeMenu={() => setSideOpen(false)} 
            />

            <div className="flex-1 flex flex-col h-full w-full relative">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 shrink-0 z-20">
                    <button onClick={() => setSideOpen(true)} className="text-slate-600 p-2"><i className="ph-bold ph-list text-2xl"></i></button>
                    <span className="font-bold text-blue-900">SUSHRUTA</span>
                    <button onClick={() => setRightOpen(true)} className="text-slate-600 p-2"><i className="ph-bold ph-calendar-blank text-2xl"></i></button>
                </header>

                <main className="flex-1 overflow-y-auto scroll-smooth">
                    {tab === 'home' && (
                        <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
                             <div className="flex justify-between items-center mb-6 gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Namaste, {currentUser.name.split(' ')[0]} 🙏</h1>
                                    <p className="text-sm md:text-base text-slate-500">Here's your health summary.</p>
                                </div>
                            </div>
                            {/* Dashboard Widgets */}
                            <HealthScoreCard data={healthData} refreshData={refreshData} />
                            
                            {/* Simple Quick Links if needed here, or redirect to tabs */}
                        </div>
                    )}
                    {tab === 'profile' && <ProfileTab data={healthData} refreshData={refreshData} />}
                    {tab === 'meds' && <MedicineTab data={healthData} refreshData={refreshData} />}
                    {tab === 'wellness' && <WellnessTab />}
                    {tab === 'assistant' && <AiAssistantTab />}
                    {tab === 'reports' && <ReportsTab data={healthData} refreshData={refreshData} />}
                    {tab === 'appointments' && <AppointmentsTab data={healthData} user={currentUser} refreshData={refreshData} />}
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
}

export default App;