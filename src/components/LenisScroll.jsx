import { useEffect, createContext, useContext, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";

// Create a context for the Lenis instance
const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisScroll({ children }) {
  const lenisRef = useRef(null);
  const [lenisInstance, setLenisInstance] = useState(null); // State to hold Lenis instance

  useEffect(() => {
    const lenis = new Lenis({
      duration: 3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTouch: false,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis; // Store Lenis instance in ref
    setLenisInstance(lenis); // Update state with Lenis instance

    let frameId;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}