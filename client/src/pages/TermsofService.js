import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

/**
 * Signature Sporty Style Utility:
 * Bold, Italic, and Uppercase for that premium brand aesthetic.
 */
const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";

const TermsOfService = () => {
    return (
        <div className="bg-white selection:bg-[#0D6EFD] selection:text-white">
            
            {/* BLACK HEADER SECTION: Matching your Privacy Policy image exactly */}
            <header className="bg-black py-16 md:py-24 px-5">
                <div className="max-w-7xl mx-auto text-center">
                    {/* Icon/Shield placeholder from image */}
                    <div className="flex justify-center mb-6">
                        <div className="w-10 h-10 border-2 border-[#0D6EFD] rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-[#0D6EFD] rotate-45"></div>
                        </div>
                    </div>
                    
                    <h1 className={`text-5xl sm:text-7xl md:text-9xl text-white leading-none ${sportyStyle}`}>
                        Terms <span className="text-[#0D6EFD]">Of Service</span>
                    </h1>
                    
                    <p className={`text-[10px] md:text-[12px] text-gray-400 mt-6 tracking-[0.3em] ${sportyStyle}`}>
                        LAST UPDATED: DECEMBER 2025 • YOUR TRUST IS OUR PRIORITY
                    </p>
                </div>
            </header>

            <main className="min-h-screen py-12 md:py-20">
                <div className="container mx-auto px-5 sm:px-10 max-w-7xl">
                    <div className="max-w-4xl mx-auto">
                        
                        {/* INTRODUCTION */}
                        <p className={`text-sm md:text-base text-gray-500 mb-16 text-center italic ${sportyStyle}`}>
                            At <span className="text-black">MEN'S WEAR</span>, we value the trust you place in us. These Terms of Service describe the rules, 
                            membership guidelines, and legal agreements for our platform.
                        </p>

                        <div className="space-y-12 md:space-y-20">
                            
                            {/* SECTION 01: AGREEMENT */}
                            <section className="border-l-4 border-[#0D6EFD] pl-6">
                                <h2 className={`text-2xl md:text-3xl text-black mb-4 flex items-center gap-4 ${sportyStyle}`}>
                                    📄 Information & Agreement
                                </h2>
                                <p className={`text-base md:text-lg text-gray-600 leading-snug ${sportyStyle}`}>
                                    By accessing Men's Wear Official, you agree to be bound by these terms. We provide premium apparel engineered for the modern man. 
                                    If you disagree with any part, you may not access our services.
                                </p>
                            </section>

                            {/* SECTION 02: MEMBERSHIP (Special Requirement) */}
                            <section className="bg-[#F8FAFC] p-8 md:p-12 rounded-[20px] border border-gray-100 shadow-sm">
                                <h2 className={`text-2xl md:text-3xl text-black mb-6 ${sportyStyle}`}>
                                    💎 Membership & Inner Circle
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h3 className={`text-[#0D6EFD] mb-2 ${sportyStyle}`}>Account Data</h3>
                                        <p className="text-sm text-gray-500 uppercase font-bold">Members must provide accurate information for early-access drops and exclusive releases.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h3 className={`text-[#0D6EFD] mb-2 ${sportyStyle}`}>Restrictions</h3>
                                        <p className="text-sm text-gray-500 uppercase font-bold">Membership is non-transferable and can be revoked if fraudulent activity is detected.</p>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 03: PAYMENTS (Black Card from image) */}
                            <section className="bg-black text-white p-8 md:p-12 rounded-[20px] shadow-2xl">
                                <h2 className={`text-2xl md:text-3xl text-[#0D6EFD] mb-6 ${sportyStyle}`}>
                                    🔒 Security & Payments
                                </h2>
                                <p className={`text-base md:text-lg leading-relaxed mb-6 ${sportyStyle}`}>
                                    We use industry-standard encryption (SSL). Your payment details are processed through secure gateways. 
                                    We never store full card details on our local servers.
                                </p>
                                <div className="flex flex-wrap gap-4 opacity-50 grayscale invert">
                                    <span className="border border-white px-3 py-1 text-xs font-black">VISA</span>
                                    <span className="border border-white px-3 py-1 text-xs font-black">STRIPE</span>
                                    <span className="border border-white px-3 py-1 text-xs font-black">PAYPAL</span>
                                </div>
                            </section>

                            {/* SECTION 04: RETURNS */}
                            <section className="border-l-4 border-[#0D6EFD] pl-6">
                                <h2 className={`text-2xl md:text-3xl text-black mb-4 ${sportyStyle}`}>
                                    📦 Shipping & Returns
                                </h2>
                                <p className={`text-base md:text-lg text-gray-600 leading-snug ${sportyStyle}`}>
                                    Drop delivery varies by region. For exchanges, visit our 
                                    <Link to="/money-refund" className="text-[#0D6EFD] mx-2 underline hover:text-black transition-all">Refund Policy</Link> 
                                    within 7 days.
                                </p>
                            </section>

                            {/* CONTACT BOX: Styled like the bottom card in your image */}
                            <div className="bg-black rounded-[40px] p-10 md:p-16 relative overflow-hidden text-white">
                                <div className="relative z-10">
                                    <h2 className={`text-4xl md:text-6xl mb-8 ${sportyStyle}`}>
                                        Contact <br /> <span className="text-[#0D6EFD]">Legal Team</span>
                                    </h2>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div>
                                            <p className="text-[#0D6EFD] text-xs font-black mb-2 uppercase">Email Support</p>
                                            <a href="mailto:menswearofficial07@gmail.com" className="text-sm hover:underline">menswearofficial07@gmail.com</a>
                                        </div>
                                        <div>
                                            <p className="text-[#0D6EFD] text-xs font-black mb-2 uppercase">Official Site</p>
                                            <p className="text-sm">www.menswearofficial.com</p>
                                        </div>
                                        <div>
                                            <p className="text-[#0D6EFD] text-xs font-black mb-2 uppercase">Head Office</p>
                                            <p className="text-sm uppercase">Karachi, Pakistan</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative globe or circle similar to image background */}
                                <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[20px] border-white/5 rounded-full"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;