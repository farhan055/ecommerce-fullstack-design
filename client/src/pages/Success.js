import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, FileDown, Loader2, MapPin, CreditCard, ArrowRight, ShoppingBag } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import Footer from '../components/Footer';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { currency: contextCurrency, convertPrice } = useCurrency();

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    const orderId = searchParams.get('orderId') || searchParams.get('id');
    const sessionId = searchParams.get('session_id');

    // --- HARDCODE CURRENCY LOGIC (FIXED) ---
    const activeSymbol = useMemo(() => {
        if (!orderData) return contextCurrency === 'PKR' ? 'Rs ' : '$';
        
        const price = Number(orderData.totalPrice);
        // Hardcode logic: Agar price 1000 se kam ho OR decimal point ho (.00) toh USD show kare
        if (price < 1000 || !Number.isInteger(price)) {
            return '$';
        }
        return 'Rs ';
    }, [orderData, contextCurrency]);

    useEffect(() => {
        const fetchOrder = async () => {
            if ((!orderId && !sessionId) || fetchedRef.current) {
                if (!orderId && !sessionId) setLoading(false);
                return;
            }
            fetchedRef.current = true;
            try {
                let url = sessionId
                    ? `https://menswear-backend.vercel.app/api/orders/verify?session_id=${sessionId}&id=${orderId}`
                    : `https://menswear-backend.vercel.app/api/orders/single/${orderId}`;

                const res = await fetch(url);
                if (!res.ok) throw new Error('Order fetch failed');
                const data = await res.json();
                const finalOrder = data.order || (data._id ? data : null);

                if (finalOrder) {
                    setOrderData(finalOrder);
                    clearCart();
                }
            } catch (err) {
                console.error('Order Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, sessionId, clearCart]);

    const deliveryRange = useMemo(() => {
        const today = new Date();
        const d1 = new Date(); d1.setDate(today.getDate() + 3);
        const d2 = new Date(); d2.setDate(today.getDate() + 7);
        return `${d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }, []);

    // --- ACCURATE PDF INVOICE ---
    const downloadCustomInvoice = (data, symbol) => {
        if (!data) return;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header Section
        try { 
            doc.addImage('/logo4.png', 'PNG', 15, 12, 12, 12); 
        } catch (e) {
            doc.setFillColor(14, 165, 233); doc.circle(20, 18, 5, 'F');
        }

        doc.setTextColor(14, 165, 233); doc.setFontSize(22); doc.setFont("helvetica", "bold");
        doc.text("MEN'S WEAR", 30, 21);
        doc.setFontSize(8); doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal");
        doc.text("PREMIUM CLOTHING STORE", 30, 26);

        doc.setFont("helvetica", "bold"); doc.text("OFFICIAL SALES RECEIPT", pageWidth - 15, 18, { align: 'right' });
        doc.text(`ORDER ID: #${data.customOrderId || data._id}`, pageWidth - 15, 23, { align: 'right' });
        doc.setFont("helvetica", "normal"); doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 27, { align: 'right' });

        doc.setDrawColor(14, 165, 233); doc.setLineWidth(1); doc.line(15, 35, pageWidth - 15, 35);

        // Grid Info
        doc.setFontSize(9); doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER DETAILS", 15, 45);
        doc.text("DELIVERY WINDOW", 80, 45);
        doc.text("STORE CONTACT", 145, 45);

        doc.setFontSize(8); doc.setFont("helvetica", "normal");
        const ship = data.shippingAddress;
        const addressLines = doc.splitTextToSize(`${ship?.address || ''}, ${ship?.city || ''}`, 55);
        doc.text([`${ship?.firstName} ${ship?.lastName}`.toUpperCase(), ...addressLines, `PH: ${data.phone || 'N/A'}`], 15, 51);

        doc.setTextColor(14, 165, 233); doc.setFont("helvetica", "bold");
        doc.text(data.expectedDelivery || deliveryRange, 80, 51);
        doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal");
        doc.text("Standard Home Delivery", 80, 55);

        doc.text(`PAYMENT: ${data.paymentMethod?.toUpperCase()}`, 145, 51);
        doc.text("menswearofficial07@gmail.com", 145, 55);
        doc.setTextColor(14, 165, 233); doc.text("menswearbrand.vercel.app", 145, 59);

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['#', 'PRODUCT DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']],
            body: (data.orderItems || []).map((item, i) => [
                i + 1, 
                item.name.toUpperCase(), 
                item.qty || item.quantity,
                `${symbol}${Number(item.price).toFixed(2)}`,
                `${symbol}${(Number(item.price) * (item.qty || item.quantity)).toFixed(2)}`
            ]),
            headStyles: { fillColor: [0, 0, 0], fontSize: 8 },
            bodyStyles: { fontSize: 8, textColor: [0, 0, 0] },
            theme: 'striped'
        });

        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setDrawColor(14, 165, 233); doc.line(pageWidth - 85, finalY - 5, pageWidth - 15, finalY - 5);

        doc.setFontSize(10); doc.setTextColor(0, 0, 0);
        doc.text("NET TOTAL PAID:", pageWidth - 85, finalY + 5);
        doc.setFontSize(14); doc.setTextColor(14, 165, 233); doc.setFont("helvetica", "bold");
        doc.text(`${symbol}${Number(data.totalPrice).toFixed(2)}`, pageWidth - 15, finalY + 5, { align: 'right' });

        doc.save(`Invoice_${data.customOrderId || 'Order'}.pdf`);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
            <Loader2 className="animate-spin text-sky-500 mb-4" size={50} />
            <h2 className="font-black uppercase italic tracking-tighter text-2xl">Processing Payment...</h2>
        </div>
    );

    if (!orderData) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-bold">Order not found.</p>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-green-100">
                                <CheckCircle size={14}/> PAYMENT SUCCESSFUL
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                ORDER <br/> <span className="text-sky-500 underline decoration-black">CONFIRMED.</span>
                            </h1>
                             <p className="text-gray-400 font-bold text-sm mx-auto md:mx-0 max-w-xs md:max-w-md">
                                    We've received your order. Our team is now preparing your premium items for shipment.
                                </p>
                            <p className="text-gray-400 font-bold text-sm uppercase">Order ID: #{orderData.customOrderId || orderData._id}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                <MapPin className="text-sky-500 mb-4" size={28} />
                                <h3 className="font-black uppercase text-[11px] mb-3 tracking-widest text-gray-400">Ship To</h3>
                                <p className="font-black uppercase text-black leading-tight">
                                    {orderData.shippingAddress?.firstName} {orderData.shippingAddress?.lastName}<br/>
                                    <span className="text-gray-500 text-xs font-bold">
                                        {orderData.shippingAddress?.address}, {orderData.shippingAddress?.city}
                                    </span>
                                </p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                <CreditCard className="text-sky-500 mb-4" size={28} />
                                <h3 className="font-black uppercase text-[11px] mb-3 tracking-widest text-gray-400">Order Info</h3>
                                <p className="font-black uppercase text-[11px] italic">Method: {orderData.paymentMethod}</p>
                                <p className="font-black uppercase text-[11px] italic text-sky-500 mt-1">Arriving: {orderData.expectedDelivery || deliveryRange}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Summary Card) */}
                    <div className="lg:col-span-5">
                        <div className="bg-black rounded-[3rem] p-8 md:p-10 text-white shadow-2xl border-b-[12px] border-sky-500">
                            <h3 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-2">
                                <ShoppingBag className="text-sky-500"/> Summary
                            </h3>
                            <div className="space-y-4 mb-10 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                {orderData.orderItems?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center gap-4 border-b border-white/10 pb-2">
                                        <p className="text-[11px] font-black uppercase truncate flex-1 leading-none">
                                            {(item.qty || item.quantity)}x {item.name}
                                        </p>
                                        <span className="font-black italic text-sky-400 text-sm">
                                            {activeSymbol}{Number(item.price * (item.qty || item.quantity)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-6">
                                <p className="text-[10px] font-black text-white/40 uppercase mb-1">Net Amount Paid</p>
                                <p className="text-5xl font-black italic text-sky-500 leading-none">
                                    {activeSymbol}{Number(orderData.totalPrice).toFixed(2)}
                                </p>
                            </div>
                            <div className="mt-10 space-y-3">
                                <button onClick={() => downloadCustomInvoice(orderData, activeSymbol)} className="w-full bg-sky-500 text-black py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-white transition-all">
                                    <FileDown size={18}/> Download Paid Invoice
                                </button>
                                <button onClick={() => navigate('/')} className="w-full bg-white/5 text-white py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                                    Continue Shopping <ArrowRight size={18}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }`}</style>
        </div>
    );
};

export default Success;