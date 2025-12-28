import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ChevronRight, ArrowLeft, Eye } from 'lucide-react';
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Footer from '../components/Footer';

/**
 * Wishlist Component
 * Modern, sporty layout for saved premium items.
 */
const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Sporty UI Utility Styles
    const sportyHeading = "font-black uppercase italic tracking-tighter";
    const sportyButton = "font-black text-[10px] uppercase tracking-widest italic";

    /**
     * Empty State UI
     * Displayed when no items are present in the wishlist.
     */
    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-white text-center">
                <div className="bg-gray-50 p-8 md:p-12 rounded-full mb-8 animate-bounce duration-[3000ms]">
                    <Heart size={60} className="text-gray-200 md:w-20 md:h-20" />
                </div>
                <h2 className={`text-3xl md:text-5xl ${sportyHeading} mb-4 text-gray-900`}>
                    Wishlist <span className="text-gray-300">Empty</span>
                </h2>
                <p className="text-gray-500 mb-10 font-medium italic text-sm md:text-base">Your premium selection is waiting for you.</p>
                <Link to="/products" className={`bg-black text-white px-10 py-5 rounded-2xl ${sportyButton} flex items-center gap-3 hover:bg-[#0D6EFD] transition-all shadow-xl active:scale-95`}>
                    Explore Collection <ChevronRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <main className="py-8 md:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    
                    {/* --- Dynamic Header --- */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b-4 md:border-b-8 border-gray-50 pb-8 md:pb-12">
                        <div>
                            <Link to="/products" className={`flex items-center gap-2 text-[#0D6EFD] ${sportyButton} mb-4 md:mb-6 hover:translate-x-[-5px] transition-transform`}>
                                <ArrowLeft size={14} /> Back to Shopping
                            </Link>
                            <h1 className={`text-5xl md:text-8xl ${sportyHeading} text-gray-900 leading-none`}>
                                My <span className="text-[#0D6EFD]">Wishlist</span>
                            </h1>
                        </div>
                        {/* Counter visible on all screens, styled differently for mobile */}
                        <div className="inline-block self-start md:self-end">
                            <span className={`bg-gray-950 px-5 py-2 rounded-xl ${sportyButton} text-white md:bg-gray-100 md:text-gray-400 md:rounded-full`}>
                                {wishlistItems.length} Items Saved
                            </span>
                        </div>
                    </div>

                    {/* --- Responsive Product Grid (1 col mobile, 2 cols desktop) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                        {wishlistItems.map((item) => {
                            const pId = item._id || item.id;
                            const imageUrl = item.image?.startsWith('http') 
                                ? item.image 
                                : `http://localhost:5000${item.image}`;

                            return (
                                <div key={pId} className="group relative flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 border-2 md:border-4 border-gray-50 rounded-[2rem] md:rounded-[2.5rem] hover:border-blue-100 transition-all bg-white hover:shadow-2xl">
                                    
                                    {/* Product Image Section */}
                                    <div 
                                        onClick={() => navigate(`/product/${pId}`)}
                                        className="w-full sm:w-48 md:w-56 h-72 sm:h-64 rounded-[1.5rem] overflow-hidden relative flex-shrink-0 cursor-pointer"
                                    >
                                        <img 
                                            src={imageUrl} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white p-3 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform">
                                                <Eye size={20} className="text-black" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details Section */}
                                    <div className="flex flex-col justify-between flex-grow py-1 md:py-2">
                                        <div>
                                            <span className={`text-[9px] md:text-[11px] ${sportyButton} text-[#0D6EFD] bg-blue-50 px-3 py-1 rounded-lg`}>
                                                {item.category || "Premium"}
                                            </span>
                                            <h3 
                                                onClick={() => navigate(`/product/${pId}`)}
                                                className={`text-2xl md:text-3xl ${sportyHeading} mt-3 cursor-pointer hover:text-[#0D6EFD] transition-colors leading-none`}
                                            >
                                                {item.name}
                                            </h3>
                                            <div className={`text-2xl md:text-4xl ${sportyHeading} mt-4 text-gray-900 tracking-normal`}>
                                                ${parseFloat(item.price).toFixed(2)}
                                            </div>
                                        </div>

                                        {/* Dynamic Action Buttons */}
                                        <div className="flex items-center gap-2 md:gap-3 mt-6 md:mt-8">
                                            <button 
                                                onClick={() => addToCart({...item, id: pId})}
                                                className={`flex-grow flex items-center justify-center gap-2 md:gap-3 py-4 md:py-5 rounded-xl md:rounded-2xl ${sportyButton} bg-black text-white hover:bg-[#0D6EFD] transition-all active:scale-95 shadow-lg`}
                                            >
                                                <ShoppingCart size={15} /> Add to Cart
                                            </button>
                                            <button 
                                                onClick={() => removeFromWishlist(pId)} 
                                                className="p-4 md:p-5 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl md:rounded-2xl transition-all"
                                                title="Remove"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;