import React from 'react';
import Footer from '../components/Footer';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

const sportyStyle = "font-sans font-[900] italic uppercase tracking-tighter";

/**
 * 100% Live & Verified Apparel Guides (2025)
 */
const blogPosts = [
    { 
        id: 1, 
        title: "T-Shirt Fabric: The Cotton Quality Guide", 
        author: "OCS", 
        date: "Dec 22, 2025", 
        summary: "Mastering the basics: Why GSM and combed cotton matter for the durability and comfort of your everyday T-shirts.", 
        imageUrl: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800",
        articleUrl: "https://www.onlineclothingstudy.com/2023/07/the-ultimate-guide-to-t-shirt-fabric.html" 
    },
    { 
        id: 2, 
        title: "The Oxford Shirt: Office to Evening", 
        author: "Fashion Beans", 
        date: "Dec 20, 2025", 
        summary: "The ultimate guide to the classic button-down: How to choose the right collar and fit for a professional look.", 
        imageUrl: "https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=800",
        articleUrl: "https://www.fashionbeans.com/article/ocbd-oxford-shirt-guide/"
    },
    { 
        id: 3, 
        title: "Hoodies & Jackets: Heavyweight Tech", 
        author: "Fashion Beans", 
        date: "Dec 18, 2025", 
        summary: "From fleece lining to oversized fits: Everything you need to know about choosing premium winter streetwear.", 
        imageUrl: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
        articleUrl: "https://www.fashionbeans.com/article/best-heavyweight-hoodies/"
    },
    { 
        id: 4, 
        title: "Finding The Perfect Trouser Fit", 
        author: "MUFFYNN", 
        date: "Dec 15, 2025", 
        summary: "Chinos, Trousers, or Cargo? A complete breakdown of different leg cuts and how they should sit on your shoes.", 
        imageUrl: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800",
        articleUrl: "https://muffynn.com/blogs/news/cargo-pants-vs-chinos-finding-the-perfect-fit-for-your-style"
    }
];

const BlogPostCard = ({ post }) => (
    <div className="relative group h-full">
        {/* Shadow Layer - Turns Blue on Hover */}
        <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 rounded-[40px] transition-colors duration-500 group-hover:bg-sky-500"></div>
        
        {/* Main Card Content */}
        <div className="relative bg-white border-2 border-black rounded-[40px] overflow-hidden transition-all duration-500 flex flex-col h-full group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-sky-500">
            
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden shrink-0 border-b-2 border-black group-hover:border-sky-500 transition-colors duration-500">
                <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className={`absolute top-5 left-5 bg-black text-white px-5 py-2 rounded-full text-[10px] shadow-lg flex items-center gap-2 ${sportyStyle}`}>
                    <ShieldCheck size={12} className="text-sky-400" />
                    Verified Style
                </div>
            </div>

            {/* Card Text Area */}
            <div className="p-8 flex flex-col flex-grow text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                    <span className={`text-[11px] text-sky-500 ${sportyStyle}`}>{post.author}</span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                    <span className={`text-[11px] text-gray-400 ${sportyStyle}`}>{post.date}</span>
                </div>
                
                <h3 className={`text-2xl text-black mb-4 leading-none group-hover:text-sky-500 transition-colors duration-500 ${sportyStyle}`}>
                    {post.title}
                </h3>
                
                <p className={`text-[13px] text-gray-500 mb-8 leading-relaxed flex-grow font-medium`}>
                    {post.summary}
                </p>
                
                {/* Button that redirects to external guides */}
                <a 
                    href={post.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 bg-black text-white py-4 rounded-2xl text-[12px] group-hover:bg-sky-500 transition-all duration-500 active:scale-95 ${sportyStyle}`}
                >
                    Read Style Guide <ExternalLink size={16} className="text-white group-hover:text-black transition-colors" />
                </a>
            </div>
        </div>
    </div>
);

const BlogsPage = () => {
    return (
        <div className="bg-white">
            <main className="min-h-screen py-16 md:py-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    
                    {/* Header Section */}
                    <div className="mb-20 text-center">
                        <div className="inline-flex items-center gap-3 mb-8 bg-black/5 px-6 py-2 rounded-full">
                            <BookOpen size={20} className="text-sky-500" />
                            <p className={`text-black text-sm tracking-widest ${sportyStyle}`}>Men's wear Knowledge Base</p>
                        </div>
                        
                        <h1 className={`text-6xl md:text-[120px] text-black mb-8 leading-[0.8] tracking-[-0.05em] ${sportyStyle}`}>
                            Apparel <span className="text-sky-500">Insights</span>
                        </h1>
                        
                        <div className="h-2 w-32 bg-sky-500 mx-auto rounded-full"></div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10">
                        {blogPosts.map(post => (
                            <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* Bottom Disclaimer/Banner */}
                    <div className="mt-24 py-16 border-t-2 border-black/5 text-center">
                        <p className={`text-sky-500 text-xs mb-4 tracking-[0.3em] ${sportyStyle}`}>Expertly Curated Guides</p>
                        <p className={`text-black text-lg md:text-2xl max-w-4xl mx-auto leading-tight italic ${sportyStyle}`}>
                            "We don't just sell clothes; we build style. Our guides help you understand the quality of fabrics and the art of the perfect fit."
                        </p>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default BlogsPage;