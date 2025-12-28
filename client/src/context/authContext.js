import React, { createContext, useState, useEffect, useContext } from 'react';

// Initialize the Auth Context
const AuthContext = createContext();

/**
 * @AuthProvider
 * This component acts as the security guard for the entire app.
 * It manages user sessions, tokens, and ensures that the user's 
 * identity is verified with the backend on every page refresh.
 */
export const AuthProvider = ({ children }) => {
    // 'user' holds the profile data (name, email, role)
    const [user, setUser] = useState(null);
    // 'loading' prevents protected routes from redirecting before the check is complete
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * @checkUser
         * Auto-login logic: Checks if a JWT token exists in localStorage.
         * If found, it validates the token with the server.
         */
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            
            // If no token, we stop loading and let the user browse public pages
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetching the latest user profile from the backend
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    // Successfully verified! Updating the global user state
                    setUser(data);
                } else {
                    // Token is invalid or expired - cleaning up the trash
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (err) {
                // Network error or server is down
                console.error("Auth Validation Error:", err);
            } finally {
                // Loading is finished regardless of success or failure
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    /**
     * @logout
     * Clears all session data and forces a redirect to the login page.
     * Use this for 'Sign Out' buttons.
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        // Using window.location to ensure all context states are fully reset
        window.location.href = '/login';
    };

    return (
        /* Providing user data and auth controls to all child components.
           This allows any page (like Profile or Header) to know who is logged in.
        */
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * @useAuth
 * Custom hook to easily access auth data without importing Context everywhere.
 */
export const useAuth = () => useContext(AuthContext);