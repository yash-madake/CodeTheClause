// src/components/RoleBasedLogin.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DB } from '../utils/db';
import Toast from './Toast';

const RoleBasedLogin = () => {
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({});
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const AUTH_BG_IMAGE = "https://image2url.com/images/1765813364304-04cd83c9-8e5b-410b-a5d0-f4d31263c553.jpg";
    const LOGO_SRC = "https://image2url.com/images/1765805243191-d5f3a19d-770b-41d8-94c1-33d7216f45f0.png";

    const showToast = (msg, type) => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const users = DB.get('users') || [];
            
            if (selectedRole === 'senior') {
                // Senior login - just phone and PIN
                const user = users.find(u => 
                    u.role === 'senior' && 
                    u.phone === formData.phone && 
                    u.pin === formData.pin
                );
                
                if (user) {
                    showToast(`Welcome back, ${user.name}`, 'success');
                    setTimeout(() => login(user), 1000);
                } else {
                    showToast('Invalid credentials', 'error');
                    setLoading(false);
                }
            } else {
                // Doctor/Caretaker login - phone, PIN, and Senior ID required
                if (!formData.seniorId) {
                    showToast('Senior ID is required', 'error');
                    setLoading(false);
                    return;
                }

                const user = users.find(u => 
                    u.role === selectedRole && 
                    u.phone === formData.phone && 
                    u.pin === formData.pin
                );

                const senior = users.find(u => 
                    u.role === 'senior' && 
                    u.seniorId === formData.seniorId
                );

                if (user && senior) {
                    // Store the senior ID they're accessing
                    const userWithSenior = { ...user, selectedSeniorId: formData.seniorId };
                    sessionStorage.setItem('selectedSeniorId', formData.seniorId);
                    showToast(`Welcome, ${user.name}`, 'success');
                    setTimeout(() => login(userWithSenior), 1000);
                } else if (!user) {
                    showToast('Invalid credentials', 'error');
                    setLoading(false);
                } else if (!senior) {
                    showToast('Senior ID not found', 'error');
                    setLoading(false);
                }
            }
        }, 1000);
    };

    const roleCards = [
        {
            role: 'senior',
            icon: 'ph-user',
            title: 'Senior Citizen',
            description: 'Access your personal health dashboard',
            color: 'blue',
            gradient: 'from-blue-900 to-blue-700'
        },
        {
            role: 'doctor',
            icon: 'ph-stethoscope',
            title: 'Doctor',
            description: 'View patient medical records',
            color: 'purple',
            gradient: 'from-purple-900 to-purple-700'
        },
        {
            role: 'caretaker',
            icon: 'ph-heart',
            title: 'Caretaker',
            description: 'Monitor senior daily activities',
            color: 'green',
            gradient: 'from-green-900 to-green-700'
        }
    ];

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ 
                backgroundImage: `url('${AUTH_BG_IMAGE}')`,
                backgroundColor: 'rgba(0,0,0,0.4)', 
                backgroundBlendMode: 'overlay'
            }}
        >
            <Toast msg={toast?.msg} type={toast?.type} />

            <div className="w-full max-w-6xl bg-white/95 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
                
                {/* Role Selection View */}
                {!selectedRole && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <img 
                                    src={LOGO_SRC} 
                                    alt="Sushruta Logo" 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-900/20 shadow-lg"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-blue-900/20 shadow-lg">S</div>';
                                    }}
                                />
                            </div>
                            <h1 className="text-4xl font-bold text-blue-900 mb-2">SUSHRUTA</h1>
                            <p className="text-slate-600 text-lg">Select Your Role to Continue</p>
                        </div>

                        {/* Role Cards */}
                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {roleCards.map((card) => (
                                <button
                                    key={card.role}
                                    onClick={() => setSelectedRole(card.role)}
                                    className={`group p-8 border-2 border-slate-200 rounded-2xl hover:border-${card.color}-600 hover:shadow-xl transition-all duration-300 text-center`}
                                >
                                    <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white text-3xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <i className={`ph-fill ${card.icon}`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                                    <p className="text-sm text-slate-500">{card.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Login Form View */}
                {selectedRole && (
                    <div className="flex flex-col md:flex-row min-h-[600px] animate-fade-in">
                        
                        {/* Left Side - Branding */}
                        <div className={`md:w-5/12 bg-gradient-to-br ${roleCards.find(r => r.role === selectedRole)?.gradient} p-12 text-white flex flex-col justify-between relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                            
                            <div className="z-10">
                                <button 
                                    onClick={() => setSelectedRole(null)}
                                    className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition"
                                >
                                    <i className="ph-bold ph-arrow-left text-xl"></i>
                                    <span>Back to Role Selection</span>
                                </button>
                                
                                <div className="flex justify-center mb-6">
                                    <img 
                                        src={LOGO_SRC} 
                                        alt="Sushruta Logo" 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 bg-white shadow-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div class="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-4xl border-4 border-white/20 shadow-lg">S</div>';
                                        }}
                                    />
                                </div>
                                <h1 className="text-3xl font-bold mb-2 text-center">SUSHRUTA</h1>
                                <p className="text-white/80 text-center">
                                    {selectedRole === 'senior' && 'Your Personal Health Companion'}
                                    {selectedRole === 'doctor' && 'Patient Care Management'}
                                    {selectedRole === 'caretaker' && 'Senior Care Dashboard'}
                                </p>
                            </div>

                            <div className="z-10 space-y-4 hidden md:block">
                                <div className="flex items-center gap-3">
                                    <i className="ph-fill ph-shield-check text-2xl text-yellow-400"></i>
                                    <span className="text-sm opacity-90">Secure & HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <i className="ph-fill ph-heartbeat text-2xl text-yellow-400"></i>
                                    <span className="text-sm opacity-90">Real-time Health Monitoring</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <i className="ph-fill ph-users-three text-2xl text-yellow-400"></i>
                                    <span className="text-sm opacity-90">Connected Care Network</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="md:w-7/12 p-8 md:p-12 flex items-center justify-center">
                            <div className="w-full max-w-md">
                                <div className="mb-8">
                                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${roleCards.find(r => r.role === selectedRole)?.gradient} rounded-2xl flex items-center justify-center text-white text-2xl`}>
                                        <i className={`ph-fill ${roleCards.find(r => r.role === selectedRole)?.icon}`}></i>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                                        {roleCards.find(r => r.role === selectedRole)?.title} Login
                                    </h2>
                                    <p className="text-slate-500 text-center">
                                        {selectedRole === 'senior' && 'Enter your credentials to access your dashboard'}
                                        {selectedRole === 'doctor' && 'Enter credentials and Senior ID to view patient data'}
                                        {selectedRole === 'caretaker' && 'Enter credentials and Senior ID to monitor activities'}
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="relative">
                                        <i className="ph-bold ph-phone absolute left-4 top-4 text-slate-400 text-lg"></i>
                                        <input 
                                            name="phone" 
                                            type="tel" 
                                            placeholder="Mobile Number" 
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>

                                    <div className="relative">
                                        <i className="ph-bold ph-lock-key absolute left-4 top-4 text-slate-400 text-lg"></i>
                                        <input 
                                            name="pin" 
                                            type="password" 
                                            placeholder="4-Digit PIN" 
                                            maxLength="4"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>

                                    {/* Senior ID field for Doctor and Caretaker */}
                                    {(selectedRole === 'doctor' || selectedRole === 'caretaker') && (
                                        <div className="relative animate-slide-up">
                                            <i className="ph-bold ph-identification-card absolute left-4 top-4 text-slate-400 text-lg"></i>
                                            <input 
                                                name="seniorId" 
                                                type="text" 
                                                placeholder="Senior ID (e.g., SEN001)" 
                                                className="w-full pl-12 pr-4 py-3.5 bg-blue-50 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                                                onChange={handleInputChange}
                                                required 
                                            />
                                            <p className="text-xs text-slate-500 mt-1.5 ml-1">
                                                Enter the Senior ID you want to access
                                            </p>
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-gradient-to-r ${roleCards.find(r => r.role === selectedRole)?.gradient} text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6`}
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <span>Login</span>
                                                <i className="ph-bold ph-sign-in text-lg"></i>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-xs text-slate-600 text-center">
                                        <i className="ph-fill ph-info text-blue-900"></i> For demo purposes, credentials are stored locally
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleBasedLogin;
