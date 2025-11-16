import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import CustomPixelText from "./CustomPixelText";
import { TextRevealerOnScroll } from "./RevealTextAnimation";
import "../index.css";

const Footer = () => {
  const containerRef = useRef(null);
  const textRefs = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Marquee animation
  useEffect(() => {
    const texts = textRefs.current.filter(Boolean);
    if (!texts.length) return;

    const textWidth = texts[0].getBoundingClientRect().width;
    const gap = 50;
    const totalWidth = textWidth + gap;

    texts.forEach((text, index) => gsap.set(text, { x: index * totalWidth }));

    const marqueeTween = gsap.to(texts, {
      x: `-=${totalWidth}`,
      duration: 15,
      ease: "linear",
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`,
      },
    });

    return () => marqueeTween.kill();
  }, [isMobile]);

  const textInstances = Array.from({ length: 10 }).map((_, i) => (
    <div
      key={i}
      ref={(el) => (textRefs.current[i] = el)}
      className="whitespace-nowrap absolute top-1/2 -translate-y-1/2 flex items-center"
    >
      {isMobile ? (
        // Mobile → Normal text
        <p
          className="text-[12vw] tracking-widest font-bold uppercase font-[arial]
          .text-footer"
        >
          PJTALKS
        </p>
      ) : (
        // Desktop → Pixel distortion text
        <CustomPixelText
          textString="PJTALKS"
          fontSizes={[300]}
          canvasSizes={[{ w: 1520, h: 300 }]}
          gapY={-200}
          textAlignments={["center"]}
          fontFamily="arial"
          strokeWidth={0.4}
          fontWeight=""
        />
      )}
    </div>
  ));

  return (
    <div className="w-full min-w-screen min-h-[35rem] h-auto px-4 flex flex-col justify-between font-[arial] pt-5 text-[#A3A38F] max-sm:min-h-[15rem]">
      {/* Top Footer Text */}
      <div className="flex items-center justify-between text-[15px] font-bold uppercase p-4 border-y border-gray-500 max-sm:flex-col max-sm:text-xs max-sm:items-end max-sm:gap-y-2 max-sm:px-0 max-[300px]:text-[3vw]">
        <div>
          <TextRevealerOnScroll text="All rights reserved prashant joshi 2025">
            <sup className="font-bold text-lg font-[arial]">&reg;</sup>
          </TextRevealerOnScroll>
        </div>
        <div>
          <TextRevealerOnScroll
            text="+91-(9876543210)"
            className="font-[poppins]"
          />
        </div>
      </div>

      {/* Marquee Text */}
      <div
        ref={containerRef}
        className="relative w-full h-[25vw] text-[#A3A38F] overflow-hidden max-sm:h-[35vw]"
      >
        {textInstances}
      </div>
    </div>
  );
};

export default Footer;
