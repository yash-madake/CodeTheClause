// src/components/RoleBasedLogin.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log('Form data:', formData);
        console.log('Selected role:', selectedRole);
        try {
            await login({ ...formData, role: selectedRole });
            // The AuthContext will handle navigation on successful login
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // --- UPDATED ROLE CONFIGURATION WITH IMAGES & QUOTES ---
    const roleCards = [
        {
            role: 'senior',
            icon: 'ph-user',
            title: 'Senior Citizen',
            description: 'Access your personal health dashboard',
            color: 'blue',
            gradient: 'from-blue-900 to-blue-700',
            // Image representing Senior
            roleImg: "https://cdn-icons-png.flaticon.com/512/2966/2966343.png", 
            quote: "Aging is not lost youth but a new stage of opportunity and strength."
        },
        {
            role: 'doctor',
            icon: 'ph-stethoscope',
            title: 'Doctor',
            description: 'View patient medical records',
            color: 'purple',
            gradient: 'from-purple-900 to-purple-700',
            // Image representing Doctor
            roleImg: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png", 
            quote: "Medicines cure diseases, but only doctors can cure patients."
        },
        {
            role: 'caretaker',
            icon: 'ph-heart',
            title: 'Caretaker',
            description: 'Monitor senior daily activities',
            color: 'green',
            gradient: 'from-green-900 to-green-700',
            // Image representing Caretaker
            roleImg: "https://cdn-icons-png.flaticon.com/512/4435/4435427.png", 
            quote: "Caregiving is an expression of the strength and love within us."
        }
    ];

    const activeRole = roleCards.find(r => r.role === selectedRole);

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
            style={{ 
                backgroundImage: `url('${AUTH_BG_IMAGE}')`,
                backgroundColor: 'rgba(0,0,0,0.5)', 
                backgroundBlendMode: 'overlay'
            }}
        >
            <Toast msg={toast?.msg} type={toast?.type} />

            <div className="w-full max-w-6xl bg-white/95 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-500">
                
                {/* Role Selection View */}
                {!selectedRole && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <img 
                                    src={LOGO_SRC} 
                                    alt="Sushruta Logo" 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-900/20 shadow-lg"
                                />
                            </div>
                            <h1 className="text-4xl font-bold text-blue-900 mb-2">SUSHRUTA</h1>
                            <p className="text-slate-600 text-lg">Select Your Role to Continue</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {roleCards.map((card) => (
                                <button
                                    key={card.role}
                                    onClick={() => setSelectedRole(card.role)}
                                    className={`group p-8 border-2 border-slate-200 rounded-2xl hover:border-${card.color}-600 hover:shadow-xl transition-all duration-300 text-center bg-white hover:bg-slate-50`}
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
                        
                        {/* LEFT SIDE - ROLE SPECIFIC BRANDING & QUOTE */}
                        <div className={`md:w-5/12 bg-gradient-to-br ${activeRole?.gradient} p-12 text-white flex flex-col justify-between relative overflow-hidden`}>
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
                            
                            <div className="z-10 relative">
                                <button 
                                    onClick={() => setSelectedRole(null)}
                                    className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition group"
                                >
                                    <i className="ph-bold ph-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
                                    <span className="font-medium">Switch Role</span>
                                </button>
                                
                                <div className="flex flex-col items-center text-center mt-4">
                                    <div className="w-40 h-40 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center p-6 border border-white/20 shadow-xl mb-6 animate-float">
                                        <img 
                                            src={activeRole?.roleImg} 
                                            alt={activeRole?.title} 
                                            className="w-full h-full object-contain drop-shadow-md"
                                        />
                                    </div>
                                    <h1 className="text-3xl font-bold mb-2 tracking-wide">{activeRole?.title} Portal</h1>
                                    <div className="w-16 h-1 bg-yellow-400 rounded-full mb-6"></div>
                                    
                                    <p className="text-xl font-light italic leading-relaxed text-white/90">
                                        "{activeRole?.quote}"
                                    </p>
                                </div>
                            </div>

                            <div className="z-10 space-y-3 hidden md:block mt-8 opacity-80 text-sm">
                                <div className="flex items-center gap-3">
                                    <i className="ph-fill ph-shield-check text-yellow-400 text-xl"></i>
                                    <span>Secure & HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <i className="ph-fill ph-globe text-yellow-400 text-xl"></i>
                                    <span>Accessible Anywhere</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - LOGIN FORM */}
                        <div className="md:w-7/12 p-8 md:p-12 flex items-center justify-center bg-white">
                            <div className="w-full max-w-md">
                                <div className="mb-8 text-center md:text-left">
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                        Welcome Back
                                    </h2>
                                    <p className="text-slate-500">
                                        Please authenticate to access the {activeRole?.title} dashboard.
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <i className="ph-bold ph-phone text-xl"></i>
                                        </div>
                                        <input 
                                            name="phone" 
                                            type="tel" 
                                            placeholder="Mobile Number" 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-700"
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            <i className="ph-bold ph-lock-key text-xl"></i>
                                        </div>
                                        <input 
                                            name="pin" 
                                            type="password" 
                                            placeholder="4-Digit PIN" 
                                            maxLength="4"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-slate-700"
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>

                                    {/* Senior ID field for Doctor and Caretaker */}
                                    {(selectedRole === 'doctor' || selectedRole === 'caretaker') && (
                                        <div className="relative group animate-slide-up">
                                            <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                                <i className="ph-bold ph-identification-card text-xl"></i>
                                            </div>
                                            <input 
                                                name="seniorId" 
                                                type="text" 
                                                placeholder="Senior ID (e.g., SEN001)" 
                                                className="w-full pl-12 pr-4 py-4 bg-blue-50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-600 outline-none transition-all font-medium text-blue-900 placeholder:text-blue-300"
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-gradient-to-r ${activeRole?.gradient} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4`}
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <span>Secure Login</span>
                                                <i className="ph-bold ph-arrow-right"></i>
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-xs text-slate-400">
                                        Protected by End-to-End Encryption
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