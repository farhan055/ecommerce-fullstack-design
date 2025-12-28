// src/context/CurrencyContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext();

// Free API for real-time exchange rates (USD is base)
const API_URL = "https://open.er-api.com/v6/latest/USD";

export const CurrencyProvider = ({ children }) => {
    // 1. Fixed Fallback Rates (Only USD and PKR)
    const [rates, setRates] = useState({
        USD: 1.0,
        PKR: 280.00 // Average fallback rate
    });

    // 2. Default Currency set to PKR
    const [currency, setCurrency] = useState('PKR');
    const [shipTo, setShipTo] = useState('PK'); 
    const [loading, setLoading] = useState(true);

    // 3. Cleaned Country List (Only US and PK)
    const COUNTRIES = [
        { code: 'PK', name: 'Pakistan', currency: 'PKR' },
        { code: 'US', name: 'United States', currency: 'USD' },
    ];

    /**
     * @fetchRates
     * Fetches live exchange rates from the API.
     */
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                if (data && data.rates) {
                    // We only extract PKR and USD from the API response
                    const filteredRates = {
                        USD: 1.0,
                        PKR: data.rates.PKR || 280.00
                    };
                    setRates(filteredRates);
                    console.log("Live USD/PKR rates updated:", filteredRates);
                }
                setLoading(false);
            } catch (error) {
                console.error("Currency API Error, using fallback rates:", error);
                setLoading(false);
            }
        };
        fetchRates();
    }, []);

    /**
     * @convertPrice
     * Converts USD price to selected currency.
     */
    const convertPrice = (usdPrice) => {
        const rate = rates[currency] || 1.0;
        const converted = (usdPrice * rate).toFixed(2);
        
        // PKR formatting: No decimals for a cleaner look. USD: 2 decimals.
        return currency === 'PKR' ? Math.round(parseFloat(converted)) : converted;
    };

    /**
     * @getCurrencyDetails
     * Returns current details for the Checkout/Backend process.
     */
    const getCurrencyDetails = () => {
        return {
            code: currency,
            symbol: currency === 'PKR' ? 'Rs ' : '$',
            rate: rates[currency] || 1.0
        };
    };

    // Helper to get active symbol directly in components
    const activeSymbol = currency === 'PKR' ? 'Rs ' : '$';

    const contextValue = {
        currency,
        setCurrency,
        convertPrice,
        getCurrencyDetails,
        activeSymbol, // Directly use this for UI
        rates,
        shipTo,
        setShipTo,
        COUNTRIES,
        loading
    };

    return (
        <CurrencyContext.Provider value={contextValue}>
            {!loading && children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
};