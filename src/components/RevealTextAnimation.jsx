import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 🟢 Static Animation
export const TextRevealer = ({
  text = "", // Para (multiple lines allowed)
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  className,
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll(".char");
    if (!chars.length) return;

    gsap.set(chars, { y: "100%" });

    const anim = gsap.to(chars, {
      y: "0%",
      duration,
      stagger: {
        each: stagger,
        grid: "auto",
        from: "start",
      },
      delay,
      ease: "power3.out",
    });

    return () => anim.kill();
  }, [delay, duration, stagger]);

  // Split text into lines → then into chars
  const lines = text.split("\n");

  return (
    <div className={`block ${className || ""}`} ref={textRef}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="overflow-hidden block">
          {line.split("").map((char, index) => (
            <span key={index} className="char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

// 🟢 Scroll Animation

export const TextRevealerOnScroll = ({
  text = "",
  duration = 1.5,
  reverseOnScroll = false,
  className,
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const chars = el.querySelectorAll(".char");
    if (!chars.length) return;

    // Initial hidden state
    gsap.set(chars, { y: "100%", opacity: 0 });

    // Responsive values
    const isMobile = window.innerWidth <= 640;
    const triggerStart = isMobile ? "top 80%" : "top 70%";
    const triggerEnd = isMobile ? "bottom 90%" : "bottom 70%";
    const animDuration = isMobile ? duration * 1.4 : duration;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: triggerStart,
        end: triggerEnd,
        toggleActions: reverseOnScroll
          ? "play none none reverse"
          : "play none none none",
        markers: false,
        // ✨ Performance boost
        invalidateOnRefresh: true,
        fastScrollEnd: true,
      },
    });

    // ✨ Stagger animation - smooth reveal
    tl.to(chars, {
      y: "0%",
      opacity: 1,
      duration: animDuration,
      ease: "power2.out",
      stagger: {
        amount: animDuration * 0.5, // total stagger time
        from: "start",
      },
      // ✨ GPU acceleration
      force3D: true,
      willChange: "transform, opacity",
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [duration, reverseOnScroll, text]); // text ko dependency me add kiya

  // Split text into lines → then into chars
  const lines = text.split("\n");

  return (
    <div className={`block ${className || ""}`} ref={textRef}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="overflow-hidden block">
          {line.split("").map((char, index) => (
            <span
              key={`${lineIndex}-${index}`}
              className="char inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
