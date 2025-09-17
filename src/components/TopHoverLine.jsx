import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export default function TopHoverLine({
  children,
  lineColor = "#9B9B88",
  duration = 0.5,
  ease = "power2.out",
}) {
  const wrapperRef = useRef(null);
  const lineRef = useRef(null);
  const [dynamicHeight, setDynamicHeight] = useState("2px");

  // Responsive breakpoints ke hisaab se lineHeight set karna
  useEffect(() => {
    const updateHeight = () => {
      if (window.matchMedia("(max-width: 400px)").matches) {
        setDynamicHeight("1px"); //  phones
      } else if (window.matchMedia("(max-width: 768px)").matches) {
        setDynamicHeight("2px"); //  tablets
      } else {
        setDynamicHeight("3px"); // desktops
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleMouseEnter = () => {
    gsap.fromTo(lineRef.current, { x: "-100%" }, { x: "0%", duration, ease });
  };

  const handleMouseLeave = () => {
    gsap.to(lineRef.current, { x: "100%", duration, ease: "power2.inOut" });
  };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Top Line */}
      <span
        ref={lineRef}
        className="absolute top-0 left-0 w-full"
        style={{
          height: dynamicHeight,
          backgroundColor: lineColor,
          transform: "translateX(-100%)",
        }}
      ></span>
    </div>
  );
}
