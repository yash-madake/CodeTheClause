import React, { useState } from 'react';
import { LogOut, CheckCircle, Phone } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [imgError, setImgError] = useState(false);
  const LOGO_SRC = "https://image2url.com/images/1765805243191-d5f3a19d-770b-41d8-94c1-33d7216f45f0.png";

  return (
    <div className="min-h-screen bg-slate-50 font-[Outfit]">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {!imgError ? (
            <img 
              src={LOGO_SRC} 
              alt="Logo"
              className="w-10 h-10 rounded-full border border-slate-200 object-cover" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold border border-slate-200">S</div>
          )}
          <span className="font-bold text-xl text-blue-900">SUSHRUTA</span>
        </div>
        <button 
          onClick={onLogout} 
          className="text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="p-4 md:p-8 max-w-6xl mx-auto">
        <header className="mb-8 animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold text-slate-800">Namaste, {user.name}</h1>
          <p className="text-slate-500 capitalize flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Role: {user.role}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* General Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-900 hover:shadow-md transition duration-300">
            <h3 className="font-bold text-lg mb-2 text-slate-700">Profile Status</h3>
            <p className="text-green-600 font-medium flex items-center gap-2">
              <CheckCircle size={20} className="fill-green-100" /> Active Member
            </p>
          </div>

          {/* Senior Specific Card */}
          {user.role === 'senior' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-yellow-500 hover:shadow-md transition duration-300">
              <h3 className="font-bold text-lg mb-2 text-slate-700">Emergency Contact</h3>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="font-semibold text-slate-800">{user.emergencyName || 'Not Set'}</p>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                  <Phone size={14} /> {user.emergencyPhone || '--'}
                </p>
              </div>
            </div>
          )}

          {/* Doctor Specific Card */}
          {user.role === 'doctor' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-purple-500 hover:shadow-md transition duration-300">
              <h3 className="font-bold text-lg mb-2 text-slate-700">Consultation Mode</h3>
              <span className="bg-purple-100 text-purple-800 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold">
                 {user.mode || 'N/A'}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;