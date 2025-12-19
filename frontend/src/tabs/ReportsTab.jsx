// src/tabs/ReportsTab.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MockBackend } from '../utils/db';

const ReportsTab = ({ data, refreshData }) => {
    const [localReports, setLocalReports] = useState(data.reports || []);
    const [uploading, setUploading] = useState(false);
    const [reportName, setReportName] = useState('');
    const [docName, setDocName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const fileInput = useRef(null);
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        setLocalReports(data.reports || []);
    }, [data.reports]);

    // Stats Logic
    const histSteps = data.history?.steps || [];
    const avgSteps = histSteps.length ? Math.round(histSteps.reduce((a, b) => a + b, 0) / histSteps.length) : 0;
    const histHeart = data.history?.heart || [];
    const avgHeart = histHeart.length ? Math.round(histHeart.reduce((a, b) => a + b, 0) / histHeart.length) : 0;
    const histSleep = data.history?.sleep || [];
    const avgSleep = histSleep.length ? (histSleep.reduce((a, b) => a + b, 0) / histSleep.length).toFixed(1) : "0.0";
    const takenCount = (data.meds || []).filter(m => m.taken).length;
    const totalMeds = (data.meds || []).length || 1;
    const adherence = Math.round((takenCount / totalMeds) * 100);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const now = new Date();
            const newReport = {
                id: Date.now(),
                name: reportName.trim() || `Report ${now.toLocaleDateString()}`, 
                doctor: docName.trim() || "Self Upload", 
                date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                type: file.type,
                content: e.target.result 
            };
            
            const currentData = MockBackend.getData();
            const updatedReports = [newReport, ...(currentData.reports || [])];
            const newData = { ...currentData, reports: updatedReports };
            
            const success = MockBackend.updateData(newData);
            if (success) {
                setLocalReports(updatedReports);
                if (refreshData) refreshData();
                setReportName('');
                setDocName('');
                alert("File Added Successfully!");
            }
            setUploading(false);
            if(fileInput.current) fileInput.current.value = "";
        };
        reader.readAsDataURL(file);
    };

    const deleteReport = (e, id) => {
        e.stopPropagation();
        if(window.confirm('Delete this report?')) {
            const currentData = MockBackend.getData();
            const updatedReports = (currentData.reports || []).filter(r => r.id !== id);
            const newData = { ...currentData, reports: updatedReports };
            MockBackend.updateData(newData);
            
            setLocalReports(updatedReports);
            if (refreshData) refreshData();
        }
    };

    // Sorting Logic
    const sortedReports = useMemo(() => {
        let sortableItems = [...localReports];
        if (searchTerm) {
            sortableItems = sortableItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.doctor.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [localReports, searchTerm, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
            {/* PREVIEW MODAL */}
            {previewFile && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setPreviewFile(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] w-full bg-transparent" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewFile(null)} className="absolute -top-10 right-0 text-white text-3xl hover:scale-110 transition"><i className="ph-bold ph-x"></i></button>
                        {previewFile.type.includes('image') ? (
                            <img src={previewFile.content} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl bg-black" />
                        ) : (
                            <iframe src={previewFile.content} className="w-full h-[80vh] rounded-lg bg-white" title="PDF Preview"></iframe>
                        )}
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-bold text-slate-800">Medical Archives</h1>

            {/* WEEKLY OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Steps Card */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">AVG STEPS</p>
                        <h3 className="text-3xl font-extrabold text-slate-800">{avgSteps.toLocaleString()}</h3>
                    </div>
                    <div className="relative z-10 w-full bg-blue-100 h-1.5 rounded-full mt-2"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '65%'}}></div></div>
                </div>
                {/* Other cards omitted for brevity, logic follows same pattern */}
                 <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition"></div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">MED ADHERENCE</p>
                        <h3 className="text-3xl font-extrabold text-slate-800">{adherence}%</h3>
                    </div>
                    <div className="relative z-10 w-full bg-emerald-100 h-1.5 rounded-full mt-2"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${adherence}%`}}></div></div>
                </div>
            </div>

            {/* UPLOAD SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-8 text-center relative group hover:border-blue-400 transition-colors">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <i className="ph-fill ph-cloud-arrow-up text-3xl"></i>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Upload New Record</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-left">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Report Name</label>
                            <input type="text" placeholder="e.g. Lab Report Dec '25" className="w-full p-2 border rounded-lg text-sm outline-none focus:border-blue-500 bg-white" value={reportName} onChange={e => setReportName(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Prescribed By (Dr.)</label>
                            <input type="text" placeholder="e.g. Dr. Sharma" className="w-full p-2 border rounded-lg text-sm outline-none focus:border-blue-500 bg-white" value={docName} onChange={e => setDocName(e.target.value)} />
                        </div>
                    </div>
                    <button onClick={() => fileInput.current.click()} className="bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition flex items-center gap-2 mx-auto">
                        {uploading ? <i className="ph-bold ph-spinner animate-spin"></i> : <i className="ph-bold ph-file-plus"></i>}
                        {uploading ? 'Uploading...' : 'Select File (JPG/PDF)'}
                    </button>
                    <input type="file" ref={fileInput} className="hidden" accept="image/*,application/pdf" onChange={handleFile} />
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-4 border-b bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2"><i className="ph-duotone ph-files text-xl"></i> Uploaded Documents ({sortedReports.length})</h3>
                    <div className="relative w-full md:w-64">
                        <i className="ph-bold ph-magnifying-glass absolute left-3 top-2.5 text-slate-400"></i>
                        <input type="text" placeholder="Search reports..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4 cursor-pointer hover:text-blue-600" onClick={() => requestSort('name')}>Name</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-blue-600" onClick={() => requestSort('doctor')}>Doctor</th>
                                <th className="px-6 py-4 cursor-pointer hover:text-blue-600" onClick={() => requestSort('date')}>Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedReports.map((report) => (
                                <tr key={report.id} className="group hover:bg-slate-50 transition cursor-pointer" onClick={() => setPreviewFile(report)}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${report.type.includes('pdf') ? 'bg-red-500' : 'bg-blue-500'}`}>
                                                <i className={`ph-bold ${report.type.includes('pdf') ? 'ph-file-pdf' : 'ph-image'} text-xl`}></i>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{report.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">ID: #{report.id.toString().slice(-4)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 font-semibold">Dr. {report.doctor}</td>
                                    <td className="px-6 py-5 text-sm text-slate-600">{report.date}</td>
                                    <td className="px-6 py-5"><span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">{report.type.includes('pdf') ? 'PDF' : 'IMG'}</span></td>
                                    <td className="px-6 py-5 text-right">
                                        <button onClick={(e) => deleteReport(e, report.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"><i className="ph-bold ph-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;