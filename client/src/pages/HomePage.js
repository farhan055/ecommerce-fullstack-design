import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { ChevronRight, User, Zap, Flame, LogOut, ArrowRight, Send, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/authContext';

// ---- STYLE CONSTANTS ----
const containerMaxClass = "container mx-auto px-4 max-w-7xl";
const sportyHeading = "font-[900] uppercase italic tracking-tighter leading-none";
const sportyButton = "font-black text-[10px] md:text-[12px] uppercase tracking-widest italic transition-all duration-300";
const sportySub = "font-black tracking-[3px] md:tracking-[5px] uppercase text-[9px] md:text-[10px] italic";

// --- Flash Sale Timer Component ---
const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        let targetDate = localStorage.getItem('flashSaleEnd');
        let now = new Date().getTime();
        if (!targetDate || new Date(targetDate).getTime() <= now) {
            const newTarget = new Date(now + 14 * 60 * 60 * 1000).toISOString();
            localStorage.setItem('flashSaleEnd', newTarget);
            targetDate = newTarget;
        }
        const difference = +new Date(targetDate) - now;
        let timeLeft = { days: 0, hours: 0, mins: 0, secs: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                mins: Math.floor((difference / 1000 / 60) % 60),
                secs: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setInterval(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimerBox = ({ val, unit }) => (
        <div className="flex flex-col items-center">
            <div className="bg-black text-white w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg border-b-4 border-[#0099ff]">
                <div className="text-base md:text-2xl font-black italic">{String(val).padStart(2, '0')}</div>
            </div>
            <div className={`${sportySub} text-gray-500 mt-1 md:mt-2`}>{unit}</div>
        </div>
    );

    return (
        <div className="flex gap-2 md:gap-4 mt-6">
            <TimerBox val={timeLeft.days} unit="Days" />
            <div className="text-black font-black mt-2 md:mt-4 text-lg">:</div>
            <TimerBox val={timeLeft.hours} unit="Hrs" />
            <div className="text-black font-black mt-2 md:mt-4 text-lg">:</div>
            <TimerBox val={timeLeft.mins} unit="Min" />
            <div className="text-black font-black mt-2 md:mt-4 text-lg">:</div>
            <TimerBox val={timeLeft.secs} unit="Sec" />
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    // Safely get user data from local storage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const [trendingProducts, setTrendingProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    // Form logic for bulk inquiries
    const [inquiry, setInquiry] = useState({ item: '', details: '', quantity: '', unit: 'Pcs' });
    const [sending, setSending] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const categoriesMenu = [
        { label: "T Shirts", slug: "t-shirts" },
        { label: "Office Shirts", slug: "office-shirts" },
        { label: "Pants", slug: "pants-trousers" },
        { label: "Hoodies", slug: "jackets-hoodies" },
        { label: "Jackets", slug: "jackets-hoodies" }
    ];

    const trendingIds = ["ts-001", "ts-003", "ts-006", "os-006", "pn-001", "jk-001", "hd-005", "pn-003"];

    // Fetch products on page load
    useEffect(() => {
        const fetchProducts = async () => {
            try {
               const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://menswear-backend.vercel.app';
               const response = await fetch(`${backendUrl}/api/products`);
                const data = await response.json();
                setTrendingProducts(data.filter(p => trendingIds.includes(p.id)));
            } catch (err) { console.error(err); } 
            finally { setProductsLoading(false); }
        };
        fetchProducts();
    }, []);

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const response = await fetch('https://menswear-backend.vercel.app/api/auth/inquires', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...inquiry, 
                    submittedBy: user?.email || 'Guest',
                    adminEmail: 'menswearofficial07@gmail.com' 
                })
            });
            if (response.ok) {
                setInquiry({ item: '', details: '', quantity: '', unit: 'Pcs' });
                setShowToast(true); 
                setTimeout(() => setShowToast(false), 5000); 
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setSending(false);
        }
    };

    // Pick avatar based on gender selection
    const avatarUrl = user?.gender?.toLowerCase() === 'female' ? '/female.png' : '/male.png';

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-black overflow-x-hidden relative">
            
            {/* Custom UI Notification Toast */}
            {showToast && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md animate-in fade-in zoom-in slide-in-from-top-10 duration-500">
                    <div className="bg-black border-2 border-[#0099ff] rounded-2xl p-5 shadow-[0_0_30px_rgba(0,153,255,0.3)] flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#0099ff]"></div>
                        <div className="bg-[#0099ff]/20 p-3 rounded-xl">
                            <CheckCircle2 className="text-[#0099ff]" size={28} />
                        </div>
                        <div>
                            <h4 className={`${sportySub} text-[#0099ff] text-xs`}>Transmission Successful</h4>
                            <p className="text-white font-black italic uppercase text-sm tracking-tight">Request Sent! We'll reply soon.</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-auto text-gray-500 hover:text-white transition-colors">
                            <LogOut size={16} className="rotate-90" />
                        </button>
                    </div>
                </div>
            )}

            <main className="pb-20">
                <div className={containerMaxClass}>
                    
                    {/* HERO & SIDEBAR SECTION */}
                    <div className="flex flex-col lg:flex-row gap-6 pt-4 md:pt-8">
                        
                        {/* Categories Menu (Desktop Only) */}
                        <aside className="hidden lg:block w-72 bg-white border-2 border-gray-100 rounded-[2rem] overflow-hidden shadow-sm h-fit">
                            <div className="p-6 border-b-4 border-gray-50 bg-gray-50/50">
                                <h3 className={`${sportySub} text-gray-400`}>Menu Categories</h3>
                            </div>
                            <nav className="flex flex-col">
                                {categoriesMenu.map((cat, i) => (
                                    <Link key={i} to={`/products?category=${cat.slug}`} className="px-8 py-4 text-[13px] font-black text-gray-700 hover:bg-[#E3F2FD] hover:text-[#0099ff] transition-all flex justify-between items-center group italic uppercase tracking-wider">
                                        {cat.label} <ChevronRight size={14} className="group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </nav>
                        </aside>

                        {/* Main Banner */}
                        <div className="flex-grow">
                            <div className="relative bg-[#E3F2FD] rounded-[1.5rem] md:rounded-[2.5rem] h-[300px] md:h-[480px] overflow-hidden border-2 md:border-4 border-white shadow-xl group">
                                <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-16 z-20">
                                    <p className={`${sportySub} text-[#0099ff] mb-2`}>Summer drop 2025</p>
                                    <h2 className={`text-3xl md:text-6xl lg:text-7xl ${sportyHeading} mb-4 md:mb-8`}>
                                        Latest Trending <br/> <span className="text-blue-600">MEN'S WEAR</span>
                                    </h2>
                                    <button onClick={() => navigate('/products')} className={`w-fit bg-black text-white px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl ${sportyButton} hover:bg-[#0099ff] hover:scale-105 shadow-lg`}>
                                        Shop Collection
                                    </button>
                                </div>
                                <img src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1200" alt="Hero" className="absolute right-0 top-0 h-full w-full object-cover opacity-40 md:opacity-95 group-hover:scale-110 transition-transform duration-[5000ms]" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#E3F2FD] via-[#E3F2FD]/80 lg:via-[#E3F2FD]/60 to-transparent z-10"></div>
                            </div>
                        </div>

                        {/* PROFILE & PROMO WIDGET: Fixed to show on BOTH Mobile and Desktop */}
                        <div className="flex flex-col gap-5 w-full lg:w-72">
                            {/* User Authentication Card */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-gray-100 shadow-sm transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-[#E3F2FD] border-2 border-white rounded-xl flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
                                        {user ? <img src={avatarUrl} alt="User" className="w-full h-full object-cover" /> : <User size={24} className="text-gray-300" />}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-[#0D6EFD] uppercase italic tracking-widest leading-none mb-1">Welcome</p>
                                        <p className="font-black italic uppercase truncate text-sm">{user?.name?.split(' ')[0] || "Guest"}</p>
                                    </div>
                                </div>
                                {user ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                                        <button onClick={() => navigate('/profile')} className={`w-full bg-blue-50 text-blue-600 py-3 rounded-xl ${sportyButton}`}>Profile</button>
                                        <button onClick={logout} className={`w-full bg-red-50 text-red-600 py-3 rounded-xl ${sportyButton}`}>Logout</button>
                                    </div>
                                ) : (
                                    <button onClick={() => navigate('/login')} className={`w-full bg-[#0099ff] text-black py-3 rounded-xl ${sportyButton} hover:bg-black hover:text-white shadow-md`}>Login Account</button>
                                )}
                            </div>
                            
                            {/* Promo Banner */}
                            <div className="bg-[#FF9017] p-6 md:p-8 rounded-[2rem] relative overflow-hidden group shadow-md cursor-pointer flex flex-col justify-center min-h-[100px]">
                                <Zap className="absolute -right-2 -bottom-2 w-16 h-16 md:w-20 md:h-20 opacity-20 group-hover:scale-125 transition-all rotate-12" />
                                <p className={`${sportySub} text-black/60`}>Special Promo</p>
                                <p className="text-xl md:text-2xl font-black italic text-black">GET $10 OFF</p>
                            </div>
                        </div>
                    </div>

                    {/* FLASH SALE SECTION */}
                    <section className="mt-12 md:mt-16 bg-white border-4 border-gray-50 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-xl">
                        <div className="p-8 md:p-12 lg:w-1/3 flex flex-col justify-center border-b lg:border-b-0 lg:border-r-4 border-gray-50 bg-white">
                            <div className="flex items-center gap-3 text-[#EB001B] mb-4">
                                <Flame size={22} fill="#EB001B" className="animate-bounce" />
                                <span className={sportySub}>Mega Sale Live</span>
                            </div>
                            <h3 className={`text-4xl md:text-5xl ${sportyHeading} mb-4`}>Season <br/><span className="text-[#0099ff]">Mega Sale</span></h3>
                            <CountdownTimer />
                        </div>
                        <div className="lg:w-2/3 relative h-64 md:h-auto overflow-hidden group">
                            <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt="Sale" />
                        </div>
                    </section>

                   {/* TRENDING PRODUCTS GRID */}
<section className="mt-16 md:mt-24 px-4 md:px-10">
    {/* Heading Area */}
    <div className="flex items-center gap-4 md:gap-8 mb-8 md:mb-12">
        <h2 className={`text-2xl md:text-5xl ${sportyHeading}`}>
            Trending <span className="text-[#0099ff]">Now</span>
        </h2>
        <div className="h-[2px] md:h-[4px] flex-grow bg-gray-100 rounded-full"></div>
    </div>

    {/* 1. Products Grid - Optimized for Mobile (2 Columns) and Desktop (4 Columns) */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
        {!productsLoading ? (
            trendingProducts.map(p => (
                <div key={p.id} className="flex justify-center">
                    <ProductCard product={p} />
                </div>
            ))
        ) : (
            /* Skeleton Loading State matches the 2-column mobile layout */
            <div className="contents">
                {[...Array(4)].map((_, i) => (
                    <div 
                        key={i} 
                        className="h-[280px] sm:h-80 md:h-[450px] w-full bg-gray-100 rounded-[1.5rem] md:rounded-[2rem] animate-pulse"
                    ></div>
                ))}
            </div>
        )}
    </div>
    
    {/* 2. CALL TO ACTION BUTTON*/}
    <div className="mt-20 flex justify-center w-full">
                 <button 
    onClick={() => navigate('/products')} 
    className={`px-12 py-6 bg-black text-white rounded-2xl ${sportyButton} hover:bg-[#0099ff] flex items-center justify-center gap-4 hover:scale-110 shadow-2xl transition-all group`}>
    <span className="text-xl font-black italic tracking-wider uppercase">
        Explore Collections
    </span>
    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                 </button>
    </div>
</section>

                    {/* BULK INQUIRY FORM */}
                    <section className="mt-20 md:mt-32 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-black border-4 border-white">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0099ff] opacity-10 blur-[120px] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row">
                            <div className="lg:w-1/2 p-10 md:p-20 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-1 w-12 bg-[#0099ff]"></div>
                                    <span className={`${sportySub} text-[#0099ff]`}>Bulk Sourcing</span>
                                </div>
                                <h2 className={`text-4xl md:text-6xl ${sportyHeading} text-white mb-6`}>
                                    Direct <span className="text-[#0099ff]">Inquiry</span> <br/> To Our Elite Team
                                </h2>
                                <p className="text-gray-400 font-medium italic mb-8 max-w-sm">
                                    Looking for custom orders or bulk stock? Drop your requirements and we'll handle the rest.
                                </p>
                                <div className="flex items-center gap-4 text-white/50">
                                    <Mail size={20} className="text-[#0099ff]" />
                                    <span className="text-sm font-bold tracking-widest uppercase">menswearofficial07@gmail.com</span>
                                </div>
                            </div>

                            <div className="lg:w-1/2 p-6 md:p-12 bg-white/5 backdrop-blur-sm border-l border-white/10">
                                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border-b-8 border-[#0099ff]">
                                    <h3 className={`${sportyHeading} text-2xl text-black mb-8`}>Send Quote Request</h3>
                                    <form onSubmit={handleInquirySubmit} className="space-y-5">
                                        <input 
                                            required
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl focus:border-[#0099ff] outline-none transition-all font-bold italic text-sm" 
                                            placeholder="PRODUCT NAME (E.G. POLO T-SHIRTS)"
                                            value={inquiry.item}
                                            onChange={(e) => setInquiry({...inquiry, item: e.target.value.toUpperCase()})}
                                        />
                                        <textarea 
                                            rows="3" 
                                            className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl focus:border-[#0099ff] outline-none transition-all font-bold italic text-sm" 
                                            placeholder="DESCRIBE YOUR REQUIREMENTS..."
                                            value={inquiry.details}
                                            onChange={(e) => setInquiry({...inquiry, details: e.target.value})}
                                        ></textarea>
                                        <div className="flex gap-4">
                                            <input 
                                                type="number"
                                                className="w-1/2 bg-gray-50 border-2 border-gray-100 p-4 rounded-xl focus:border-[#0099ff] outline-none font-bold italic" 
                                                placeholder="QTY"
                                                value={inquiry.quantity}
                                                onChange={(e) => setInquiry({...inquiry, quantity: e.target.value})}
                                            />
                                            <select 
                                                className="w-1/2 bg-gray-50 border-2 border-gray-100 p-4 rounded-xl focus:border-[#0099ff] outline-none font-black italic text-xs uppercase"
                                                value={inquiry.unit}
                                                onChange={(e) => setInquiry({...inquiry, unit: e.target.value})}
                                            >
                                                <option>Pieces</option>
                                                <option>Cartons</option>
                                                <option>Sets</option>
                                            </select>
                                        </div>
                                        <button 
                                            disabled={sending}
                                            className={`w-full bg-black text-white py-5 rounded-xl ${sportyButton} flex items-center justify-center gap-3 hover:bg-[#0099ff] group shadow-xl active:scale-95`}
                                        >
                                            {sending ? "TRANSMITTING..." : "SEND REQUEST NOW"}
                                            <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;