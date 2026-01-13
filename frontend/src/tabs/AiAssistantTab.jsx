import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const AiAssistantTab = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Namaste! I am your health assistant. How are you feeling today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input; // Store input to send
        const userMsg = { id: Date.now(), sender: 'user', text: userText };
        
        // 1. Add User Message immediately
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // 2. Call the Python Backend API
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: userText,
                    language: 'english' // Optional: can be dynamic based on user preference
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // 3. Add Bot Response from Backend
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: data.reply || "I'm having trouble understanding. Please try again."
            }]);

        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: "I seem to be offline. Please ensure the Python backend is running." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col fade-in">
            {/* Header */}
            <div className="bg-white rounded-t-2xl p-4 border-b flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white">
                    <i className="ph-fill ph-robot text-xl"></i>
                </div>
                <div>
                    <h2 className="font-bold text-slate-800">Sushruta Assistant</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full block ${isTyping ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></span> 
                        {isTyping ? 'Thinking...' : 'Online'}
                    </p>
                </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 bg-slate-50 p-4 overflow-y-auto custom-scroll flex flex-col gap-3">
                {messages.map(m => (
                    <div key={m.id} className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        m.sender === 'user' 
                            ? 'bg-blue-600 text-white self-end rounded-tr-none' 
                            : 'bg-white text-slate-700 self-start rounded-tl-none border border-slate-100'
                    }`}>
                        {m.text}
                    </div>
                ))}
                
                {isTyping && (
                    <div className="bg-white text-slate-500 self-start p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm w-16 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                )}
                <div ref={chatEndRef}></div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="bg-white p-4 rounded-b-2xl border-t flex gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your symptoms or question..."
                    className="flex-1 p-3 bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-700 placeholder:text-slate-400"
                    disabled={isTyping}
                />
                <button 
                    type="submit" 
                    disabled={isTyping || !input.trim()}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i className="ph-bold ph-paper-plane-right text-xl"></i>
                </button>
            </form>
        </div>
    );
};

export default AiAssistantTab;