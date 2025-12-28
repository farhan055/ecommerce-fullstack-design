import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Trash2, ArrowLeft, Save, X, ShieldCheck, CheckCircle2, AlertCircle, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/authContext'; // Global state sync ke liye
import Footer from '../components/Footer';

/**
 * @page ProfilePage
 * @description Member identity management center with real-time profile synchronization.
 */
const ProfilePage = () => {
    const navigate = useNavigate();
    const { user: authUser, logout, login } = useAuth(); // Context se functions liye hain
    
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', gender: '' });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

    // Toast Alert logic
    const showAlert = (msg, type) => {
        setAlert({ show: true, msg, type });
        setTimeout(() => setAlert({ show: false, msg: '', type: '' }), 3000);
    };

    /** @function fetchProfile - Backend se user data fetch karta hai */
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token') || authUser?.token;
            if (!token) { navigate('/login'); return; }
            
            try {
                const response = await fetch('https://menswear-backend.vercel.app/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setFormData({ name: data.name, gender: data.gender });
                } else { 
                    logout(); // Token expire ho to logout kar do
                    navigate('/login'); 
                }
            } catch (err) { 
                showAlert("SYSTEM SYNC ERROR", "error"); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchProfile();
    }, [navigate, authUser, logout]);

    /** @handler handleUpdate - Profile changes save karne ke liye */
    const handleUpdate = async () => {
        const token = localStorage.getItem('token') || authUser?.token;
        try {
            const response = await fetch('https://menswear-backend.vercel.app/api/auth/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const updatedData = await response.json();
                setUser(updatedData);
                
                // Context update taake Navbar mein bhi naam change ho jaye
                const fullUser = { ...updatedData, token };
                login(fullUser); 
                
                setIsEditing(false);
                showAlert("IDENTITY UPDATED", "success");
            }
        } catch (err) { 
            showAlert("UPDATE PROTOCOL FAILED", "error"); 
        }
    };

    /** @handler handleLogout - Secure session termination */
    const handleLogout = () => {
        if(window.confirm("TERMINATE SESSION?")) {
            logout();
            navigate('/login');
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center font-[900] italic uppercase tracking-[0.2em] animate-pulse">
            Establishing Secure Connection...
        </div>
    );

    const avatarUrl = user?.gender === 'female' ? '/female.png' : '/male.png';

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-600">
            
            {/* DYNAMIC ALERT NOTIFICATION */}
            {alert.show && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-2xl border-2 animate-in slide-in-from-top-4 duration-300 ${alert.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                    {alert.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                    <span className="font-black italic uppercase text-[10px] tracking-widest">{alert.msg}</span>
                </div>
            )}

            <main className="py-6 md:py-12 px-4">
                <div className="container mx-auto max-w-5xl">
                    
                    {/* Navigation Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 uppercase text-[10px] font-black tracking-widest text-gray-400 hover:text-black transition-all">
                            <ArrowLeft size={14} /> Return to Operations
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 uppercase text-[10px] font-black tracking-widest text-red-500 hover:text-red-700 transition-all">
                            Terminate Session <LogOut size={14} />
                        </button>
                    </div>

                    <div className="border border-gray-100 bg-white rounded-[2.5rem] overflow-hidden shadow-sm">
                        
                        {/* HEADER BANNER */}
                        <div className="relative h-40 md:h-52 bg-black flex items-center px-6 md:px-16 overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div className="relative z-10 w-full text-center md:text-left">
                                <h1 className="text-3xl md:text-6xl font-[900] italic uppercase tracking-tighter text-white leading-none">
                                    MEMBER <span className="text-blue-500">DOSSIER</span>
                                </h1>
                                <p className="text-gray-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-2 flex justify-center md:justify-start items-center gap-2">
                                    <ShieldCheck size={12} className="text-blue-500"/> Verified Security Clearance
                                </p>
                            </div>
                        </div>
                        
                        <div className="px-6 md:px-16 pb-12">
                            {/* IDENTITY PREVIEW */}
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 -mt-12 md:-mt-16 relative z-20">
                                <div className="bg-white p-1 rounded-2xl border-4 border-blue-600 shadow-2xl transition-transform hover:scale-105">
                                    <img 
                                        src={avatarUrl} 
                                        alt="Member Avatar" 
                                        className="w-28 h-28 md:w-40 md:h-40 object-cover rounded-xl"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
                                    />
                                </div>

                                <div className="flex gap-2 w-full md:w-auto">
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex-1 md:flex-none bg-black text-white hover:bg-blue-600 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                            Modify Identity
                                        </button>
                                    ) : (
                                        <div className="flex gap-2 w-full">
                                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-black px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200">
                                                Discard
                                            </button>
                                            <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                                                Update Profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CORE DATA GRID */}
                            <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                
                                <div className="border-b border-gray-100 pb-4">
                                    <label className="text-[10px] uppercase font-black text-blue-600 tracking-widest mb-2 block">Full Name</label>
                                    {isEditing ? (
                                        <input 
                                            className="w-full bg-blue-50/50 p-2 rounded-lg text-2xl font-black uppercase italic outline-none text-black border-l-4 border-blue-600"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="text-3xl md:text-4xl font-[900] uppercase italic tracking-tighter text-black">{user?.name}</p>
                                    )}
                                </div>

                                <div className="border-b border-gray-100 pb-4">
                                    <label className="text-[10px] uppercase font-black text-blue-600 tracking-widest mb-2 block">Identity Category</label>
                                    {isEditing ? (
                                        <select 
                                            className="w-full bg-blue-50/50 p-2 rounded-lg text-xl font-black uppercase italic outline-none text-black border-l-4 border-blue-600 cursor-pointer appearance-none"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                        >
                                            <option value="male">MALE</option>
                                            <option value="female">FEMALE</option>
                                        </select>
                                    ) : (
                                        <p className="text-3xl md:text-4xl font-[900] uppercase italic tracking-tighter text-black">{user?.gender || 'Male'}</p>
                                    )}
                                </div>

                                <div className="opacity-60 border-b border-gray-100 pb-4">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2 block">Email Access Node</label>
                                    <p className="text-lg font-bold text-gray-800 tracking-tight">{user?.email}</p>
                                </div>

                                <div className="border-b border-gray-100 pb-4">
                                    <label className="text-[10px] uppercase font-black text-blue-600 tracking-widest mb-2 block">Deployment Base</label>
                                    <p className="text-xl font-black uppercase italic tracking-wider flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-600 animate-bounce"/> KARACHI, PK
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;