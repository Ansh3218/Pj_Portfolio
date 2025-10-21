import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PjCanvasImage from "../../public/assets/Images/Untitled design.png";
import PjImage from "../../public/assets/Images/pjImg.jpg";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const PjCanvasImg = () => {
  const textRef = useRef(null);
  const maskImgRef = useRef(null);
  const canvasImgRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const innerText = "You're probably in the right place".toUpperCase();
  const innerChars = useMemo(() => innerText.split(""), [innerText]);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const ctx = gsap.context(() => {
      const maskEl = maskImgRef.current;
      const textEl = textRef.current;
      const bgEl = canvasImgRef.current;

      const chars = container.querySelectorAll(".inner-char");
      if (!chars || chars.length === 0) {
        console.warn("PjCanvasImg: no inner-char elements found");
      }

      // Check if mobile
      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      // Mobile responsive values
      const circleSize = isMobile ? "25%" : "30%";
      const finalCircleSize = "100%";
      const textMoveDistance = isMobile
        ? () => window.innerHeight - 100
        : () => getContainerHeight() - 150;
      const scaleValue = isMobile ? 1.05 : 1.1;

      // Initial states
      gsap.set(maskEl, {
        clipPath: `circle(0% at 50% 50%)`,
        force3D: true,
      });

      if (chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: isMobile ? 30 : 50 });
      }

      gsap.set(bgEl, { scale: 1 });

      const getContainerHeight = () => {
        const r = container.getBoundingClientRect();
        return (r && r.height) || window.innerHeight;
      };

      // Timeline with ScrollTrigger - Mobile responsive
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: isMobile ? "+=2000" : "+=3000", // Shorter on mobile
          scrub: isMobile ? 1 : 2, // Smoother on mobile
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Animation sequence with mobile adjustments
      tl.to(textEl, {
        y: textMoveDistance,
        ease: "power2.out",
        duration: 1,
      })
        .to(
          maskEl,
          {
            clipPath: `circle(${circleSize} at 50% 50%)`,
            ease: "power2.inOut",
            duration: 1,
          },
          "-=0.5"
        )
        .to(
          textEl,
          {
            opacity: 0,
            ease: "power1.out",
            duration: 0.4,
          },
          "-=0.2"
        )
        .to(
          bgEl,
          {
            scale: scaleValue,
            ease: "power2.out",
            transformOrigin: "center center",
            duration: 0.8,
          },
          "-=0.6"
        )
        .to(maskEl, {
          clipPath: `circle(${finalCircleSize} at 50% 50%)`,
          ease: "power2.out",
          duration: 0.6,
        })
        .to(chars, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: isMobile ? 0.01 : 0.02, // Faster stagger on mobile
          ease: "power3.out",
        })
        .to({}, { duration: isMobile ? 0.5 : 1 }); // Shorter hold on mobile

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, container);

    return () => {
      ctx.revert();
    };
  }, [innerChars]);

  return (
    <>
      <div ref={wrapperRef} className="w-full" style={{ height: "100vh" }}>
        <div
          ref={containerRef}
          className="w-full h-screen relative text-white bg-black overflow-hidden"
          style={{ position: "sticky", top: 0 }}
        >
          {/* Background Canvas Image - Fully Responsive */}
          <img
            ref={canvasImgRef}
            src={PjCanvasImage}
            alt="canvas bg"
            className="h-full w-full object-cover max-sm:object-center"
            style={{ transformOrigin: "center center" }}
          />

          {/* Mask Effect Container - Fully Responsive */}
          <div
            ref={maskImgRef}
            className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center"
            style={{ clipPath: `circle(0% at 50% 50%)` }}
          >
            {/* Masked Image - Responsive */}
            <img
              src={PjImage}
              alt="masked pj"
              className="w-full h-full object-cover max-sm:object-[-35rem]"
            />

            {/* Inner Text - Mobile Responsive */}
            <div className="absolute text-center text-6xl font-bold text-gray-400 max-sm:text-4xl max-sm:px-2">
              <p className="overflow-hidden max-sm:leading-tight">
                {innerChars.map((char, i) => (
                  <span key={i} className="inner-char inline-block">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Main Text - Mobile Responsive */}
          <div
            ref={textRef}
            className="absolute top-40 left-1/2 -translate-x-1/2 text-center text-7xl font-bold leading-[1.1] tracking-tight z-10 max-sm:text-4xl max-sm:top-32 max-sm:w-full"
          >
            IN A WORLD FULL <br className="max-sm:hidden" />
            <span className="max-sm:block max-sm:mt">OF NOISE</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-black text-white">
        <Footer />
      </div>
    </>
  );
};

export default PjCanvasImg;
