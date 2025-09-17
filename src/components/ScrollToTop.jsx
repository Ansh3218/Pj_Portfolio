import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "./LenisScroll";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const scrollToTop = () => {
      if (lenis) {
        // Use Lenis to scroll to top instantly
        lenis.scrollTo(0, { immediate: true });
      } else {
        // Fallback to window.scrollTo if Lenis isn't available
        window.scrollTo({
          top: 0,
          behavior: "instant", // Changed to instant for consistency
        });
      }
    };

    // Add slight delay to ensure Lenis is initialized
    const timer = setTimeout(scrollToTop, 0);

    return () => clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
}
