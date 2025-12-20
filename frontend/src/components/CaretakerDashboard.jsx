// src/components/CaretakerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DB } from '../utils/db';

const CaretakerDashboard = () => {
    const { currentUser, logout } = useAuth();
    const [seniorData, setSeniorData] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Give morning medication', time: '08:00 AM', completed: false, priority: 'high' },
        { id: 2, text: 'Assist with breakfast', time: '08:30 AM', completed: false, priority: 'medium' },
        { id: 3, text: 'Morning walk', time: '09:00 AM', completed: false, priority: 'medium' },
        { id: 4, text: 'Check blood pressure', time: '10:00 AM', completed: false, priority: 'high' },
        { id: 5, text: 'Lunch preparation', time: '12:30 PM', completed: false, priority: 'medium' },
        { id: 6, text: 'Evening medication', time: '06:00 PM', completed: false, priority: 'high' },
    ]);

    useEffect(() => {
        const seniorId = sessionStorage.getItem('selectedSeniorId');
        if (seniorId) {
            const users = DB.get('users') || [];
            const senior = users.find(u => u.role === 'senior' && u.seniorId === seniorId);
            if (senior) {
                setSeniorData(senior);
            }
        }
    }, []);

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    if (!seniorData) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-900 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading senior data...</p>
                </div>
            </div>
        );
    }

    const sections = [
        { id: 'overview', icon: 'ph-house', label: 'Overview' },
        { id: 'routine', icon: 'ph-clock', label: 'Daily Routine' },
        { id: 'medications', icon: 'ph-pill', label: 'Medications' },
        { id: 'activities', icon: 'ph-activity', label: 'Activities' },
        { id: 'tasks', icon: 'ph-list-checks', label: 'Task List' },
        { id: 'emergency', icon: 'ph-siren', label: 'Emergency' }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <aside className={`absolute inset-y-0 left-0 z-40 w-72 bg-gradient-to-br from-green-900 to-green-700 text-white shadow-2xl transform transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-green-600">
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
                            <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center text-green-900 font-bold text-lg">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{currentUser.name}</p>
                                <p className="text-xs text-green-200">
                                    {currentUser.relation || 'Caretaker'}
                                </p>
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
                                    ? 'bg-white text-green-900 font-bold shadow-lg' 
                                    : 'text-green-100 hover:bg-white/10'
                            }`}
                        >
                            <i className={`ph-bold ${section.icon} text-xl`}></i>
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-green-600">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-green-100 hover:bg-white/10 rounded-xl transition"
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
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-900 font-bold text-xl">
                                    {seniorData.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg text-slate-800">{seniorData.name}</h2>
                                    <p className="text-sm text-slate-500">
                                        Senior ID: <span className="font-semibold text-green-600">{seniorData.seniorId}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                                Caretaker View
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Senior Info Banner */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-6">
                            <img 
                                src={seniorData.photo || `https://ui-avatars.com/api/?name=${seniorData.name}`}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                                alt={seniorData.name}
                            />
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Senior Name</p>
                                    <p className="text-lg font-bold text-slate-800">{seniorData.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Age</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {seniorData.dob ? new Date().getFullYear() - new Date(seniorData.dob).getFullYear() : 'N/A'} yrs
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Contact</p>
                                    <p className="text-lg font-bold text-slate-800">{seniorData.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Blood Group</p>
                                    <p className="text-lg font-bold text-slate-800">{seniorData.bloodGroup || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    {activeSection === 'overview' && <OverviewSection seniorData={seniorData} tasks={tasks} />}
                    {activeSection === 'routine' && <RoutineSection seniorData={seniorData} />}
                    {activeSection === 'medications' && <MedicationsSection seniorData={seniorData} />}
                    {activeSection === 'activities' && <ActivitiesSection seniorData={seniorData} />}
                    {activeSection === 'tasks' && <TasksSection tasks={tasks} toggleTask={toggleTask} />}
                    {activeSection === 'emergency' && <EmergencySection seniorData={seniorData} />}
                </main>
            </div>
        </div>
    );
};

// Section Components
const OverviewSection = ({ seniorData, tasks }) => {
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const completedTasks = tasks.filter(t => t.completed).length;
    
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Daily Overview</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-2xl">
                            <i className="ph-fill ph-list-checks"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold">Tasks Pending</p>
                            <p className="text-3xl font-bold text-slate-800">{pendingTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                            <i className="ph-fill ph-check-circle"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold">Completed</p>
                            <p className="text-3xl font-bold text-slate-800">{completedTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
                            <i className="ph-fill ph-pill"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold">Medications</p>
                            <p className="text-3xl font-bold text-slate-800">{seniorData.meds?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 text-2xl">
                            <i className="ph-fill ph-heartbeat"></i>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-semibold">Health Score</p>
                            <p className="text-3xl font-bold text-slate-800">86</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Today's Schedule</h3>
                <div className="space-y-3">
                    {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl ${task.completed ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <i className={`ph-fill ${task.completed ? 'ph-check-circle' : 'ph-clock'}`}></i>
                                </div>
                                <div>
                                    <p className={`font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                        {task.text}
                                    </p>
                                    <p className="text-sm text-slate-500">{task.time}</p>
                                </div>
                            </div>
                            {task.priority === 'high' && !task.completed && (
                                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                                    Priority
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RoutineSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Daily Routine</h2>
        
        <div className="space-y-4">
            {[
                { time: '07:00 AM', activity: 'Wake Up', icon: 'ph-sun', color: 'yellow' },
                { time: '08:00 AM', activity: 'Breakfast & Morning Meds', icon: 'ph-coffee', color: 'orange' },
                { time: '09:00 AM', activity: 'Morning Walk', icon: 'ph-sneaker', color: 'green' },
                { time: '10:00 AM', activity: 'Vitals Check', icon: 'ph-heartbeat', color: 'red' },
                { time: '12:30 PM', activity: 'Lunch Time', icon: 'ph-fork-knife', color: 'blue' },
                { time: '02:00 PM', activity: 'Rest Time', icon: 'ph-bed', color: 'purple' },
                { time: '06:00 PM', activity: 'Evening Medication', icon: 'ph-pill', color: 'pink' },
                { time: '08:00 PM', activity: 'Dinner', icon: 'ph-bowl-food', color: 'indigo' },
                { time: '10:00 PM', activity: 'Bedtime', icon: 'ph-moon', color: 'slate' }
            ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-${item.color}-50 rounded-xl flex items-center justify-center text-${item.color}-600 text-2xl`}>
                            <i className={`ph-fill ${item.icon}`}></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-slate-800">{item.activity}</h3>
                            <p className="text-slate-500">{item.time}</p>
                        </div>
                        <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition">
                            Mark Done
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MedicationsSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">Medication Reminders</h2>
            <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold text-sm">
                ⏰ Next dose in 2 hours
            </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
            {seniorData.meds && seniorData.meds.length > 0 ? (
                seniorData.meds.map((med, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                                    <i className="ph-fill ph-pill"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{med.name}</h3>
                                    <p className="text-sm text-slate-500">{med.type}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${med.taken ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                {med.taken ? 'Taken' : 'Pending'}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Dosage:</span>
                                <span className="font-semibold text-slate-800">{med.dose}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Schedule:</span>
                                <span className="font-semibold text-slate-800">{med.schedule}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Stock:</span>
                                <span className="font-semibold text-slate-800">{med.stock} remaining</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition">
                            Mark as Taken
                        </button>
                    </div>
                ))
            ) : (
                <div className="col-span-2 text-center py-8 text-slate-500">
                    No medications recorded
                </div>
            )}
        </div>
    </div>
);

const ActivitiesSection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Activity Tracking</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl">
                        <i className="ph-fill ph-footprints"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-semibold">Steps Today</p>
                        <p className="text-3xl font-bold text-slate-800">1,240</p>
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Goal: 5,000 steps</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
                        <i className="ph-fill ph-moon"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-semibold">Sleep Last Night</p>
                        <p className="text-3xl font-bold text-slate-800">6.5h</p>
                    </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Target: 8 hours</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 text-2xl">
                        <i className="ph-fill ph-dumbbell"></i>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-semibold">Exercise Today</p>
                        <p className="text-3xl font-bold text-slate-800">0</p>
                    </div>
                </div>
                <button className="w-full py-2 bg-green-50 text-green-600 rounded-lg font-semibold hover:bg-green-100 transition text-sm">
                    Record Exercise
                </button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Activity Log - Today</h3>
            <div className="space-y-3">
                {[
                    { time: '08:15 AM', activity: 'Breakfast completed', icon: 'ph-fork-knife', color: 'green' },
                    { time: '09:30 AM', activity: 'Morning walk - 20 mins', icon: 'ph-sneaker', color: 'blue' },
                    { time: '10:05 AM', activity: 'Vitals recorded', icon: 'ph-heartbeat', color: 'red' },
                ].map((log, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className={`w-10 h-10 bg-${log.color}-50 rounded-lg flex items-center justify-center text-${log.color}-600`}>
                            <i className={`ph-fill ${log.icon}`}></i>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-800">{log.activity}</p>
                            <p className="text-sm text-slate-500">{log.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const TasksSection = ({ tasks, toggleTask }) => {
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Task Management</h2>
                <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2">
                    <i className="ph-bold ph-plus"></i>
                    Add Task
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Pending Tasks ({pendingTasks.length})</h3>
                <div className="space-y-3">
                    {pendingTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                            <div className="flex items-center gap-4 flex-1">
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className="w-6 h-6 border-2 border-slate-300 rounded-lg hover:border-green-600 transition"
                                ></button>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800">{task.text}</p>
                                    <p className="text-sm text-slate-500">{task.time}</p>
                                </div>
                            </div>
                            {task.priority === 'high' && (
                                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                                    High Priority
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {completedTasks.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Completed Tasks ({completedTasks.length})</h3>
                    <div className="space-y-3">
                        {completedTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                                <div className="flex items-center gap-4 flex-1">
                                    <button 
                                        onClick={() => toggleTask(task.id)}
                                        className="w-6 h-6 bg-green-600 rounded-lg flex items-center justify-center text-white"
                                    >
                                        <i className="ph-bold ph-check text-sm"></i>
                                    </button>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-500 line-through">{task.text}</p>
                                        <p className="text-sm text-slate-400">{task.time}</p>
                                    </div>
                                </div>
                                <i className="ph-bold ph-check-circle text-xl text-green-600"></i>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const EmergencySection = ({ seniorData }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800">Emergency Information</h2>
        
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl animate-pulse">
                    <i className="ph-fill ph-siren"></i>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Emergency Contacts</h3>
                    <p className="text-sm text-slate-600">Quick access to critical contacts</p>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-red-200">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 text-xl">
                        <i className="ph-fill ph-phone"></i>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Emergency Ambulance</p>
                        <p className="text-2xl font-bold text-slate-800">911</p>
                    </div>
                </div>
                <button className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2">
                    <i className="ph-bold ph-phone-call"></i>
                    Call Now
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-blue-200">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-xl">
                        <i className="ph-fill ph-user-circle"></i>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Primary Contact</p>
                        <p className="text-xl font-bold text-slate-800">
                            {seniorData.emergencyPrimary?.name || 'Not set'}
                        </p>
                        <p className="text-sm text-slate-500">
                            {seniorData.emergencyPrimary?.contact || 'N/A'}
                        </p>
                    </div>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <i className="ph-bold ph-phone-call"></i>
                    Call Contact
                </button>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Medical Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Blood Type</label>
                    <p className="text-lg font-semibold text-slate-800">{seniorData.bloodGroup || 'N/A'}</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Known Allergies</label>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">Penicillin</span>
                        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">Sulfa</span>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Current Medications</label>
                    <p className="text-sm text-slate-600">
                        {seniorData.meds?.map(m => m.name).join(', ') || 'None'}
                    </p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Doctor</label>
                    <p className="text-sm text-slate-600">Dr. {seniorData.doctor?.name || 'Not assigned'}</p>
                    <p className="text-xs text-slate-500">{seniorData.doctor?.contact || ''}</p>
                </div>
            </div>
        </div>
    </div>
);

export default CaretakerDashboard;
