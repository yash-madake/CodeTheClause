// src/tabs/GpsTab.jsx
import React, { useState, useEffect } from 'react';

const GpsTab = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                    setLoading(false);
                },
                (err) => {
                    console.error(err);
                    setError("Location permission denied or unavailable.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, []);

    const refreshLocation = () => {
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                setLoading(false);
            },
            (err) => {
                setError("Unable to retrieve location.");
                setLoading(false);
            }
        );
    };

    return (
        <div className="p-4 md:p-8 space-y-8 fade-in pb-32 h-full flex flex-col">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                        <i className="ph-fill ph-map-pin text-3xl"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Live GPS Location</h1>
                        <p className="text-slate-500">Track your current position for safety</p>
                    </div>
                </div>
                <button 
                    onClick={refreshLocation} 
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition"
                >
                    <i className="ph-bold ph-arrows-clockwise"></i> Refresh
                </button>
            </div>

            {/* MAIN CONTENT CARD */}
            <div className="flex-1 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                
                {/* Loader Overlay */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-blue-800 animate-pulse">Acquiring Satellite Signal...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 text-4xl">
                            <i className="ph-fill ph-warning-circle"></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Location Error</h3>
                        <p className="text-slate-500 max-w-md">{error}</p>
                        <button onClick={refreshLocation} className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Success State - Map */}
                {!loading && !error && location.lat && (
                    <>
                        <div className="flex-1 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-inner">
                            <iframe 
                                className="w-full h-full border-none"
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
                                title="Live Location Map"
                            ></iframe>
                        </div>

                        {/* Coordinates & Actions Bar */}
                        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                                    <i className="ph-bold ph-crosshair"></i>
                                </div>
                                <div className="font-mono text-sm text-slate-600">
                                    <span className="block font-bold text-slate-800">LAT: {location.lat.toFixed(6)}</span>
                                    <span className="block font-bold text-slate-800">LNG: {location.lng.toFixed(6)}</span>
                                </div>
                            </div>

                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
                            >
                                <span>Open in Google Maps</span>
                                <i className="ph-bold ph-arrow-up-right"></i>
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GpsTab;