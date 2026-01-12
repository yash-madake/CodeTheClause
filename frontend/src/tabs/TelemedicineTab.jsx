// src/tabs/TelemedicineTab.jsx
import React, { useState, useEffect, useRef } from 'react';

const TelemedicineTab = () => {
    const [view, setView] = useState('list'); // list, call
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [callDuration, setCallDuration] = useState(0);

    const timerRef = useRef(null);

    const doctors = [
        { id: 1, name: "Dr. Anjali Sharma", specialty: "Cardiologist", status: "Online", image: "https://randomuser.me/api/portraits/women/68.jpg" },
        { id: 2, name: "Dr. Rajesh Gupta", specialty: "General Physician", status: "Online", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 3, name: "Dr. Emily Chen", specialty: "Psychiatrist", status: "Busy", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    ];

    useEffect(() => {
        if (view === 'call') {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setCallDuration(0);
        }
        return () => clearInterval(timerRef.current);
    }, [view]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartCall = (doc) => {
        setSelectedDoctor(doc);
        setView('call');
        setMessages([{sender: 'system', text: `Connected with ${doc.name}`}]);

        // Log start call to backend
        fetch('http://localhost:5000/api/telemedicine/start', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ doctorId: doc.id, doctorName: doc.name })
        }).catch(err => console.error(err));
    };

    const handleEndCall = () => {
        // Log end call
        fetch('http://localhost:5000/api/telemedicine/end', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ doctorId: selectedDoctor.id, duration: callDuration })
        }).catch(err => console.error(err));

        setView('list');
        setSelectedDoctor(null);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { sender: 'me', text: chatInput }]);
        setChatInput('');

        // Mock doctor reply
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'doctor', text: "I see. Could you describe the symptoms more?" }]);
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col animate-fade-in pb-20 md:pb-0">
            {view === 'list' && (
                <div className="p-6 space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Telemedicine Consultation</h1>
                            <p className="opacity-90">Connect with available doctors instantly for a video consultation.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map(doc => (
                            <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <img src={doc.image} alt={doc.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" />
                                    <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-white rounded-full ${doc.status === 'Online' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                                <p className="text-slate-500 mb-6">{doc.specialty}</p>
                                <button
                                    onClick={() => handleStartCall(doc)}
                                    disabled={doc.status !== 'Online'}
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${doc.status === 'Online' ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                >
                                    <i className="ph-fill ph-video-camera"></i>
                                    {doc.status === 'Online' ? 'Start Consultation' : 'Currently Busy'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'call' && selectedDoctor && (
                <div className="flex-1 flex flex-col md:flex-row h-full bg-slate-900 text-white overflow-hidden relative">
                    {/* Main Video Area */}
                    <div className="flex-1 relative flex items-center justify-center bg-slate-800">
                        {/* Doctor Video Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img src={selectedDoctor.image} className="w-full h-full object-cover opacity-50 blur-sm" alt="Doctor" />
                            <div className="absolute z-10 flex flex-col items-center">
                                <img src={selectedDoctor.image} className="w-32 h-32 rounded-full border-4 border-white/20 mb-4 animate-pulse" alt="Doctor" />
                                <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                                <p className="text-blue-300">{formatTime(callDuration)}</p>
                            </div>
                        </div>

                        {/* Self Video PIP */}
                        <div className="absolute bottom-24 right-6 w-32 h-48 bg-black rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl z-20">
                            {cameraOff ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                    <i className="ph-fill ph-video-camera-slash text-2xl"></i>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                                    Self View
                                </div>
                            )}
                        </div>

                        {/* Controls Bar */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 z-30">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`p-4 rounded-full transition ${isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                            >
                                <i className={`ph-fill ${isMuted ? 'ph-microphone-slash' : 'ph-microphone'} text-xl`}></i>
                            </button>
                            <button
                                onClick={() => setCameraOff(!cameraOff)}
                                className={`p-4 rounded-full transition ${cameraOff ? 'bg-red-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                            >
                                <i className={`ph-fill ${cameraOff ? 'ph-video-camera-slash' : 'ph-video-camera'} text-xl`}></i>
                            </button>
                            <button
                                onClick={handleEndCall}
                                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                            >
                                <i className="ph-fill ph-phone-slash text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* Chat Side Panel (Desktop) / Overlay (Mobile) */}
                    <div className="hidden md:flex w-80 bg-white border-l border-slate-200 flex-col text-slate-800">
                        <div className="p-4 border-b font-bold flex justify-between items-center bg-slate-50">
                            <span>Consultation Chat</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Secure</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : m.sender === 'system' ? 'bg-slate-100 text-slate-500 text-center w-full text-xs' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="p-4 border-t bg-slate-50">
                            <div className="flex gap-2">
                                <input
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type message..."
                                    className="flex-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                                    <i className="ph-bold ph-paper-plane-right"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TelemedicineTab;