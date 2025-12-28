// src/components/Layout.js
import React from 'react';
import Header from './Header'; 
import Footer from './Footer'; 

/**
 * @LayoutComponent
 * This is the primary structural wrapper for the entire application.
 * It ensures a consistent user experience by maintaining the Header and Footer
 * while providing a responsive container for all page-specific content.
 */
const Layout = ({ children }) => {
    return (
        /* The 'flex flex-col' combined with 'min-h-screen' is a pro-trick.
           It forces the Footer to stay at the very bottom of the page, 
           even if the page content is very short (Sticky Footer effect).
        */
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white">
            
            {/* The Header is global and remains sticky at the top 
                across all viewports as defined in the Header component. 
            */}
            <Header />
            
            {/* MAIN CONTENT AREA:
                - 'flex-grow' ensures this section takes up all available space.
                - 'w-full' ensures it spans the entire width of mobile and desktop screens.
                - We use 'relative' positioning in case any children use absolute placement.
            */}
            <main className="flex-grow w-full relative">
                {/* The 'children' prop dynamically injects your pages 
                    (HomePage, ProductPage, etc.) right here.
                */}
                {children}
            </main>
            
            {/* The Footer is placed at the end of the flex-column. 
                Its internal grid handles responsive stacking for mobile users.
            */}
            <Footer />
            
        </div>
    );
};

export default Layout;