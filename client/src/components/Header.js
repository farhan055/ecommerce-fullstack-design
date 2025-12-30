import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, Heart, ShoppingCart, ChevronDown, Menu, X, Search, LogOut, LayoutDashboard, ChevronRight
} from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/authContext';

// ActionIcon Component - For Cart, Wishlist, User icons
const ActionIcon = ({ Icon, label, count, to = "#", onClick, className = "" }) => {
  const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";

  const content = (
    <>
      <div className="relative">
        <Icon size={22} className="text-gray-900 group-hover:text-[#0D6EFD] transition-colors stroke-[2.5px]" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#EB001B] text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-white shadow-lg">
            {count}
          </span>
        )}
      </div>
      <span className={`hidden md:block text-[10px] text-black mt-1 ${sportyStyle} group-hover:text-[#0D6EFD]`}>
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={`text-center group cursor-pointer p-2 rounded-xl hover:bg-blue-50 transition-all relative flex flex-col items-center min-w-[45px] md:min-w-[70px] ${className}`}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} className={`text-center group cursor-pointer p-2 rounded-xl hover:bg-blue-50 transition-all relative flex flex-col items-center min-w-[45px] md:min-w-[70px] ${className}`}>
      {content}
    </Link>
  );
};

const Header = () => {
  const { currency, setCurrency } = useCurrency();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const catMenuRef = useRef(null);
  const currMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";

  const totalCartItems = useMemo(() => cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0, [cartItems]);
  const totalWishlistItems = useMemo(() => wishlistItems?.length || 0, [wishlistItems]);

  const currencyData = {
    USD: { flag: 'https://flagcdn.com/w40/us.png' },
    PKR: { flag: 'https://flagcdn.com/w40/pk.png' },
  };

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currMenuRef.current && !currMenuRef.current.contains(e.target)) setIsCurrOpen(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) setIsCatOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => { await logout(); setIsUserMenuOpen(false); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts' },
    { name: 'Office Shirts', slug: 'office-shirts' },
    { name: 'Jeans & Trousers', slug: 'pants-trousers' },
    { name: 'Jackets & Hoodies', slug: 'jackets-hoodies' },
  ];

  return (
    <header className="bg-white sticky top-0 z-[100] font-sans shadow-sm border-b border-gray-100 w-full">
      
      {/* MOBILE MENU SIDEBAR */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[240] lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[250] lg:hidden shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              <div className="p-5 border-b flex items-center justify-between bg-gray-50">
                <span className={`${sportyStyle} text-xl`}>Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm border border-gray-100"><X size={20} /></button>
              </div>

              <div className="flex-grow overflow-y-auto">
                {/* SEARCH BAR INSIDE SIDEBAR FOR MOBILE */}
                <div className="p-4 bg-white">
                  <form onSubmit={handleSearch} className="relative group">
                    <input
                      type="text"
                      placeholder="SEARCH PRODUCT..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-gray-100 p-3.5 pl-12 rounded-xl text-[12px] border-2 border-transparent focus:border-[#0D6EFD] focus:bg-white outline-none transition-all ${sportyStyle}`}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0D6EFD]" size={18} />
                  </form>
                </div>

                <div className="p-4 space-y-6">
                  <div className="space-y-1">
                    <p className={`${sportyStyle} text-[10px] text-gray-400 px-3 mb-2 tracking-[0.2em]`}>Shop By Category</p>
                    {categories.map((cat) => (
                      <Link key={cat.slug} to={`/products?category=${cat.slug}`} className={`flex items-center justify-between px-4 py-3.5 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px] border border-transparent active:border-blue-100`}>
                        {cat.name} <ChevronRight size={14} className="text-[#0D6EFD]" />
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1 pt-4 border-t border-gray-50">
                    <p className={`${sportyStyle} text-[10px] text-gray-400 px-3 mb-2 tracking-[0.2em]`}>Explore</p>
                    <Link to="/products" className={`block px-4 py-3.5 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>New Arrival</Link>
                    <Link to="/about" className={`block px-4 py-3.5 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>About Us</Link>
                    <Link to="/contact-us" className={`block px-4 py-3.5 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>Support</Link>
                  </div>
                </div>
              </div>

              {/* Sidebar Currency Selection */}
              <div className="p-6 bg-gray-50 border-t">
                <p className={`${sportyStyle} text-[10px] text-gray-400 mb-3 uppercase tracking-widest`}>Currency</p>
                <div className="flex gap-2">
                  {Object.keys(currencyData).map((code) => (
                    <button
                      key={code}
                      onClick={() => { setCurrency(code); setIsMobileMenuOpen(false); }}
                      className={`flex-1 py-3 rounded-xl border-2 text-[11px] font-black flex items-center justify-center gap-2 transition-all ${currency === code ? "bg-black border-black text-white shadow-lg" : "bg-white border-gray-100 text-black hover:border-gray-300"}`}
                    >
                      <img src={currencyData[code].flag} alt={code} className="w-5 h-3.5 rounded-sm" /> {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN TOP HEADER */}
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg active:scale-90 transition-transform">
            <Menu size={26} />
          </button>
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 shrink-0">
            <img src="/logo4.png" alt="Logo" className="w-8 h-8 md:w-11 md:h-11 rounded-full shadow-sm object-cover" />
            <span className={`text-[15px] md:text-2xl ${sportyStyle} whitespace-nowrap`}>Men's<span className="text-[#0D6EFD]">Wear</span></span>
          </Link>

          {/* Search - Hidden on mobile/tablet, visible on large screens */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-grow max-w-xl xl:max-w-2xl bg-[#F8FAFC] border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-[#0D6EFD] transition-all">
            <input
              type="text"
              placeholder="SEARCH PRODUCT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`p-3 pl-6 w-full bg-transparent focus:outline-none text-[12px] ${sportyStyle}`}
            />
            <button type="submit" className={`px-8 bg-black text-white text-[12px] hover:bg-[#0D6EFD] transition-colors ${sportyStyle}`}>Search</button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-0.5 md:gap-2">
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <ActionIcon Icon={User} label={user.displayName?.split(' ')[0] || 'Account'} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} />
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white border shadow-2xl rounded-2xl py-2 z-[110] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 py-3 border-b border-gray-50 mb-1">
                         <p className={`${sportyStyle} text-[10px] text-gray-400`}>Logged in as</p>
                         <p className={`${sportyStyle} text-[12px] truncate`}>{user.displayName}</p>
                      </div>
                      <Link to="/my-orders" className={`flex items-center gap-3 px-5 py-3 hover:bg-blue-50 text-[11px] ${sportyStyle}`}><LayoutDashboard size={16} /> MY ORDERS </Link>
                      <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 text-[11px] ${sportyStyle}`}><LogOut size={16} /> Logout</button>
                    </div>
                  )}
                </>
              ) : (
                <ActionIcon Icon={User} label="Login" to="/login" />
              )}
            </div>
            <ActionIcon Icon={Heart} label="Wishlist" to="/wishlist" count={totalWishlistItems} />
            <ActionIcon Icon={ShoppingCart} label="Cart" to="/cart" count={totalCartItems} />
          </div>
        </div>
      </div>

      {/* DESKTOP NAVIGATION BAR (Hidden on Mobile) */}
      <div className="hidden lg:block bg-white border-t border-gray-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <nav className={`flex items-center space-x-10 text-[12px] ${sportyStyle}`}>
            <div className="relative" ref={catMenuRef}>
              <button onClick={() => setIsCatOpen(!isCatOpen)} className="flex items-center gap-2 text-[#0D6EFD] hover:opacity-80">
                {isCatOpen ? <X size={16} /> : <Menu size={16} />} All Categories
              </button>
              {isCatOpen && (
                <div className="absolute top-[120%] left-0 w-72 bg-white shadow-2xl rounded-2xl py-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map(cat => (
                    <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="block px-6 py-3.5 hover:bg-gray-50 font-black uppercase italic transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/products" className="hover:text-[#0D6EFD] transition-colors">New Arrival</Link>
            <Link to="/about" className="hover:text-[#0D6EFD] transition-colors">About Us</Link>
            <Link to="/contact-us" className="hover:text-[#0D6EFD] transition-colors">Support</Link>
          </nav>

          {/* Desktop Currency Selection */}
          <div className="relative" ref={currMenuRef}>
            <button onClick={() => setIsCurrOpen(!isCurrOpen)} className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
              <img src={currencyData[currency]?.flag} alt={currency} className="w-5 h-3.5 rounded-sm object-cover" />
              <span className={`text-[12px] ${sportyStyle}`}>{currency} <ChevronDown size={12} className={`transition-transform duration-200 ${isCurrOpen ? 'rotate-180' : ''}`} /></span>
            </button>
            {isCurrOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl py-2 border border-gray-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {Object.keys(currencyData).map(code => (
                  <button key={code} onClick={() => { setCurrency(code); setIsCurrOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors">
                    <img src={currencyData[code].flag} alt={code} className="w-5 h-3.5 rounded-sm" />
                    <span className={`text-[11px] ${sportyStyle}`}>{code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;