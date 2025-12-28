import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Footer from '../components/Footer';

// Sporty Style Constant (Black, Italic, Uppercase)
const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";
// Clean Inter Style for readable text
const interStyle = "font-inter font-medium tracking-tight";

const InfoCard = ({ Icon, title, content }) => (
    <div className="bg-black p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 text-center group hover:border-sky-500 transition-all duration-300">
        <div className="bg-sky-500/10 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-sky-500 transition-colors">
            <Icon size={24} className="text-sky-500 group-hover:text-black" />
        </div>
        <h3 className={`text-sm md:text-base text-white mb-2 ${sportyStyle}`}>{title}</h3>
        <p className={`text-[12px] md:text-[13px] text-gray-400 leading-relaxed ${interStyle}`}>{content}</p>
    </div>
);

const ContactPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState({ loading: false, error: null, success: null });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (status.error || status.success) setStatus({ loading: false, error: null, success: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: null });

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    adminEmail: 'menswearofficial07@gmail.com' 
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ loading: false, error: null, success: "Message Sent! Check your email." });
                setFormData(prev => ({ ...prev, subject: '', message: '' })); 
            } else {
                throw new Error(data.message || "Failed to send message");
            }
        } catch (err) {
            setStatus({ loading: false, error: err.message, success: null });
        }
    };

    return (
        <div className="bg-white min-h-screen font-inter">
            <main className="py-10 md:py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    
                    {/* Header Section */}
                    <div className="text-left mb-10 md:mb-16">
                        <button onClick={() => navigate('/')} className={`flex items-center gap-2 text-black text-[10px] md:text-[11px] mb-6 md:mb-8 group hover:text-sky-500 transition-colors ${sportyStyle}`}>
                            <ArrowLeft size={14}/> Back to Home
                        </button>
                        <h1 className={`text-5xl md:text-7xl lg:text-8xl text-black mb-4 leading-none ${sportyStyle}`}>
                            Get In <span className="text-sky-500">Touch</span>
                        </h1>
                        <p className={`text-gray-500 text-[11px] md:text-[13px] max-w-lg leading-relaxed ${sportyStyle}`}>
                            Premium Support for Premium Wear. Reach out for orders, returns, or style advice.
                        </p>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20">
                        <InfoCard Icon={MapPin} title="HQ Location" content="Karachi, Pakistan - Premium Quality Official Store" />
                        <InfoCard Icon={Phone} title="Direct Line" content="+92 300 1234567 (Mon-Sat 10am-8pm)" />
                        <InfoCard Icon={Mail} title="Official Mail" content="menswearofficial07@gmail.com" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        {/* Sidebar Info Panel */}
                        <div className="lg:col-span-5 bg-black p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl">
                            <h2 className={`text-3xl md:text-4xl mb-6 flex items-center gap-3 ${sportyStyle}`}>
                                <MessageSquare size={28} className="text-sky-400" />
                                Support <br className="hidden md:block"/> Center
                            </h2>
                            <p className={`text-gray-400 text-[12px] md:text-[13px] mb-8 leading-relaxed ${sportyStyle}`}>
                               We strive to respond to all inquiries within 24 business hours.
                            </p>

                            <div className="space-y-3">
                                {status.error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                                        <AlertCircle size={16} />
                                        <p className={`text-[10px] uppercase tracking-widest font-bold`}>{status.error}</p>
                                    </div>
                                )}
                                {status.success && (
                                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500">
                                        <CheckCircle2 size={16} />
                                        <p className={`text-[10px] uppercase tracking-widest font-bold`}>{status.success}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/10 pt-8 mt-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                                    <p className={`text-[10px] tracking-widest ${sportyStyle}`}>Live Response Active</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Contact Form */}
                        <div className="lg:col-span-7 bg-gray-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm transition-all">
                            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    {/* Name Field */}
                                    <div className="space-y-3">
                                        <label htmlFor="name" className={`block text-[14px] md:text-[16px] text-black tracking-[0.15em] ml-1 ${sportyStyle}`}>
                                            Your Full Name
                                        </label>
                                        <input type="text" id="name" value={formData.name} onChange={handleInputChange} placeholder="FULL NAME" className={`w-full bg-white p-4 md:p-5 rounded-2xl text-sm border-2 border-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 font-inter font-bold shadow-sm`} required />
                                    </div>
                                    {/* Email Field */}
                                    <div className="space-y-3">
                                        <label htmlFor="email" className={`block text-[14px] md:text-[16px] text-black tracking-[0.15em] ml-1 ${sportyStyle}`}>
                                            Email Address
                                        </label>
                                        <input type="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="EMAIL" className={`w-full bg-white p-4 md:p-5 rounded-2xl text-sm border-2 border-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 font-inter font-bold shadow-sm`} required />
                                    </div>
                                </div>
                                
                                {/* Subject Field */}
                                <div className="space-y-3">
                                    <label htmlFor="subject" className={`block text-[14px] md:text-[16px] text-black tracking-[0.15em] ml-1 ${sportyStyle}`}>
                                        Subject / Inquiry
                                    </label>
                                    <input type="text" id="subject" value={formData.subject} onChange={handleInputChange} placeholder="HOW CAN WE HELP?" className={`w-full bg-white p-4 md:p-5 rounded-2xl text-sm border-2 border-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 font-inter font-bold shadow-sm`} required />
                                </div>

                                {/* Message Field */}
                                <div className="space-y-3">
                                    <label htmlFor="message" className={`block text-[14px] md:text-[16px] text-black tracking-[0.15em] ml-1 ${sportyStyle}`}>
                                        Your Message
                                    </label>
                                    <textarea id="message" rows="5" value={formData.message} onChange={handleInputChange} placeholder="WRITE YOUR MESSAGE HERE..." className={`w-full bg-white p-4 md:p-5 rounded-2xl text-sm border-2 border-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 font-inter font-bold shadow-sm resize-none`} required></textarea>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={status.loading}
                                    className={`w-full bg-black text-white py-5 md:py-7 rounded-2xl text-[16px] hover:bg-sky-500 hover:text-black transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl active:scale-[0.98] ${sportyStyle}`}
                                >
                                    {status.loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                    <span>{status.loading ? "Processing..." : "Submit Message"}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;