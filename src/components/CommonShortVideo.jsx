import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { CiPlay1 } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

import Typography from "../../public/assets/Video/Typography.mp4";
import Bat_Short_Video from "../../public/assets/Video/Bat Gauge.mp4";
import { TextRevealerOnScroll } from "./RevealTextAnimation";

const VideoCard = ({ videoSrc, title, text, variant = "landscape" }) => {
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const borderRef = useRef(null);
  const tl = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useLayoutEffect(() => {
    if (!textRef.current || !videoRef.current || !borderRef.current) return;

    let split = null;
    try {
      split = new SplitType(textRef.current, { types: "chars" });
    } catch (e) {
      console.error("SplitType initialization failed:", e);
      return;
    }
    const chars = split.chars;

    tl.current = gsap.timeline({ paused: true });

    if (chars?.length) {
      tl.current.to(chars, {
        opacity: 0,
        z: 500,
        scale: 0,
        stagger: { each: 0.02, from: "random" },
        duration: 0.5,
        ease: "power3.out",
      });
    }

    tl.current.to(
      borderRef.current,
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      0
    );

    const videoElement = videoRef.current;
    const handleMouseEnter = () => {
      tl.current?.play();
      videoElement.play().catch((e) => console.error("Video play failed:", e));
      // Use global cursor functions instead of local cursor
      if (window.cursorEnterVideo && window.innerWidth >= 640) {
        window.cursorEnterVideo();
      }
    };

    const handleMouseLeave = () => {
      tl.current?.reverse();
      videoElement.pause();
      // Use global cursor functions
      if (window.cursorLeaveVideo && window.innerWidth >= 640) {
        window.cursorLeaveVideo();
      }
    };

    videoElement.addEventListener("mouseenter", handleMouseEnter);
    videoElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      split?.revert();
      tl.current?.kill();
      videoElement.removeEventListener("mouseenter", handleMouseEnter);
      videoElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const isPortrait = variant === "portrait";

  const cardWidth = isPortrait
    ? "w-[400px] min-h-[30rem] max-sm:w-full max-sm:min-h-[25rem]"
    : "w-[400px] min-h-[30rem] max-sm:w-full max-sm:min-h-[25rem]";

  const videoClass = isPortrait
    ? "w-full h-[500px] object-cover max-sm:h-[400px]"
    : "w-full h-[350px] object-cover max-sm:h-[250px]";

  const expandedClass = isPortrait
    ? "w-auto h-[80vh] max-sm:w-full max-sm:h-[60vh]"
    : "w-[80vw] h-auto max-w-5xl max-sm:w-[90vw] max-sm:h-auto";

  // 🔥 Expanded Mode Open
  const openExpanded = () => {
    setIsExpanded(true);
    setIsMuted(false);
    // Notify cursor about fullscreen opening
    if (window.cursorFullscreenOpen) {
      window.cursorFullscreenOpen();
    }
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.error("Video play failed:", e));
    }
  };

  // ❌ Expanded Mode Close
  const closeExpanded = () => {
    setIsExpanded(false);
    setIsMuted(true);
    // Notify cursor about fullscreen closing
    if (window.cursorFullscreenClose) {
      window.cursorFullscreenClose();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    if (!isExpanded) {
      openExpanded();
    }
    // Notify cursor about video click
    if (window.cursorClickVideo) {
      window.cursorClickVideo();
    }
  };

  const handleExpandedClick = (e) => {
    e.stopPropagation();
    closeExpanded();
    // Notify cursor about closing
    if (window.cursorClickVideo) {
      window.cursorClickVideo();
    }
  };

  return (
    <div className="video-container grid justify-center group text-gray-100">
      <div
        className={`flex flex-col justify-between overflow-hidden relative bg-transparent rounded-lg ${cardWidth}`}
      >
        <div className="video-details p-3 flex flex-col items-start gap-y-2.5 max-sm:p-2">
          <div
            ref={borderRef}
            className="border-t-2 border-white w-full"
            style={{ opacity: 0.2 }}
          ></div>
          <TextRevealerOnScroll
            reverseOnScroll={true}
            className="py-5 font-bold text-4xl max-sm:text-2xl max-sm:py-3"
            text={title}
            key={title}
          />
          <p
            ref={textRef}
            className="pt-6 py-3 text-justify text-lg max-sm:text-base max-sm:pt-3"
          >
            {text}
          </p>
        </div>
        <div className="flex items-center flex-wrap justify-center bg-black relative overflow-hidden rounded-2xl">
          <video
            ref={videoRef}
            src={videoSrc}
            className={`transition-all duration-200 hover:scale-110 cursor-none ${videoClass}`}
            loop
            muted={isMuted}
            playsInline
            onClick={handleVideoClick}
          />
        </div>
      </div>

      {/* 🌟 Expanded Video Overlay */}
      {isExpanded && (
        <div
          id="fullscreen-bg"
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[55] cursor-none"
          onClick={handleExpandedClick}
        >
          <div
            className="relative cursor-none"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={videoSrc}
              className={`${expandedClass} rounded-2xl cursor-none`}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onClick={handleExpandedClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const VideoGallery = ({ limit }) => {
  const videos = [
    {
      videoSrc: Typography,
      title: "Landscape Video 1",
      text: "Lorem ipsum Landscape 1",
    },
    {
      videoSrc: Typography,
      title: "Landscape Video 2",
      text: "Lorem ipsum Landscape 2",
    },
    {
      videoSrc: Typography,
      title: "Landscape Video 3",
      text: "Lorem ipsum Landscape 3",
    },
    {
      videoSrc: Bat_Short_Video,
      title: "Portrait Video 1",
      text: "Lorem ipsum Portrait 1",
    },
  ];

  const displayedVideos = limit ? videos.slice(0, limit) : videos;

  return (
    <div className="grid grid-cols-3 gap-8 p-5 max-sm:grid-cols-1 max-sm:gap-6 max-sm:p-3">
      {displayedVideos.map((video, index) => (
        <VideoCard
          key={`video-${index}`}
          videoSrc={video.videoSrc}
          title={video.title}
          text={video.text}
          variant={video.title.includes("Portrait") ? "portrait" : "landscape"}
        />
      ))}
    </div>
  );
};

export default VideoGallery;
