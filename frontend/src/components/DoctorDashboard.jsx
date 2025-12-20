// src/components/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DB } from '../utils/db';

const DoctorDashboard = () => {
    const { currentUser, logout } = useAuth();
    const [seniorData, setSeniorData] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Load senior data based on selectedSeniorId
        const seniorId = sessionStorage.getItem('selectedSeniorId');
        if (seniorId) {
            const users = DB.get('users') || [];
            const senior = users.find(u => u.role === 'senior' && u.seniorId === seniorId);
            if (senior) {
                setSeniorData(senior);
            }
        }
    }, []);

    if (!seniorData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading patient data...</p>
                </div>
            </div>
        );
    }

    const sections = [
        { id: 'overview', icon: 'ph-squares-four', label: 'Overview' },
        { id: 'history', icon: 'ph-clock-clockwise', label: 'Medical History' },
        { id: 'reports', icon: 'ph-file-text', label: 'Reports' },
        { id: 'prescriptions', icon: 'ph-prescription', label: 'Prescriptions' },
        { id: 'appointments', icon: 'ph-calendar', label: 'Appointments' },
        { id: 'vitals', icon: 'ph-heartbeat', label: 'Vitals' }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <aside className={`absolute inset-y-0 left-0 z-40 w-72 bg-gradient-to-br from-purple-900 to-purple-700 text-white shadow-2xl transform transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-purple-600">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">SUSHRUTA</h1>
                        <button 
                            onClick={() => setSidebarOpen(false)} 
                            className="md:hidden text-white/80 hover:text-white"
                        >
                            <i className="ph-bold ph-x text-xl"></i>
                        </button>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center text-purple-900 font-bold text-lg">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Dr. {currentUser.name}</p>
                                <p className="text-xs text-purple-200">{currentUser.specialization || 'Physician'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto flex-1">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => {
                                setActiveSection(section.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                activeSection === section.id 
                                    ? 'bg-white text-purple-900 font-bold shadow-lg' 
                                    : 'text-purple-100 hover:bg-white/10'
                            }`}
                        >
                            <i className={`ph-bold ${section.icon} text-xl`}></i>
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-purple-600">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-purple-100 hover:bg-white/10 rounded-xl transition"
                    >
                        <i className="ph-bold ph-sign-out text-xl"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-slate-600 hover:text-slate-900"
                        >
                            <i className="ph-bold ph-list text-2xl"></i>
                        </button>
                        
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-900 font-bold text-xl">
                                    {seniorData.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-800">{seniorData.name}</h2>
                                    <p className="text-sm text-slate-500">
                                        Patient ID: <span className="font-semibold text-purple-600">{seniorData.seniorId}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                                Doctor View
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Patient Info Banner - Always visible */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-6">
                            <img 
                                src={seniorData.photo || `https://ui-avatars.com/api/?name=${seniorData.name}`}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                                alt={seniorData.name}
                            />
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Patient</p>
                                    <p className="text-lg font-bold text-slate-800">{seniorData.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Age</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {seniorData.dob ? new Date().getFullYear() - new Date(seniorData.dob).getFullYear() : 'N/A'} yrs
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Blood Group</p>
                                    <p className="text-lg font-bold text-slate-800">{seniorData.bloodGroup || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Contact</p>
                                    <p className="text-lg font-bold text-slate-800">{seniorData.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    {activeSection === 'overview' && <OverviewSection seniorData={seniorData} />}
                    {activeSection === 'history' && <MedicalHistorySection seniorData={seniorData} />}
                    {activeSection === 'reports' && <ReportsSection seniorData={seniorData} />}
                    {activeSection === 'prescriptions' && <PrescriptionsSection seniorData={seniorData} />}
                    {activeSection === 'appointments' && <AppointmentsSection seniorData={seniorData} />}
                    {activeSection === 'vitals' && <VitalsSection seniorData={seniorData} />}
                </main>
            </div>
        </div>
    );
};

// Section Components
const OverviewSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Patient Overview</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 text-2xl">
                        <i className="ph-fill ph-heartbeat"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-semibold">Blood Pressure</p>
                        <p className="text-2xl font-bold text-slate-800">120/80</p>
                    </div>
                </div>
                <p className="text-xs text-green-600 font-semibold">Normal Range</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                        <i className="ph-fill ph-heart"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-semibold">Heart Rate</p>
                        <p className="text-2xl font-bold text-slate-800">72 <span className="text-sm text-slate-400">bpm</span></p>
                    </div>
                </div>
                <p className="text-xs text-green-600 font-semibold">Normal Range</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
                        <i className="ph-fill ph-thermometer"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-semibold">Temperature</p>
                        <p className="text-2xl font-bold text-slate-800">98.6 <span className="text-sm text-slate-400">°F</span></p>
                    </div>
                </div>
                <p className="text-xs text-green-600 font-semibold">Normal</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Current Medications</h3>
            <div className="space-y-3">
                {seniorData.meds && seniorData.meds.length > 0 ? (
                    seniorData.meds.map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <i className="ph-fill ph-pill"></i>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{med.name}</p>
                                    <p className="text-sm text-slate-500">{med.dose} - {med.schedule}</p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">{med.qty}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 text-center py-4">No medications recorded</p>
                )}
            </div>
        </div>
    </div>
);

const MedicalHistorySection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Medical History</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Chronic Conditions</h3>
            <div className="space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="font-semibold text-slate-800">Type 2 Diabetes</p>
                    <p className="text-sm text-slate-600 mt-1">Diagnosed: 2020 • Controlled with Metformin</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="font-semibold text-slate-800">Hypertension</p>
                    <p className="text-sm text-slate-600 mt-1">Diagnosed: 2018 • Managed with Amlodipine</p>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Allergies</h3>
            <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold">Penicillin</span>
                <span className="px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-semibold">Sulfa Drugs</span>
            </div>
        </div>
    </div>
);

const ReportsSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Medical Reports</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
            {['Blood Test Report', 'ECG Report', 'X-Ray Chest', 'Diabetes Panel'].map((report, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
                            <i className="ph-fill ph-file-text"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800">{report}</h3>
                            <p className="text-sm text-slate-500">Dec 15, 2025</p>
                        </div>
                        <i className="ph-bold ph-download-simple text-xl text-slate-400 hover:text-purple-600"></i>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const PrescriptionsSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Prescriptions</h2>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2">
                <i className="ph-bold ph-plus"></i>
                New Prescription
            </button>
        </div>
        
        <div className="space-y-4">
            {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Prescription #{idx + 1}</h3>
                            <p className="text-sm text-slate-500">Date: Dec {15 - idx}, 2025</p>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">Active</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="font-semibold text-slate-700">Metformin 500mg</span>
                            <span className="text-sm text-slate-500">1 Tab - Morning & Night</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AppointmentsSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center gap-2">
                <i className="ph-bold ph-plus"></i>
                Schedule Appointment
            </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">Upcoming</span>
                    <span className="text-sm font-semibold text-slate-600">Dec 25, 2025</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Follow-up Consultation</h3>
                <p className="text-sm text-slate-600">10:00 AM - 11:00 AM</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold">Completed</span>
                    <span className="text-sm font-semibold text-slate-600">Dec 10, 2025</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Regular Checkup</h3>
                <p className="text-sm text-slate-600">2:00 PM - 3:00 PM</p>
            </div>
        </div>
    </div>
);

const VitalsSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Vital Signs History</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Readings</h3>
            <div className="space-y-4">
                {['Dec 20', 'Dec 19', 'Dec 18', 'Dec 17'].map((date, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
                        <span className="font-semibold text-slate-700">{date}</span>
                        <div className="flex gap-6 text-sm">
                            <div>
                                <span className="text-slate-500">BP: </span>
                                <span className="font-semibold text-slate-800">120/80</span>
                            </div>
                            <div>
                                <span className="text-slate-500">HR: </span>
                                <span className="font-semibold text-slate-800">72 bpm</span>
                            </div>
                            <div>
                                <span className="text-slate-500">Temp: </span>
                                <span className="font-semibold text-slate-800">98.6°F</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default DoctorDashboard;
