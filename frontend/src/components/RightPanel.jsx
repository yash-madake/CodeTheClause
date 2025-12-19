// src/components/RightPanel.jsx
import React, { useState } from 'react';

const RightPanel = ({ reminders, isOpen, closeMenu, onAddReminder, onDeleteReminder }) => {
    const classes = isOpen 
        ? "absolute inset-y-0 right-0 z-40 w-80 bg-white border-l shadow-2xl transform translate-x-0 transition-transform duration-300" 
        : "absolute inset-y-0 right-0 z-40 w-80 bg-white border-l shadow-xl transform translate-x-full transition-transform duration-300 lg:static lg:translate-x-0";
    
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [newEvent, setNewEvent] = useState('');
    const [hour, setHour] = useState('09');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('AM');
    const [selectedReminderId, setSelectedReminderId] = useState(null);

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const startDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const totalSlots = [...Array(startDay).fill(null), ...[...Array(daysInMonth)].map((_, i) => i + 1)];

    // Filtering logic specific to your app
    const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const daysReminders = reminders.filter(r => r.day === selectedDay);
    const waterReminders = daysReminders.filter(r => r.text === "Drink Water");
    const otherReminders = daysReminders.filter(r => r.text !== "Drink Water");

    let nextWaterReminder = null;
    if (selectedDay === now.getDate()) {
            nextWaterReminder = waterReminders.find(r => parseTime(r.time) > currentMinutes && !r.completed);
    } else if (selectedDay > now.getDate()) {
            nextWaterReminder = waterReminders[0]; 
    }
    
    let filteredReminders = [...otherReminders];
    if (nextWaterReminder) filteredReminders.push(nextWaterReminder);

    const handleAdd = () => {
        if(newEvent && hour && minute) {
            const timeStr = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')} ${period}`;
            onAddReminder(newEvent, timeStr, selectedDay);
            setNewEvent('');
        }
    }

    return (
        <>
            {isOpen && <div onClick={closeMenu} className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"></div>}
            <aside className={`${classes} flex flex-col h-full`}>
                <div className="p-4 border-b flex justify-between items-center lg:hidden">
                    <h3 className="font-bold text-slate-800">Schedule</h3>
                    <button onClick={closeMenu}><i className="ph-bold ph-x text-xl"></i></button>
                </div>
                <div className="p-6 overflow-y-auto h-full space-y-6">
                    {/* Calendar Grid */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <i className="ph-bold ph-calendar-blank text-blue-600"></i> 
                                {now.toLocaleString('default', { month: 'long' })} {now.getFullYear()}
                            </h3>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Today: {now.getDate()}</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
                            {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
                            {totalSlots.map((d, i) => {
                                if (d === null) return <span key={i}></span>;
                                const isSelected = d === selectedDay;
                                const isToday = d === now.getDate();
                                return (
                                    <span 
                                        key={i} 
                                        onClick={() => setSelectedDay(d)}
                                        className={`p-2 rounded-lg cursor-pointer transition relative
                                            ${isSelected ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-slate-100'}
                                            ${isToday && !isSelected ? 'text-blue-600 font-bold border border-blue-200' : ''}
                                        `}
                                    >
                                        {d}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Add Reminder Form */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-600 mb-2">Add Task for Day {selectedDay}</h4>
                        <div className="space-y-4">
                            <input 
                                value={newEvent} onChange={e=>setNewEvent(e.target.value)} 
                                placeholder="Task Name (e.g. Yoga)" 
                                className="w-full p-2.5 text-sm bg-white rounded-xl border border-slate-200 outline-none" 
                            />
                            <div className="flex items-center gap-2">
                                <input type="number" value={hour} onChange={e=>setHour(e.target.value)} className="w-full bg-white border border-slate-200 p-2 rounded-xl text-center" maxLength="2" />
                                <span>:</span>
                                <input type="number" value={minute} onChange={e=>setMinute(e.target.value)} className="w-full bg-white border border-slate-200 p-2 rounded-xl text-center" maxLength="2" />
                                <button onClick={()=>setPeriod('AM')} className={`p-2 text-xs rounded-lg ${period==='AM' ? 'bg-blue-600 text-white' : 'bg-white'}`}>AM</button>
                                <button onClick={()=>setPeriod('PM')} className={`p-2 text-xs rounded-lg ${period==='PM' ? 'bg-blue-600 text-white' : 'bg-white'}`}>PM</button>
                            </div>
                            <button onClick={handleAdd} className="w-full bg-blue-900 text-white py-2 rounded-xl font-bold text-sm">Add</button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default RightPanel;