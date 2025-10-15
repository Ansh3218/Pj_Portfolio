import { Link, useLocation } from "react-router-dom";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import TextHover from "./TextBlinkHover";

const ActiveLink = ({ to = "/", label = "", onClick, key }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const lineRef = useRef();
  const hoverTweenRef = useRef(null);

  // Ensure global transition state
  if (!window.transitionState) {
    window.transitionState = {
      isTransitioning: false,
      pendingRoute: null,
      startTransition: null,
    };
  }

  // Set line for active link
  useLayoutEffect(() => {
    if (lineRef.current) {
      gsap.set(lineRef.current, {
        scaleX: isActive ? 1 : 0,
        transformOrigin: isActive ? "center" : "left",
      });
    }
  }, [isActive]);

  const handleMouseEnter = () => {
    if (!isActive && lineRef.current) {
      hoverTweenRef.current?.kill();
      hoverTweenRef.current = gsap.to(lineRef.current, {
        scaleX: 1,
        transformOrigin: "left",
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          hoverTweenRef.current = null;
        },
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isActive && lineRef.current) {
      hoverTweenRef.current?.kill();
      hoverTweenRef.current = gsap.to(lineRef.current, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          hoverTweenRef.current = null;
        },
      });
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    // Ignore click if already transitioning
    if (window.transitionState.isTransitioning) return;

    // Same route clicked → pulse animation
    if (isActive) {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 1 },
        { scaleX: 0.8, yoyo: true, repeat: 1, duration: 0.2 }
      );
      return;
    }

    // Store pending route and trigger transition
    window.transitionState.pendingRoute = to;
    if (window.transitionState.startTransition) {
      window.transitionState.startTransition(to);
    }

    if (onClick) onClick();
  };

  return (
    <Link
      to={to}
      key={key || to}
      className="relative px-0 py-1 inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <TextHover
        text={label}
        disableBlink={isActive}
        className="text-gray-100 font-semibold text-lg max-sm:text-xs"
      />
      <span
        ref={lineRef}
        className="absolute top-0 left-0 h-[3px] w-full bg-[#FFFFFF]"
      />
    </Link>
  );
};

export default ActiveLink;
