// src/tabs/MarketplaceTab.jsx
import React, { useState } from 'react';
import { MockBackend } from '../utils/db';

const MarketplaceTab = ({ user, refreshData }) => {
    const [filter, setFilter] = useState('All');
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    const providers = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Certified Nurse",
            photo: "https://randomuser.me/api/portraits/women/44.jpg",
            rate: "$25/hr",
            rating: 4.9,
            reviews: 124,
            specialty: "Medical Care",
            trustScore: 98,
            verified: true
        },
        {
            id: 2,
            name: "David Chen",
            role: "Physiotherapist",
            photo: "https://randomuser.me/api/portraits/men/32.jpg",
            rate: "$40/hr",
            rating: 4.8,
            reviews: 89,
            specialty: "Therapy",
            trustScore: 95,
            verified: true
        },
        {
            id: 3,
            name: "Maria Rodriguez",
            role: "Home Companion",
            photo: "https://randomuser.me/api/portraits/women/68.jpg",
            rate: "$18/hr",
            rating: 4.7,
            reviews: 210,
            specialty: "Companionship",
            trustScore: 92,
            verified: true
        },
        {
            id: 4,
            name: "James Wilson",
            role: "Emergency EMT",
            photo: "https://randomuser.me/api/portraits/men/85.jpg",
            rate: "$50/hr",
            rating: 5.0,
            reviews: 45,
            specialty: "Emergency",
            trustScore: 99,
            verified: true
        }
    ];

    const handleBook = () => {
        if (!bookingDate || !bookingTime) {
            alert("Please select date and time.");
            return;
        }

        const data = MockBackend.getData();
        const newBooking = {
            id: Date.now(),
            providerId: selectedProvider.id,
            providerName: selectedProvider.name,
            providerPhoto: selectedProvider.photo,
            service: selectedProvider.role,
            date: bookingDate,
            time: bookingTime,
            status: 'Pending',
            bookedBy: user.name,
            bookedRole: user.role
        };

        if (!data.bookings) data.bookings = [];
        data.bookings.push(newBooking);
        MockBackend.updateData(data);

        // Also call backend API
        fetch('http://localhost:5000/api/marketplace/book', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newBooking)
        }).catch(err => console.error(err));

        alert(`Booking Request Sent to ${selectedProvider.name}!`);
        setSelectedProvider(null);
        if (refreshData) refreshData();
    };

    const filteredProviders = filter === 'All' ? providers : providers.filter(p => p.specialty === filter);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Caregiver Marketplace</h1>
                    <p className="opacity-90 max-w-xl">Find trusted, verified professionals for medical care, therapy, and companionship.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scroll">
                {['All', 'Medical Care', 'Therapy', 'Companionship', 'Emergency'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-violet-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map(provider => (
                    <div key={provider.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="relative">
                                <img src={provider.photo} alt={provider.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                                {provider.verified && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Verified">
                                        <i className="ph-fill ph-seal-check text-xs"></i>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-1">
                                    Trust Score: {provider.trustScore}
                                </span>
                                <p className="font-bold text-slate-800 text-lg">{provider.rate}</p>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800">{provider.name}</h3>
                        <p className="text-slate-500 text-sm mb-3">{provider.role}</p>

                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                            <span className="flex items-center gap-1 text-amber-500 font-bold">
                                <i className="ph-fill ph-star"></i> {provider.rating}
                            </span>
                            <span>•</span>
                            <span>{provider.reviews} Reviews</span>
                        </div>

                        <button
                            onClick={() => setSelectedProvider(provider)}
                            className="w-full py-3 bg-violet-50 text-violet-600 font-bold rounded-xl hover:bg-violet-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Book Now</span>
                            <i className="ph-bold ph-calendar-plus"></i>
                        </button>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedProvider(null)}>
                    <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl relative animate-bounce-in" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedProvider(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500">
                            <i className="ph-bold ph-x"></i>
                        </button>

                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Book Service</h2>

                        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                            <img src={selectedProvider.photo} className="w-14 h-14 rounded-xl object-cover" alt="" />
                            <div>
                                <h3 className="font-bold text-slate-800">{selectedProvider.name}</h3>
                                <p className="text-sm text-slate-500">{selectedProvider.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                                    value={bookingDate}
                                    onChange={e => setBookingDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Select Time</label>
                                <input
                                    type="time"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500"
                                    value={bookingTime}
                                    onChange={e => setBookingTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleBook}
                            className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl shadow-lg hover:bg-violet-700 transition flex items-center justify-center gap-2"
                        >
                            <span>Confirm Booking</span>
                            <i className="ph-bold ph-check"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketplaceTab;