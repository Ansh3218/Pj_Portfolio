import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ModernLoader = () => {
  // 🔹 Refs setup
  const containerRef = useRef(null); // Loader ke overall container ke liye
  const linesRef = useRef([]); // Animated lines store karne ke liye
  const contentRef = useRef(null); // Text aur logo area ke liye

  useEffect(() => {
    const container = containerRef.current;

    // 🔹 5 horizontal lines dark gradients ke sath
    const numLines = 5;
    const colors = [
      "linear-gradient(90deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
      "linear-gradient(90deg, #0a0a0a 0%, #262626 50%, #0a0a0a 100%)",
      "linear-gradient(90deg, #111111 0%, #333333 50%, #111111 100%)",
      "linear-gradient(90deg, #1a1a1a 0%, #3d3d3d 50%, #1a1a1a 100%)",
      "linear-gradient(90deg, #000000 0%, #444444 50%, #000000 100%)",
    ];

    // 🔹 Loop me lines create kar rahe hai
    for (let i = 0; i < numLines; i++) {
      const line = document.createElement("div");
      line.className = "absolute left-0 right-0"; // Full width line
      line.style.height = "2px"; // Thin horizontal line
      line.style.background = colors[i]; // Gradient color apply
      line.style.transformOrigin = "center"; // Animation center se ho
      line.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.15)"; // Soft glow

      // 🔹 Alternate lines top aur bottom se place kar rahe hai
      if (i % 2 === 0) {
        line.style.top = `${(i / numLines) * 100}%`;
      } else {
        line.style.bottom = `${((numLines - 1 - i) / numLines) * 100}%`;
      }

      // Lines ko store aur container me add kar diya
      linesRef.current.push(line);
      container.appendChild(line);
    }

    // 🔹 GSAP animation timeline
    const tl = gsap.timeline({
      onComplete: () => gsap.set(container, { display: "none" }), // End me loader hide
    });

    // ⚡ Animation Steps
    tl.from(linesRef.current, {
      scaleX: 0, // Lines left-right se grow hoti hai
      duration: 1.5,
      stagger: 0.15, // Ek ke baad ek line animate hoti hai
      ease: "power2.inOut",
    })
      .to({}, { duration: 0.8 }) // Short delay

      // Lines vertically expand hoti hain (height badhti hai)
      .to(linesRef.current, {
        height: "30vh",
        duration: 2.5,
        ease: "power3.inOut",
      })

      // Thoda shadow adjust for subtle glow effect
      .to(
        linesRef.current,
        {
          boxShadow: "0 0 5px rgba(255, 255, 255, 0.2)",
          duration: 1.5,
          ease: "power2.out",
        },
        "-=2.5" // Parallel animation timing
      )

      // Text ("LOADING...") fade in and move up
      .from(
        contentRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=1.5"
      )

      // Logo animation (scale up thoda bounce ke sath)
      .from(
        contentRef.current.querySelector(".logo"),
        {
          scale: 0.9,
          duration: 1,
          ease: "back.out(1.3)",
        },
        "-=1.2"
      )

      .to({}, { duration: 1 }) // Small pause before exit

      // 🔹 Lines exit animation (alternate lines left/right move hoti hain)
      .to(
        linesRef.current.filter((_, i) => i % 2 === 0),
        {
          x: "-100vw",
          duration: 2,
          ease: "power2.inOut",
        }
      )
      .to(
        linesRef.current.filter((_, i) => i % 2 !== 0),
        {
          x: "100vw",
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=1.5"
      )

      // Text fade-out ho jaata hai jab lines move kar rahi hoti hain
      .to(
        contentRef.current,
        {
          opacity: 0,
          y: -30,
          duration: 1,
          ease: "power2.in",
        },
        "-=1"
      )

      // Pura container fade-out ho jaata hai end me
      .to(container, {
        opacity: 0,
        duration: 10,
      });

    // 🔹 Cleanup — lines DOM se remove kar do jab component unmount ho
    return () => linesRef.current.forEach((line) => line.remove());
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black z-50 overflow-hidden"
    >
      {/* 🔹 Right-side soft gray glow for modern look */}
      <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-gray-600 via-gray-700 to-black opacity-20 blur-[150px]"></div>

      {/* 🔹 Subtle noise overlay — realistic texture ke liye */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* 🔹 Loader text content */}
      <div ref={contentRef} className="relative z-10 text-center">
        <div className="logo mb-6">
          {/* Optional: “LOADING” big text (commented out) */}
          {/* <h1 className="text-8xl font-light text-white tracking-[0.3em] mb-2">LOADING</h1> */}
          {/* Small separator line */}
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        </div>
        {/* Subtext */}
        <p className="text-2xl text-gray-400 tracking-[0.4em] font-light uppercase">
          LOADING...
        </p>
      </div>
    </div>
  );
};

export default ModernLoader;
