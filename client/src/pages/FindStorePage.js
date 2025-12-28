import React from 'react';
import Footer from '../components/Footer';
import { MapPin, Phone, Clock, ShoppingBag, Map as MapIcon } from 'lucide-react';

/**
 * Global Styles
 * sportyStyle: High-impact typography for that premium "Menswear" look.
 */
const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";

const storeLocations = [
    { 
        id: 1, 
        name: "NYC Flagship", 
        address: "235 West 57th Street, New York, NY 10019, USA", 
        phone: "+1 (212) 555-1000", 
        hours: "MON-SAT: 10AM - 9PM",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.142293414164!2d-73.9826766845939!3d40.76353897932645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f9cfcb251d%3A0xc091f05b441a4502!2s235%20W%2057th%20St%2C%20New%20York%2C%20NY%2010019!5e0!3m2!1sen!2sus!4v1670000000000!5m2!1sen!2sus"
    },
    { 
        id: 2, 
        name: "Berlin Outlet", 
        address: "Kurfürstendamm 237, 10719 Berlin, Germany", 
        phone: "+49 30 1234 5678", 
        hours: "MON-FRI: 9AM - 7PM",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.423456789!2d13.33!3d52.50!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDMwJzAwLjAiTiAxM8KwMjAnMDAuMCJF!5e0!3m2!1sen!2sde!4v1670000000000!5m2!1sen!2sde"
    },
    { 
        id: 3, 
        name: "London Boutique", 
        address: "138 Regent Street, London W1B 5SG, UK", 
        phone: "+44 20 7946 0123", 
        hours: "MON-SAT: 10AM - 9PM",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0!2d-0.14!3d51.51!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzAwLjAiTiAwwrAwOCcwMC4wIlc!5e0!3m2!1sen!2suk!4v1670000000000!5m2!1sen!2suk"
    },
];

const FindStorePage = () => {
    return (
        <div className="bg-white min-h-screen">
            <main className="py-10 md:py-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* Header Section: Scaled for mobile and desktop */}
                    <div className="mb-12 md:mb-16">
                        <h1 className={`text-4xl md:text-6xl lg:text-7xl text-black mb-4 ${sportyStyle}`}>
                            Locate <span className="text-[#0D6EFD]">Global</span> Stores
                        </h1>
                        <div className="h-1.5 w-24 md:w-32 bg-[#0D6EFD] mb-6"></div>
                        <p className={`text-[11px] md:text-[13px] text-gray-500 max-w-2xl leading-relaxed tracking-widest ${sportyStyle}`}>
                            PREMIUM CRAFTSMANSHIP IN PERSON. VISIT OUR FLAGSHIP LOCATIONS WORLDWIDE.
                        </p>
                    </div>

                    {/* --- THE BOLD BORDER GRID --- 
                        Matches the ProductCard aesthetic: Thick borders and Hard Shadows.
                    */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                        {storeLocations.map((store) => (
                            <div 
                                key={store.id} 
                                className="group bg-white rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(13,110,253,1)] hover:border-[#0D6EFD] transition-all duration-300 flex flex-col h-full overflow-hidden"
                            >
                                
                                {/* --- MAP AREA --- 
                                    Matches the Image area of ProductCard with a Bottom Border switch.
                                */}
                                <div className="relative h-[280px] sm:h-[320px] bg-[#F8FAFC] overflow-hidden border-b-2 border-black group-hover:border-[#0D6EFD] transition-colors">
                                    <iframe
                                        title={store.name}
                                        src={store.mapUrl} 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0 }} 
                                        allowFullScreen="" 
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="grayscale hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                    
                                    {/* Action Icon Overlay */}
                                    <div className="absolute top-4 right-4 bg-white border-2 border-black p-3 rounded-full text-black group-hover:bg-[#0D6EFD] group-hover:text-white group-hover:border-[#0D6EFD] transition-all shadow-lg">
                                        <ShoppingBag size={20} />
                                    </div>
                                </div>

                                {/* --- INFO AREA --- 
                                    Matches the Product Info Area (Centered Layout).
                                */}
                                <div className="p-6 md:p-8 flex flex-col flex-grow text-center bg-white">
                                    <h2 className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter hover:text-[#0D6EFD] transition-colors mb-4`}>
                                        {store.name}
                                    </h2>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <MapPin size={18} className="text-[#0D6EFD]" />
                                            <p className={`text-[10px] md:text-[11px] text-black leading-tight ${sportyStyle}`}>
                                                {store.address}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Phone size={18} className="text-[#0D6EFD]" />
                                            <p className={`text-[11px] md:text-[12px] text-black ${sportyStyle}`}>
                                                {store.phone}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Clock size={18} className="text-[#0D6EFD]" />
                                            <p className={`text-[11px] md:text-[12px] text-black ${sportyStyle}`}>
                                                {store.hours}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* --- ACTION BUTTON --- 
                                        Matches the "Add To Cart" button style exactly.
                                    */}
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`mt-auto w-full bg-black border-2 border-black text-white py-4 rounded-xl text-[11px] font-black italic uppercase hover:bg-[#0D6EFD] hover:border-[#0D6EFD] transition-all flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(13,110,253,0.5)] ${sportyStyle}`}
                                    >
                                        <MapIcon size={16} /> Get Directions
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FindStorePage;