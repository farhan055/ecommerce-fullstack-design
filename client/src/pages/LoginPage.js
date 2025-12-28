import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertTriangle, UserCheck } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
    // --- State Management ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // --- Styling Constants (Bold & Sharp Theme) ---
    const boldHeading = "font-sans font-[900] italic uppercase tracking-tighter";
    const sharpButton = "font-black text-[13px] uppercase tracking-[2px] italic transition-all duration-300";

    // --- Login Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Clean the email string before sending to backend
            const loginData = { 
                email: email.toLowerCase().trim(), 
                password: password 
            };

            // Hit the login API
            const res = await axios.post('https://menswear-backend.vercel.app/api/auth/login', loginData);
            
            if (res.data.token) {
                const userData = res.data.user || res.data; 

                // Clear old junk from storage and save new session
                localStorage.clear(); 
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Check if user is an admin via DB flag or master email
                const isAdminUser = userData.isAdmin === true || email.toLowerCase() === 'administrator@menswear.com';

                if (isAdminUser) {
                    // Force redirect to admin panel
                    window.location.href = '/admin/dashboard'; 
                } else {
                    // Standard user redirect to homepage
                    window.location.href = '/'; 
                }
            }
        } catch (err) {
            // Extract error message or use a fallback
            const errorMsg = err.response?.data?.message || 'INVALID CREDENTIALS. CHECK YOUR ENTRY.';
            setError(errorMsg.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main Wrapper: Responsive padding and center alignment
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
            
            {/* Login Card: Responsive width (Full on mobile, fixed on desktop) */}
            <div className="w-full max-w-[420px] bg-white rounded-[1.5rem] shadow-2xl p-6 md:p-10 relative border border-gray-100 transition-all">
                
                {/* Brand Logo & Heading Section */}
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 mb-4 border border-gray-100 shadow-sm overflow-hidden">
                         <img src="/logo4.png" alt="MW Logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className={`text-3xl md:text-4xl text-black ${boldHeading} leading-none`}>
                        MEN'S<span className="text-[#0D6EFD]">WEAR</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="h-[1px] w-6 bg-gray-300"></span>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[3px] italic">Casual & Formal Edition</p>
                        <span className="h-[1px] w-6 bg-gray-300"></span>
                    </div>
                </div>

                {/* Error Alerts or Status Header */}
                {error ? (
                    <div className="mb-6 flex items-center gap-3 bg-red-50 border-l-4 border-red-600 p-4 text-red-600 text-[11px] font-black uppercase italic animate-bounce-short">
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                ) : (
                    <div className="mb-6 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase italic tracking-widest border-b border-gray-100 pb-4">
                        <UserCheck size={14} className="text-[#0D6EFD]" />
                        Member Authentication
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    
                    {/* Email Input Field */}
                    <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D6EFD] transition-colors" />
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#0D6EFD] focus:bg-white outline-none text-[12px] font-bold uppercase transition-all placeholder:text-gray-300"
                        />
                    </div>

                    {/* Password Input Field */}
                    <div className="space-y-2">
                        <div className="relative group">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D6EFD] transition-colors" />
                            <input
                                type="password"
                                placeholder="PASSWORD"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#0D6EFD] focus:bg-white outline-none text-[12px] font-bold transition-all placeholder:text-gray-300"
                            />
                        </div>
                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link to="/resetpassword" size={14} className="text-[10px] font-black text-[#0D6EFD] hover:underline italic uppercase tracking-wider">Forgot Secret?</Link>
                        </div>
                    </div>

                    {/* Submit Action: Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 md:py-5 rounded-xl bg-black text-white ${sharpButton} hover:bg-[#0D6EFD] shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-gray-400 transition-all`}
                    >
                        {loading ? (
                            <span className="animate-pulse">AUTHENTICATING...</span>
                        ) : (
                            <>SECURE LOGIN <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                {/* Signup Call-to-Action */}
                <div className="mt-8 md:mt-10 text-center border-t border-gray-50 pt-6">
                    <p className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[2px] italic mb-4">
                        Don't have an account?
                    </p>
                    <Link 
                        to="/register" 
                        className="inline-block w-full py-3.5 md:py-4 rounded-xl border-2 border-black text-black font-black text-[12px] uppercase italic hover:bg-black hover:text-white transition-all text-center"
                    >
                        Create New Account
                    </Link>
                </div>

            </div>
        </main>
    );
};

export default LoginPage;