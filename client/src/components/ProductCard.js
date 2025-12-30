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

  // GET PRODUCT DETAILS
 const pId = product.id;
  const currentPrice = convertPrice(product.price);

  // Resolving image paths
  const getImageUrl = () => {
    if (!product.image) return "https://via.placeholder.com/400x500?text=No+Image";
    if (product.image.startsWith('http') || product.image.startsWith('data:')) return product.image;
    if (!product.image.includes('/')) return `/Products-Data/${product.image}`;
    return product.image;
  };

  const imageUrl = getImageUrl();
 const isInWishlist = wishlistItems?.some(item => item.id === pId);

return (
    <div className="group bg-white rounded-[1.5rem] md:rounded-[2rem] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(13,110,253,1)] hover:border-[#0D6EFD] transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* IMAGE AREA - Aspect Ratio fixed for consistency */}
      <div 
        className="relative aspect-[3/4] sm:aspect-square md:aspect-[3/4] bg-[#F8FAFC] overflow-hidden cursor-pointer border-b-2 border-black group-hover:border-[#0D6EFD] transition-colors" 
        onClick={() => navigate(`/product/${pId}`)}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Action Buttons Overlay - Mobile optimized */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 z-10">
          <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${pId}`); }} 
            className="bg-white border-2 border-black p-2 md:p-3 rounded-full hover:bg-[#0D6EFD] hover:text-white transition-all">
            <Eye size={18} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); addToWishlist({...product, id: pId}); }}
            className={`border-2 border-black p-2 md:p-3 rounded-full transition-all ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white'}`}>
            <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* INFO AREA - Mobile padding reduced */}
      <div className="p-3 md:p-6 flex flex-col flex-grow text-center">
        <Link to={`/product/${pId}`} className="text-xs md:text-xl font-black uppercase italic tracking-tighter line-clamp-1">
          {product.name}
        </Link>
        
        <div className="mt-1 md:mt-3">
          <span className="text-lg md:text-3xl font-[1000] italic tracking-tighter text-black">
            {currency} {currentPrice}
          </span>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart({...product}); }} 
          className="mt-3 md:mt-5 w-full bg-black text-white py-2 md:py-4 rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black uppercase italic flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
        >
          <ShoppingBag size={14} className="md:w-4 md:h-4" /> Add
        </button>
      </div>
    </div>
  );
};
export default ProductCard; 