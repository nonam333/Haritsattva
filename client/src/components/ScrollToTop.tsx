import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page when navigation occurs
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top smoothly when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [location]);

  return null;
}
