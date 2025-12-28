// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context for Wishlist
const WishlistContext = createContext();

/**
 * @WishlistProvider
 * Manages the user's "Favorites" or "Wishlist".
 * This context persists data using LocalStorage so that items 
 * don't disappear when the user refreshes the browser.
 */
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  /**
   * INITIAL LOAD:
   * When the app starts, we check if there's any saved wishlist in the browser's memory.
   */
  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
      if (savedWishlist && Array.isArray(savedWishlist)) {
        setWishlistItems(savedWishlist);
      }
    } catch (error) {
      console.error("Error loading wishlist from storage:", error);
    }
  }, []);

  /**
   * PERSISTENCE:
   * Every time the wishlistItems state changes, we sync it with LocalStorage.
   */
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /**
   * @addToWishlist
   * Handles adding a product to the list.
   * Pro Logic: If the item already exists, we can either alert the user
   * or simply ignore the request. Here we keep it safe with a check.
   */
  const addToWishlist = (product) => {
    const pId = product._id || product.id;
    
    setWishlistItems((prev) => {
      // Check if item is already in the wishlist using ID
      const isExist = prev.find((item) => (item._id === pId || item.id === pId));
      
      if (isExist) {
        // You can replace this with a nice Toast notification later
        console.log("Item is already in your wishlist.");
        return prev;
      }
      
      // If it's a new item, spread the previous items and add the new product
      return [...prev, { ...product, id: pId, _id: pId }];
    });
  };

  /**
   * @removeFromWishlist
   * Removes an item based on its unique ID.
   */
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id !== id && item.id !== id)));
  };

  /**
   * @toggleWishlist
   * A handy helper: If it's there, remove it. If it's not, add it.
   * Great for heart icons on product cards.
   */
  const toggleWishlist = (product) => {
    const pId = product._id || product.id;
    const isExist = wishlistItems.find((item) => (item._id === pId || item.id === pId));
    
    if (isExist) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    /* Exposing wishlistItems and control functions to the entire app.
       We added 'toggleWishlist' to make your heart icons smarter.
    */
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist, 
      removeFromWishlist, 
      toggleWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

/**
 * @useWishlist
 * Custom hook to consume wishlist data easily.
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};