import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MockBackend } from '../utils/db'; // Connects to your existing DB
import { useAuth } from '../contexts/AuthContext';

const Signup = ({ onSwitchToLogin }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', phone: '', pin: '', confirmPin: '', role: 'senior'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 1. Validation
        if (formData.phone.length !== 10) {
            setError("Phone number must be 10 digits.");
            setIsLoading(false);
            return;
        }
        if (formData.pin.length < 4) {
            setError("PIN must be at least 4 digits.");
            setIsLoading(false);
            return;
        }
        if (formData.pin !== formData.confirmPin) {
            setError("PINs do not match.");
            setIsLoading(false);
            return;
        }

        // 2. Simulate Network Delay
        setTimeout(() => {
            // 3. Check if user exists
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            if (existingUsers.find(u => u.phone === formData.phone)) {
                setError("User already exists with this phone number.");
                setIsLoading(false);
                return;
            }

            // 4. Create New User Object
            const newUser = {
                role: formData.role,
                name: formData.name,
                phone: formData.phone,
                pin: formData.pin, // In a real app, hash this!
                seniorId: `SEN${Math.floor(Math.random() * 1000)}`,
                joined: new Date().toISOString()
            };

            // 5. Save to Mock DB
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            MockBackend.initDB(); // Refresh DB context

            // 6. Auto Login
            login(newUser);
            alert(`Welcome to Sushruta, ${newUser.name}!`);
        }, 1500);
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl animate-fade-in">
            <h2 className="text-3xl font-black text-slate-800 text-center">Create Account</h2>
            
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-center gap-2">
                    <i className="ph-fill ph-warning-circle"></i> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selection */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                    {['senior', 'caretaker', 'doctor'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setFormData({ ...formData, role: r })}
                            className={`py-2 text-sm font-bold rounded-lg capitalize transition-all ${
                                formData.role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <input 
                    required type="text" placeholder="Full Name"
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                    required type="tel" placeholder="Phone Number (10 digits)" maxLength="10"
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                />
                <div className="flex gap-4">
                    <input 
                        required type="password" placeholder="Set PIN" maxLength="4"
                        className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, pin: e.target.value})}
                    />
                    <input 
                        required type="password" placeholder="Confirm" maxLength="4"
                        className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={e => setFormData({...formData, confirmPin: e.target.value})}
                    />
                </div>

                <button 
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign Up"}
                </button>
            </form>

            <p className="text-center text-slate-500 text-sm">
                Already have an account? <button onClick={onSwitchToLogin} className="text-blue-600 font-bold hover:underline">Log In</button>
            </p>
        </div>
    );
};

export default Signup;