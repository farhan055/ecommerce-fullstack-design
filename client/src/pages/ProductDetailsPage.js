import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ArrowLeft, Check, Loader2, Truck, Shield, Heart, X, Ruler } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext'; 
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; 
import Footer from '../components/Footer';

/**
 * ProductDetails Component
 * Handles single product display, size selection, and cart/wishlist actions.
 * Optimized for high-performance and mobile responsiveness.
 */

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currency, convertPrice } = useCurrency();
    const { addToCart } = useCart();
    
    // Wishlist context with fallback for empty states
    const { wishlistItems = [], addToWishlist, removeFromWishlist } = useWishlist() || {};
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null); 
    const [msg, setMsg] = useState(null);
    const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

    /**
     * Helper to resolve product image paths from local or remote sources
     */
    const getProductImageUrl = (prod) => {
        if (!prod || !prod.image) return "https://via.placeholder.com/600x800?text=No+Image";
        if (prod.image.startsWith('data:') || prod.image.startsWith('http')) return prod.image;
        if (!prod.image.includes('/')) return `/Products-Data/${prod.image}`;
        if (prod.image.startsWith('/Products-Data/')) return prod.image;
        return `/Products-Data/${prod.image}`;
    };

    const isWishlisted = product && Array.isArray(wishlistItems) 
        ? wishlistItems.some(item => item._id === (product._id || id)) 
        : false;

    // Fetch product data on component mount or ID change
   // ProductDetailsPage.js mein Line 50 se 70 ke beech ye replace karein:
useEffect(() => {
    const fetchProduct = async () => {
        try {
            setLoading(true);
          const res = await axios.get(`https://menswear-backend.vercel.app/api/products/${id}`);
            
            // Yahan hum 'data' ko define kar rahe hain jo errors khatam karega
            const data = res.data; 

            if (data) {
                setProduct(data);
                // Agar aapne images ya specs set karni hain toh:
                // setMainImage(data.image); 
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const handleWishlistAction = () => {
        if (!product || !addToWishlist) return;
        const currentImageUrl = getProductImageUrl(product);
        const productToHandle = {
            _id: product._id || id,
            id: product._id || id,
            name: product.name,
            price: Number(product.price),
            image: currentImageUrl,
            category: product.category
        };

        if (isWishlisted) {
            removeFromWishlist(productToHandle._id);
            setMsg('Removed from Wishlist');
        } else {
            addToWishlist(productToHandle);
            setMsg('Added to Wishlist');
        }
        setTimeout(() => setMsg(null), 3000);
    };

    // Global loading state with sporty animation
    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-black mb-6" size={60} strokeWidth={3} />
            <p className="font-black text-gray-900 uppercase tracking-[0.3em] text-[10px]">Loading Model...</p>
        </div>
    );

    if (!product) return null;

    const finalImageUrl = getProductImageUrl(product);

    // Logic to parse sizes from database (handles both string and array formats)
    const dbSizes = product.sizes 
        ? (Array.isArray(product.sizes) ? product.sizes : product.sizes.toString().split(',').map(s => s.trim()).filter(s => s !== ""))
        : [];

    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            {/* Success/Action Notifications */}
            {msg && (
                <div className="fixed top-5 md:top-10 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 md:px-10 py-4 md:py-5 rounded-full shadow-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300 w-[90%] md:w-auto justify-center">
                    <Check size={18} className="text-green-500" strokeWidth={4}/>
                    <span className="font-black uppercase tracking-[0.2em] text-[10px]">{msg}</span>
                </div>
            )}

            {/* SIZE GUIDE MODAL - Responsive scaling */}
            {isSizeModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden border-4 border-gray-100">
                        <button onClick={() => setIsSizeModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                            <X size={20} />
                        </button>
                        <div className="p-6 md:p-10">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl md:text-3xl font-[900] italic uppercase tracking-tighter text-black">Size <span className="text-blue-600">Guide</span></h3>
                            </div>
                            <div className="rounded-2xl border-2 border-gray-50 overflow-hidden mb-2">
                                <table className="w-full text-left text-[10px] md:text-xs uppercase font-bold">
                                    <thead className="bg-gray-50">
                                        <tr><th className="p-3 md:p-4">Size</th><th className="p-3 md:p-4">Chest</th><th className="p-3 md:p-4">Waist</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {[{s:'S', c:'36-38', w:'30-32'}, {s:'M', c:'39-41', w:'33-35'}, {s:'L', c:'42-44', w:'36-38'}, {s:'XL', c:'45-47', w:'39-41'}].map(r => (
                                            <tr key={r.s} className="hover:bg-blue-50 transition-colors">
                                                <td className="p-3 md:p-4 text-blue-600 font-black">{r.s}</td>
                                                <td className="p-3 md:p-4 text-gray-500">{r.c}</td>
                                                <td className="p-3 md:p-4 text-gray-500">{r.w}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8 md:py-12">
                {/* Navigation Link */}
                <button onClick={() => navigate(-1)} className="group flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black mb-8 md:mb-12">
                    <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1"/> Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
                    
                    {/* LEFT: Product Visuals */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#F8FAFC] rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 flex items-center justify-center h-[400px] md:h-[700px] border border-gray-100 overflow-hidden group shadow-inner">
                            <img 
                                src={finalImageUrl} 
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                                alt={product.name}
                                onError={(e) => { e.target.src = "https://via.placeholder.com/600x800?text=Image+Not+Found"; }}
                            />
                        </div>
                    </div>

                    {/* RIGHT: Product Details & Purchase Actions */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <span className="text-blue-600 font-black text-[10px] tracking-[0.5em] uppercase mb-4 italic">Luxury Edition • {product.category}</span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-[0.95] md:leading-[0.9] uppercase italic">{product.name}</h1>
                        
                        <div className="flex items-center gap-6 mb-8 md:mb-10">
                            <div className="flex items-center text-orange-500 gap-2">
                                <Star size={20} fill="currentColor"/>
                                <span className="text-gray-900 text-lg md:text-xl font-black italic">4.9</span>
                            </div>
                            <span className="text-gray-400 font-black uppercase text-[10px] tracking-tighter italic">REF: {id.slice(-6)}</span>
                        </div>

                        <div className="text-5xl md:text-7xl font-black text-gray-900 mb-8 md:mb-12 tracking-tighter italic">
                            {currency}{convertPrice(product.price)}
                        </div>

                        {/* Size Selection Section */}
                        <div className="mb-8 md:mb-12">
                            <div className="flex justify-between mb-4 items-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Available Sizes</p>
                                <button onClick={() => setIsSizeModalOpen(true)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline italic flex items-center gap-1">
                                    <Ruler size={12} /> Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {dbSizes.length > 0 ? (
                                    dbSizes.map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => setSelectedSize(s)} 
                                            className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs transition-all duration-300 italic ${selectedSize === s ? 'bg-black text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'}`}
                                        >
                                            {s}
                                        </button>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-[10px] uppercase font-black italic">No specific size available</span>
                                )}
                            </div>
                        </div>

                        {/* Quantity & CTA Buttons */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex items-center justify-between md:justify-start bg-gray-50 rounded-full px-6 border border-gray-100 h-16 w-full md:w-auto">
                                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 font-black text-xl hover:text-blue-600">-</button>
                                <span className="w-12 text-center font-black text-xl italic">{quantity}</span>
                                <button onClick={() => setQuantity(q => q+1)} className="w-8 font-black text-xl hover:text-blue-600">+</button>
                            </div>
                            
                            <div className="flex gap-4 flex-1">
                                <button 
                                    onClick={() => {
                                        addToCart({...product, _id: product._id || id, id: product._id || id, size: selectedSize, quantity, image: finalImageUrl}); 
                                        setMsg('Added to Bag'); 
                                        setTimeout(()=>setMsg(null),3000)
                                    }} 
                                    className="flex-1 bg-black text-white rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-2xl italic active:scale-95 h-16"
                                >
                                    <ShoppingCart size={20}/> Add to Bag
                                </button>

                                <button 
                                    onClick={handleWishlistAction} 
                                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${isWishlisted ? 'bg-red-50 border-red-100 text-red-500 shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-black'}`}
                                >
                                    <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </div>

                        {/* Value Props */}
                        <div className="mt-12 md:mt-16 grid grid-cols-2 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-gray-100">
                            <div className="flex items-center gap-2 md:gap-4 text-gray-400 font-black text-[8px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.2em] italic"><Truck size={16}/> Express Global</div>
                            <div className="flex items-center gap-2 md:gap-4 text-gray-400 font-black text-[8px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.2em] italic"><Shield size={16}/> Lifetime Quality</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetails;