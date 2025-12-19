import React from 'react';
import SeniorDashboard from './SeniorDashboard';
import CaretakerDashboard from './CaretakerDashboard';

const Dashboard = ({ user, onLogout }) => {
  if (user.role === 'senior') {
    return <SeniorDashboard user={user} onLogout={onLogout} />;
  }
  
  if (user.role === 'caretaker') {
    return <CaretakerDashboard user={user} onLogout={onLogout} />;
  }

  // Fallback for Doctor (using the generic dashboard or a specific one if built later)
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Doctor Dashboard</h1>
        <p className="text-slate-500 mb-6">Welcome, Dr. {user.name}. Your dashboard is under construction.</p>
        <button onClick={onLogout} className="bg-red-500 text-white px-6 py-2 rounded-lg">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;