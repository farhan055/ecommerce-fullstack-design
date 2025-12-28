// src/pages/AboutUsPage.js
import React from 'react';
import Footer from '../components/Footer';
import { TrendingUp, Award, Users } from 'lucide-react';

/**
 * @StatCard
 * A reusable card for displaying company achievements.
 * Responsive: Scales icon and text sizes based on screen width.
 */
const StatCard = ({ Icon, number, text }) => (
    <div className="bg-[#F0F7FF] p-6 md:p-8 rounded-2xl text-center border border-blue-100 shadow-sm transition-transform hover:scale-105 duration-300">
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Icon size={32} className="text-[#0D6EFD]" />
        </div>
        <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic uppercase">{number}</p>
        <p className="text-[12px] md:text-sm font-bold text-gray-500 mt-2 uppercase tracking-widest">{text}</p>
    </div>
);

/**
 * @AboutUsPage
 * This page follows a traditional editorial layout with premium spacing.
 * Fonts: Using a mix of bold italics for a "Sporty" brand feel and clean sans-serif for body text.
 */
const AboutUsPage = () => {
    const containerMaxClass = "container mx-auto px-6 max-w-6xl";

    return (
        <div className="bg-white min-h-screen">
            <main className="py-16 md:py-24">
                <div className={containerMaxClass}>
                    
                    {/* --- HERO HEADER SECTION --- */}
                    <div className="max-w-3xl mx-auto text-center mb-20">
                        <span className="text-[#0D6EFD] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Heritage</span>
                        <h1 className="text-5xl md:text-7xl font-black text-black mb-8 italic uppercase tracking-tighter leading-[0.9]">
                            Our Story: <br />
                            <span className="text-[#0D6EFD]">Men's Wear</span>
                        </h1>
                        <div className="w-24 h-2 bg-black mx-auto rounded-full"></div>
                    </div>

                    {/* --- EDITORIAL CONTENT SECTION --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                        <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
                            <p>
                                Founded in 2023, <strong className="text-black font-extrabold italic uppercase">Men's Wear Ecommerce</strong> was born from a simple mission: to provide high-quality, modern, and affordable men's fashion to a global audience. We believe that style should be accessible to everyone, regardless of their location or budget.
                            </p>
                            <p>
                                Our platform connects customers directly with verified international suppliers, offering a vast catalog of apparel—from classic formal suits to the latest casual street wear. 
                            </p>
                        </div>
                        <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
                            <p>
                                We focus on transparent pricing, reliable shipping, and an outstanding customer experience. Every piece in our collection is selected to ensure it meets our rigorous standards for durability and modern aesthetics.
                            </p>
                            <div className="p-6 bg-gray-50 rounded-2xl border-l-8 border-[#0D6EFD]">
                                <p className="italic font-bold text-black text-xl">
                                    "We don't just sell clothes; we engineer confidence for the modern man."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- CORE VALUES GRID --- */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-black text-black mb-12 italic uppercase tracking-tighter text-center md:text-left">
                            Our Core <span className="text-[#0D6EFD]">Values</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Quality & Trust", desc: "Every product on our platform is sourced from suppliers who meet strict quality and ethical standards." },
                                { title: "Innovation", desc: "We use modern technology to streamline the global supply chain, ensuring you get the best price and fastest delivery." },
                                { title: "Customer First", desc: "Your satisfaction is our priority. We offer dedicated support and clear refund policies." }
                            ].map((val, i) => (
                                <div key={i} className="p-8 border-2 border-black rounded-[2rem] hover:bg-black hover:text-white transition-all duration-300 group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                    <h3 className="text-xl font-black uppercase italic mb-4 group-hover:text-[#0D6EFD]">{val.title}</h3>
                                    <p className="text-sm leading-relaxed opacity-80 font-semibold">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- COMPANY STATS SECTION --- */}
                    <div className="bg-black rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D6EFD] blur-[120px] opacity-20"></div>
                        
                        <h2 className="text-3xl md:text-4xl font-black mb-16 italic uppercase tracking-tighter text-center">
                            By The <span className="text-[#0D6EFD]">Numbers</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                            <StatCard Icon={TrendingUp} number="1M+" text="Products Sold" />
                            <StatCard Icon={Award} number="50+" text="Global Suppliers" />
                            <div className="sm:col-span-2 lg:col-span-1">
                                <StatCard Icon={Users} number="500K+" text="Happy Customers" />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUsPage;