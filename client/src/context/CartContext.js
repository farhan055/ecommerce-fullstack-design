import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // API base URL
    const API_URL = "https://menswear-backend.vercel.app/api/cart";

    // Dynamic User ID: FromLocalStorage 
    const getUserData = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const user = getUserData();
    const userId = user ? user._id : null;

    /**
     * @fetchCartFromDB
     * Database se cart load karta hai. Agar user login nahi hai toh khali kar deta hai.
     */
    const fetchCartFromDB = async () => {
        if (!userId) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/${userId}`);
            if (res.data && res.data.items) {
                const formattedItems = res.data.items.map(item => ({
                    ...item,
                    id: item.productId, // Frontend compatibility ke liye
                    price: parseFloat(item.price) || 0
                }));
                setCartItems(formattedItems);
            } else {
                setCartItems([]);
            }
        } catch (err) { 
            console.error("Cart Fetching Failed:", err); 
            setCartItems([]);
        } finally { 
            setLoading(false); 
        }
    };

    // Jab app load ho ya userId badle (Login/Logout), tab fetch kare
    useEffect(() => { 
        fetchCartFromDB(); 
    }, [userId]);

    /**
     * @syncWithDB
     * Backend ko updated cart bhejta hai
     */
    const syncWithDB = async (updatedItems) => {
        if (!userId) return; // Guest user ke liye sync skip

        try {
            await axios.post(`${API_URL}/save`, {
                userId,
                items: updatedItems.map(item => ({
                    productId: item.id || item._id,
                    name: item.name,
                    price: parseFloat(item.price),
                    image: item.image || item.img,
                    size: item.size,
                    quantity: item.quantity
                }))
            });
        } catch (err) { 
            console.error("Database Sync Error:", err); 
        }
    };

    /**
     * @addToCart
     */
    const addToCart = async (product) => {
        const pId = product.id || product._id;
        const price = parseFloat(product.price) || 0;
        
        let newItems;
        const exists = cartItems.find(item => item.id === pId && item.size === product.size);

        if (exists) {
            newItems = cartItems.map(item => 
                (item.id === pId && item.size === product.size) 
                ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newItems = [...cartItems, { ...product, id: pId, price: price, quantity: 1 }];
        }
        
        setCartItems(newItems);
        await syncWithDB(newItems);
    };

    /**
     * @updateQuantity
     */
    const updateQuantity = async (id, size, delta) => {
        const newItems = cartItems.map(item => 
            (item.id === id && item.size === size) 
            ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        );
        setCartItems(newItems);
        await syncWithDB(newItems);
    };

    /**
     * @removeFromCart
     */
    const removeFromCart = async (id, size) => {
        const newItems = cartItems.filter(item => !(item.id === id && item.size === size));
        setCartItems(newItems);
        await syncWithDB(newItems);
    };

    /**
     * @clearCart
     */
    const clearCart = async () => {
        setCartItems([]); 
        if (userId) {
            try {
                await axios.post(`${API_URL}/save`, {
                    userId,
                    items: []
                });
            } catch (err) {
                console.error("Failed to empty cart:", err);
            }
        }
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            loading,
            userId // Useful for debugging
        }}>
            {children}
        </CartContext.Provider>
    );  
};

export const useCart = () => useContext(CartContext);