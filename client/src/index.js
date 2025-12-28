// client/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/authContext'; // Global Authentication State Provider
import './index.css'; // Global Styles (including Tailwind CSS)
import App from './App'; // The main layout and routing component

/**
 * Root Entry Point:
 * Targets the 'root' div defined in public/index.html to mount the React application.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Rendering the Application:
 * The <AuthProvider> wraps the <App> to ensure that authentication data 
 * (like user login status) is accessible throughout all components.
 * <React.StrictMode> is used for identifying potential problems in an application.
 */
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);