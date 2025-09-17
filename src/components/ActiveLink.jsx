// import { Link, useLocation } from "react-router-dom";
// import { useRef, useEffect } from "react";
// import gsap from "gsap";
// import TextHover from "./TextBlinkHover";

// const ActiveLink = ({ to = "/", label = "", onClick }) => {

//   const location = useLocation();
//   const isActive = location.pathname === to;
//   const lineRef = useRef();

//   useEffect(() => {
//     if (isActive) {
//       gsap.set(lineRef.current, { scaleX: 1, transformOrigin: "center" });
//     } else {
//       gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left" });
//     }
//   }, [isActive]);

//   const handleMouseEnter = () => {
//     if (!isActive) {
//       gsap.fromTo(
//         lineRef.current,
//         { scaleX: 0, transformOrigin: "left" },
//         { scaleX: 1, duration: 0.4, ease: "power2.out" }
//       );
//     }
//   };

//   const handleMouseLeave = () => {
//     if (!isActive) {
//       gsap.to(lineRef.current, {
//         scaleX: 0,
//         transformOrigin: "right",
//         duration: 0.4,
//         ease: "power2.in",
//       });
//     }
//   };

//   return (
//     <Link
//       to={to}
//       className="relative px-0 py-1 inline-block"
//       onClick={onClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <TextHover
//         text={label}
//         disableBlink={isActive}
//         className="text-[#ABAB99] font-semibold text-lg"
//       />

//       {/* underline */}
//       <span
//         ref={lineRef}
//         className="absolute top-0 left-0 h-[3px] w-full bg-[#ABAB99]"
//       ></span>
//     </Link>
//   );
// };

// export default ActiveLink;

// ActiveLink.jsx - Updated for controlled navigation

import { Link, useLocation } from "react-router-dom";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import TextHover from "./TextBlinkHover";

const ActiveLink = ({ to = "/", label = "", onClick, key }) => {
  const location = useLocation();
  const isActive = location.pathname === to; // check if current route is active
  const lineRef = useRef(); // reference for the underline element
  const activeTweenRef = useRef(null); // GSAP animation reference for active state
  const hoverTweenRef = useRef(null); // GSAP animation reference for hover effect

  // Initialize global transition state if not already created
  if (!window.transitionState) {
    window.transitionState = {
      isTransitioning: false,
      pendingRoute: null,
      startTransition: null,
    };
  }

  // Runs whenever active route changes
  useLayoutEffect(() => {
    if (lineRef.current) {
      // Kill any existing active animation
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
      }
      // Instantly set underline based on whether this link is active or not
      activeTweenRef.current = gsap.set(lineRef.current, {
        scaleX: isActive ? 1 : 0,
        transformOrigin: isActive ? "center" : "left",
      });
    }
  }, [isActive]);

  // When mouse enters (hover start)
  const handleMouseEnter = () => {
    if (!isActive && lineRef.current && !hoverTweenRef.current) {
      // Animate line from left to right
      hoverTweenRef.current = gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            hoverTweenRef.current = null;
          },
        }
      );
    }
  };

  // When mouse leaves (hover end)
  const handleMouseLeave = () => {
    if (!isActive && lineRef.current && hoverTweenRef.current) {
      // Kill ongoing hover animation
      hoverTweenRef.current.kill();
      // Animate line back to hidden (shrink to right)
      hoverTweenRef.current = gsap.to(lineRef.current, {
        scaleX: 0,
        transformOrigin: "right",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          hoverTweenRef.current = null;
        },
      });
    }
  };

  // Handle link click
  const handleClick = (e) => {
    e.preventDefault();

    // If a transition is already in progress → ignore click
    if (window.transitionState.isTransitioning) {
      console.log("[ActiveLink] ❌ Click ignored - transition already running");
      return;
    }

    // If clicked on the same active route
    if (isActive) {
      console.log("[ActiveLink] 🔁 Same route clicked - skipping navigate");
      // Small pulse animation to indicate feedback
      gsap.fromTo(
        lineRef.current,
        { scaleX: 1 },
        { scaleX: 0.8, yoyo: true, repeat: 1, duration: 0.2 }
      );
      return;
    }

    console.log("[ActiveLink] ✅ Starting transition to:", to);

    // Store pending route in global transition state
    window.transitionState.pendingRoute = to;

    // Start transition if function is defined
    if (window.transitionState.startTransition) {
      window.transitionState.startTransition(to);
    }

    // Call parent onClick handler if passed
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      to={to}
      key={key || to}
      className="relative px-0 py-1 inline-block"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Text label with hover effect → text color changed to white */}
      <TextHover
        text={label}
        disableBlink={isActive}
        className="text-gray-100 font-semibold text-lg max-sm:text-xs"
      />
      {/* Underline animation bar → color changed to white */}
      <span
        ref={lineRef}
        className="absolute top-0 left-0 h-[3px] w-full bg-[#FFFFFF]"
      />
    </Link>
  );
};

export default ActiveLink;
