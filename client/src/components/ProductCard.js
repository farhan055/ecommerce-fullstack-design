import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

/**
 * @ProductCard
 * Fully Optimized Logic & CSS.
 * Maintains the bold "Black and Blue" streetwear aesthetic.
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currency, convertPrice } = useCurrency();
  const { addToWishlist, wishlistItems } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  // Final Logic: Get ID from any possible source
  const pId = product._id || product.id;
  const currentPrice = convertPrice(product.price);

  // Resolving image paths
  const getImageUrl = () => {
    if (!product.image) return "https://via.placeholder.com/400x500?text=No+Image";
    if (product.image.startsWith('http') || product.image.startsWith('data:')) return product.image;
    if (!product.image.includes('/')) return `/Products-Data/${product.image}`;
    return product.image;
  };

  const imageUrl = getImageUrl();
  const isInWishlist = wishlistItems?.some(item => (item._id === pId || item.id === pId));

  return (
    /* --- THE BOLD BORDER GRID (STAYS SAME) --- */
    <div className="group bg-white rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(13,110,253,1)] hover:border-[#0D6EFD] transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* --- IMAGE AREA --- */}
      <div 
        className="relative h-[280px] sm:h-[350px] md:h-[400px] bg-[#F8FAFC] overflow-hidden cursor-pointer border-b-2 border-black group-hover:border-[#0D6EFD] transition-colors" 
        onClick={() => navigate(`/product/${pId}`)}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/400x500?text=Image+Not+Found"; 
          }}
        />
        
        {/* Action Buttons Overlay - Logic: Shows on Hover (Desktop) & Tap (Mobile) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 group-active:opacity-100 flex items-center justify-center gap-3 transition-all duration-300 z-10">
          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault(); // Safety
              e.stopPropagation(); 
              navigate(`/product/${pId}`); 
            }} 
            className="z-20 bg-white border-2 border-black p-3 rounded-full text-black hover:bg-[#0D6EFD] hover:text-white hover:border-[#0D6EFD] transition-all shadow-lg active:scale-90"
          >
            <Eye size={20} />
          </button>
          
          <button 
            type="button"
            onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                addToWishlist({...product, id: pId, _id: pId, image: imageUrl}); 
            }}
            className={`z-20 border-2 border-black p-3 rounded-full transition-all shadow-lg active:scale-90 ${isInWishlist ? 'bg-red-500 text-white border-red-500' : 'bg-white text-black hover:bg-black hover:text-white'}`}
          >
            <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* --- PRODUCT INFO AREA --- */}
      <div className="p-5 md:p-6 flex flex-col flex-grow text-center bg-white">
        <Link to={`/product/${pId}`} className="text-md md:text-xl font-black uppercase italic tracking-tighter hover:text-[#0D6EFD] line-clamp-1 transition-colors">
          {product.name}
        </Link>
        
        <div className="mt-3 flex justify-center items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-[1000] italic tracking-tighter text-black">
            {currency} {currentPrice}
          </span>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            addToCart({ ...product, id: pId, _id: pId, price: Number(product.price), image: imageUrl, quantity: 1, size: "M" }); 
          }} 
          className="mt-5 w-full bg-black border-2 border-black text-white py-3 md:py-4 rounded-xl text-[11px] font-black italic uppercase hover:bg-[#0D6EFD] hover:border-[#0D6EFD] transition-all flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(13,110,253,0.5)]"
        >
          <ShoppingBag size={16} /> Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 