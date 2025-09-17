import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const Loader = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const blocksRef = useRef([]);

  useEffect(() => {
    // Split LOADING text
    const splitChar = new SplitText(textRef.current, {
      type: "chars",
    });

    // Create a grid of blocks as thin lines
    const numCols = 12;
    const numRows = 6;
    const blockWidth = window.innerWidth / numCols;
    const blockHeight = window.innerHeight / numRows;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const block = document.createElement("div");
        block.className = "absolute bg-gray-700 opacity-85";
        block.style.width = "1px"; // Start as thin lines
        block.style.height = `${blockHeight}px`;
        block.style.left = `${col * blockWidth}px`;
        block.style.top = `${row * blockHeight}px`;
        blocksRef.current.push(block);
        containerRef.current.appendChild(block);
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(containerRef.current, { display: "none" });
      },
    });

    // Animation timeline
    // Step 1: Text pops in with a bounce
    tl.from(splitChar.chars, {
      duration: 2,
      opacity: 0,
      scale: 0.4,
      y: 20,
      stagger: 0.05,
      ease: "back.out(1.5)",
    })
      // Step 2: Thin lines expand to full block width
      .to(
        blocksRef.current,
        {
          width: blockWidth,
          duration: 1,
          stagger: {
            each: 0.03,
            grid: [numRows, numCols],
            from: "center",
          },
          ease: "power2.out",
        },
        "-=0.3"
      )
      // Step 3: Blocks slide up to reveal page
      .to(blocksRef.current, {
        y: "-100vh",
        duration: 1.2,
        stagger: {
          each: 0.04,
          grid: [numRows, numCols],
          from: "center",
        },
        ease: "power3.in",
      })
      // Step 4: Fade out container
      .to(containerRef.current, {
        opacity: 0,
        duration: 2,
        ease: "power1.out",
      });
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-black z-50 overflow-hidden"
    >
      <span ref={textRef} className="text-xl text-white tracking-[0.6rem] z-10">
        LOADING
      </span>
    </div>
  );
};

export default Loader;
