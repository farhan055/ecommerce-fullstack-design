import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, FileDown, Loader2,
    MapPin, CreditCard, ArrowRight, ShoppingBag
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import Footer from '../components/Footer';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { currency } = useCurrency();

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchedRef = useRef(false);

    const orderId = searchParams.get('orderId') || searchParams.get('id');
    const sessionId = searchParams.get('session_id');

    const activeSymbol = useMemo(() => {
        if (orderData && orderData.currencyCode) {
            return { USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹' }[orderData.currencyCode] || orderData.currencyCode;
        }
        return { USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹' }[currency] || currency;
    }, [orderData, currency]);

    /* ================= FETCH & VERIFY ORDER (YOUR ORIGINAL LOGIC) ================= */
    useEffect(() => {
        const fetchOrder = async () => {
            if ((!orderId && !sessionId) || fetchedRef.current) {
                if (!orderId && !sessionId) setLoading(false);
                return;
            }
            
            fetchedRef.current = true;

            try {
                let url;
                if (sessionId) {
                    url = `https://menswear-backend.vercel.app/api/orders/verify?session_id=${sessionId}&id=${orderId}`;
                } else {
                    url = `https://menswear-backend.vercel.app/api/orders/single/${orderId}`;
                }

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

    /* ================= DELIVERY RANGE ================= */
    const deliveryRange = useMemo(() => {
        const today = new Date();
        const min = currency === 'PKR' ? 3 : 7;
        const max = currency === 'PKR' ? 5 : 12;
        const d1 = new Date(today); d1.setDate(today.getDate() + min);
        const d2 = new Date(today); d2.setDate(today.getDate() + max);
        return `${d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }, [currency]);

    /* =================  INVOICE (ELECTRIC BLUE & BLACK) ================= */
    const downloadCustomInvoice = (data, symbol) => {
        if (!data) return;
        const items = data.orderItems || [];
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. BRAND SECTION (Top Left)
        try {
            // Logo aur Brand Name image ke mutabiq
            doc.addImage('/logo4.png', 'PNG', 15, 15, 10, 10); 
        } catch (e) {
            doc.setFillColor(14, 165, 233); doc.circle(20, 20, 5, 'F');
        }
        
        doc.setTextColor(14, 165, 233); // Electric Blue
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MEN'S WEAR", 28, 23);
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("PREMIUM CLOTHING STORE", 28, 28);

        // 2. RECEIPT INFO (Top Right)
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("OFFICIAL SALES RECEIPT", pageWidth - 15, 18, { align: 'right' });
        doc.text(`ORDER ID: #${data.customOrderId || data._id}`, pageWidth - 15, 23, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 27, { align: 'right' });

        // 3. ELECTRIC BLUE LINE (Image style)
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1);
        doc.line(15, 38, pageWidth - 15, 38);

        // 4. INFORMATION GRID (Exactly like Image)
        const startYInfo = 50;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("CUSTOMER DETAILS", 15, startYInfo);
        doc.text("DELIVERY WINDOW", 85, startYInfo);
        doc.text("STORE CONTACT", 145, startYInfo);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const ship = data.shippingAddress;
        
        // Customer Column
        doc.setFont('helvetica', 'bold');
        doc.text(`${ship?.firstName} ${ship?.lastName}`.toUpperCase(), 15, startYInfo + 6);
        doc.setFont('helvetica', 'normal');
        doc.text([
            ship?.address || '',
            ship?.city || '',
            `PH: ${data.phone || 'N/A'}`
        ], 15, startYInfo + 11);

        // Delivery Column
        doc.setTextColor(14, 165, 233);
        doc.setFont('helvetica', 'bold');
        doc.text(data.expectedDelivery || deliveryRange, 85, startYInfo + 6);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text("Standard Home Delivery", 85, startYInfo + 11);

        // Contact Column
        doc.text(`PAYMENT: ${data.paymentMethod?.toUpperCase() || 'PAID'}`, 145, startYInfo + 6);
        doc.text("menswearofficial07@gmail.com", 145, startYInfo + 11);
        doc.setTextColor(14, 165, 233);
        doc.text("menswearbrand.vercel.app", 145, startYInfo + 16);

        // 5. PRODUCTS TABLE (Exact Image Style)
        autoTable(doc, {
            startY: 85,
            head: [['#', 'PRODUCT DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']],
            body: items.map((item, i) => [
                i + 1,
                (item.name || "Item").toUpperCase(),
                item.qty || item.quantity || 1,
                `${symbol} ${Number(item.price).toFixed(2)}`,
                `${symbol} ${Number(item.price * (item.qty || item.quantity)).toFixed(2)}`
            ]),
            headStyles: { 
                fillColor: [0, 0, 0], 
                textColor: [255, 255, 255], 
                fontSize: 8, 
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 10 },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            },
            bodyStyles: { fontSize: 8, cellPadding: 5 },
            theme: 'striped',
            margin: { left: 15, right: 15 }
        });

        // 6. SUMMARY SECTION (Right Aligned like Image)
        const finalY = doc.lastAutoTable.finalY + 15;
        const summaryX = pageWidth - 65;

        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(0.8);
        doc.line(summaryX - 20, finalY - 5, pageWidth - 15, finalY - 5);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Subtotal
        doc.text("SUBTOTAL:", summaryX, finalY + 5);
        doc.text(`${symbol} ${Number(data.totalPrice - (currency === 'PKR' ? 500 : 2)).toFixed(2)}`, pageWidth - 15, finalY + 5, { align: 'right' });
        
        // Shipping
        doc.text("SHIPPING:", summaryX, finalY + 12);
        doc.text(`${symbol} ${currency === 'PKR' ? '500.00' : '2.00'}`, pageWidth - 15, finalY + 12, { align: 'right' });

        // Net Total
        doc.setFontSize(13);
        doc.setTextColor(14, 165, 233);
        doc.setFont('helvetica', 'bold');
        doc.text("NET TOTAL:", summaryX, finalY + 22);
        doc.text(`${symbol} ${Number(data.totalPrice).toFixed(2)}`, pageWidth - 15, finalY + 22, { align: 'right' });

        doc.save(`MensWear_Invoice_${data.customOrderId || 'Order'}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-sky-500" size={60} />
                <p className="mt-6 font-black uppercase italic tracking-widest text-sm">Verifying Secure Payment...</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-6 tracking-tighter">Order Not Found</h2>
                <button onClick={() => navigate('/')} className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-sm hover:bg-sky-500 transition-all">
                    Back to Store
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-10 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                    
                    {/* LEFT COLUMN: BRANDING & DETAILS */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-green-100">
                                <CheckCircle size={14}/> {orderData.isPaid ? 'PAYMENT VERIFIED' : 'CONFIRMED'}
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                YOUR ORDER <br/> <span className="text-sky-500 underline decoration-black">IS PLACED.</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-sm mx-auto md:mx-0 max-w-xs md:max-w-md uppercase">
                                Order #{orderData.customOrderId || orderData._id} received. We are prepping your premium items.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="p-6 md:p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all group">
                                <MapPin className="text-sky-500 mb-3 group-hover:scale-110 transition-transform" size={24} />
                                <h3 className="font-black uppercase italic text-[11px] mb-2 tracking-widest text-gray-400">Ship To</h3>
                                <div className="text-[13px] font-bold text-gray-600 leading-tight uppercase">
                                    <p className="text-black text-base mb-1">{orderData.shippingAddress?.firstName} {orderData.shippingAddress?.lastName}</p>
                                    <p className="mt-1 line-clamp-2">{orderData.shippingAddress?.address}, {orderData.shippingAddress?.city}</p>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                <CreditCard className="text-sky-500 mb-3" size={24} />
                                <h3 className="font-black uppercase italic text-[11px] mb-2 tracking-widest text-gray-400">Order Info</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Arriving</span>
                                        <span className="text-[11px] font-black italic text-sky-500 ml-2">{orderData.expectedDelivery || deliveryRange}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Method</span>
                                        <span className="text-[11px] font-black italic uppercase">{orderData.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY CARD (RESPONSIVE STICKY) */}
                    <div className="lg:col-span-5">
                        <div className="bg-black rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 text-white shadow-2xl border-b-[8px] md:border-b-[12px] border-sky-500 lg:sticky lg:top-10">
                            <h3 className="text-xl md:text-2xl font-black italic uppercase mb-6 md:mb-10 flex items-center gap-2">
                                <ShoppingBag className="text-sky-500"/> Summary
                            </h3>
                            <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                {orderData.orderItems?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center gap-2 border-b border-white/5 pb-2">
                                        <p className="text-[10px] md:text-[11px] font-black uppercase truncate flex-1">
                                            {(item.qty || item.quantity)}x {item.name}
                                        </p>
                                        <span className="font-black italic text-sky-400 whitespace-nowrap text-sm">
                                            {activeSymbol}{(item.price * (item.qty || item.quantity)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase">Net Amount Paid</p>
                                    <p className="text-4xl md:text-5xl font-black italic text-sky-500 leading-none">{activeSymbol}{Number(orderData.totalPrice).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-12 space-y-3">
                                <button 
                                    onClick={() => downloadCustomInvoice(orderData, activeSymbol)} 
                                    className="w-full bg-sky-500 text-black py-4 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white transition-all active:scale-95"
                                >
                                    <FileDown size={16}/> Download Paid Invoice
                                </button>
                                <button 
                                    onClick={() => navigate('/')} 
                                    className="w-full bg-white/5 text-white py-4 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all active:scale-95"
                                >
                                    Continue Shopping <ArrowRight size={16}/>
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