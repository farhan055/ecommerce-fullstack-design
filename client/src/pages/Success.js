import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Download, Loader2,
    MapPin, CreditCard, ArrowRight
} from 'lucide-react';
import jsPDF from 'jspdf';
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
        return orderData.currencyCode === 'PKR' ? 'Rs ' : '$';
    }
    return currency === 'PKR' ? 'Rs ' : '$';
}, [orderData, currency]);

    /* ================= FETCH & VERIFY ORDER ================= */
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

    /* ================= PREMIUM TRADITIONAL INVOICE DOWNLOAD ================= */
const downloadCustomInvoice = (data, activeSymbol) => {
    // Check if data exists to prevent errors
    if (!data) return;
    const items = data.orderItems || [];
    
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- 1. HEADER SECTION (Brand Identity) ---
    // Circular Blue Logo Placeholder
    doc.setFillColor(52, 152, 219);
    doc.circle(20, 20, 6, 'F'); 
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("MW", 17.5, 21);

    // Main Brand Name
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("MEN'S WEAR", 30, 22);

    // Official Receipt Details (Top Right)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text("OFFICIAL RECEIPT", pageWidth - 15, 18, { align: 'right' });
    doc.text(`Invoice: #${data.customOrderId || data._id}`, pageWidth - 15, 22, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 26, { align: 'right' });

    // Decorative separator line
    doc.setDrawColor(240, 240, 240);
    doc.line(15, 32, pageWidth - 15, 32);

    // --- 2. INFORMATION GRID (Shipping & Order Details) ---
    doc.setFontSize(9);
    doc.setTextColor(0, 153, 255);
    doc.setFont('helvetica', 'bold');
    doc.text("SHIP TO:", 15, 42);
    doc.text("ORDER SUMMARY:", pageWidth - 80, 42);

    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const ship = data.shippingAddress;
    
    // Mapping Customer Shipping Address
    doc.text([
        `${ship?.firstName} ${ship?.lastName}`.toUpperCase(),
        ship?.address || '',
        ship?.city || '',
        `Phone: ${data.phone || 'N/A'}`
    ], 15, 48);

    // Mapping Payment Method and Store Information
    doc.text([
        `Payment: ${data.paymentMethod ? data.paymentMethod.toUpperCase() : 'COD'}`,
        `Email: menswearofficial07@gmail.com`,
        `Website: www.menswear.com`
    ], pageWidth - 80, 48);

    // --- 3. PRODUCT ITEMS TABLE ---
    autoTable(doc, {
        startY: 70,
        head: [['#', 'PRODUCT DESCRIPTION', 'QTY', 'TOTAL']],
        body: items.map((item, i) => [
            i + 1,
            (item.name || "Item").toUpperCase(),
            item.qty || item.quantity || 1,
            `${activeSymbol} ${Number(item.price * (item.qty || item.quantity)).toFixed(2)}`
        ]),
        // White header with blue text (Clean UI style)
        headStyles: { 
            fillColor: [255, 255, 255], 
            textColor: [0, 153, 255], 
            fontStyle: 'bold', 
            lineWidth: { bottom: 0.1 }, 
            lineColor: [230, 230, 230],
            fontSize: 8 
        },
        bodyStyles: { 
            fontSize: 8, 
            textColor: [100, 100, 100],
            cellPadding: 3 
        },
        columnStyles: {
            0: { cellWidth: 10 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 35, halign: 'right' }
        },
        theme: 'plain',
        margin: { left: 15, right: 15 }
    });

    // --- 4. GRAND TOTAL SECTION ---
    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setTextColor(0, 153, 255);
    doc.setFont('helvetica', 'bold');
    
    // Total calculation display at the bottom right
    doc.text(`TOTAL AMOUNT: ${activeSymbol} ${Number(data.totalPrice).toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });

    // --- 5. FOOTER SECTION ---
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text("Thank you for choosing MEN'S WEAR OFFICIAL Store.", pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.text("Exchange policy: 7 days with original receipt.", pageWidth / 2, pageHeight - 11, { align: "center" });

    // Save and download the generated PDF
    doc.save(`MensWear_Invoice_${data.customOrderId || 'Order'}.pdf`);
};

    /* ================= RENDER LOGIC ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-sky-500" size={60} />
                <p className="mt-6 font-black uppercase italic tracking-widest">Verifying Order...</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-black italic uppercase mb-4">Order Not Found</h2>
                <button onClick={() => navigate('/')} className="bg-black text-white px-10 py-4 rounded-xl font-black uppercase">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle size={14}/> {orderData.isPaid ? 'Payment Verified' : 'Order Confirmed'}
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                THANKS FOR <br />
                                <span className="text-sky-500 underline decoration-black">YOUR ORDER.</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-sm">#{orderData.customOrderId || orderData._id}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-transparent hover:border-sky-500 transition-all">
                                <MapPin className="text-sky-500 mb-4" size={32} />
                                <p className="font-black uppercase text-sm mb-4">Shipping To</p>
                                <p className="font-bold uppercase text-gray-700">
                                    {orderData.shippingAddress?.firstName} {orderData.shippingAddress?.lastName}<br />
                                    {orderData.shippingAddress?.address}<br />
                                    {orderData.shippingAddress?.city}
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-gray-50">
                                <CreditCard className="text-sky-500 mb-4" size={32} />
                                <p className="font-black uppercase text-sm mb-4">Details</p>
                                <p className="font-black italic uppercase text-xs text-gray-700">
                                    Method: {orderData.paymentMethod}<br />
                                    Delivery: <span className="text-sky-500">{orderData.expectedDelivery || deliveryRange}</span><br />
                                    Support: menswearofficial07@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-black rounded-[3.5rem] p-10 text-white border-b-[12px] border-sky-500 sticky top-10">
                            <h3 className="text-2xl font-black italic uppercase mb-8">Order Summary</h3>

                            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {orderData.orderItems?.map((item, i) => (
                                    <div key={i} className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="uppercase font-black text-[10px] w-2/3">{(item.qty || item.quantity)}x {item.name}</span>
                                        <span className="font-black italic text-sky-400">
                                            {activeSymbol}{(item.price * (item.qty || item.quantity)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-10">
                                <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Total Amount Paid</p>
                                <p className="text-5xl font-black italic text-sky-500">
                                    {activeSymbol}{Number(orderData.totalPrice).toFixed(2)}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => downloadCustomInvoice(orderData, activeSymbol)}
                                    className="w-full bg-sky-500 hover:bg-sky-400 transition-colors text-black py-6 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3"
                                >
                                    <Download size={18}/> Download Invoice
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full bg-white/10 hover:bg-white/20 transition-colors py-6 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3"
                                >
                                    Continue Shopping <ArrowRight size={18}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Success;