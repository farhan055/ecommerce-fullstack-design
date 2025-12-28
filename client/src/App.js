import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- CONTEXT STATE MANAGEMENT ---
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext'; 

// --- SHARED UI COMPONENTS ---
import Header from './components/Header';
import ScrollToTop from "./components/ScrollToTop";

// --- MAIN SHOPPING PAGES ---
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailsPage';
import MyCartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import Checkout from './pages/Checkout'; 

// --- USER AUTHENTICATION & ACCOUNT ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage';

// --- ADDITIONAL INFORMATION & SUPPORT ---
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import FindStorePage from './pages/FindStorePage';
import BlogsPage from './pages/BlogsPage';
import PolicyPage from './pages/PolicyPage';
import MyOrdersPage from './pages/MyOrdersPage';
import Success from './pages/Success';
import TermsOfService from './pages/TermsofService';

// --- ADMINISTRATIVE CONTROLS ---
import AdminDashboard from './pages/AdminDashboard'; 

/**
 * @AdminRoute
 * Prevents non-admin users from accessing the dashboard.
 * Checks localStorage for user session and admin flag.
 */
const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user')); 
    return user && user.isAdmin === true ? children : <Navigate to="/login" replace />;
};

/**
 * @AppContent
 * The core layout engine. Handles conditional rendering of the Header
 * and ensures global responsiveness across all viewports.
 */
const AppContent = () => {
    const location = useLocation();
    
    // We hide the standard header if the user is inside the admin panel
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        /* The main wrapper prevents horizontal scroll leaks on mobile devices */
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gray-50">
            <ScrollToTop />
            
            {/* Standard Header is shown on all pages except Admin Dashboard */}
            {!isAdminPath && <Header />} 
            
            {/* The 'main' tag expands to fill screen height, keeping Footer at the bottom */}
            <main className="flex-grow w-full relative">
                <Routes>
                    {/* Public Browsing Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListingPage />} />
                    <Route path="/categories" element={<ProductListingPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    
                    {/* Shopping Experience Routes */}
                    <Route path="/cart" element={<MyCartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<Checkout />} /> 
                    <Route path="/success" element={<Success/>} />

                    {/* Authentication & User Account Management */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/resetpassword" element={<ResetPasswordPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-orders" element={<MyOrdersPage />} />

                    {/* Restricted Admin Area */}
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        } 
                    />

                    {/* Institutional & Information Pages */}
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/find-store" element={<FindStorePage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/contact-us" element={<ContactPage />} />
                    <Route path="/help-center" element={<ContactPage />} />
                    <Route path="/Terms-of-Service" element={<TermsOfService type="terms" />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/shipping" element={<PolicyPage type="shipping" />} />
                    <Route path="/money-refund" element={<PolicyPage type="refund" />} />
                </Routes>
            </main>
        </div>
    );
};

/**
 * @App
 * Entry point of the application. 
 * Wraps the entire app in Context Providers for global data access.
 */
function App() {
    return (
        <CurrencyProvider>
            <WishlistProvider>
                <CartProvider> 
                    <Router>
                        <AppContent />
                    </Router>
                </CartProvider>
            </WishlistProvider>
        </CurrencyProvider> 
    );
}

export default App;