import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { User, Lock, Mail, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

/**
 * RegisterPage Component
 * Handles new user registration, validation, and redirection.
 * Fully responsive for mobile and desktop devices.
 */
const RegisterPage = () => {
    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('male'); 
    const [acceptTerms, setAcceptTerms] = useState(false);
    
    // Status States
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Design utility classes for consistent branding
    const boldHeading = "font-sans font-[900] italic uppercase tracking-tighter";
    const sharpButton = "font-black text-[13px] uppercase tracking-[2px] italic transition-all duration-300";

    /**
     * Handles Form Submission
     * Validates terms and makes API call to the backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic client-side validation for terms
        if (!acceptTerms) {
            setError('PLEASE ACCEPT TERMS & PRIVACY POLICY.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('https://menswear-backend.vercel.app/api/auth/register', { 
                name, email, password, gender 
            });
            
            if (res.status === 201) {
                // Success Scenario: Feedback to user and redirect
                setSuccess("REGISTRATION SUCCESSFUL! REDIRECTING...");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            // Error Scenario: Extract message from server or show default
            setError(err.response?.data?.message || 'REGISTRATION FAILED. TRY AGAIN.');
            setLoading(false); 
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Main Auth Card - Responsive width for all devices */}
            <div className="w-full max-w-[450px] bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100 relative">
                
                {/* Branding Section */}
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 mb-4 border border-gray-100 shadow-sm overflow-hidden">
                         <img src="/logo4.png" alt="MW Logo" className="w-full h-full object-cover" />
                    </div>
                    <h2 className={`text-3xl md:text-4xl text-black ${boldHeading} leading-none`}>
                        MEN'S<span className="text-[#0D6EFD]">WEAR</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="h-[1px] w-6 bg-gray-300"></span>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[3px] italic">Create Member Profile</p>
                        <span className="h-[1px] w-6 bg-gray-300"></span>
                    </div>
                </div>

                {/* Status Messages (Error/Success) */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-50 border-l-4 border-red-600 p-4 text-red-600 text-[10px] md:text-[11px] font-black uppercase italic animate-in fade-in slide-in-from-top-1">
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-3 bg-green-50 border-l-4 border-green-600 p-4 text-green-600 text-[10px] md:text-[11px] font-black uppercase italic animate-bounce">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    {/* Input Field: Name */}
                    <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D6EFD] transition-colors" />
                        <input
                            type="text"
                            placeholder="FULL NAME"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading || !!success}
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#0D6EFD] focus:bg-white outline-none text-[12px] font-bold uppercase transition-all"
                        />
                    </div>

                    {/* Input Field: Email */}
                    <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D6EFD] transition-colors" />
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading || !!success}
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#0D6EFD] focus:bg-white outline-none text-[12px] font-bold uppercase transition-all"
                        />
                    </div>

                    {/* Input Field: Password */}
                    <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D6EFD] transition-colors" />
                        <input
                            type="password"
                            placeholder="SECRET PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading || !!success}
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#0D6EFD] focus:bg-white outline-none text-[12px] font-bold transition-all"
                        />
                    </div>

                    {/* Gender Selection */}
                    <div className="flex flex-col sm:flex-row gap-4 px-1 py-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase italic self-center">Gender:</p>
                        <div className="flex gap-3 flex-1">
                            <button 
                                type="button"
                                onClick={() => setGender('male')}
                                disabled={loading || !!success}
                                className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black italic transition-all ${gender === 'male' ? 'bg-black text-white border-black shadow-md scale-105' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}
                            > MALE </button>
                            <button 
                                type="button"
                                onClick={() => setGender('female')}
                                disabled={loading || !!success}
                                className={`flex-1 py-3 rounded-xl border-2 text-[10px] font-black italic transition-all ${gender === 'female' ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-105' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-200'}`}
                            > FEMALE </button>
                        </div>
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="flex items-start gap-3 py-2 px-1">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            disabled={loading || !!success}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#0D6EFD] focus:ring-[#0D6EFD] cursor-pointer"
                        />
                      <label htmlFor="terms" className="text-[10px] font-black text-gray-500 italic uppercase leading-tight cursor-pointer">I accept the <a href="/terms-of-service" className="text-black underline mx-1 hover:opacity-70">Terms of Service</a> and understand the <a href="/privacy-policy" className="text-black underline mx-1 hover:opacity-70">Privacy Policy</a>.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !!success}
                        className={`w-full py-4 md:py-5 rounded-xl bg-black text-white ${sharpButton} hover:bg-[#0D6EFD] shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                {success ? "REDIRECTING..." : "CREATING PROFILE..."}
                            </span>
                        ) : (
                            <>JOIN THE BRAND <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                {/* Login Redirect */}
                <div className="mt-8 md:mt-10 text-center border-t border-gray-50 pt-6 md:pt-8">
                    <p className="text-[11px] font-black text-gray-400 uppercase italic mb-4">
                        Already a registered member?
                    </p>
                    <Link 
                        to="/login" 
                        className="inline-block w-full py-4 rounded-xl border-2 border-black text-black font-black text-[12px] uppercase italic hover:bg-black hover:text-white transition-all"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default RegisterPage;