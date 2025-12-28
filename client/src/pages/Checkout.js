import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle, Loader2, ArrowLeft, CreditCard, 
    AlertCircle, Truck, ShieldCheck, ShoppingBag, 
    FileDown, Calendar, MapPin, Phone, ArrowRight 
} from 'lucide-react';
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/authContext'; 
import Footer from '../components/Footer';

// Initialize Stripe with your public key
const stripePromise = loadStripe('pk_test_51SfRWVDULzuXEvq1woksn1JQ1nr2A11OuplMPuetqa9S8vRWwt5nGF9QlQ36syk3nlWglK3clg4AteOkiHX6H5yb004ERv8eGp');

// Helper function to generate a random Order ID
const generateCustomOrderId = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); 
    return `MWS${randomDigits}`;
};

// Reusable Input Component for the form
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
            className={`w-full bg-gray-50 p-5 rounded-2xl text-[14px] font-bold border-2 transition-all duration-300 outline-none 
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
    // Hooks for context and navigation
    const { cartItems, clearCart } = useCart();
    const { currency, convertPrice } = useCurrency(); 
    const { user } = useAuth(); 
    const navigate = useNavigate();
    
    // Local state management
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

    // Map currency symbols
    const activeSymbol = { USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹' }[currency] || currency;

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    // Auto-fill user data if logged in
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

    // Calculate Subtotal, Shipping, and Grand Total
    const { total, subtotal, shipping } = useMemo(() => {
        const subRaw = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const subConverted = Number(convertPrice(subRaw)) || 0;
        let shippingFinal;
        
        // Fixed shipping logic: 500 PKR for local, converted equivalent for international
        if (currency === 'PKR') {
            shippingFinal = 500;
        } else {
            const pkrInBase = 500 / 280; 
            shippingFinal = Number(convertPrice(pkrInBase)) || 0;
        }
        
        const finalTotal = subConverted + shippingFinal;
        return { 
            subtotal: subConverted.toFixed(2),
            shipping: shippingFinal.toFixed(2),
            total: finalTotal.toFixed(2)
        };
    }, [cartItems, convertPrice, currency]);

    // Calculate Delivery Date Range based on location
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

    // Form validation logic
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
    // Check if cart is empty to prevent generating an empty PDF
    if (!cartItems || cartItems.length === 0) return;

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // --- 1. HEADER SECTION (Brand & Identity) ---
    // Draw Blue Logo Circle
    doc.setFillColor(52, 152, 219);
    doc.circle(20, 20, 6, 'F'); 
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("MW", 17.5, 21);

    // Set Brand Name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("MEN'S WEAR", 30, 22);

    // Receipt Metadata (ID and Date)
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL RECEIPT", pageWidth - 15, 18, { align: "right" });
    doc.text(`Order ID: #${invoiceData?.id || 'MWS77932'}`, pageWidth - 15, 22, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 26, { align: "right" });

    // Decorative Separator Line
    doc.setDrawColor(240, 240, 240);
    doc.line(15, 32, pageWidth - 15, 32);

    // --- 2. INFORMATION BLOCKS (Shipping & Billing) ---
    doc.setFontSize(9);
    doc.setTextColor(0, 153, 255); 
    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO:", 15, 42); 
    doc.text("ORDER SUMMARY:", 125, 42);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    // Display Customer Information from formData state
    const clientName = `${formData.firstName} ${formData.lastName}`.toUpperCase();
    doc.text(clientName, 15, 48);
    const addressLine = doc.splitTextToSize(`${formData.address}, ${formData.city}`, 80);
    doc.text(addressLine, 15, 52);
    doc.text(`Phone: ${phoneNumber}`, 15, 54 + (addressLine.length * 3.5));

    // Display Payment Method and Store Info
    // paymentMethod state is used here (e.g., 'COD' or 'Card')
    doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 125, 48);
    doc.text("Email: menswearofficial07@gmail.com", 125, 52);
    doc.text("Website: www.menswear.com", 125, 56);

    // --- 3. PRODUCT LIST TABLE ---
    autoTable(doc, {
        startY: 70, 
        head: [["#", "PRODUCT DESCRIPTION", "QTY", "TOTAL"]],
        body: cartItems.map((item, i) => [
            i + 1,
            item.name.toUpperCase(),
            item.quantity, 
            `${activeSymbol} ${Number(convertPrice(item.price * item.quantity)).toFixed(2)}`
        ]),
        // Header styling to match your desired UI (Image 1)
        headStyles: { 
            fillColor: [255, 255, 255], 
            textColor: [0, 153, 255], 
            fontSize: 8,
            fontStyle: 'bold',
            lineWidth: { bottom: 0.1 },
            lineColor: [230, 230, 230]
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
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 153, 255);
    doc.setFont("helvetica", "bold");
    
    // Renders the total amount clearly at the bottom right
    doc.text(`TOTAL AMOUNT: ${activeSymbol} ${total}`, pageWidth - 15, finalY, { align: "right" });

    // --- 5. FOOTER NOTES ---
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text("Thank you for choosing MEN'S WEAR OFFICIAL Store.", pageWidth / 2, 280, { align: "center" });
    doc.text("Exchange policy: 7 days with original receipt.", pageWidth / 2, 284, { align: "center" });

    // Save PDF with unique filename
    doc.save(`Invoice_${invoiceData?.id || 'Order'}.pdf`);
};
    // Main Order Submission Handler
    const handleOrder = async (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;
        setIsProcessing(true);
        
        const orderId = generateCustomOrderId();
        const token = localStorage.getItem('token');
        
       const payload = {
    customOrderId: orderId,
    orderItems: cartItems.map(item => ({ 
        name: item.name, 
        qty: item.quantity, 
        image: item.image, 
        price: Number(convertPrice(item.price)).toFixed(2),
        product: item._id 
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
            // Save order to Database
            await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (paymentMethod === 'card') {
                // Stripe Payment Logic
                const stripeRes = await fetch('http://localhost:5000/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        items: cartItems.map(item => ({...item, price: convertPrice(item.price)})), 
                        orderId, 
                        currency: currency.toLowerCase() 
                    })
                });
                const stripeData = await stripeRes.json();
                if (stripeData.url) window.location.href = stripeData.url;
            } else {
                // Success State for COD
                setInvoiceData({ id: orderId, date: new Date().toLocaleDateString() });
                setIsSuccess(true);
            }
        } catch (err) { 
            alert("Error placing order. Please try again."); 
        } finally { 
            setIsProcessing(false); 
        }
    };

    // Render Success View
    if (isSuccess) {
        return (
            <div className="bg-white min-h-screen">
                <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-green-100">
                                    <CheckCircle size={14}/> ORDER PLACED (COD)
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                                    YOUR GEAR IS <br/> <span className="text-sky-500 underline decoration-black">READY.</span>
                                </h1>
                                <p className="text-gray-400 font-bold text-sm md:text-base max-w-md">
                                    We've received your order. Our team is now preparing your premium items for shipment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2.5rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                    <MapPin className="text-sky-500 mb-4" size={32} />
                                    <h3 className="font-black uppercase italic text-sm mb-4 tracking-widest">Shipping To</h3>
                                    <div className="text-[13px] font-bold text-gray-600 leading-relaxed uppercase">
                                        <p className="text-black text-lg mb-1">{formData.firstName} {formData.lastName}</p>
                                        <p className="flex items-center gap-2 text-sky-600"><Phone size={12}/> {phoneNumber}</p>
                                        <p className="mt-2">{formData.address}, {formData.city}</p>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[2.5rem] bg-gray-50 border-2 border-transparent hover:border-black transition-all">
                                    <CreditCard className="text-sky-500 mb-4" size={32} />
                                    <h3 className="font-black uppercase italic text-sm mb-4 tracking-widest">Order Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Order ID</span>
                                            <span className="text-[12px] font-black italic">#{invoiceData?.id}</span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">Arriving</span>
                                            <span className="text-[12px] font-black italic text-sky-500">{deliveryRange}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="bg-black rounded-[3.5rem] p-10 text-white shadow-2xl border-b-[12px] border-sky-500">
                                <h3 className="text-2xl font-black italic uppercase mb-10">Summary</h3>
                                <div className="space-y-6 mb-10 max-h-[250px] overflow-y-auto custom-scrollbar">
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <p className="text-[11px] font-black uppercase">{item.quantity}x {item.name}</p>
                                            <span className="font-black italic text-sky-400">{activeSymbol}{(convertPrice(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-white/10 pt-8 flex justify-between items-end">
                                    <p className="text-[12px] font-black text-white/30 uppercase">Total Amount</p>
                                    <p className="text-5xl font-black italic text-sky-500 leading-none">{activeSymbol}{total}</p>
                                </div>
                                <div className="mt-12 space-y-4">
                                    <button onClick={() =>
                                     downloadCustomInvoice({
                                        invoiceData,
                                         formData,
                                          cartItems,
                                          currency,
                                          convertPrice,
                                          phoneNumber,
                                          paymentMethod,
                                          deliveryRange
                                         })
                                        }
    className="w-full bg-sky-500 text-black py-6 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white transition-all"
>
    <FileDown size={18}/> Download Invoice
</button>

                                    <button onClick={() => { clearCart(); navigate('/'); }} className="w-full bg-white/5 text-white py-6 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all">
                                        Back to Shop <ArrowRight size={18}/>
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

    // Render Checkout Form View
    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl pt-16 pb-32">
                <div className="space-y-4 mb-20">
                    <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-black font-black uppercase text-xs tracking-widest hover:text-sky-500 transition-colors">
                        <ArrowLeft size={16}/> Back to Bag
                    </button>
                    <h1 className="text-7xl font-black uppercase italic tracking-tighter">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7">
                        <form id="checkout-form-main" onSubmit={handleOrder} className="space-y-16">
                            {/* Section 01: Delivery */}
                            <section>
                                <div className="flex items-center gap-5 mb-10">
                                    <span className="text-6xl font-black text-gray-100 italic">01</span>
                                    <h2 className="text-4xl font-black uppercase italic tracking-tight">Delivery Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} error={errors.firstName} />
                                    <InputField name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} error={errors.lastName} />
                                    <InputField name="email" placeholder="Email Address" fullWidth value={formData.email} onChange={handleInputChange} error={errors.email} />
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black tracking-widest text-gray-500 uppercase ml-1 block mb-2">Phone Number</label>
                                        <PhoneInput placeholder="Enter mobile number" value={phoneNumber} onChange={setPhoneNumber} defaultCountry="PK" className="bg-gray-50 p-5 rounded-2xl font-bold border-2 border-transparent focus-within:border-black transition-all" />
                                        {errors.phone && <p className="text-[9px] text-red-600 font-black mt-2 uppercase flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</p>}
                                    </div>
                                    <InputField name="address" placeholder="Full Street Address" fullWidth value={formData.address} onChange={handleInputChange} error={errors.address} />
                                    <InputField name="city" placeholder="City" value={formData.city} onChange={handleInputChange} error={errors.city} />
                                    <InputField name="zip" placeholder="Postal Zip Code" value={formData.zip} onChange={handleInputChange} error={errors.zip} />
                                </div>
                            </section>

                            {/* Section 02: Payment */}
                            <section>
                                <div className="flex items-center gap-5 mb-10">
                                    <span className="text-6xl font-black text-gray-100 italic">02</span>
                                    <h2 className="text-4xl font-black uppercase italic tracking-tight">Payment Method</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div onClick={() => setPaymentMethod('cod')} className={`relative p-10 rounded-[3rem] border-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-sky-500 bg-sky-50/30' : 'border-gray-100 hover:border-black'}`}>
                                        <Truck size={40} className={paymentMethod === 'cod' ? 'text-sky-500' : 'text-gray-300'}/>
                                        <h4 className="text-2xl font-black uppercase italic mt-6">Cash On Delivery</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase mt-2">Pay when you receive</p>
                                    </div>
                                    <div onClick={() => setPaymentMethod('card')} className={`relative p-10 rounded-[3rem] border-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-sky-500 bg-sky-50/30' : 'border-gray-100 hover:border-black'}`}>
                                        <CreditCard size={40} className={paymentMethod === 'card' ? 'text-sky-500' : 'text-gray-300'}/>
                                        <h4 className="text-2xl font-black uppercase italic mt-6">Card Payment</h4>
                                        <p className="text-xs font-bold text-gray-400 uppercase mt-2">Secure via Stripe</p>
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="bg-black text-white p-12 rounded-[4rem] sticky top-10 shadow-2xl border-b-[16px] border-sky-500">
                            <h3 className="text-3xl font-black italic uppercase mb-12 flex items-center gap-4"><ShoppingBag className="text-sky-500"/> Order Summary</h3>
                            <div className="space-y-8 mb-12 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="flex gap-4 items-center">
                                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-white/10" />
                                            <div>
                                                <p className="text-[11px] font-black uppercase">{item.name}</p>
                                                <p className="text-[10px] font-bold text-sky-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-lg italic">{activeSymbol}{Number(convertPrice(item.price * item.quantity)).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-10 space-y-5">
                                <div className="flex justify-between text-white/40 font-black text-[10px] uppercase">
                                    <span>Subtotal</span>
                                    <span>{activeSymbol}{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 font-black text-[10px] uppercase">Shipping</span>
                                    <span className="font-black text-sky-500">+{activeSymbol}{shipping}</span>
                                </div>
                                <div className="flex justify-between items-end pt-8">
                                    <div>
                                        <p className="text-white/30 text-[9px] font-black uppercase mb-2">Total Amount</p>
                                        <p className="text-6xl font-black italic text-sky-500 leading-none">{activeSymbol}{total}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/30 mb-1 italic uppercase">Arriving</p>
                                        <p className="text-xs font-black text-sky-500 uppercase">{deliveryRange}</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" form="checkout-form-main" disabled={isProcessing} className="w-full bg-sky-500 text-black py-8 rounded-3xl font-black uppercase text-2xl mt-12 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-4">
                                {isProcessing ? <Loader2 className="animate-spin" /> : <><span>Confirm Order</span><ShieldCheck size={28}/></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default Checkout;
