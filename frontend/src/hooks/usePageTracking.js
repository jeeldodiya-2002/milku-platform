import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

/**
 * usePageTracking Hook
 * Automatically sends pageview events to GA4 on route changes
 */
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // We wrap document.title in a small timeout to ensure SEO/Helmet has updated it
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);
};

export default usePageTracking;
