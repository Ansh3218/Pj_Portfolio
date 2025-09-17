import gsap from "gsap";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { CiPlay1 } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const iconRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const baseScale = useRef(0.5);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const speed = 0.15;
  const rafId = useRef(null);

  // Smooth cursor movement
  const update = useCallback(() => {
    pos.current.x += (mouse.current.x - pos.current.x) * speed;
    pos.current.y += (mouse.current.y - pos.current.y) * speed;

    const dx = mouse.current.x - pos.current.x;
    const dy = mouse.current.y - pos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const stretch = Math.min(dist / 100, 0.5);
    const scaleX = baseScale.current * (1 + stretch * 1);
    const scaleY = baseScale.current * Math.max(1, 1 - stretch * 5);

    if (cursorRef.current && isVisible) {
      gsap.set(cursorRef.current, {
        x: pos.current.x - 10,
        y: pos.current.y - 10,
        scaleX,
        scaleY,
        rotation: angle,
        transformOrigin: "center center",
      });
    }

    if (iconRef.current && isVisible) {
      gsap.set(iconRef.current, { rotation: -angle });
    }

    rafId.current = requestAnimationFrame(update);
  }, [isVisible]);

  // Hide system cursor and show custom cursor
  const showCustomCursor = useCallback(() => {
    setIsVisible(true);
    document.body.style.cursor = "none";
  }, []);

  // Show system cursor and hide custom cursor
  const hideCustomCursor = useCallback(() => {
    setIsVisible(false);
    document.body.style.cursor = "auto";
  }, []);

  // Video hover handlers
  const enlargeCursorVideo = useCallback(() => {
    showCustomCursor();
    setShowIcon(true);
    setIsPlaying(false); // Show play icon on hover
    gsap.to(baseScale, {
      current: 3,
      duration: 0.4,
      ease: "elastic.out(1, 0.6)",
    });
  }, [showCustomCursor]);

  const shrinkCursorVideo = useCallback(() => {
    const fullscreenBg = document.getElementById("fullscreen-bg");

    if (!fullscreenBg) {
      // No fullscreen, hide cursor completely
      // hideCustomCursor();
      setShowIcon(false);
      setIsPlaying(false);
      gsap.to(baseScale, {
        current: 0.5,
        duration: 0.4,
        ease: "elastic.out(1, 0.6)",
      });
    }
    // If fullscreen is open, keep cursor visible with close icon
  }, [hideCustomCursor]);

  // Handle video click
  const handleVideoClick = useCallback(() => {
    const fullscreenBg = document.getElementById("fullscreen-bg");

    if (fullscreenBg) {
      // Fullscreen is open, will close
      console.log("🖱️ Cursor: Closing fullscreen");
      setIsPlaying(false);
      setShowIcon(true); // Show play icon after closing
    } else {
      // Opening fullscreen
      console.log("🖱️ Cursor: Opening fullscreen");
      setIsPlaying(true);
      setShowIcon(true); // Show close icon
    }
  }, []);

  // Handle fullscreen open
  const handleFullscreenOpen = useCallback(() => {
    showCustomCursor();
    setIsPlaying(true);
    setShowIcon(true);
    gsap.to(baseScale, {
      current: 3,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [showCustomCursor]);

  // Handle fullscreen close
  const handleFullscreenClose = useCallback(() => {
    hideCustomCursor();
    setIsPlaying(false);
    setShowIcon(false);
    gsap.to(baseScale, {
      current: 0.5,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [hideCustomCursor]);

  // Handle fullscreen area hover
  const handleFullscreenHover = useCallback(() => {
    const fullscreenBg = document.getElementById("fullscreen-bg");
    if (fullscreenBg) {
      showCustomCursor();
      setShowIcon(true);
      setIsPlaying(true); // Show close icon in fullscreen
      gsap.to(baseScale, {
        current: 3,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [showCustomCursor]);

  useEffect(() => {
    // Mouse movement handler
    const move = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", move);
    rafId.current = requestAnimationFrame(update);

    // Attach listeners for existing videos
    const videos = document.querySelectorAll("video");
    videos.forEach((el) => {
      el.addEventListener("mouseenter", enlargeCursorVideo);
      el.addEventListener("mouseleave", shrinkCursorVideo);
    });

    // Global cursor functions for component compatibility
    window.cursorEnterVideo = enlargeCursorVideo;
    window.cursorLeaveVideo = shrinkCursorVideo;
    window.cursorClickVideo = handleVideoClick;
    window.cursorFullscreenOpen = handleFullscreenOpen;
    window.cursorFullscreenClose = handleFullscreenClose;

    // Monitor DOM changes for fullscreen
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Handle added nodes (fullscreen opening)
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.id === "fullscreen-bg") {
            handleFullscreenOpen();

            // Add comprehensive hover handling for fullscreen
            const addFullscreenListeners = (element) => {
              element.addEventListener("mouseenter", handleFullscreenHover);
              element.addEventListener("mousemove", handleFullscreenHover);
            };

            // Add to fullscreen background
            addFullscreenListeners(node);

            // Add to video inside fullscreen
            const fullscreenVideo = node.querySelector("video");
            if (fullscreenVideo) {
              fullscreenVideo.addEventListener(
                "mouseenter",
                handleFullscreenHover
              );
              fullscreenVideo.addEventListener(
                "mousemove",
                handleFullscreenHover
              );
            }

            // Add to all divs inside fullscreen
            const containers = node.querySelectorAll("div");
            containers.forEach(addFullscreenListeners);
          }
        });

        // Handle removed nodes (fullscreen closing)
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.id === "fullscreen-bg") {
            handleFullscreenClose();
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", move);
      observer.disconnect();
      document.body.style.cursor = "auto";

      videos.forEach((el) => {
        el.removeEventListener("mouseenter", enlargeCursorVideo);
        el.removeEventListener("mouseleave", shrinkCursorVideo);
      });

      // Clean up global functions
      delete window.cursorEnterVideo;
      delete window.cursorLeaveVideo;
      delete window.cursorClickVideo;
      delete window.cursorFullscreenOpen;
      delete window.cursorFullscreenClose;
    };
  }, [
    update,
    enlargeCursorVideo,
    shrinkCursorVideo,
    handleVideoClick,
    handleFullscreenOpen,
    handleFullscreenClose,
    handleFullscreenHover,
  ]);

  return (
    <div>
      {isVisible && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 rounded-full bg-white bg-blend-difference w-6 h-6 pointer-events-none z-[110] flex items-center justify-center"
          style={{ transformOrigin: "center center" }}
        >
          {showIcon && (
            <div ref={iconRef} className="text-black text-[8px]">
              {isPlaying ? <IoCloseOutline /> : <CiPlay1 />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomCursor;
