import { useEffect, useState } from "react";
import Home from "./section/Home";
import Loader from "./components/Loader";
import "../src/index.css";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const isFirstVisit = !sessionStorage.getItem("visited");
  const [showLoader, setShowLoader] = useState(isFirstVisit);

  useEffect(() => {
    if (isFirstVisit) {
      // Mark as visited
      sessionStorage.setItem("visited", "true");
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 3000);

      // Log for debugging
      console.log("Loader effect: Started timer");

      return () => {
        clearTimeout(timer);
        console.log("Loader effect: Cleaned up");
      };
    }
  }, [isFirstVisit]);

  // 🚀 SCROLL RESTORATION FIX - Main level pe
  useEffect(() => {
    // Browser ka automatic scroll restoration disable karo
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Page load pe top pe le jao
    window.scrollTo(0, 0);

    // Browser back/forward button events handle karo
    const handlePopState = () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 0, immediate: true });
        }
      }, 0);
    };

    // Page visibility change pe handle karo
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    };

    // Event listeners add karo
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    console.log("Scroll restoration: Disabled & events added");

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      console.log("Scroll restoration: Event listeners removed");
    };
  }, []);

  // Block zoom (Ctrl + wheel / Ctrl + +/-)
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    // Log for debugging
    console.log("Zoom effect: Added event listeners");

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      console.log("Zoom effect: Removed event listeners");
    };
  }, []);

  return (
    // <AnimatePresence mode="wait" initial={true}>
    <>{showLoader ? <Loader key="loader" /> : <Home key="home" />}</>
    // </AnimatePresence>
  );
};

export default App;
