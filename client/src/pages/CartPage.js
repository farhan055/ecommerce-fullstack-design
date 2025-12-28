import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext'; 

/**
 * CartPage Component
 * Restored original shipping logic: Base PKR 500 converted manually (500/280).
 * Enabled Guest Checkout: No login required to proceed.
 */
const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const { currency, convertPrice } = useCurrency();
    const { user } = useAuth(); 
    const navigate = useNavigate();

    // Global sporty style variable for consistency
    const sportyStyle = "font-black italic uppercase tracking-tighter";

    /**
     * Calculation Logic (Restored Original Shipping):
     * 1. Subtotal: Base price sum.
     * 2. Shipping: PKR 500 / 280 (Original Logic).
     * 3. Total: Subtotal + Shipping.
     */
    const { convertedSubtotal, convertedShipping, convertedTotal } = useMemo(() => {
        // Calculate base subtotal from items
        const sub = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        
        // --- RESTORED ORIGINAL SHIPPING LOGIC ---
        // Converts the subtotal normally
        const subtotal = convertPrice(sub);
        
        // Original logic: Base 500 PKR divided by 280 then converted
        const shipping = cartItems.length > 0 ? convertPrice(500 / 280) : 0; 
        
        // Final total sum
        const total = parseFloat(subtotal) + parseFloat(shipping);

        return { 
            convertedSubtotal: subtotal,
            convertedShipping: shipping,
            convertedTotal: total.toFixed(2)
        };
    }, [cartItems, convertPrice]);

    /**
     * GUEST CHECKOUT logic
     * User can now click 'Checkout' even if not logged in.
     */
    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/checkout'); // Directly goes to checkout (No Login Guard)
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8 md:py-16">
                
                {/* Dynamic Cart Header with Sporty Style */}
                <h1 className={`text-4xl md:text-7xl mb-8 md:mb-12 text-gray-900 leading-none ${sportyStyle}`}>
                    YOUR BAG <span className="text-[#0D6EFD]">({cartItems.length})</span>
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
                    
                    {/* Left Section: Product Item List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div key={`${item.id}-${item.size}`} 
                                     className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-gray-100 flex flex-col sm:flex-row items-center justify-between transition-all hover:shadow-2xl group">
                                    
                                    {/* Item Details */}
                                    <div className="flex items-center space-x-5 md:space-x-8 w-full">
                                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 border-2 border-gray-50">
                                            <img 
                                                src={item.image} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className='flex-1'>
                                            <h3 className={`text-gray-900 text-lg md:text-2xl leading-tight mb-1 ${sportyStyle}`}>
                                                {item.name}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 md:gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                                                <span className="bg-gray-50 px-2 py-1 rounded-md text-[#0D6EFD]">Size: {item.size}</span>
                                                <span className="bg-gray-50 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                                            </div>
                                            <p className={`text-[#0D6EFD] text-lg md:text-xl ${sportyStyle}`}>
                                                {currency} {convertPrice(item.price)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Controls (Qty, Price, Remove) */}
                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 md:gap-8 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                        <div className="flex items-center bg-gray-950 text-white rounded-2xl p-1 shadow-lg">
                                            <button onClick={() => updateQuantity(item.id, item.size, -1)} className="w-10 h-10 flex items-center justify-center hover:text-blue-400 transition"><Minus size={14}/></button>
                                            <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.size, 1)} className="w-10 h-10 flex items-center justify-center hover:text-blue-400 transition"><Plus size={14}/></button>
                                        </div>

                                        <div className="text-right hidden sm:block">
                                            <p className={`text-gray-900 text-xl leading-none ${sportyStyle}`}>
                                                {currency} {convertPrice(item.price * item.quantity)}
                                            </p>
                                        </div>

                                        <button onClick={() => removeFromCart(item.id, item.size)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                            <X size={22} strokeWidth={3}/>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State UX */
                            <div className='bg-white p-16 md:p-28 rounded-[3rem] border-4 border-dashed border-gray-100 text-center'>
                                <ShoppingBag size={64} className='text-gray-100 mx-auto mb-6 animate-bounce'/>
                                <h2 className={`text-2xl md:text-4xl text-gray-900 mb-8 ${sportyStyle}`}>Your bag is empty</h2>
                                <Link to="/products" className={`inline-block bg-black text-white px-12 py-5 rounded-2xl text-[10px] tracking-[0.3em] hover:bg-[#0D6EFD] transition-all shadow-xl ${sportyStyle}`}>
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Section: Order Breakdown */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 lg:sticky lg:top-28">
                            <h2 className={`text-3xl mb-8 text-gray-900 border-b-4 border-gray-50 pb-4 ${sportyStyle}`}>Summary</h2>
                            
                            <div className="space-y-5 mb-10">
                                <div className={`flex justify-between items-center ${sportyStyle}`}>
                                    <span className="text-[14px] text-gray-400">Subtotal</span>
                                    <span className="text-[16px] text-gray-900">{currency} {convertedSubtotal}</span>
                                </div>

                                <div className={`flex justify-between items-center ${sportyStyle}`}>
                                    <span className="text-[14px] text-gray-400">Shipping</span>
                                    <span className="text-[16px] text-[#0D6EFD]">{currency} {convertedShipping}</span>
                                </div>
                                
                                <div className="h-px bg-gray-100 my-6"></div>
                                
                                <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                    <span className={`text-3xl text-gray-950 mb-1 ${sportyStyle}`}>TOTAL</span>
                                    <span className={`text-5xl md:text-6xl text-[#0D6EFD] leading-none ${sportyStyle}`}>
                                        {currency} {convertedTotal}
                                    </span>
                                </div>
                            </div>
                            
                            {/* CTA Button: Proceed as guest or logged in user */}
                            <button 
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                                className={`w-full bg-[#0D6EFD] text-white py-6 rounded-3xl text-[11px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl shadow-blue-200 active:scale-95 disabled:opacity-30 disabled:grayscale ${sportyStyle}`}
                            >
                                {user ? 'Proceed to Checkout' : 'Guest Checkout'} <ArrowRight size={18}/>
                            </button>

                            {/* Info for Guest Users */}
                            {!user && cartItems.length > 0 && (
                                <p className="text-[9px] text-center mt-6 text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">
                                    Fast & Secure Guest Checkout Enabled.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;