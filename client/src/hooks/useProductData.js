// client/src/hooks/useProductData.js

import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @API_BASE_URL
 * Pointing to your backend server. 
 * Ensure your Node.js server is running on port 5000.
 */
const API_BASE_URL = 'http://localhost:5000/api/products';

/**
 * @useFetchProducts
 * Custom hook to fetch a list of products.
 * Handles filtering, categories, and search via 'queryParams'.
 * * Usage: const { products, loading, error } = useFetchProducts('?category=hoodies');
 */
export const useFetchProducts = (queryParams = '') => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // AbortController is a pro-tool that cancels the request if the component unmounts
        // (Great for mobile performance and preventing memory leaks)
        const controller = new AbortController();

        const fetchProducts = async () => {
            try {
                setLoading(true);
                // We add a signal to the axios request for clean cancellation
                const { data } = await axios.get(`${API_BASE_URL}${queryParams}`, {
                    signal: controller.signal
                });
                
                setProducts(data);
                setError(null); // Clear any previous errors
            } catch (err) {
                if (axios.isCancel(err)) return; // Ignore if request was cancelled
                setError('Failed to fetch product list. Please check your connection.');
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Cleanup function: runs when queryParams change or user leaves the page
        return () => controller.abort();
    }, [queryParams]);

    return { products, loading, error };
};


/**
 * @useFetchProductDetails
 * Custom hook to fetch a single product's data using its ID.
 * Perfect for the 'Product Detail View' or 'Quick View' modal.
 */
export const useFetchProductDetails = (id) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Don't trigger the API if the ID is missing or undefined
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_BASE_URL}/${id}`);
                setProduct(data);
                setError(null);
            } catch (err) {
                setError('Failed to load product details.');
                console.error("Detail Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
};