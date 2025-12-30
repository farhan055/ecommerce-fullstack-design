import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, ArrowLeft, Loader2, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/authContext'; 
import { useCurrency } from '../context/CurrencyContext'; 
import Footer from '../components/Footer';

// --- UI Styling Constants ---
const boldHeading = "font-[900] italic uppercase tracking-tighter leading-none text-black";
const sportySub = "font-black tracking-[2px] uppercase text-[10px] italic text-gray-500";
const sportyButton = "font-black text-[10px] uppercase tracking-widest italic transition-all duration-300 active:scale-95";

// --- Custom Red Alert Modal for Order Cancellation ---
const CancelModal = ({ isOpen, onClose, onConfirm, orderId, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden border-[3px] border-black shadow-2xl scale-in-center">
                <div className="bg-red-600 p-6 text-white flex flex-col items-center">
                    <AlertTriangle size={40} className="mb-2" />
                    <h3 className="font-black italic uppercase tracking-widest text-lg">Terminate Order?</h3>
                </div>
                <div className="p-8 text-center">
                    <p className="font-bold text-gray-500 text-sm mb-6 leading-relaxed">
                        Are you sure you want to cancel order <span className="text-black">#{orderId}</span>? 
                        <br/> Admin will be notified of this cancellation.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-black italic text-[10px] uppercase tracking-widest bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Keep Order
                        </button>
                        <button 
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 py-4 rounded-2xl font-black italic text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                        >
                            {loading ? <Loader2 className="animate-spin" size={14} /> : 'Terminate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Individual Order Card Component ---
const OrderCard = ({ order, onCancelSuccess }) => {
    const { user } = useAuth();
    const { currency: contextCurrency } = useCurrency(); 
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const items = order.orderItems || [];

    // --- HARDCODE CURRENCY LOGIC (FIXED) ---
    const formatPrice = (priceVal) => {
        const numPrice = Number(priceVal) || 0;
        // Logic: Agar price 1000 se kam ho ya decimal ho toh USD ($), warna PKR (Rs)
        let symbol = 'Rs ';
        if (numPrice < 1000 || !Number.isInteger(numPrice)) {
            symbol = '$';
        }
        return `${symbol}${numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        return `https://menswear-backend.vercel.app${path}`; 
    };

    const handleCancelRequest = async () => {
        setIsCancelling(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const config = {
                headers: { Authorization: `Bearer ${user?.token || storedUser?.token}` }
            };
            await axios.put(`https://menswear-backend.vercel.app/api/orders/cancel-order/${order._id}`, {
                email: user?.email || storedUser?.email,
                reason: "User cancelled from Dashboard"
            }, config);

            onCancelSuccess(order.customOrderId); 
            setIsModalOpen(false);
        } catch (err) {
            alert(err.response?.data?.message || "CANCELLATION FAILED.");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <>
            <div className="bg-white border-[3px] border-black/5 rounded-3xl overflow-hidden mb-6 shadow-sm transition-all hover:shadow-md">
                {/* Header: Order Info - Responsive adjustment */}
                <div className="p-4 md:p-6 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-dashed border-gray-200">
                    <div className="flex gap-6 md:gap-10">
                        <div>
                            <p className={sportySub}>Order Serial</p>
                            <p className="font-black italic text-black text-sm md:text-base">#{order.customOrderId}</p>
                        </div>
                        <div>
                            <p className={sportySub}>Net Total</p>
                            <p className="font-black italic text-[#0D6EFD] text-sm md:text-base">{formatPrice(order.totalPrice)}</p>
                        </div>
                    </div>
                    <span className="px-4 py-1 bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full font-black italic text-[9px] md:text-[10px] uppercase">
                        {order.status || 'Processing'}
                    </span>
                </div>

                {/* Body: Product Info */}
                <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6 w-full">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-2xl overflow-hidden border-2 border-black/5 shrink-0">
                            <img 
                                src={getImageUrl(items[0]?.image)} 
                                alt="Product" 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={boldHeading + " text-lg md:text-xl truncate"}>{items[0]?.name || "Product Item"}</p>
                            <p className={sportySub}>MW SIGNATURE DROP / {new Date().getFullYear()} EDITION</p>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            onClick={() => setIsDetailsOpen(!isDetailsOpen)} 
                            className={`flex-1 md:flex-none bg-black text-white px-4 md:px-8 py-4 rounded-2xl ${sportyButton} flex items-center justify-center gap-2 hover:bg-gray-800 whitespace-nowrap`}
                        >
                            {isDetailsOpen ? 'CLOSE' : 'DETAILS'} 
                            <ChevronDown size={14} className={isDetailsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                        </button>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-12 h-12 md:w-14 md:h-14 border-2 border-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Collapsible Details */}
                {isDetailsOpen && (
                    <div className="p-4 md:p-6 bg-gray-50/80 border-t-2 animate-in fade-in duration-300">
                        <p className={sportySub + " mb-4"}>MANIFEST / PURCHASED ITEMS</p>
                        {items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 md:p-4 rounded-2xl mb-2 border border-black/5">
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                    <img src={getImageUrl(item.image)} className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-lg shrink-0" alt={item.name} />
                                    <span className="font-bold italic uppercase text-[11px] md:text-sm text-black truncate">
                                        {item.name} <span className="text-[#0D6EFD]">x{item.qty || item.quantity}</span>
                                    </span>
                                </div>
                                <span className="font-black italic text-black text-[11px] md:text-sm shrink-0 ml-2">{formatPrice(item.price)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CancelModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConfirm={handleCancelRequest}
                orderId={order.customOrderId}
                loading={isCancelling}
            />
        </>
    );
};

// --- Main Page Component ---
const MyOrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const currentUser = user || JSON.parse(localStorage.getItem('user'));
            const email = currentUser?.email;

            if (!email) {
                setLoading(false);
                return;
            }

            const { data } = await axios.get(`https://menswear-backend.vercel.app/api/orders/myorders-by-email/${email}`);
            setOrders(data);
        } catch (err) { 
            console.error("Fetch Error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    const removeOrderFromUI = (customId) => {
        setOrders(prev => prev.filter(order => order.customOrderId !== customId));
    };

    useEffect(() => { 
        fetchOrders(); 
    }, [user]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center font-black italic gap-4 text-center px-4">
                <Loader2 className="animate-spin text-[#0D6EFD]" size={40} />
                <span className="tracking-widest text-xs md:text-sm">SYNCHRONIZING RECENT DATA...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <main className="max-w-5xl mx-auto p-4 md:p-12 py-10 md:py-16">
                <button onClick={() => navigate('/profile')} className="flex items-center gap-2 mb-6 md:mb-10 text-black hover:text-[#0D6EFD] transition-colors">
                    <ArrowLeft size={18} /><span className={sportySub}>Return to Control Center</span>
                </button>

                <h1 className={boldHeading + " text-4xl sm:text-6xl md:text-8xl mb-8 md:mb-16"}>
                    MY <span className="text-[#0D6EFD]">ORDERS</span>
                </h1>

                {orders.length > 0 ? (
                    <div className="animate-in slide-in-from-bottom-5 duration-500">
                        {orders.map(order => (
                            <OrderCard key={order._id} order={order} onCancelSuccess={removeOrderFromUI} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-20 border-4 border-dashed rounded-[2rem] md:rounded-[3rem] bg-white border-gray-100 mx-auto">
                        <ShoppingBag className="mx-auto text-gray-200 mb-6 w-16 h-16 md:w-20 md:h-20" />
                        <h2 className={boldHeading + " text-2xl md:text-3xl mb-4"}>No Orders History</h2>
                        <Link to="/products" className={`inline-block bg-black text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl ${sportyButton}`}>
                            Initiate First Order
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
            <div className="text-center pb-10 text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">
                © MENSWEAR OFFICIAL 2025
            </div>
        </div>
    );
};

export default MyOrdersPage;