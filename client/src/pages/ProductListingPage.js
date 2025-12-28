import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Star, Eye, Filter, X, Loader2, SearchX } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext'; 
import Footer from '../components/Footer';

/**
 * ProductListing Component
 * Displays a grid of products with category filtering and search functionality.
 */
const ProductListing = () => {
    const { currency, convertPrice } = useCurrency();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    
    // Extracting category and search queries from the URL
    const categoryQuery = searchParams.get('category') || 'All';
    const searchQuery = searchParams.get('search') || '';

    const categories = ['All', 't-shirts', 'office-shirts', 'pants-trousers', 'jackets-hoodies'];

    /**
     * Effect to fetch products whenever category or search query changes
     */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let params = new URLSearchParams();
                
                // Append filters to API request if they are not default
                if (categoryQuery !== 'All') {
                    params.append('category', categoryQuery);
                }
                if (searchQuery) {
                    params.append('search', searchQuery);
                }

                const { data } = await axios.get(`https://menswear-backend.vercel.app/api/products?${params.toString()}`);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Fetch Error:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryQuery, searchQuery, location.search]);

    // Loading State - High energy sporty loader
    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-black mb-4" size={40} />
            <p className="font-sans font-[900] italic uppercase tracking-widest text-[10px]">Updating Collection...</p>
        </div>
    );

    return (
        <div className="bg-white min-h-screen font-sans">
            <div className="container mx-auto px-4 max-w-7xl py-10 md:py-16">
                
                {/* Header Section - Handles Search results and Category titles */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6">
                    <div className="w-full">
                        <h1 className="text-4xl md:text-7xl font-[900] text-gray-900 tracking-tighter italic leading-none uppercase break-words">
                            {searchQuery 
                                ? `Search: ${searchQuery}` 
                                : categoryQuery === 'All' 
                                    ? 'NEW ARRIVALS' 
                                    : categoryQuery.replace('-', ' ')}
                        </h1>
                        <p className="text-gray-400 mt-4 font-[900] uppercase tracking-[0.3em] text-[10px]">
                            Showing {products.length} Professional Models
                        </p>
                    </div>
                    
                    {/* Filter Action - Dropdown for category selection */}
                    <div className="relative w-full md:w-auto">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-full font-[900] italic text-[10px] uppercase tracking-widest hover:bg-[#0D6EFD] transition-all shadow-xl"
                        >
                            {showFilters ? <X size={16}/> : <Filter size={16}/>} 
                            {categoryQuery === 'All' ? 'Filter' : categoryQuery}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 mt-3 w-full md:w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-3 animate-in fade-in slide-in-from-top-2">
                                {categories.map(cat => (
                                    <Link 
                                        key={cat}
                                        to={cat === 'All' ? '/products' : `/products?category=${cat}`}
                                        onClick={() => setShowFilters(false)}
                                        className={`block w-full text-left px-5 py-3 rounded-2xl text-[10px] font-[900] italic uppercase tracking-widest transition-colors ${categoryQuery === cat ? 'bg-blue-50 text-[#0D6EFD]' : 'hover:bg-gray-50 text-gray-400'}`}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                        {products.map((product) => (
                            <div key={product.id} className="group">
                                {/* Image Container with Hover Effects */}
                                <div className="relative h-[400px] md:h-[480px] overflow-hidden bg-[#F8FAFC] rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl">
                                    <img 
                                        src={`https://menswear-backend.vercel.app${product.image.replace('/Products Data/', '/Product Data/')}`} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110" 
                                        onError={(e) => { e.target.src = "https://placehold.co/400x600?text=Model+Coming+Soon"; }}
                                    />
                                    
                                    {/* Action Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Link to={`/product/${product.id}`} className="bg-white p-5 rounded-full text-black hover:bg-[#0D6EFD] hover:text-white transition transform translate-y-4 group-hover:translate-y-0 shadow-2xl">
                                            <Eye size={24} strokeWidth={3} />
                                        </Link>
                                    </div>

                                    {/* Category Label */}
                                    <div className="absolute top-5 left-5">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-[900] italic uppercase tracking-widest shadow-sm">
                                            {product.category.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Text Details */}
                                <div className="mt-5 px-2 text-center">
                                    <h3 className="text-gray-900 font-[900] italic text-lg uppercase tracking-tight truncate">{product.name}</h3>
                                    <div className="flex items-center justify-center gap-4 mt-2">
                                        <span className="text-xl font-[900] italic text-[#0D6EFD]">
                                            {currency} {convertPrice(product.price)}
                                        </span>
                                        <div className="h-4 w-[1px] bg-gray-200"></div>
                                        <div className="flex items-center text-[10px] font-[900] text-orange-500">
                                            <Star size={12} fill="currentColor" className="mr-1"/> 4.8
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty Search/Filter State */
                    <div className="py-20 md:py-32 text-center">
                        <SearchX size={80} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
                        <h2 className="text-3xl md:text-4xl font-[900] uppercase italic text-gray-300 tracking-tighter">No products found</h2>
                        <p className="text-gray-400 font-medium mt-2 px-4">Try adjusting your filters or searching for something else.</p>
                        <Link to="/products" className="mt-8 inline-block bg-black text-white px-10 py-4 rounded-full font-[900] italic uppercase text-[10px] tracking-widest hover:bg-[#0D6EFD] transition-all">
                            Clear all filters
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductListing;