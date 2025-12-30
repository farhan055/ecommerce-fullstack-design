import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle, Loader2, ArrowLeft, CreditCard, 
    AlertCircle, Truck, ShieldCheck, ShoppingBag, 
    FileDown, MapPin, Phone, ArrowRight 
} from 'lucide-react';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

// FIX: Small letters mein import taake error na aaye
import { jsPDF } from 'jspdf'; 
import autoTable from 'jspdf-autotable'; 

import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/authContext'; 
import Footer from '../components/Footer';

const stripePromise = loadStripe('pk_test_51SfRWVDULzuXEvq1woksn1JQ1nr2A11OuplMPuetqa9S8vRWwt5nGF9QlQ36syk3nlWglK3clg4AteOkiHX6H5yb004ERv8eGp');

const generateCustomOrderId = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); 
    return `MWS${randomDigits}`;
};

const InputField = ({ name, placeholder, type = "text", fullWidth = false, value, onChange, error }) => (
    <div className={`${fullWidth ? 'md:col-span-2' : ''} space-y-2 text-left`}>
        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-1">
            {placeholder}
        </label>
        <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete="off"
            className={`w-full bg-gray-50 p-4 md:p-5 rounded-2xl text-[14px] font-bold border-2 transition-all duration-300 outline-none 
            ${error ? 'border-red-500 bg-red-50 text-red-900' : 'border-transparent focus:border-black focus:bg-white text-black'}`}
            placeholder={`Enter your ${placeholder.toLowerCase()}...`}
        />
        {error && (
            <p className="text-[9px] text-red-600 font-black tracking-widest uppercase ml-1 flex items-center gap-1">
                <AlertCircle size={10}/> {error}
            </p>
        )}
    </div>
);

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const { currency, convertPrice } = useCurrency(); 
    const { user } = useAuth(); 
    const navigate = useNavigate();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null); 
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod'); 
    const [errors, setErrors] = useState({});
    const [phoneNumber, setPhoneNumber] = useState();
    const [formData, setFormData] = useState({ 
        firstName: user?.name?.split(' ')[0] || '', 
        lastName: user?.name?.split(' ')[1] || '', 
        email: user?.email || '', 
        address: '', city: '', zip: '' 
    });

    const activeSymbol = { USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹' }[currency] || currency;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ')[1] || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const { total, subtotal, shipping } = useMemo(() => {
        const subRaw = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const subConverted = Number(convertPrice(subRaw)) || 0;
        let shippingFinal = currency === 'PKR' ? 500 : Number(convertPrice(500 / 280)) || 0;
        const finalTotal = subConverted + shippingFinal;
        return { 
            subtotal: subConverted.toFixed(2),
            shipping: shippingFinal.toFixed(2),
            total: finalTotal.toFixed(2)
        };
    }, [cartItems, convertPrice, currency]);

    const deliveryRange = useMemo(() => {
        const today = new Date();
        let minDays = 3, maxDays = 5;
        const currentCity = formData.city.trim().toLowerCase();
        if (currentCity === 'karachi') { minDays = 2; maxDays = 4; } 
        else if (currency === 'PKR') { minDays = 4; maxDays = 7; } 
        else { minDays = 10; maxDays = 15; }
        const d1 = new Date(); d1.setDate(today.getDate() + minDays);
        const d2 = new Date(); d2.setDate(today.getDate() + maxDays);
        return `${d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }, [formData.city, currency]);

    const validate = () => {
        let tempErrors = {};
        if (!formData.firstName.trim()) tempErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) tempErrors.lastName = "Last name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "Invalid email address";
        if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) tempErrors.phone = "Valid phone is required";
        if (!formData.address.trim()) tempErrors.address = "Street address is required";
        if (!formData.city.trim()) tempErrors.city = "City is required";
        if (!/^\d{4,10}$/.test(formData.zip)) tempErrors.zip = "Invalid zip code";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

const downloadCustomInvoice = () => {
        if (!cartItems || cartItems.length === 0) return;
        
        const doc = new jsPDF("p", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // --- LOGO & BRAND NAME (ELECTRIC BLUE) ---
        try {
            // Logo image (Aapka logo4.png)
            doc.addImage('/logo4.png', 'PNG', 15, 12, 12, 12); 
        } catch (e) {
            // Fallback agar logo na miley
            doc.setFillColor(14, 165, 233);
            doc.circle(20, 18, 5, 'F');
        }

        // Brand Name in Electric Blue
        doc.setTextColor(14, 165, 233); // Electric Blue
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("MEN'S WEAR", 30, 21);
        
        // Sub-header Info (Black Text)
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0); 
        doc.setFont("helvetica", "normal");
        doc.text("PREMIUM CLOTHING STORE", 30, 26);
        
        doc.setFont("helvetica", "bold");
        doc.text("OFFICIAL SALES RECEIPT", pageWidth - 15, 18, { align: "right" });
        doc.setFontSize(9);
        doc.text(`ORDER ID: #${invoiceData?.id || 'MWS77932'}`, pageWidth - 15, 23, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 27, { align: "right" });

        // Electric Blue Thick Divider
        doc.setDrawColor(14, 165, 233); 
        doc.setLineWidth(1);
        doc.line(15, 35, pageWidth - 15, 35);

        // --- INFO COLUMNS (PURE BLACK TEXT) ---
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0); 
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER DETAILS", 15, 45); 
        doc.text("DELIVERY WINDOW", 85, 45);
        doc.text("STORE CONTACT", 145, 45);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        
        // Column 1: Customer
        const clientName = `${formData.firstName} ${formData.lastName}`.toUpperCase();
        doc.setFont("helvetica", "bold");
        doc.text(clientName, 15, 51);
        doc.setFont("helvetica", "normal");
        const addressLine = doc.splitTextToSize(`${formData.address}, ${formData.city}`, 60);
        doc.text(addressLine, 15, 55);
        doc.text(`PH: ${phoneNumber}`, 15, 57 + (addressLine.length * 3.5));

        // Column 2: Delivery (Electric Blue Text)
        doc.setTextColor(14, 165, 233);
        doc.setFont("helvetica", "bold");
        doc.text(deliveryRange, 85, 51);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Standard Home Delivery", 85, 55);

        // Column 3: Store Details (Updated Website)
        doc.text(`PAYMENT: ${paymentMethod.toUpperCase()}`, 145, 51);
        doc.text("menswearofficial07@gmail.com", 145, 55);
        doc.setTextColor(14, 165, 233); // Website link in blue
        doc.text("menswearbrand.vercel.app", 145, 59);
        doc.setTextColor(0, 0, 0);

        // --- ITEMS TABLE (ACCURATE CALCULATIONS) ---
        autoTable(doc, {
            startY: 72, 
            head: [["#", "PRODUCT DESCRIPTION", "QTY", "UNIT PRICE", "TOTAL"]],
            body: cartItems.map((item, i) => {
                const uPrice = Number(convertPrice(item.price));
                const sTotal = uPrice * item.quantity;
                return [
                    i + 1, 
                    item.name.toUpperCase(), 
                    item.quantity, 
                    `${activeSymbol} ${uPrice.toFixed(2)}`,
                    `${activeSymbol} ${sTotal.toFixed(2)}`
                ];
            }),
            headStyles: { 
                fillColor: [0, 0, 0], // Black Table Header
                textColor: [255, 255, 255], 
                fontSize: 8, 
                fontStyle: 'bold'
            },
            bodyStyles: { 
                fontSize: 8, 
                textColor: [0, 0, 0], 
                cellPadding: 4 
            },
            columnStyles: { 
                0: { cellWidth: 10 }, 
                2: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 35, halign: 'right' } 
            },
            theme: 'striped'
        });

        // --- SUMMARY CALCULATION (ZERO ERROR) ---
        const finalY = doc.lastAutoTable.finalY + 10;
        
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(0.5);
        doc.line(pageWidth - 85, finalY, pageWidth - 15, finalY);

        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        
        // Shipping calc
        doc.text("SUBTOTAL:", pageWidth - 50, finalY + 7, { align: "right" });
        doc.text(`${activeSymbol} ${subtotal}`, pageWidth - 15, finalY + 7, { align: "right" });
        
        doc.text("SHIPPING:", pageWidth - 50, finalY + 12, { align: "right" });
        doc.text(`${activeSymbol} ${shipping}`, pageWidth - 15, finalY + 12, { align: "right" });

        // Final Total
        doc.setFontSize(12);
        doc.setTextColor(14, 165, 233); // Electric Blue Total
        doc.setFont("helvetica", "bold");
        doc.text("NET TOTAL:", pageWidth - 50, finalY + 20, { align: "right" });
        doc.text(`${activeSymbol} ${total}`, pageWidth - 15, finalY + 20, { align: "right" });

        // --- FOOTER ---
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(230, 230, 230);
        doc.line(15, 275, pageWidth - 15, 275);
        doc.text("THANK YOU FOR SHOPPING WITH MEN'S WEAR OFFICIAL", pageWidth / 2, 282, { align: "center" });
        doc.text("Exchange within 7 days with original tag and receipt.", pageWidth / 2, 286, { align: "center" });

        doc.save(`Men's Wear Invoice_${invoiceData?.id || 'Order'}.pdf`);
    };
    const handleOrder = async (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;
        setIsProcessing(true);
        const orderId = generateCustomOrderId();
        const token = localStorage.getItem('token');
        const payload = {
            customOrderId: orderId,
            orderItems: cartItems.map(item => ({ 
                name: item.name, qty: item.quantity, image: item.image, 
                price: Number(convertPrice(item.price)).toFixed(2), product: item._id 
            })),
            shippingAddress: { ...formData, country: currency === 'PKR' ? 'Pakistan' : 'International' },
            paymentMethod: paymentMethod === 'card' ? 'Stripe' : 'COD',
            totalPrice: Number(total),
            currency: activeSymbol,
            phone: phoneNumber,
            email: formData.email, 
            customerEmail: formData.email,
            expectedDelivery: deliveryRange
        };
        try {
            await fetch('https://menswear-backend.vercel.app/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (paymentMethod === 'card') {
                const stripeRes = await fetch('https://menswear-backend.vercel.app/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cartItems.map(item => ({...item, price: convertPrice(item.price)})), orderId, currency: currency.toLowerCase() })
                });
                const stripeData = await stripeRes.json();
                if (stripeData.url) window.location.href = stripeData.url;
            } else {
                setInvoiceData({ id: orderId });
                setIsSuccess(true);
            }
        } catch (err) { alert("Error placing order."); } 
        finally { setIsProcessing(false); }
    };

    if (isSuccess) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-6xl mx-auto px-4 py-10 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                        <div className="lg:col-span-7 space-y-6 md:space-y-8">
                            <div className="space-y-4 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-green-100">
                                    <CheckCircle size={14}/> ORDER PLACED (COD)
                                </div>
                                <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                     ORDER <br/> <span className="text-sky-500 underline decoration-black">CONFIRMED.</span>
                                </h1>
                                <p className="text-gray-400 font-bold text-sm mx-auto md:mx-0 max-w-xs md:max-w-md">
                                    We've received your order. Our team is now preparing your premium items for shipment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="p-6 md:p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                    <MapPin className="text-sky-500 mb-3" size={24} />
                                    <h3 className="font-black uppercase italic text-[11px] mb-2 tracking-widest text-gray-400">Shipping To</h3>
                                    <div className="text-[13px] font-bold text-gray-600 leading-tight uppercase">
                                        <p className="text-black text-base mb-1">{formData.firstName} {formData.lastName}</p>
                                        <p className="text-sky-600 truncate">{phoneNumber}</p>
                                        <p className="mt-1 line-clamp-2">{formData.address}, {formData.city}</p>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 rounded-[2rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                    <CreditCard className="text-sky-500 mb-3" size={24} />
                                    <h3 className="font-black uppercase italic text-[11px] mb-2 tracking-widest text-gray-400">Order Info</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">ID</span>
                                            <span className="text-[11px] font-black italic">#{invoiceData?.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Arriving</span>
                                            <span className="text-[11px] font-black italic text-sky-500 text-right ml-2">{deliveryRange}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-5">
                            <div className="bg-black rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 text-white shadow-2xl border-b-[8px] md:border-b-[12px] border-sky-500">
                                <h3 className="text-xl md:text-2xl font-black italic uppercase mb-6 md:mb-10">Summary</h3>
                                <div className="space-y-4 mb-8 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center gap-2">
                                            <p className="text-[10px] md:text-[11px] font-black uppercase truncate flex-1">{item.quantity}x {item.name}</p>
                                            <span className="font-black italic text-sky-400 whitespace-nowrap">{activeSymbol}{(convertPrice(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/10 pt-6 flex justify-between items-end">
                                    <p className="text-[10px] font-black text-white/30 uppercase">Total</p>
                                    <p className="text-4xl md:text-5xl font-black italic text-sky-500 leading-none">{activeSymbol}{total}</p>
                                </div>
                                <div className="mt-8 md:mt-12 space-y-3">
                                    <button onClick={downloadCustomInvoice} className="w-full bg-sky-500 text-black py-4 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white transition-all">
                                        <FileDown size={16}/> Download Invoice
                                    </button>
                                    <button onClick={() => { clearCart(); navigate('/'); }} className="w-full bg-white/5 text-white py-4 md:py-6 rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                                        Back to Shop <ArrowRight size={16}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 max-w-7xl pt-10 pb-20 md:pt-16 md:pb-32">
                <div className="space-y-4 mb-10 md:mb-20">
                    <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-widest hover:text-sky-500 transition-colors">
                        <ArrowLeft size={14}/> Back to Bag
                    </button>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Checkout</h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
                    <div className="lg:col-span-7">
                        <form id="checkout-form-main" onSubmit={handleOrder} className="space-y-12 md:space-y-16">
                            <section>
                                <div className="flex items-center gap-3 md:gap-5 mb-6 md:mb-10">
                                    <span className="text-4xl md:text-6xl font-black text-gray-100 italic">01</span>
                                    <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">Delivery Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                    <InputField name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
                                    <InputField name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
                                    <InputField name="email" placeholder="Email Address" fullWidth value={formData.email} onChange={handleInputChange} error={errors.email} />
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-1 block mb-2">Phone Number</label>
                                        <PhoneInput placeholder="Enter mobile number" value={phoneNumber} onChange={setPhoneNumber} defaultCountry="PK" className="bg-gray-50 p-4 md:p-5 rounded-2xl font-bold border-2 border-transparent focus-within:border-black transition-all" />
                                        {errors.phone && <p className="text-[9px] text-red-600 font-black mt-2 uppercase flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</p>}
                                    </div>
                                    <InputField name="address" placeholder="Full Street Address" fullWidth value={formData.address} onChange={handleInputChange} error={errors.address} />
                                    <InputField name="city" placeholder="City" value={formData.city} onChange={handleInputChange} error={errors.city} />
                                    <InputField name="zip" placeholder="Postal Zip Code" value={formData.zip} onChange={handleInputChange} error={errors.zip} />
                                </div>
                            </section>
                            <section>
                                <div className="flex items-center gap-3 md:gap-5 mb-6 md:mb-10">
                                    <span className="text-4xl md:text-6xl font-black text-gray-100 italic">02</span>
                                    <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">Payment Method</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div onClick={() => setPaymentMethod('cod')} className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-sky-500 bg-sky-50/30' : 'border-gray-100 hover:border-black'}`}>
                                        <Truck size={32} className={paymentMethod === 'cod' ? 'text-sky-500' : 'text-gray-300'}/>
                                        <h4 className="text-xl md:text-2xl font-black uppercase italic mt-4">Cash On Delivery</h4>
                                    </div>
                                    <div onClick={() => setPaymentMethod('card')} className={`p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-sky-500 bg-sky-50/30' : 'border-gray-100 hover:border-black'}`}>
                                        <div className="flex justify-between items-start w-full">
                                            <CreditCard size={32} className={paymentMethod === 'card' ? 'text-sky-500' : 'text-gray-300'}/>
                                            {/* RIGHT SIDE LOGOS */}
                                            <div className="flex gap-2">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="h-4 md:h-5" />
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 md:h-5" />
                                            </div>
                                        </div>
                                        <h4 className="text-xl md:text-2xl font-black uppercase italic mt-4">Card Payment</h4>
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="bg-black text-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] sticky top-10 shadow-2xl border-b-[12px] md:border-b-[16px] border-sky-500">
                            <h3 className="text-xl md:text-3xl font-black italic uppercase mb-8 md:mb-12 flex items-center gap-3 md:gap-4"><ShoppingBag className="text-sky-500"/> Order Summary</h3>
                            <div className="space-y-6 md:space-y-8 mb-8 md:mb-12 max-h-[250px] overflow-y-auto custom-scrollbar pr-2 md:pr-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center gap-3">
                                        <div className="flex gap-3 md:gap-4 items-center min-w-0">
                                            <img src={item.image} alt={item.name} className="w-10 h-10 md:w-14 md:h-14 object-cover rounded-xl bg-white/10 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-[11px] font-black uppercase truncate">{item.name}</p>
                                                <p className="text-[9px] md:text-[10px] font-bold text-sky-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-sm md:text-lg italic whitespace-nowrap">{activeSymbol}{Number(convertPrice(item.price * item.quantity)).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/10 pt-6 md:pt-10">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-white/30 text-[8px] md:text-[9px] font-black uppercase mb-1">Total Amount</p>
                                        <p className="text-4xl md:text-6xl font-black italic text-sky-500 leading-none">{activeSymbol}{total}</p>
                                    </div>
                                </div>
                                {/* DELIVERY DATES BOX WITH SPACING */}
                                <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/10 mt-6">
                                    <p className="text-[10px] font-black text-white/50 uppercase italic">Estimated Delivery</p>
                                    <p className="text-[11px] font-black text-sky-500 uppercase tracking-tighter ml-2">{deliveryRange}</p>
                                </div>
                            </div>
                            <button type="submit" form="checkout-form-main" disabled={isProcessing} className="w-full bg-sky-500 text-black py-6 md:py-8 rounded-2xl md:rounded-3xl font-black uppercase text-xl md:text-2xl mt-8 md:mt-12 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                                {isProcessing ? <Loader2 className="animate-spin" /> : <><span>Confirm Order</span><ShieldCheck size={24}/></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }`}</style>
        </div>
    );
};

export default Checkout;