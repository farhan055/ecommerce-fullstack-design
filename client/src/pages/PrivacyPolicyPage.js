import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText, Globe, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

/** * BRAND STYLE CONSTANTS
 * headerStyle: Bold, Italic, Aggressive Sporty look
 * bodyText: Clean, readable font for policy details
 */
const headerStyle = "font-sans font-[900] italic uppercase tracking-tighter";
const bodyText = "font-sans font-medium text-gray-600 leading-relaxed";

const PrivacyPolicy = () => {
    // Dynamic Brand Configuration
    const siteConfig = {
        name: "MEN'S WEAR",
        logo: "/logo4.png",
        email: "menswearofficial07@gmail.com",
        address: "Karachi, Pakistan",
        phone: "+92 300 1234567"
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Reusable Section Header Component
    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-4 mb-6 mt-12 border-l-4 border-[#0099ff] pl-4">
            <div className="bg-[#0099ff]/10 p-2 rounded-lg">
                <Icon size={24} className="text-[#0099ff]" />
            </div>
            <h2 className={`text-xl md:text-3xl text-black ${headerStyle}`}>
                {title}
            </h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#0099ff] selection:text-white">
            
            {/* --- HERO HEADER: RESPONSIVE HEIGHT & TYPOGRAPHY --- */}
            <header className="bg-black py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-[#0099ff] blur-[100px] md:blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
                <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-blue-500/20 animate-pulse">
                            <ShieldCheck size={40} className="text-[#0099ff]" />
                        </div>
                    </div>
                    <h1 className={`text-5xl md:text-8xl text-white mb-4 ${headerStyle}`}>
                        Privacy <span className="text-[#0099ff]">Policy</span>
                    </h1>
                    <p className="text-gray-500 font-bold italic uppercase tracking-[2px] md:tracking-[4px] text-[10px] md:text-xs">
                        Last Updated: December 2025 • Your Security is Our Priority
                    </p>
                </div>
            </header>

            {/* --- MAIN CONTENT: READABLE & CLEAN LAYOUT --- */}
            <main className="container mx-auto px-6 max-w-5xl py-12 md:py-20">
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 p-8 md:p-16 shadow-sm">
                    
                    <p className="text-gray-800 text-lg md:text-2xl mb-12 italic font-bold leading-tight">
                        At <span className="text-[#0099ff] uppercase">{siteConfig.name}</span>, we value the trust you place in us. This Privacy Policy describes how we collect, use, and share your personal information.
                    </p>

                    {/* 1. Information Collection Section */}
                    <SectionHeader title="Information We Collect" icon={FileText} />
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 hover:border-[#0099ff] transition-all group">
                            <h4 className={`text-lg mb-3 text-[#0099ff] ${headerStyle}`}>Personal Data</h4>
                            <p className={bodyText}>Name, email, shipping address, and phone number provided during checkout.</p>
                        </div>
                        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 hover:border-[#0099ff] transition-all group">
                            <h4 className={`text-lg mb-3 text-[#0099ff] ${headerStyle}`}>Device Data</h4>
                            <p className={bodyText}>IP address, browser type, and cookies to optimize your browsing speed.</p>
                        </div>
                    </div>

                    {/* 2. Usage Policy Section */}
                    <SectionHeader title="How We Use Your Data" icon={Eye} />
                    <ul className="space-y-6">
                        {[
                            "To process and fulfill your orders effectively.",
                            "To send updates regarding order status or exclusive offers.",
                            "To maintain platform security and prevent fraudulent activities."
                        ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="bg-[#0099ff] p-1 rounded-full mt-1 shrink-0">
                                    <ArrowRight size={14} className="text-white" />
                                </div>
                                <span className="text-base md:text-lg font-semibold text-gray-700 italic">{text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* 3. Security Section: High Contrast Design */}
                    <SectionHeader title="Security & Protection" icon={Lock} />
                    <div className="bg-black p-8 md:p-12 rounded-[2rem] border-t-4 border-[#0099ff] mb-16 shadow-xl">
                        <p className="text-white font-bold italic text-base md:text-xl leading-relaxed">
                            We use industry-standard encryption <span className="text-[#0099ff] font-black">(SSL)</span>. Your payment details are processed through secure gateways like Stripe and PayPal. We never store full card details on our local servers.
                        </p>
                    </div>

                    {/* 4. Contact Footer Section: Dynamic & Responsive */}
                    <footer className="mt-20 pt-12 border-t border-gray-100">
                        <div className="bg-gradient-to-br from-black to-[#111] rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden">
                            <Globe className="absolute -right-16 -bottom-16 w-64 h-64 text-[#0099ff] opacity-10" />
                            
                            <h3 className={`text-4xl md:text-6xl mb-12 relative z-10 leading-[0.85] ${headerStyle}`}>
                                Contact <br/> <span className="text-[#0099ff]">Legal Team</span>
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 text-left">
                                <div className="space-y-3">
                                    <div className="bg-[#0099ff] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"><Mail size={22} className="text-black" /></div>
                                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Email Support</p>
                                    <p className="font-bold italic text-sm md:text-base break-all">{siteConfig.email}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-[#0099ff] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"><Phone size={22} className="text-black" /></div>
                                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Direct Line</p>
                                    <p className="font-bold italic text-sm md:text-base">{siteConfig.phone}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-[#0099ff] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"><MapPin size={22} className="text-black" /></div>
                                    <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Base Office</p>
                                    <p className="font-bold italic text-sm md:text-base">{siteConfig.address}</p>
                                </div>
                            </div>
                        </div>
                    </footer>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;