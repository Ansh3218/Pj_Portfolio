import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PjCanvasImage from "../../public/assets/Images/Untitled design.png";
import PjImage from "../../public/assets/Images/pjImg.jpg";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH":
      return { ...state, refreshedAt: Date.now() };
    default:
      return state;
  }
};

const PjCanvasImg = () => {
  const [state, dispatch] = useReducer(reducer, {});

  const textRef = useRef(null);
  const maskImgRef = useRef(null);
  const canvasImgRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const tlRef = useRef(null);
  const resizeTimerRef = useRef(null);

  // Memoize text
  const innerText = useMemo(
    () => "You're probably in the right place".toUpperCase(),
    []
  );
  const innerChars = useMemo(() => innerText.split(""), [innerText]);

  // Height calculation (lightweight)
  const getContainerHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return window.innerHeight;
    return el.offsetHeight || window.innerHeight;
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    // ensure previous timeline/ScrollTrigger cleaned (defensive)
    if (tlRef.current) {
      tlRef.current.scrollTrigger && tlRef.current.scrollTrigger.kill();
      tlRef.current.kill();
      tlRef.current = null;
    }

    const maskEl = maskImgRef.current;
    const textEl = textRef.current;
    const bgEl = canvasImgRef.current;

    const chars = container.querySelectorAll(".inner-char");
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    // sizes and values
    const circleSize = isMobile ? "28%" : "32%";
    const finalCircleSize = "100%";
    const scaleVal = isMobile ? 1.04 : 1.1;

    // pre-calc text move distance (memo-like, only on setup/resize)
    const textMoveDistance = isMobile
      ? window.innerHeight - 100
      : Math.max(getContainerHeight() - 150, window.innerHeight / 2);

    // INITIAL GPU-accelerated set
    if (textEl) {
      gsap.set(textEl, {
        y: 0,
        force3D: true,
        willChange: "transform, opacity",
      });
    }
    if (maskEl) {
      gsap.set(maskEl, {
        clipPath: "circle(0% at 50% 50%)",
        force3D: true,
        willChange: "clip-path, transform",
      });
    }
    if (chars && chars.length) {
      gsap.set(chars, { opacity: 0, y: 40, willChange: "transform, opacity" });
    }
    if (bgEl) {
      gsap.set(bgEl, { scale: 1, willChange: "transform" });
    }

    // Create timeline AFTER setting initial states
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: isMobile ? "+=1800" : "+=2600",
        scrub: 1.1,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });
    tlRef.current = tl;

    // TEXT move: split into two linear/nothing-ease steps for first heavy movement
    // First step: linear (no easing) so it's frame-perfect with scroll
    tl.to(
      textEl,
      {
        y: textMoveDistance * 0.5,
        ease: "none",
        duration: 0.6,
        immediateRender: false,
      },
      0
    ).to(
      textEl,
      {
        y: textMoveDistance,
        ease: "none",
        duration: 0.6,
        immediateRender: false,
      },
      ">",
    );

    // Mask expansion & bg scale + text fade and characters reveal
    tl.to(
      maskEl,
      {
        clipPath: `circle(${circleSize} at 50% 50%)`,
        ease: "power2.inOut",
        duration: 0.9,
      },
      "-=0.5"
    )
      .to(
        textEl,
        {
          opacity: 0,
          duration: 0.35,
        },
        "-=0.25"
      )
      .to(
        bgEl,
        {
          scale: scaleVal,
          duration: 0.8,
          ease: "power2.out",
          transformOrigin: "center center",
        },
        "-=0.5"
      )
      .to(
        maskEl,
        {
          clipPath: `circle(${finalCircleSize} at 50% 50%)`,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .to(
        chars,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: isMobile ? 0.009 : 0.015,
          ease: "power3.out",
        },
        "-=0.2"
      );

    // Resize handling (throttled)
    const handleResize = () => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        // recalc and update ScrollTrigger / timeline if needed
        try {
          ScrollTrigger.refresh();
          dispatch({ type: "REFRESH" });
        } catch (e) {
          // ignore refresh errors gracefully
          // console.warn("ScrollTrigger refresh error", e);
        }
      }, 220);
    };
    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimerRef.current);

      // Kill timeline & its ScrollTrigger safely
      try {
        if (tlRef.current) {
          tlRef.current.scrollTrigger && tlRef.current.scrollTrigger.kill();
          tlRef.current.kill();
          tlRef.current = null;
        }
      } catch (e) {
        // ignore kill errors
      }
    };
  }, [innerChars, getContainerHeight, dispatch]);

  return (
    <>
      <div ref={wrapperRef} className="w-full" style={{ height: "100vh" }}>
        <div
          ref={containerRef}
          className="w-full h-screen relative text-white bg-black overflow-hidden"
          style={{ position: "sticky", top: 0 }}
        >
          {/* Background image */}
          <img
            ref={canvasImgRef}
            src={
              typeof window !== "undefined" && window.innerWidth <= 640
                ? "/public/assets/Images/PjCanvas_mobile.png"
                : PjCanvasImage
            }
            alt="canvas bg"
            className="h-full w-full object-cover"
            style={{ transformOrigin: "center center" }}
          />

          {/* Mask */}
          <div
            ref={maskImgRef}
            className="absolute top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center"
            style={{ clipPath: "circle(0% at 50% 50%)" }}
          >
            <img
              src={PjImage}
              alt="masked pj"
              className="w-full h-full object-cover"
            />

            <div className="absolute text-center text-6xl font-bold text-gray-400 max-sm:text-4xl max-sm:px-2">
              <p>
                {innerChars.map((c, i) => (
                  <span key={i} className="inner-char inline-block">
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Main text */}
          <div
            ref={textRef}
            className="absolute top-40 left-1/2 -translate-x-1/2 text-center text-7xl font-bold leading-[1.1] tracking-tight z-10 max-sm:text-4xl max-sm:top-32 max-sm:w-full"
          >
            IN A WORLD FULL
            <br className="max-sm:hidden" />
            <span className="max-sm:block">OF NOISE</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-black text-white">
        <Footer />
      </div>
    </>
  );
};

export default PjCanvasImg;
