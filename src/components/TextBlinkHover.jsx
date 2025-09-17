import gsap from "gsap";
import React, { useRef, useEffect } from "react";

const TextBlinkHover = ({ text = "", className = "" }) => {
  const textRef = useRef();

  useEffect(() => {
    if (!textRef.current) return;

    const firstSpans = textRef.current.querySelectorAll(
      ".char span:first-child"
    );
    const secondSpans = textRef.current.querySelectorAll(
      ".char span:nth-child(2)"
    );

    // second spans ko neeche hi chhupao
    gsap.set(secondSpans, { y: "100%" });

    // 👇 initial reveal sirf first spans ke liye
    gsap.fromTo(
      firstSpans,
      { y: "100%" },
      {
        y: "0%",
        stagger: 0.03,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, []);

  const animateWord = (reverse = false) => {
    const letters = textRef.current.querySelectorAll(".char");

    letters.forEach((char, index) => {
      const [first, second] = char.querySelectorAll("span");

      gsap.to(first, {
        y: reverse ? "0%" : "-100%",
        duration: 0.4,
        delay: index * 0.03,
        ease: "power2.inOut",
      });

      gsap.to(second, {
        y: reverse ? "100%" : "0%",
        duration: 0.4,
        delay: index * 0.03,
        ease: "power2.inOut",
      });
    });
  };

  return (
    <span
      ref={textRef}
      onMouseEnter={() => animateWord(false)}
      onMouseLeave={() => animateWord(true)}
      className={`cursor-pointer select-none flex ${className}`}
    >
      {[...text].map((char, i) => (
        <span
          className="char inline-block relative overflow-hidden h-fit"
          key={i}
        >
          <span className="block">{char}</span>
          <span className="block absolute top-0 left-0 w-full">{char}</span>
        </span>
      ))}
    </span>
  );
};

export default TextBlinkHover;
