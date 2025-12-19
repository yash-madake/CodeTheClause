// src/tabs/MedicineTab.jsx
import React from 'react';
import { MockBackend } from '../utils/db';

const MedicineTab = ({ data, refreshData }) => {
    
    // Logic to mark medicine as taken
    const toggleMed = (id) => {
        const newMeds = data.meds.map(m => {
            if (m.id === id) {
                const isTaking = !m.taken;
                const newStock = typeof m.stock === 'number' 
                    ? (isTaking ? m.stock - 1 : m.stock + 1) 
                    : m.stock;
                return { ...m, taken: isTaking, stock: newStock };
            }
            return m;
        });
        MockBackend.updateData({ ...data, meds: newMeds });
        refreshData();
    };

    const dailyMeds = data.meds.filter(m => m.category === 'Daily Routine').sort((a, b) => a.taken - b.taken);
    const sosMeds = data.meds.filter(m => m.category === 'As Needed').sort((a, b) => a.taken - b.taken);

    // Reusable Card Component internal to this file
    const MedCard = ({ m, type }) => (
        <div key={m.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-2xl hover:border-amber-200 transition-all gap-4 bg-white shadow-sm animate-fade-in">
            <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`p-3 rounded-full shrink-0 ${m.taken ? 'bg-slate-100 text-slate-400' : (type === 'sos' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}`}>
                    <i className={`ph-fill ${m.type === 'Syrup' ? 'ph-drop' : 'ph-pill'} text-xl`}></i>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <h4 className={`font-bold text-lg truncate ${m.taken ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {m.name}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1 items-center">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{m.qty || m.dose}</span>
                        <span className={`${type === 'sos' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} px-2 py-0.5 rounded font-bold`}>
                            {m.instructions}
                        </span>
                        {typeof m.stock === 'number' && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.stock < 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                                Stock: {m.stock}
                            </span>
                        )}
                        {m.expiry && (
                            <span className="text-slate-400 text-[10px] font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                                Exp: {m.expiry}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => toggleMed(m.id)} 
                className={`w-full md:w-auto px-8 py-3 md:py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm 
                ${m.taken 
                    ? 'bg-slate-100 text-slate-400 cursor-default' 
                    : (type === 'sos' 
                        ? 'bg-white border-2 border-red-500 text-red-600 hover:bg-red-50' 
                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200'
                      )
                }`}
            >
                {m.taken ? (
                    <span className="flex items-center justify-center gap-2"><i className="ph-bold ph-check-circle"></i> Taken</span>
                ) : (
                    type === 'sos' ? 'Record Use' : 'Take Now'
                )}
            </button>
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-8 pb-32 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                    <i className="ph-fill ph-prescription text-2xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Medicine Cabinet</h1>
            </div>
            
            {/* Daily Routine Section */}
            <section className="space-y-4">
                <h3 className="font-bold text-lg text-slate-600 px-1 flex items-center gap-2">
                    <i className="ph-fill ph-sun-horizon text-amber-500"></i> Daily Schedule
                </h3>
                <div className="grid gap-4">
                    {dailyMeds.length > 0 ? (
                        dailyMeds.map(m => <MedCard key={m.id} m={m} type="daily" />)
                    ) : (
                        <p className="text-slate-400 italic p-4 text-center">No daily medicines scheduled.</p>
                    )}
                </div>
            </section>

            {/* SOS Section */}
            <section className="space-y-4 pt-4">
                <h3 className="font-bold text-lg text-slate-600 px-1 flex items-center gap-2">
                    <i className="ph-fill ph-first-aid text-red-500"></i> As Needed / SOS
                </h3>
                <div className="grid gap-4">
                    {sosMeds.length > 0 ? (
                        sosMeds.map(m => <MedCard key={m.id} m={m} type="sos" />)
                    ) : (
                        <p className="text-slate-400 italic p-4 text-center">No emergency medicines listed.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MedicineTab;