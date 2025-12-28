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
      <button onClick={onClick} className={`text-center group cursor-pointer p-2 rounded-xl hover:bg-blue-50 transition-all relative flex flex-col items-center min-w-[50px] md:min-w-[70px] ${className}`}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to} className={`text-center group cursor-pointer p-2 rounded-xl hover:bg-blue-50 transition-all relative flex flex-col items-center min-w-[50px] md:min-w-[70px] ${className}`}>
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

  // Cleaned Currency Data: Only USD and PKR
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
          <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-[250] lg:hidden shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b flex items-center justify-between">
                <span className={`${sportyStyle} text-xl`}>Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-4">
                <div className="space-y-1">
                  <p className={`${sportyStyle} text-[10px] text-gray-400 px-3 mb-2`}>Shop By Category</p>
                  {categories.map((cat) => (
                    <Link key={cat.slug} to={`/products?category=${cat.slug}`} className={`flex items-center justify-between px-4 py-3 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>
                      {cat.name} <ChevronRight size={14} className="text-[#0D6EFD]" />
                    </Link>
                  ))}
                </div>
                <div className="my-6 border-t border-gray-100"></div>
                <div className="space-y-1">
                  <p className={`${sportyStyle} text-[10px] text-gray-400 px-3 mb-2`}>Explore</p>
                  <Link to="/products" className={`block px-4 py-3 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>New Arrival</Link>
                  <Link to="/about" className={`block px-4 py-3 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>About Us</Link>
                  <Link to="/contact-us" className={`block px-4 py-3 hover:bg-blue-50 rounded-xl ${sportyStyle} text-[13px]`}>Support</Link>
                </div>
              </div>

              {/* Sidebar Currency Selection (Reduced to USD/PKR) */}
              <div className="p-6 bg-gray-50 border-t">
                <p className={`${sportyStyle} text-[10px] text-gray-400 mb-3 uppercase`}>Currency</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(currencyData).map((code) => (
                    <button
                      key={code}
                      onClick={() => { setCurrency(code); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-2 rounded-lg border text-[10px] font-black flex items-center gap-2 ${currency === code ? "bg-black text-white" : "bg-white text-black"}`}
                    >
                      <img src={currencyData[code].flag} alt={code} className="w-4 h-3" /> {code}
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
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-black hover:bg-gray-100 rounded-lg"><Menu size={28} /></button>
          
          <Link to="/" className="flex items-center space-x-2 md:space-x-3">
            <img src="/logo4.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm" />
            <span className={`text-base md:text-2xl ${sportyStyle}`}>Men's<span className="text-[#0D6EFD]">Wear</span></span>
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex flex-grow max-w-2xl bg-[#F8FAFC] border-2 border-gray-100 rounded-2xl overflow-hidden focus-within:border-[#0D6EFD]">
            <input
              type="text"
              placeholder="SEARCH PRODUCT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`p-3 pl-6 w-full bg-transparent focus:outline-none text-[12px] ${sportyStyle}`}
            />
            <button type="submit" className={`px-10 bg-black text-white text-[12px] hover:bg-[#0D6EFD] transition-colors ${sportyStyle}`}>Search</button>
          </form>

          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <ActionIcon Icon={User} label={user.displayName?.split(' ')[0] || 'Account'} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} />
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border shadow-xl rounded-2xl py-2 z-[110]">
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

      {/* DESKTOP NAVIGATION BAR */}
      <div className="hidden lg:block bg-white border-t">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          <nav className={`flex items-center space-x-10 text-[12px] ${sportyStyle}`}>
            <div className="relative" ref={catMenuRef}>
              <button onClick={() => setIsCatOpen(!isCatOpen)} className="flex items-center gap-2 text-[#0D6EFD]">
                {isCatOpen ? <X size={16} /> : <Menu size={16} />} All Categories
              </button>
              {isCatOpen && (
                <div className="absolute top-[120%] left-0 w-72 bg-white shadow-2xl rounded-2xl py-4 border">
                  {categories.map(cat => (
                    <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="block px-6 py-3 hover:bg-gray-50 font-black uppercase italic">{cat.name}</Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/products">New Arrival</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact-us">Support</Link>
          </nav>

          {/* Desktop Currency Selection (Reduced to USD/PKR) */}
          <div className="relative" ref={currMenuRef}>
            <button onClick={() => setIsCurrOpen(!isCurrOpen)} className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border">
              <img src={currencyData[currency]?.flag} alt={currency} className="w-5 h-3.5 rounded-sm" />
              <span className={`text-[12px] ${sportyStyle}`}>{currency} <ChevronDown size={12} /></span>
            </button>
            {isCurrOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-2xl py-2">
                {Object.keys(currencyData).map(code => (
                  <button key={code} onClick={() => { setCurrency(code); setIsCurrOpen(false); }} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50">
                    <img src={currencyData[code].flag} alt={code} className="w-5 h-3.5" />
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