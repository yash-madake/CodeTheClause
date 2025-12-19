import React, { useState, useEffect, useRef } from 'react';

const CaretakerDashboard = ({ user, onLogout }) => {
  const [selectedSeniorId, setSelectedSeniorId] = useState('ravindra');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'seniors', 'addPatient', 'reports', 'gps', 'meds'
  
  // Initial Data (Ported from seniorsData)
  const [seniorsData, setSeniorsData] = useState({
    ravindra: {
      name: "Ravindra Sagare",
      vitals: { steps: 2450, heart: "72 bpm", bp: "120/80", sleep: "6h 30m" },
      meds: [{ name: 'Metformin', dose: '500mg', time: 'After Breakfast', stock: 14, status: 'Taken' }],
      schedules: [{ date: '2025-12-16', time: '11:30', title: 'Physiotherapy', type: 'Home Visit' }],
      sos: true,
      reports: []
    },
    shanti: {
      name: "Shanti Devi",
      vitals: { steps: 1100, heart: "85 bpm", bp: "140/90", sleep: "5h 10m" },
      meds: [{ name: 'Aspirin', dose: '75mg', time: 'Morning', stock: 5, status: 'Taken' }],
      schedules: [{ date: '2025-12-16', time: '14:00', title: 'Eye Checkup', type: 'Hospital' }],
      sos: false,
      reports: []
    }
  });

  // Form States
  const [newPatientName, setNewPatientName] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [newMed, setNewMed] = useState({ name: '', dose: '' });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));

  // GPS State
  const [gpsData, setGpsData] = useState({ loading: true, lat: null, lng: null, error: null });

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSenior = seniorsData[selectedSeniorId];

  // --- Handlers ---

  const handleAddPatient = () => {
    if (!newPatientName) return alert("Please enter a name");
    const id = newPatientName.toLowerCase().replace(/\s/g, '_');
    setSeniorsData(prev => ({
      ...prev,
      [id]: {
        name: newPatientName,
        vitals: { steps: 0, heart: "--", bp: "--/--", sleep: "--" },
        meds: [],
        schedules: [],
        sos: false,
        reports: []
      }
    }));
    setSelectedSeniorId(id);
    setNewPatientName('');
    setActiveModal(null);
  };

  const handleAddReport = () => {
    if (reportNote) {
      const report = { date: new Date().toLocaleString(), note: reportNote };
      setSeniorsData(prev => ({
        ...prev,
        [selectedSeniorId]: {
          ...prev[selectedSeniorId],
          reports: [report, ...prev[selectedSeniorId].reports]
        }
      }));
      setReportNote('');
      alert(`Report logged for ${activeSenior.name}`);
    }
  };

  const handleAddSchedule = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      setSeniorsData(prev => ({
        ...prev,
        [selectedSeniorId]: {
          ...prev[selectedSeniorId],
          schedules: [...prev[selectedSeniorId].schedules, { ...newEvent, type: "Reminder" }]
        }
      }));
      setNewEvent({ title: '', date: '', time: '' });
    }
  };

  const handleAddMed = () => {
    if (newMed.name && newMed.dose) {
      setSeniorsData(prev => ({
        ...prev,
        [selectedSeniorId]: {
          ...prev[selectedSeniorId],
          meds: [...prev[selectedSeniorId].meds, { ...newMed, time: 'Pending', stock: 30, status: 'Pending' }]
        }
      }));
      setNewMed({ name: '', dose: '' });
      setActiveModal(null);
    }
  };

  const dismissSOS = () => {
    setSeniorsData(prev => ({
      ...prev,
      [selectedSeniorId]: { ...prev[selectedSeniorId], sos: false }
    }));
  };

  const fetchGPS = () => {
    setActiveModal('gps');
    setGpsData({ loading: true, lat: null, lng: null, error: null });
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsData({
            loading: false,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            error: null
          });
        },
        () => setGpsData({ loading: false, error: "Location permission denied" })
      );
    } else {
      setGpsData({ loading: false, error: "Geolocation not supported" });
    }
  };

  // --- Render Helpers ---

  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2025-12-${i.toString().padStart(2, '0')}`;
      const hasEvent = activeSenior.schedules.some(e => e.date === dateStr);
      days.push(
        <div key={i} className={`py-2 ${i === 16 ? 'bg-blue-600 text-white font-bold rounded-full' : 'hover:bg-gray-100'} rounded-full cursor-pointer relative`}>
          {i}
          {hasEvent && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-[Inter] bg-[#f8fafc] text-[#1e293b]">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <h1 className="font-bold">SUSHRUTA</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 text-2xl"><i className="fas fa-bars"></i></button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r p-6 flex flex-col gap-8 h-screen sticky top-0 fixed z-40 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static absolute`}>
        <div className="hidden md:flex items-center gap-2 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">S</div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-800">SUSHRUTA</h1>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button className="bg-[#e0e7ff] text-[#4338ca] rounded-xl flex items-center gap-3 p-3 transition font-medium"><i className="fas fa-th-large w-5"></i> Dashboard</button>
          <button onClick={() => { setActiveModal('seniors'); setSidebarOpen(false); }} className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-left w-full"><i className="fas fa-users w-5"></i> My Seniors</button>
          <button onClick={() => { setActiveModal('reports'); setSidebarOpen(false); }} className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-left w-full"><i className="fas fa-file-medical w-5"></i> Saved Reports</button>
          <button onClick={() => { fetchGPS(); setSidebarOpen(false); }} className="flex items-center gap-3 p-3 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition text-left w-full">
            <i className="fas fa-map-marker-alt w-5"></i> Live GPS
          </button>
        </nav>

        <div className="mt-auto p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[10px] uppercase font-bold text-blue-500 mb-1 tracking-wider">Caretaker Account</p>
          <p className="font-bold text-gray-800">{user.name}</p>
          <button onClick={onLogout} className="text-xs text-red-500 font-bold mt-2 hover:underline">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Control Center</h2>
            <p className="text-gray-500 text-sm md:text-base">Managing health and schedules for your patients</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full xl:w-auto">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600">
                <i className="fas fa-clock"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Live Time</span>
                <span className="text-xl font-bold font-mono text-gray-800 tracking-wider">{currentTime}</span>
              </div>
            </div>

            <div className="flex flex-1 sm:flex-initial gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border w-full">
              <select 
                value={selectedSeniorId} 
                onChange={(e) => setSelectedSeniorId(e.target.value)} 
                className="bg-transparent font-semibold px-4 py-2 outline-none cursor-pointer flex-1"
              >
                {Object.keys(seniorsData).map(key => (
                  <option key={key} value={key}>{seniorsData[key].name}</option>
                ))}
              </select>
              <button onClick={() => setActiveModal('addPatient')} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap">
                <i className="fas fa-plus"></i> <span className="hidden sm:inline">Add Patient</span>
              </button>
            </div>
          </div>
        </header>

        {/* SOS Alert */}
        {activeSenior.sos && (
          <div className="mb-8 p-6 bg-red-50 border-l-8 border-red-500 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-[pulse_2s_infinite]">
            <div className="flex items-center gap-4 text-red-700 w-full">
              <div className="bg-red-500 text-white p-3 rounded-full shrink-0"><i className="fas fa-phone-alt animate-bounce"></i></div>
              <div>
                <p className="font-black text-lg uppercase">Emergency SOS Triggered!</p>
                <p className="text-sm font-medium">Patient: {activeSenior.name.split(' ')[0]} | Location: Phule Nagar</p>
              </div>
            </div>
            <button onClick={dismissSOS} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black hover:bg-red-700 w-full md:w-auto">ACKNOWLEDGE</button>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Vitals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                <i className="fas fa-walking text-emerald-500 text-xl mb-3"></i>
                <p className="text-xs font-bold text-gray-400 uppercase">Steps</p>
                <h3 className="text-2xl font-bold">{activeSenior.vitals.steps}</h3>
                <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '49%' }}></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border shadow-sm border-l-4 border-l-red-500">
                <i className="fas fa-heartbeat text-red-500 text-xl mb-3"></i>
                <p className="text-xs font-bold text-gray-400 uppercase">Pulse</p>
                <h3 className="text-2xl font-bold text-red-600">{activeSenior.vitals.heart}</h3>
              </div>
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                <i className="fas fa-tint text-blue-500 text-xl mb-3"></i>
                <p className="text-xs font-bold text-gray-400 uppercase">BP</p>
                <h3 className="text-2xl font-bold text-blue-600">{activeSenior.vitals.bp}</h3>
              </div>
              <div className="bg-white p-5 rounded-3xl border shadow-sm">
                <i className="fas fa-moon text-indigo-500 text-xl mb-3"></i>
                <p className="text-xs font-bold text-gray-400 uppercase">Sleep</p>
                <h3 className="text-2xl font-bold text-indigo-600">{activeSenior.vitals.sleep}</h3>
              </div>
            </div>

            {/* Meds Table */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Active Medications</h3>
                <button onClick={() => setActiveModal('meds')} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100">+ Add Meds</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="text-xs text-gray-400 uppercase border-b pb-2">
                    <tr>
                      <th className="pb-4 font-bold">Medicine</th>
                      <th className="pb-4 font-bold">Time</th>
                      <th className="pb-4 font-bold">Stock</th>
                      <th className="pb-4 text-right font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeSenior.meds.map((med, idx) => (
                      <tr key={idx}>
                        <td className="py-4 font-bold text-gray-700">{med.name}<br /><span className="text-[10px] text-gray-400 uppercase">{med.dose}</span></td>
                        <td className="py-4 text-sm text-gray-500 font-medium">{med.time}</td>
                        <td className="py-4"><span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold">Qty: {med.stock}</span></td>
                        <td className="py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${med.status === 'Taken' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{med.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Report */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Caretaker Daily Report</h3>
              <textarea 
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Enter notes on appetite, mood, or health complaints..." 
                className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl mb-4 focus:ring-2 ring-blue-500 outline-none text-gray-700"
              ></textarea>
              <button onClick={handleAddReport} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition w-full md:w-auto">Submit Report</button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Calendar */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Schedule Calendar</h3>
                <span className="text-sm font-bold text-blue-600">Dec 2025</span>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 mb-2">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 text-center gap-1 text-sm">
                {renderCalendar()}
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Create New Event</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Event Name" className="w-full p-3 bg-gray-50 rounded-xl text-sm border-none outline-none focus:ring-1 ring-blue-500" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="date" className="flex-1 p-3 bg-gray-50 rounded-xl text-sm border-none outline-none" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                    <input type="time" className="flex-1 p-3 bg-gray-50 rounded-xl text-sm border-none outline-none" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                    <button onClick={handleAddSchedule} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"><i className="fas fa-plus"></i></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Timeline View</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {activeSenior.schedules.map((s, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-4 bg-gray-50 hover:bg-white border rounded-2xl group">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl text-blue-600 flex items-center justify-center font-black">{s.date.split('-')[2]}</div>
                    <div className="flex-1 text-sm">
                      <p className="font-bold text-gray-800">{s.title}</p>
                      <p className="text-xs text-gray-400">{s.time} • {s.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}

      {/* Seniors List Modal */}
      {activeModal === 'seniors' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold"><i className="fas fa-users text-blue-600 mr-2"></i> Patient Directory</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-red-500 text-2xl">×</button>
            </div>
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {Object.keys(seniorsData).map(id => (
                <div key={id} onClick={() => { setSelectedSeniorId(id); setActiveModal(null); }} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 border transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{seniorsData[id].name[0]}</div>
                    <span className="font-bold">{seniorsData[id].name}</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-300"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {activeModal === 'addPatient' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Register Patient</h3>
            <div className="space-y-4">
              <input value={newPatientName} onChange={e => setNewPatientName(e.target.value)} type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 ring-blue-500" />
              <button onClick={handleAddPatient} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Create Profile</button>
              <button onClick={() => setActiveModal(null)} className="w-full text-gray-400 font-bold py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {activeModal === 'reports' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">Daily Report History: {activeSenior.name}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {activeSenior.reports.length === 0 ? (
                <p className="text-gray-500 italic">No reports found for {activeSenior.name}.</p>
              ) : (
                activeSenior.reports.map((r, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border">
                    <p className="text-[10px] font-bold text-blue-500 uppercase">{r.date}</p>
                    <p className="text-gray-700 mt-1">{r.note}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* GPS Modal */}
      {activeModal === 'gps' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">Live Tracking</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="p-4">
              <div className="h-96 bg-gray-200 rounded-2xl relative overflow-hidden">
                {gpsData.loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50/70 z-10">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 font-bold text-blue-700">Fetching Location...</p>
                  </div>
                ) : gpsData.error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 font-bold">{gpsData.error}</div>
                ) : (
                  <iframe
                    className="w-full h-full border-none"
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${gpsData.lat},${gpsData.lng}&z=16&output=embed`}
                  ></iframe>
                )}
              </div>
              {!gpsData.loading && !gpsData.error && (
                <div className="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs font-mono text-gray-600">LAT: {gpsData.lat.toFixed(5)} | LNG: {gpsData.lng.toFixed(5)}</p>
                  <a href={`https://maps.google.com/maps?q=${gpsData.lat},${gpsData.lng}`} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold hover:underline">
                    Open in Google Maps <i className="fas fa-external-link-alt ml-1"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Med Modal */}
      {activeModal === 'meds' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setActiveModal(null)}>
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Add Medication</h3>
            <div className="space-y-4">
              <input value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} type="text" placeholder="Name" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 ring-blue-500" />
              <input value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} type="text" placeholder="Dosage" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 ring-blue-500" />
              <button onClick={handleAddMed} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Save to Dashboard</button>
              <button onClick={() => setActiveModal(null)} className="w-full text-gray-400 font-bold py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CaretakerDashboard;