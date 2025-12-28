import React, { useState } from 'react';
// Assets import
import { ShieldCheck, KeyRound, Lock, Loader2, ArrowLeft, Mail } from 'lucide-react';

/**
 * ResetPassword Component
 * Workflow: Email -> OTP -> Password Reset -> Success.
 */
const ResetPassword = () => {
    // States
    const [step, setStep] = useState(1); 
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ email: '', otp: '', newPassword: '' });

    /**
     * API Action Handler
     */
    const handleAction = async (endpoint, payload, nextStep) => {
        setLoading(true);
        try {
            const res = await fetch(`https://menswear-backend.vercel.app/api/auth/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.status === 404) {
                alert("Endpoint Not Found! Check server connection.");
                setLoading(false);
                return;
            }

            const result = await res.json();
            if (result.success) {
                setStep(nextStep);
            } else {
                alert(result.message || "Operation Failed");
            }
        } catch (err) { 
            console.error("Fetch Error:", err);
            alert("SERVER ERROR: " + err.message); 
        } finally { 
            setLoading(false); 
        }
    };

    // Responsive Styles (Fixed redundant classes)
    const cardStyle = "w-full max-w-[450px] bg-white p-6 sm:p-8 md:p-10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.07)] border border-gray-100 text-center mx-4 relative overflow-hidden";
    const inputStyle = "w-full bg-[#F8F9FA] border border-gray-200 p-4 rounded-xl text-black font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 mt-2 text-sm";
    const btnStyle = "w-full bg-black text-white py-4 rounded-xl font-[900] italic uppercase tracking-widest text-xs mt-6 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center py-10 font-sans">
            <div className={cardStyle}>
                
                {/* Brand Logo Section */}
                <div className="mb-8">
                    <div className="flex justify-center mb-4">
                        <img 
                            src={'/logo4.png'} 
                            alt="Brand Logo" 
                            className="h-16 w-auto object-contain transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                    {/* CSS Conflict Fixed: Removed double italic */}
                    <h2 className="text-2xl font-[900] italic uppercase tracking-tighter text-black leading-none">
                        ACCOUNT <span className="text-blue-500">RECOVERY</span>
                    </h2>
                    
                    {/* Progress Indicator */}
                    <div className="flex justify-center gap-1.5 mt-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-blue-500' : 'w-2 bg-gray-200'}`}></div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                        <div className="flex items-center gap-2 text-gray-400 justify-center mb-6">
                            <Mail size={16}/> 
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Protocol</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-4 font-medium italic">Authorized email required for access reset.</p>
                        <input 
                            type="email" 
                            placeholder="EMAIL ADDRESS" 
                            className={inputStyle} 
                            onChange={(e) => setData({...data, email: e.target.value})} 
                        />
                        <button 
                            disabled={!data.email || loading}
                            onClick={() => handleAction('forgot-password', { email: data.email }, 2)} 
                            className={btnStyle}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "REQUEST CODE →"}
                        </button>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-2 text-gray-400 justify-center mb-6">
                            <KeyRound size={16}/> 
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Identity Token</span>
                        </div>
                        {/* CSS Conflict Fixed: Removed double italic */}
                        <p className="text-[11px] text-gray-500 mb-4 font-medium italic">Check your inbox: {data.email}</p>
                        <input 
                            type="text" 
                            maxLength="6" 
                            placeholder="0 0 0 0 0 0" 
                            className={`${inputStyle} text-2xl tracking-[0.5em] text-center`} 
                            onChange={(e) => setData({...data, otp: e.target.value})} 
                        />
                        <button 
                            disabled={data.otp.length < 6 || loading}
                            onClick={() => setStep(3)} 
                            className={btnStyle}
                        >
                            VERIFY SECURITY TOKEN
                        </button>
                    </div>
                )}

                {/* Step 3: Password Update */}
                {step === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-2 text-gray-400 justify-center mb-6">
                            <Lock size={16}/> 
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Encryption</span>
                        </div>
                        <input 
                            type="password" 
                            placeholder="NEW SECURE PASSWORD" 
                            className={inputStyle} 
                            onChange={(e) => setData({...data, newPassword: e.target.value})} 
                        />
                        <button 
                            disabled={!data.newPassword || loading}
                            onClick={() => handleAction('reset-password', { email: data.email, otp: data.otp, newPassword: data.newPassword }, 4)} 
                            className={btnStyle}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "OVERWRITE DATABASE →"}
                        </button>
                    </div>
                )}

                {/* Step 4: Success Message */}
                {step === 4 && (
                    <div className="py-6 animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                            <ShieldCheck className="text-blue-500" size={50} />
                        </div>
                        <h3 className="text-xl font-[900] italic uppercase tracking-tight">Security Updated</h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-widest leading-relaxed px-4">
                            Password sync completed. Your account is now secured.
                        </p>
                        <button 
                            onClick={() => window.location.href='/login'} 
                            className={`${btnStyle} bg-blue-600 hover:bg-black mt-8`}
                        >
                            LOG IN NOW
                        </button>
                    </div>
                )}

                {/* Back Link */}
                <button 
                    onClick={() => window.history.back()} 
                    className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-black flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                    <ArrowLeft size={12}/> Back to Authentication
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;