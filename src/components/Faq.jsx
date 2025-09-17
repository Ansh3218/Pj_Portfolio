import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import React, { useEffect, useRef, useState } from "react";
import CustomPixelText from "./CustomPixelText";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

// Single FAQ item
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    const iconPath = iconRef.current.querySelector("#icon-path");

    gsap.to(iconPath, {
      morphSVG: open ? "M5 12h14" : "M12 5v14m7-7H5",
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [open]);

  return (
    <div className="border border-gray-700 mb-6 rounded-lg overflow-hidden w-full bg-gray-900 shadow-lg">
      {/* Question Row */}
      <button
        className="w-full flex items-center justify-between px-8 py-5 text-left font-semibold text-xl text-white bg-black hover:bg-gray-800 transition-colors duration-300"
        onClick={() => setOpen(!open)}
      >
        <span className="text-3xl max-sm:text-lg">{question}</span>
        <div className="relative w-6 h-6">
          <svg
            ref={iconRef}
            className="w-6 h-6 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path id="icon-path" d="M12 5v14m7-7H5" />
          </svg>
        </div>
      </button>

      {/* Answer Expand */}
      <div
        className={`transition-all duration-500 ease-in-out px-6 ${
          open ? "max-h-96 py-4 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden text-gray-300`}
      >
        <p className="text-xl leading-relaxed max-sm:text-xs">{answer}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  const questionRef1 = useRef(null);
  const questionRef2 = useRef(null);

  const faqs = [
    {
      question: "How do you edit a video from start to finish?",
      answer:
        "I import the raw footage, cut unnecessary parts, add effects, correct colors, fix audio, and finally export in high quality.",
    },
    {
      question: "Which software do you use for video editing?",
      answer: "I mainly use Adobe Premiere Pro and After Effects for editing.",
    },
  ];

  // Animate main heading
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".text-container",
        start: "top 80%",
        end: "bottom 50%",
        scrub: true,
      },
    });

    tl.fromTo(
      questionRef1.current,
      { x: -300, opacity: 0 },
      { x: 0, opacity: 1, ease: "power3.out" },
      0
    );

    tl.fromTo(
      questionRef2.current,
      { x: 300, opacity: 0 },
      { x: 0, opacity: 1, ease: "power3.out" },
      0
    );
  }, []);

  return (
    <div className="w-full min-h-full h-auto text-white bg-gray-950">
      {/* Animated heading */}
      <div className="text-container text-center">
        <div ref={questionRef1} className="pt-32">
          <CustomPixelText
            textString="QUESTION"
            fontSizes={[220]}
            fontFamily="arial"
            fontWeight=""
            textAlignments={["center"]}
            canvasSizes={[{ w: 1520, h: 200 }]}
          />
        </div>
        <div ref={questionRef2}>
          <CustomPixelText
            textString="EVERYTHING"
            fontSizes={[200]}
            fontWeight=""
            fontFamily="arial"
            textAlignments={["center"]}
            canvasSizes={[{ w: 1520, h: 200 }]}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="FAQ border-t-2 border-gray-700 w-full h-auto min-h-screen py-28 px-4">
        <div className="mx-auto max-w-6xl max-sm:text-lg">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
