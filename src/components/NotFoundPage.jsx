import React, { useEffect, useRef } from "react";

export default function NotFoundPage() {
  const number1Ref = useRef(null);
  const number2Ref = useRef(null);
  const number3Ref = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const badgeRef = useRef(null);
  const closeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load GSAP from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;

    script.onload = () => {
      const gsap = window.gsap;

      // Set initial states
      gsap.set([number1Ref.current, number2Ref.current, number3Ref.current], {
        y: 150,
        opacity: 0,
        scale: 0.8,
        rotationX: -45,
      });

      gsap.set([textRef.current, buttonRef.current], {
        x: -50,
        opacity: 0,
      });

      gsap.set([badgeRef.current, closeRef.current], {
        opacity: 0,
        y: -20,
      });

      // Create timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate badge and close button
      tl.to(
        [badgeRef.current, closeRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        0.2
      );

      // Animate 404 numbers with stagger and 3D effect
      tl.to(
        number1Ref.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "back.out(1.4)",
        },
        0.3
      );

      tl.to(
        number2Ref.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "back.out(1.4)",
        },
        0.5
      );

      tl.to(
        number3Ref.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "back.out(1.4)",
        },
        0.7
      );

      // Animate text
      tl.to(
        textRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        1
      );

      // Animate button
      tl.to(
        buttonRef.current,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        1.3
      );

      // Continuous floating animation for 404
      gsap.to([number1Ref.current, number2Ref.current, number3Ref.current], {
        y: -15,
        duration: 2,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
      });

      // Mouse movement parallax effect (only on desktop)
      const handleMouseMove = (e) => {
        if (window.innerWidth > 768) {
          const { clientX, clientY } = e;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          const moveX = (clientX - centerX) / 50;
          const moveY = (clientY - centerY) / 50;

          gsap.to(
            [number1Ref.current, number2Ref.current, number3Ref.current],
            {
              x: moveX,
              y: moveY,
              duration: 0.5,
              ease: "power2.out",
            }
          );
        }
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-zinc-950 flex flex-col items-start justify-start relative overflow-hidden p-4 sm:p-6 lg:p-8"
      style={{ perspective: "1000px" }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-900 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-900 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Error badge */}
      <div
        ref={badgeRef}
        className="text-zinc-500 text-[10px] sm:text-xs font-mono tracking-wider z-20 mb-auto"
      >
        • 404 ERROR, PAGE NOT FOUND
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full max-w-7xl mx-auto gap-8 lg:gap-0">
        {/* Left side - Text content */}
        <div className="w-full lg:w-1/2 z-10 text-center lg:text-left order-2 lg:order-1">
          <div ref={textRef} className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              If you're reading this,
              <br />
              something has gone
              <br />
              terribly, terribly wrong.
            </h1>
          </div>

          <div ref={buttonRef} className="flex justify-center lg:justify-start">
            <button
              onClick={() => (window.location.href = "/")}
              className="group relative px-5 py-2.5 sm:px-6 sm:py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer"
              onMouseEnter={(e) => {
                if (window.gsap) {
                  window.gsap.to(e.currentTarget, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (window.gsap) {
                  window.gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              }}
            >
              <span className="relative z-10 cursor-pointer">Return home</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
              >
                <path
                  d="M3 13L13 3M13 3H5M13 3V11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>

        {/* Right side - Large 404 */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative order-1 lg:order-2">
          <div
            className="flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={number1Ref}
              className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none select-none cursor-default"
              style={{
                background:
                  "linear-gradient(180deg, #d4d4d8 0%, #a1a1aa 30%, #71717a 60%, #52525b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
                transformStyle: "preserve-3d",
              }}
            >
              4
            </div>
            <div
              ref={number2Ref}
              className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none select-none cursor-default"
              style={{
                background:
                  "linear-gradient(180deg, #a1a1aa 0%, #71717a 30%, #52525b 60%, #3f3f46 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
                transformStyle: "preserve-3d",
              }}
            >
              0
            </div>
            <div
              ref={number3Ref}
              className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-black leading-none select-none cursor-default"
              style={{
                background:
                  "linear-gradient(180deg, #71717a 0%, #52525b 30%, #3f3f46 60%, #27272a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.05em",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
                transformStyle: "preserve-3d",
              }}
            >
              4
            </div>
          </div>
        </div>
      </div>

      {/* Close button - top right */}
      <button
        ref={closeRef}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 text-zinc-500 hover:text-white transition-colors duration-300 z-20 hover:rotate-90 transition-transform"
        onClick={() => window.history.back()}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="sm:w-6 sm:h-6"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
