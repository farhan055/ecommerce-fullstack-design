import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * @ScrollToTop
 * This is a utility component that resets the scroll position to the top.
 * In Single Page Applications (SPA), React doesn't naturally reset scroll
 * when navigating between pages. This component fixes that behavior.
 */
const ScrollToTop = () => {
  // 'pathname' represents the current URL path (e.g., /products, /cart)
  const { pathname } = useLocation();

  useEffect(() => {
    /**
     * Whenever the route (pathname) changes, we force the browser window 
     * to jump back to the coordinates (0, 0) - the very top-left corner.
     * * For Mobile: This is crucial because users often scroll deep into 
     * product grids, and without this, the next page would load halfway down.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      // 'instant' is preferred for page transitions to avoid a weird "sliding" effect
      behavior: "instant", 
    });
  }, [pathname]); // This effect re-runs every time the user clicks a new link

  // This component doesn't render any UI, it only handles background logic.
  return null;
};

export default ScrollToTop;