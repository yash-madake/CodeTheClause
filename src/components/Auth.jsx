import React, { useState } from 'react';
import { ShieldCheck, Activity, Users, User, Heart, Stethoscope, Phone, Lock, ArrowLeft, LockOpen } from 'lucide-react';
import { DB } from '../utils/db';
import Toast from './Toast';

const Auth = ({ onLogin }) => {
  const [view, setView] = useState('login'); 
  const [role, setRole] = useState('senior');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [otp, setOtp] = useState('');
  const [genOtp, setGenOtp] = useState(null);
  const [imgError, setImgError] = useState(false);

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
      const users = DB.get('users');
      const user = users?.find(u => u.phone === formData.loginPhone && u.pin === formData.loginPin);
      if (user) {
        showToast(`Welcome back, ${user.name}`, 'success');
        setTimeout(() => onLogin(user), 1500);
      } else {
        showToast('Invalid Credentials', 'error');
        setLoading(false);
      }
    }, 1500);
  };

  const triggerOtp = (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'phone', 'pin'];
    const isValid = requiredFields.every(field => formData[field]);
    
    if (!isValid) return showToast('Please fill required fields', 'error');

    setLoading(true);
    const code = Math.floor(1000 + Math.random() * 9000);
    setGenOtp(code);

    setTimeout(() => {
      alert(`🔐 SUSHRUTA OTP: ${code}`); 
      setLoading(false);
      setView('otp');
    }, 1500);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (parseInt(otp) === genOtp) {
      const users = DB.get('users') || [];
      const newUser = { ...formData, role: role, meds: [] };
      users.push(newUser);
      DB.save('users', users);
      showToast('Registration Successful!', 'success');
      setView('login');
    } else {
      showToast('Invalid OTP', 'error');
    }
  };

  const renderFormFields = () => {
    const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all";
    
    switch (role) {
      case 'senior':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <input name="name" placeholder="Full Name" className={`${inputClass} col-span-2`} onChange={handleInputChange} required />
            <input name="dob" type="date" className={inputClass} onChange={handleInputChange} required />
            <select name="gender" className={inputClass} onChange={handleInputChange}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input name="phone" type="tel" placeholder="Mobile Number" className={inputClass} onChange={handleInputChange} required />
            <select name="bloodGroup" className={inputClass} onChange={handleInputChange}>
              <option value="">Blood Group</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
            <textarea name="address" placeholder="Address (City / Area)" className={`${inputClass} col-span-2`} rows="2" onChange={handleInputChange}></textarea>
            
            <div className="col-span-2 bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="text-red-800 text-sm font-bold mb-3 flex items-center gap-2"><Heart size={16} className="fill-red-500 text-red-500"/> Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-3">
                <input name="emergencyName" placeholder="Contact Name" className="p-2 bg-white border border-red-200 rounded outline-none text-sm" onChange={handleInputChange} />
                <input name="emergencyPhone" placeholder="Contact Phone" className="p-2 bg-white border border-red-200 rounded outline-none text-sm" onChange={handleInputChange} />
              </div>
            </div>
            <input name="pin" type="password" placeholder="Set 4-Digit PIN" maxLength="4" className={`${inputClass} col-span-2`} onChange={handleInputChange} required />
          </div>
        );
      case 'caretaker':
        return (
          <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <input name="name" placeholder="Full Name" className={inputClass} onChange={handleInputChange} required />
            <select name="relation" className={inputClass} onChange={handleInputChange}>
              <option value="">Relation to Senior</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Nurse">Professional Nurse</option>
            </select>
            <input name="phone" type="tel" placeholder="Mobile Number" className={inputClass} onChange={handleInputChange} required />
            <input name="email" type="email" placeholder="Email (Optional)" className={inputClass} onChange={handleInputChange} />
            <input name="address" placeholder="Address (City)" className={inputClass} onChange={handleInputChange} />
            <input name="pin" type="password" placeholder="Set 4-Digit PIN" maxLength="4" className={inputClass} onChange={handleInputChange} required />
          </div>
        );
      case 'doctor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <input name="name" placeholder="Dr. Full Name" className={`${inputClass} col-span-2`} onChange={handleInputChange} required />
            <select name="specialization" className={inputClass} onChange={handleInputChange}>
              <option value="">Specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="General">General Physician</option>
              <option value="Ortho">Orthopedic</option>
            </select>
            <input name="regNo" placeholder="Medical Reg. No." className={inputClass} onChange={handleInputChange} required />
            <input name="clinic" placeholder="Hospital / Clinic Name" className={`${inputClass} col-span-2`} onChange={handleInputChange} />
            <input name="phone" type="tel" placeholder="Contact Number" className={`${inputClass} col-span-2`} onChange={handleInputChange} required />
            
            <div className="col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-sm text-slate-500 block mb-2">Consultation Mode</label>
              <div className="flex gap-4">
                {['Online', 'Offline', 'Both'].map(mode => (
                   <label key={mode} className="flex items-center gap-2 text-sm cursor-pointer">
                     <input type="radio" name="mode" value={mode} onChange={handleInputChange} className="accent-blue-900" /> {mode}
                   </label>
                ))}
              </div>
            </div>
            <input name="pin" type="password" placeholder="Set 4-Digit PIN" maxLength="4" className={`${inputClass} col-span-2`} onChange={handleInputChange} required />
          </div>
        );
      default: return null;
    }
  };

  return (
        <div 
        className="min-h-screen flex items-center justify-center p-4 font-[Outfit] bg-cover bg-center bg-no-repeat relative"
        style={{ 
            backgroundImage: `url('https://image2url.com/images/1765813364304-04cd83c9-8e5b-410b-a5d0-f4d31263c553.jpg')` // <--- Replace with your image URL
        }}
        >
        {/* Optional: Dark Overlay to make the background slightly darker so the card pops out more */}
        <div className="absolute inset-0 bg-black/30"></div>
      <Toast msg={toast?.msg} type={toast?.type} />

      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/20">
        
        {/* LEFT SIDE: Branding */}
        <div className="md:w-5/12 bg-gradient-to-br from-blue-900 to-blue-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="z-10 text-center md:text-left">
            <div className="flex justify-center ">
               {!imgError ? (
                  <img 
                    src={LOGO_SRC} 
                    alt="Logo"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 border-4 border-white/20 bg-white shadow-lg"
                    onError={() => setImgError(true)}
                  />
               ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-4xl mb-4 border-4 border-white/20 shadow-lg">S</div>
               )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">SUSHRUTA</h1>
            <p className="text-blue-100 font-light tracking-wide  text-center text-sm md:text-base">Ancient Wisdom, Modern Care.</p>
          </div>

          <div className="z-10 mt-8 space-y-5 hidden md:block">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-yellow-400" size={24} />
              <span className="text-sm opacity-90">Secure Health Data</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-yellow-400" size={24} />
              <span className="text-sm opacity-90">Real-time Vitals Monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-yellow-400" size={24} />
              <span className="text-sm opacity-90">Community & Doctor Connect</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Dynamic Views */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center relative">
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 mb-8">Access your health dashboard</p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input name="loginPhone" type="tel" placeholder="Mobile Number" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition-all" onChange={handleInputChange} required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input name="loginPin" type="password" placeholder="4-Digit PIN" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition-all" onChange={handleInputChange} required />
                </div>
                <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition active:scale-[0.98] flex justify-center items-center">
                  {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Login'}
                </button>
              </form>
              <p className="text-center mt-6 text-slate-500 text-sm">
                New to Sushruta? <button onClick={() => setView('role-select')} className="text-blue-900 font-bold hover:underline">Create Account</button>
              </p>
            </div>
          )}

          {/* ROLE SELECTION VIEW */}
           {view === 'role-select' && (
            <div className="animate-in fade-in duration-500 w-full max-w-md mx-auto">
                {/* 1. Back Button */}
                <button onClick={() => setView('login')} className="mb-6 text-slate-400 hover:text-blue-900 flex items-center gap-1 text-sm font-medium transition-colors">
                <ArrowLeft size={16} /> Back to Login
                </button>

                <h2 className="text-2xl font-bold text-blue-900 mb-6">Choose your Profile</h2>
                
                <div className="grid gap-4">
                {/* 2. Senior Button */}
                <button 
                    onClick={() => { setRole('senior'); setView('signup-form'); }} 
                    className="group flex items-center p-4 border border-slate-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 text-left hover:shadow-md"
                >
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User size={24} />
                    </div>
                    <div>
                    <h3 className="font-bold text-lg text-slate-800">Senior Citizen</h3>
                    <p className="text-sm text-slate-500">I want to manage my health & connect.</p>
                    </div>
                </button>

                {/* 3. Caretaker Button */}
                <button 
                    onClick={() => { setRole('caretaker'); setView('signup-form'); }} 
                    className="group flex items-center p-4 border border-slate-200 rounded-2xl hover:border-green-600 hover:bg-green-50 transition-all duration-200 text-left hover:shadow-md"
                >
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Heart size={24} className="fill-current" />
                    </div>
                    <div>
                    <h3 className="font-bold text-lg text-slate-800">Caretaker</h3>
                    <p className="text-sm text-slate-500">I am looking after a senior member.</p>
                    </div>
                </button>

                {/* 4. Doctor Button */}
                <button 
                    onClick={() => { setRole('doctor'); setView('signup-form'); }} 
                    className="group flex items-center p-4 border border-slate-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50 transition-all duration-200 text-left hover:shadow-md"
                >
                    <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Stethoscope size={24} />
                    </div>
                    <div>
                    <h3 className="font-bold text-lg text-slate-800">Doctor</h3>
                    <p className="text-sm text-slate-500">I am a medical professional.</p>
                    </div>
                </button>
                </div>
            </div>
)}

          {/* SIGNUP FORM VIEW */}
          {view === 'signup-form' && (
            <div className="animate-in fade-in duration-500 w-full">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setView('role-select')} className="text-slate-400 hover:text-blue-900 transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                  {role} Sign Up
                </span>
              </div>
              
              <form onSubmit={triggerOtp} className="space-y-4">
                {renderFormFields()}
                
                <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition mt-6 flex justify-center items-center active:scale-[0.98]">
                  {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Verify & Register'}
                </button>
              </form>
            </div>
          )}

          {/* OTP VIEW */}
          {view === 'otp' && (
            <div className="text-center max-w-sm mx-auto animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockOpen size={32} className="fill-blue-900/20" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Mobile</h2>
              <p className="text-slate-500 mb-6">Enter the code sent to your mobile</p>
              <form onSubmit={verifyOtp}>
                <input 
                  type="number" 
                  autoFocus 
                  className="w-full p-4 text-center text-3xl font-bold tracking-[0.5em] border-2 border-blue-200 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-100 outline-none mb-6 transition-all" 
                  onChange={(e) => setOtp(e.target.value)} 
                />
                <button className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition active:scale-[0.98]">
                  Confirm Registration
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;