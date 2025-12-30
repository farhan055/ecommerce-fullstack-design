import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Shared Tailwind Classes ---
const containerMaxClass = "container mx-auto px-6 max-w-7xl";
const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";

/**
 * @FooterLink
 * Responsive link component with hover effects
 */
const FooterLink = ({ text, to = "#" }) => (
    <Link to={to} className={`text-[12px] text-black hover:text-[#0D6EFD] transition-all block py-1.5 md:py-2 ${sportyStyle}`}>
        {text}
    </Link>
);

/**
 * @FooterSection
 * Adjusts layout from centered (mobile) to left-aligned (desktop)
 */
const FooterSection = ({ title, children }) => (
    <div className="flex flex-col items-center md:items-start space-y-4 md:space-y-6">
        <h5 className={`text-[14px] text-black border-l-4 border-[#0D6EFD] pl-3 w-full text-left md:text-left ${sportyStyle}`}>
            {title}
        </h5>
        <div className="flex flex-col items-center md:items-start w-full">
            {children}
        </div>
    </div>
);

const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        if (status.msg) {
            const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('https://menswear-backend.vercel.app/api/auth/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', msg: 'WELCOME TO THE MOVEMENT!' });
                setEmail('');
            } else {
                setStatus({ type: 'error', msg: data.message || 'TRY AGAIN' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'CONNECTION FAILED' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="relative bg-white border-t border-gray-100 font-sans overflow-hidden">
            
            {/* --- Floating Notifications (Top on Mobile, Top-Right on Desktop) --- */}
            {status.msg && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-10 md:right-10 md:left-auto z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border-b-4 animate-bounce w-[90%] md:w-auto ${status.type === 'success' ? 'bg-black text-white border-[#0D6EFD]' : 'bg-red-600 text-white border-black'}`}>
                    {status.type === 'success' ? <CheckCircle className="text-[#0D6EFD]" /> : <AlertTriangle />}
                    <span className={sportyStyle}>{status.msg}</span>
                </div>
            )}

            {/* --- Newsletter Section --- */}
            <div className="bg-[#F8FAFC] py-12 md:py-16">
                <div className={containerMaxClass}>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
                        <div className="text-center lg:text-left">
                            <h4 className={`text-3xl md:text-4xl text-black mb-2 ${sportyStyle}`}>Stay <span className="text-[#0D6EFD]">Ahead</span></h4>
                            <p className={`text-[11px] md:text-[12px] text-gray-500 ${sportyStyle}`}>Join the movement for exclusive drops</p>
                        </div>
                        <div className="w-full max-w-md">
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row bg-white p-2 rounded-2xl shadow-xl border border-gray-100 gap-2 sm:gap-0">
                                <input 
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="ENTER YOUR EMAIL..." 
                                    className={`w-full px-4 md:px-6 py-3 text-[12px] focus:outline-none bg-transparent placeholder:text-gray-300 ${sportyStyle}`} 
                                />
                                <button type="submit" disabled={loading} className={`bg-black text-white px-8 py-3 rounded-xl text-[12px] hover:bg-[#0D6EFD] transition-all flex items-center justify-center gap-2 ${sportyStyle}`}>
                                    {loading ? <Loader2 className="animate-spin" size={16}/> : "Subscribe"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Blue Line */}
            <div className="h-[4px] w-full bg-[#0D6EFD]"></div>

            {/* --- Main Links Grid --- */}
            <div className="py-16 md:py-20">
                <div className={containerMaxClass}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-12 text-center md:text-left">
                        
                        {/* Brand Section */}
                        <div className="flex flex-col items-center md:items-start space-y-6 md:space-y-8">
                            <Link to="/" className="flex items-center space-x-3 group">
                                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border border-gray-100">
                                    <img src='logo4.png' alt="MW Logo" className="w-full h-full object-cover" />
                                </div>
                                <span className={`text-2xl text-black ${sportyStyle}`}>Men's<span className="text-[#0D6EFD]">Wear</span></span> 
                            </Link>
                            <p className={`text-[13px] text-black leading-tight max-w-[250px] md:max-w-none ${sportyStyle}`}>
                                Premium Apparel essentials for the modern man. Engineered for comfort, designed for the bold.
                            </p>
                            <div className="flex space-x-4">
                                {/* Facebook */}
                                <a href="https://www.facebook.com/profile.php?id=61585700317494" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-[#0D6EFD] hover:text-white rounded-xl transition-all shadow-sm">
                                    <Facebook size={18} />
                                </a>
                                {/* Instagram */}
                                <a href="https://www.instagram.com/menswearstore_official?igsh=MTJ6eG9ic29qOGU5ZA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-[#E4405F] hover:text-white rounded-xl transition-all shadow-sm">
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <FooterSection title="About"> 
                            <FooterLink text="About Us" to="/about" /> 
                            <FooterLink text="Find store" to="/find-store" /> 
                            <FooterLink text="Categories" to="/products" /> 
                            <FooterLink text="Blogs" to="/blogs" /> 
                        </FooterSection>

                        <FooterSection title="Information"> 
                            <FooterLink text="Money Refund" to="/money-refund" /> 
                            <FooterLink text="Shipping" to="/shipping" /> 
                            <FooterLink text="Privacy Policy" to="/privacy-policy" />
                            <FooterLink text="Terms of Service" to="/terms-of-service" /> 
                        </FooterSection>

                        <FooterSection title="For users"> 
                            <FooterLink text="Login" to="/login" /> 
                            <FooterLink text="Register" to="/register" /> 
                            <FooterLink text="Contact" to="/contact-us" /> 
                            <FooterLink text="My Orders" to="/my-orders" /> 
                        </FooterSection>

                        {/* Apps Section */}
                        <div className="flex flex-col items-center md:items-start space-y-6">
                            <h5 className={`text-[14px] text-black border-l-4 border-[#0D6EFD] pl-3 w-full text-left ${sportyStyle}`}>Apps</h5>
                            <div className="flex flex-row md:flex-col gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-9 md:h-10 w-fit hover:scale-105 transition-transform cursor-pointer" alt="iOS"/>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-9 md:h-10 w-fit hover:scale-105 transition-transform cursor-pointer" alt="Android"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Copyright Bar --- */}
            <div className="bg-[#F8FAFC] py-6 md:py-8 border-t border-gray-100">
                <div className={containerMaxClass + " flex flex-col md:flex-row justify-between items-center gap-4"}>
                    <p className={`text-[10px] md:text-[11px] text-center md:text-left ${sportyStyle}`}>
                        © 2025 Men's Wear Brand. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;