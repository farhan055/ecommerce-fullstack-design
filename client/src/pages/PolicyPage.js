import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Truck, DollarSign, ArrowRight } from 'lucide-react';

/** * BRAND STYLE CONSTANTS
 * Header: Bold, Italic, Sporty
 * Body: Clean, Readable, Professional
 */
const headerStyle = "font-sans font-[900] italic uppercase tracking-tighter";
const bodyStyle = "font-sans font-medium text-gray-600 leading-relaxed";

const policyData = {
    refund: {
        title: "Money Refund",
        subtitle: "Guaranteed Satisfaction",
        icon: DollarSign,
        sections: [
            { heading: "30-Day Money-Back Guarantee", content: "You have 30 calendar days to return an item from the date you received it. To be eligible for a refund, your item must be unused, unworn, and in the same condition that you received it. It must also be in the original packaging." },
            { heading: "Refund Process", content: "Once we receive your item, we will inspect it and notify you on the status of your refund. If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days." },
            { heading: "Shipping Costs", content: "You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund." },
        ]
    },
    shipping: {
        title: "Shipping Info",
        subtitle: "Fast Global Delivery",
        icon: Truck,
        sections: [
            { heading: "Processing Time", content: "All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days." },
            { heading: "Rates & Estimates", content: "Shipping charges for your order will be calculated and displayed at checkout. Standard shipping typically takes 7-14 business days. Express options are available at an additional cost, usually 3-5 business days." },
            { heading: "International Shipping", content: "We ship worldwide. International shipping rates and delivery times vary significantly based on the destination country. Customs duties and taxes may apply, and the buyer is responsible for these fees." },
        ]
    }
};

const PolicyPage = ({ type = 'shipping' }) => {
    const data = policyData[type] || policyData.shipping;

    return (
        <div className="bg-white selection:bg-blue-600 selection:text-white">
            <main className="min-h-screen py-10 md:py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    
                    {/* --- PAGE HERO SECTION --- */}
                    <header className="mb-12 md:mb-20 border-b-[6px] md:border-b-[10px] border-black pb-8 md:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            <h1 className={`text-5xl md:text-8xl lg:text-9xl text-black leading-[0.9] ${headerStyle}`}>
                                {data.title.split(' ')[0]} <br /> 
                                <span className="text-[#0D6EFD]">{data.title.split(' ')[1] || 'POLICY'}</span>
                            </h1>
                            <p className={`text-xs md:text-sm text-gray-400 mt-6 tracking-[0.3em] font-bold uppercase`}>
                                {data.subtitle} <span className="text-black/20 ml-2">// MENSWEAR OFFICIAL</span>
                            </p>
                        </div>
                        {/* Dynamic Icon - Hidden on small mobile screens for cleaner look */}
                        <div className="hidden lg:block opacity-10">
                            <data.icon size={160} strokeWidth={2.5} />
                        </div>
                    </header>

                    {/* --- POLICY CONTENT GRID --- */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        {data.sections.map((section, index) => (
                            <article 
                                key={index} 
                                className={`p-8 md:p-10 rounded-[30px] md:rounded-[45px] transition-all hover:shadow-xl ${
                                    index === 0 
                                    ? 'bg-black text-white' 
                                    : 'bg-gray-50 border border-gray-100'
                                }`}
                            >
                                <h2 className={`text-xl md:text-2xl mb-4 md:mb-6 ${headerStyle} ${index === 0 ? 'text-[#0D6EFD]' : 'text-black'}`}>
                                    {index + 1}. {section.heading}
                                </h2>
                                <p className={`text-base md:text-lg leading-relaxed font-medium ${index === 0 ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {section.content}
                                </p>
                            </article>
                        ))}

                        {/* --- CUSTOMER SUPPORT CARD --- */}
                        <div className="p-8 md:p-10 rounded-[30px] md:rounded-[45px] border-2 border-dashed border-gray-200 flex flex-col justify-center items-center text-center group transition-colors hover:border-blue-500">
                            <h2 className={`text-2xl md:text-3xl text-black mb-3 ${headerStyle}`}>Need Assistance?</h2>
                            <p className="text-gray-500 mb-6 font-medium">Our expert team is available 24/7</p>
                            
                            <a 
                                href="mailto:menswearofficial07@gmail.com" 
                                className="text-sm md:text-lg text-[#0D6EFD] font-bold underline decoration-2 underline-offset-4 hover:text-black transition-all mb-8 block break-all"
                            >
                                menswearofficial07@gmail.com
                            </a>
                            
                            <Link 
                                to="/contact-us" 
                                className={`flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:bg-[#0D6EFD] active:scale-95 transition-all shadow-lg ${headerStyle}`}
                            >
                                Get in touch <ArrowRight size={18} />
                            </Link>
                        </div>
                    </section>

                    {/* --- SECONDARY NAVIGATION LINKS --- */}
                    <nav className="mt-16 md:mt-24 pt-10 border-t border-gray-100 flex flex-wrap gap-x-10 gap-y-4 justify-center">
                        <Link to="/Terms-of-Service" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Terms of Service</Link>
                        <Link to="/privacy-policy" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</Link>
                        <Link to="/find-store" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Our Stores</Link>
                    </nav>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PolicyPage;