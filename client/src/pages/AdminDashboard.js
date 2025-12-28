import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Mail, PackagePlus, Trash2, Loader2, Upload, 
    Image as ImageIcon, Edit3, X, RotateCw, Menu, ArrowLeft, CheckCircle2, AlertCircle, Tag
} from 'lucide-react';

const AdminDashboard = () => {
    // --- State Management ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [subscribers, setSubscribers] = useState([]); 
    const [activeTab, setActiveTab] = useState('inventory');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // UI Notifications State
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    
    // Configuration Constants
    const rates = { USD: 1, PKR: 280, EUR: 0.92, GBP: 0.79 };
    const categories = ["shirts", "officeshirts", "pants-trousers", "jackets-hoodies"];

    // Form State for Products
    const [newProduct, setNewProduct] = useState({ 
        name: '', price: '', image: '', category: 'shirts', stock: '50', currency: 'USD', sizes: 'S, M, L, XL'
    });

    const token = localStorage.getItem('token');

    // --- Helper Functions ---
    
    // Simple Toast Notification Logic
    const showToast = (msg, type = 'success') => {
        setNotification({ show: true, message: msg, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    // Fetch Products from API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://menswear-backend.vercel.app/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (err) { 
            console.error("Fetch failed"); 
        } finally { 
            setLoading(false); 
        }
    };

    // Fetch Newsletter Subscribers
    const fetchSubscribers = async () => {
        try {
            const res = await fetch('https://menswear-backend.vercel.app/api/auth/newsletter', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setSubscribers(data);
        } catch (err) { 
            console.error("Subscriber fetch failed"); 
        }
    };

    // Initial Data Load
    useEffect(() => { 
        fetchProducts(); 
        fetchSubscribers();
    }, []);

    // Handle Image Preview Path
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setNewProduct({ ...newProduct, image: `/Products-Data/${file.name}` });
    };

    // Create or Update Product Logic
    const handleAction = async (e) => {
        e.preventDefault();
        if (!newProduct.image) {
            showToast("Asset identity missing! Upload image.", "error");
            return;
        }
        try {
            const rawPrice = parseFloat(newProduct.price);
            const priceInUSD = (rawPrice / rates[newProduct.currency]).toFixed(2);
            
            // Format sizes from string to array
            const sizesArray = typeof newProduct.sizes === 'string' 
                ? newProduct.sizes.split(',').map(s => s.trim()).filter(s => s !== "")
                : newProduct.sizes;

            const productData = { 
                name: newProduct.name,
                price: Number(priceInUSD),
                image: newProduct.image,
                category: newProduct.category,
                stock: Number(newProduct.stock) || 0,
                sizes: sizesArray
            };

            const url = editMode ? `https://menswear-backend.vercel.app/api/products/${selectedId}` : 'https://menswear-backend.vercel.app/api/products';
            const res = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(productData)
            });

            const result = await res.json();
            if (res.ok) {
                fetchProducts(); 
                resetForm();
                showToast(editMode ? "Asset Registry Updated" : "Product Deployed Successfully", "success");
            } else {
                showToast(result.message || "System Error", "error");
            }
        } catch (err) { 
            showToast("Neural Link Failed: Connection Error", "error");
        }
    };

    // Reset Form to Initial State
    const resetForm = () => {
        setNewProduct({ name: '', price: '', image: '', category: 'shirts', stock: '50', currency: 'USD', sizes: 'S, M, L, XL' });
        setEditMode(false); 
        setSelectedId(null);
    };

    // Load Product Data into Form for Editing
    const handleEditClick = (prod) => {
        setEditMode(true); 
        setSelectedId(prod._id);
        setNewProduct({
            name: prod.name, 
            price: (prod.price * rates[currency]).toFixed(0),
            image: prod.image, 
            category: prod.category || 'shirts', 
            stock: prod.stock || 50,
            currency: currency, 
            sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes || 'S, M, L, XL'
        });
    };

    // Delete Product Logic
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if(!window.confirm("Purge this asset from registry?")) return;
        try {
            const res = await fetch(`https://menswear-backend.vercel.app/api/products/${id}`, { 
                method: 'DELETE', 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            if(res.ok) {
                fetchProducts();
                showToast("Asset Purged Successfully", "success");
            }
        } catch (err) { 
            showToast("Purge Sequence Failed", "error"); 
        }
    };

    const formatPrice = (price) => (price * rates[currency]).toLocaleString(undefined, { minimumFractionDigits: 0 });
    
    // Shared UI Classes
    const inputClasses = "w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-white outline-none focus:border-sky-500 font-bold text-xs transition-all";
    const labelClasses = "block text-[9px] font-black text-sky-400 uppercase tracking-widest mb-1 ml-1";

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden font-sans relative">
            {/* Global Animations & Custom Scrollbar */}
            <style>{`
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes rotate360 { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
                .animate-360 { animation: rotate360 15s linear infinite; transform-style: preserve-3d; }
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }
                .neon-box { border: 2px solid #39FF14; box-shadow: 0 0 25px #39FF14, inset 0 0 15px #39FF14; }
            `}</style>

            {/* Floating Notifications */}
            {notification.show && (
                <div className={`fixed top-5 right-5 md:top-10 md:right-10 z-[1000] min-w-[250px] p-5 rounded-2xl border backdrop-blur-2xl flex items-center gap-4 animate-slide-in shadow-2xl ${
                    notification.type === 'success' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-red-500/50 bg-red-500/10 text-red-400'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold italic">{notification.message}</p>
                </div>
            )}

            {/* 360 Degree Image Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
                    <button onClick={() => setShowPreview(false)} className="absolute top-8 right-8 text-white/50 hover:text-white z-[601] transition-colors"><X size={35}/></button>
                    <div className="relative flex flex-col items-center">
                        <div className="neon-box p-6 md:p-20 rounded-[3rem] bg-black/40 relative overflow-hidden">
                            <img src={newProduct.image} className="w-56 h-56 md:w-[450px] md:h-[450px] object-contain animate-360 drop-shadow-[0_0_30px_rgba(57,255,20,0.2)]" alt="360 View" />
                        </div>
                        <div className="mt-10 text-[#39FF14]">
                            <p className="font-black tracking-[0.4em] text-[10px] uppercase flex items-center gap-3 animate-pulse">
                                <RotateCw size={18} className="animate-spin" /> Neural 360 Scan Active
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Navigation - Responsive Design */}
            <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-72 h-full border-r border-white/5 bg-black p-8 transition-transform duration-300 flex flex-col`}>
                <div className="flex justify-between items-center mb-12 md:block">
                    <h1 className="text-2xl font-black italic tracking-tighter">MEN'S<span className="text-sky-500">WEAR</span></h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white/50"><X /></button>
                </div>
                
                <nav className="space-y-4 flex-grow">
                    <button onClick={() => setActiveTab('inventory')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'inventory' ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20' : 'hover:bg-white/5 text-white/50'}`}>
                        <LayoutDashboard size={20} />
                        <span className="text-xs font-black uppercase italic">Inventory</span>
                    </button>

                    <button onClick={() => setActiveTab('newsletter')} className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${activeTab === 'newsletter' ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20' : 'hover:bg-white/5 text-white/50'}`}>
                        <Mail size={20} />
                        <span className="text-xs font-black uppercase italic">Subscribers</span>
                    </button>

                    <div className="pt-6">
                        <label className={labelClasses}>Global Currency</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-sky-500">
                            {Object.keys(rates).map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
                        </select>
                    </div>
                </nav>

                <button onClick={() => window.location.href = '/'} className="mt-auto flex items-center justify-center gap-3 p-4 w-full border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Exit to Store
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col min-w-0">
                <header className="p-6 md:p-10 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-white/5 rounded-lg text-sky-500"><Menu size={20}/></button>
                        <h2 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter">
                            {activeTab === 'inventory' ? <>Inventory <span className="text-sky-500">Control</span></> : <>Mail <span className="text-sky-500">Registry</span></>}
                        </h2>
                    </div>
                    <div className="hidden sm:block bg-sky-500/10 text-sky-400 px-6 py-2 rounded-full text-[11px] font-black border border-sky-500/20 uppercase tracking-widest">
                        {activeTab === 'inventory' ? `${products.length} Units Online` : `${subscribers.length} Neural Links`}
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto custom-scroll p-4 md:p-10">
                    {activeTab === 'inventory' ? (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-slide-in">
                            {/* Product Entry Form */}
                            <section className="xl:col-span-4 bg-[#0A0A0A] p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl h-fit">
                                <h3 className="text-xs font-black italic uppercase flex items-center gap-2 mb-8 text-sky-500">
                                    {editMode ? <Edit3 size={18} /> : <PackagePlus size={18} />} 
                                    {editMode ? 'Modify Product' : 'New Deployment'}
                                </h3>
                                <form onSubmit={handleAction} className="space-y-5">
                                    <div><label className={labelClasses}>Product Name</label><input className={inputClasses} value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct, name: e.target.value})} required /></div>
                                    <div>
                                        <label className={labelClasses}>Select Category</label>
                                        <select className={inputClasses} value={newProduct.category} onChange={(e)=>setNewProduct({...newProduct, category: e.target.value})}>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat} className="bg-black capitalize">{cat.replace('-', ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClasses}>Price</label><input type="number" className={inputClasses} value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct, price: e.target.value})} required /></div>
                                        <div><label className={labelClasses}>Currency</label><select className={inputClasses} value={newProduct.currency} onChange={(e) => setNewProduct({...newProduct, currency: e.target.value})}>{Object.keys(rates).map(r => <option key={r} value={r} className="bg-black">{r}</option>)}</select></div>
                                    </div>
                                    <div><label className={labelClasses}>Available Sizes</label><input className={inputClasses} value={newProduct.sizes} onChange={(e)=>setNewProduct({...newProduct, sizes: e.target.value})} placeholder="S, M, L..." /></div>
                                    
                                    {/* Image Asset Upload Area */}
                                    <div className="relative border-2 border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center bg-white/[0.02] min-h-[180px] justify-center overflow-hidden hover:border-sky-500/40 transition-all">
                                        {newProduct.image ? (
                                            <div className="text-center w-full">
                                                <img src={newProduct.image} className="h-28 mx-auto object-contain mb-4" alt="Preview" />
                                                <div className="flex gap-2 justify-center">
                                                    <button type="button" onClick={() => setShowPreview(true)} className="bg-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1 hover:bg-sky-500 hover:text-black transition-all"><RotateCw size={12}/> 360 View</button>
                                                    <button type="button" onClick={() => setNewProduct({...newProduct, image: ''})} className="text-[9px] text-red-500 font-bold uppercase underline">Clear</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center opacity-30">
                                                <Upload size={30} className="mx-auto mb-2 text-sky-500" />
                                                <p className="text-[9px] font-black uppercase tracking-widest">Upload Asset Identity</p>
                                            </div>
                                        )}
                                        {!newProduct.image && <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />}
                                    </div>

                                    <button type="submit" className={`w-full py-5 rounded-2xl font-black italic uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl ${editMode ? 'bg-yellow-500 text-black shadow-yellow-500/10' : 'bg-white text-black hover:bg-sky-500 hover:text-white shadow-sky-500/10'}`}>
                                        {editMode ? 'Update Asset' : 'Deploy to Registry'}
                                    </button>
                                    {editMode && <button type="button" onClick={resetForm} className="w-full text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white">Cancel Modification</button>}
                                </form>
                            </section>

                            {/* Inventory Table Display */}
                            <section className="xl:col-span-8 bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                                <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                                    <h3 className="text-xs font-black italic uppercase flex items-center gap-3"><ImageIcon size={18} className="text-sky-500" /> Active Registry</h3>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">System Stable v2.4</span>
                                </div>
                                <div className="flex-grow overflow-x-auto custom-scroll">
                                    <table className="w-full text-left min-w-[600px]">
                                        <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 sticky top-0 backdrop-blur-md">
                                            <tr>
                                                <th className="p-8">Details</th>
                                                <th className="p-8">Category</th>
                                                <th className="p-8">Valuation</th>
                                                <th className="p-8 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {loading ? (
                                                <tr><td colSpan="4" className="p-32 text-center"><Loader2 className="animate-spin mx-auto text-sky-500" size={40} /></td></tr>
                                            ) : products.map((prod) => (
                                                <tr key={prod._id} className="hover:bg-white/[0.02] cursor-pointer group transition-all">
                                                    <td className="p-8 flex items-center gap-6" onClick={() => handleEditClick(prod)}>
                                                        <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/10 overflow-hidden p-2">
                                                            <img src={prod.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="" />
                                                        </div>
                                                        <p className="font-black italic uppercase text-xs tracking-tight">{prod.name}</p>
                                                    </td>
                                                    <td className="p-8"><span className="px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-[9px] font-black uppercase border border-sky-500/20">{prod.category}</span></td>
                                                    <td className="p-8 font-black italic text-sky-400 text-sm tracking-widest">{currency} {formatPrice(prod.price)}</td>
                                                    <td className="p-8 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleEditClick(prod)} className="p-3 text-white/20 hover:text-sky-500 hover:bg-sky-500/10 rounded-xl transition-all"><Edit3 size={18} /></button>
                                                            <button onClick={(e) => handleDelete(e, prod._id)} className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    ) : (
                        /* SUBSCRIBERS VIEW - Newsletter Registry */
                        <section className="bg-[#0A0A0A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl animate-slide-in">
                            <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                                <h3 className="text-xs font-black italic uppercase flex items-center gap-3 text-sky-500">
                                    <Mail size={18} /> Subscriber Neural Network
                                </h3>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subscribers.map((sub, i) => (
                                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-sky-500/50 transition-all">
                                        <div>
                                            <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Neural Link Active</p>
                                            <p className="text-sm font-bold text-white mt-1 tracking-tight">{sub.email}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-black transition-all">
                                            <CheckCircle2 size={18} />
                                        </div>
                                    </div>
                                ))}
                                {subscribers.length === 0 && (
                                    <div className="col-span-full text-center py-32 opacity-20 italic uppercase font-black text-sm tracking-widest">
                                        No Neural Connections Found
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    ); 
};

export default AdminDashboard;