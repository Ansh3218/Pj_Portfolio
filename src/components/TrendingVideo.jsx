import React, {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SplitType from "split-type";
import TrendingVideoPreview from "../../public/assets/Video/pj_trending.mp4";
import { TextRevealerOnScroll } from "./RevealTextAnimation";
import CustomPixelText from "./CustomPixelText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const TrendingVideo = () => {
  const videoTextRef = useRef(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    if (imgRef.current) {
      imgRef.current.play();
      imgRef.current.muted = true;
    }
    if (window.cursorFullscreenClose) window.cursorFullscreenClose();
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (isFullscreen && e.target.tagName?.toLowerCase() !== "video") {
        closeFullscreen();
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [isFullscreen, closeFullscreen]);

  const handleMouseEnter = () => {
    if (window.cursorEnterVideo) window.cursorEnterVideo();
  };

  const handleMouseLeave = () => {
    if (window.cursorLeaveVideo) window.cursorLeaveVideo();
  };

  return (
    <div className="w-full h-[300vh] relative max-sm:h-[150vh]" ref={wrapRef}>
      <div className="text-gray-100 h-full relative w-full">
        <VideoSection
          videoRef={videoRef}
          imgRef={imgRef}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
        <div className="w-full h-[60%] absolute bottom-0 left-0">
          <StatsSection />
          <DescriptionSection videoTextRef={videoTextRef} />
        </div>
      </div>
    </div>
  );
};

// ================== HEADING SECTION ==================
export const HeadingSection = ({ worktextRef }) => {
  useEffect(() => {
    if (!worktextRef?.current) return;

    const tween = gsap.fromTo(
      worktextRef.current,
      { opacity: 1, y: 0, scale: 1 },
      {
        opacity: 0,
        y: 500,
        scale: 2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: worktextRef.current,
          start: "top top",
          end: "bottom 20%",
          scrub: 0.5,
          onLeave: () => {
            worktextRef.current.style.visibility = "hidden";
          },
          onEnterBack: () => {
            worktextRef.current.style.visibility = "visible";
          },
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [worktextRef]);

  return (
    <>
      <div
        ref={worktextRef}
        className="w-full h-full sticky top-0 z-0 block max-sm:hidden"
      >
        <CustomPixelText
          textString="WORK"
          fontSizes={[420]}
          canvasSizes={[{ w: 1400, h: 550 }]}
          gapY={-70}
          strokeWidth={0.4}
          textAlignments={["center"]}
          fontFamily="arial"
        />
      </div>
    </>
  );
};

// ================== LINES SECTION ==================
export const LinesSection = ({ linesRef }) => {
  useEffect(() => {
    const linetargets = linesRef.current;
    if (!linetargets || !linetargets.length) return;

    const splitLines = linetargets.map(
      (line) => new SplitText(line, { type: "chars" })
    );

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: linetargets[0],
        start: "top 60%",
        end: "top 0%",
        toggleActions: "play none none reverse",
      },
    });

    splitLines.forEach((split) => {
      tl1.fromTo(
        split.chars,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1.2,
          duration: 0.6,
          ease: "power3.out",
          stagger: { each: 0.035, from: "random" },
        },
        0
      );
    });

    linetargets.forEach((line) => {
      gsap.to(line, {
        y: -50,
        scale: 1.5,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: line,
          start: "top 10%",
          end: "top 0%",
          scrub: 0.5,
        },
      });
    });

    return () => {
      splitLines.forEach((split) => split.revert());
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl1.kill();
    };
  }, [linesRef]);

  return (
    <div className="text-[#ABAB99] text-2xl font-semibold text-center p-5 py-10 max-sm:py-10">
      {[
        "We craft cinematic edits that adapt to every vision",
        "turning raw footage into compelling stories,",
        "with precision and creativity",
      ].map((text, i) => (
        <p
          key={i}
          ref={(el) => (linesRef.current[i] = el)}
          className="mb-4 tracking-wider max-sm:p-0 max-sm:text-[3vw] max-sm:mb-1 "
        >
          {text}
        </p>
      ))}
    </div>
  );
};

// ================== VIDEO SECTION ==================
export const VideoSection = ({
  videoRef,
  imgRef,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  useLayoutEffect(() => {
    if (!videoRef?.current || !imgRef?.current) return;

    // check if mobile
    if (window.innerWidth <= 640) {
      // Mobile -> No GSAP effects
      return;
    }

    // ✅ Only desktop/laptop/tablet ke liye GSAP chalega
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: videoRef.current,
        start: "top top",
        end: "bottom -800",
        scrub: true,
        onEnter: () =>
          gsap.to(videoRef.current, { autoAlpha: 1, duration: 0.3 }),
        onLeave: () =>
          gsap.to(videoRef.current, { autoAlpha: 0, duration: 0.3 }),
        onEnterBack: () =>
          gsap.to(videoRef.current, { autoAlpha: 1, duration: 0.3 }),
        onLeaveBack: () =>
          gsap.to(videoRef.current, { autoAlpha: 1, duration: 0.3 }),
      });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const videoWidth = 320;
      const videoHeight = 200;
      const centerX = windowWidth / 2 - videoWidth / 2 - 40;
      const centerY = windowHeight / 2 - videoHeight / 2 - 24;

      gsap.to(imgRef.current, {
        x: centerX,
        y: -centerY,
        scaleX: 4.2,
        scaleY: 3.8,
        ease: "none",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 40%",
          end: "top -50%",
          scrub: true,
          onLeave: () => {
            if (!videoRef.current) return;
            const rect = videoRef.current.getBoundingClientRect();
            const scrollTop =
              window.scrollY || document.documentElement.scrollTop;
            const parentRect =
              videoRef.current.parentElement.getBoundingClientRect();
            const parentScrollTop = parentRect.top + scrollTop;
            videoRef.current.style.position = "absolute";
            videoRef.current.style.top = `${
              rect.top + scrollTop - parentScrollTop
            }px`;
            videoRef.current.style.left = `${rect.left}px`;
            videoRef.current.style.bottom = "auto";
          },
          onEnterBack: () => {
            if (!videoRef.current) return;
            videoRef.current.style.position = "fixed";
            videoRef.current.style.bottom = "24px";
            videoRef.current.style.left = "40px";
            videoRef.current.style.top = "auto";
          },
        },
      });
    }, videoRef);

    const handleResize = () => ScrollTrigger.refresh(true);
    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, [videoRef, imgRef]);

  return (
    <div
      ref={videoRef}
      className="z-[50] cursor-pointer 
           fixed bottom-6 left-10 h-[200px] w-[320px] 
           max-sm:relative max-sm:bottom-auto max-sm:left-auto max-sm:h-[400px] max-sm:w-[100vw] max-sm:px-2"
    >
      <video
        ref={imgRef}
        src={TrendingVideoPreview}
        autoPlay
        loop
        muted
        controls={false}
        className="w-full h-full object-cover rounded-2xl shadow-lg origin-center will-change-transform cursor-pointer"
        onClick={() => {
          window.open(
            "https://youtu.be/IBvO4Td7SO4?si=O5q5ZI-0CJ4rsuHK",
            "_blank"
          );
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

// ================== STATS SECTION ==================
export const StatsSection = () => {
  return (
    <div className="pt-11 h-[15%] w-full">
      <div className="text-center flex justify-around items-center border-blue-500">
        <h1 className="text-5xl font-bold max-sm:text-lg">
          <TextRevealerOnScroll
            reverseOnScroll={true}
            text="1.1M+"
            className="stat-heading leading-14 max-sm:leading-10"
          />
          <TextRevealerOnScroll
            reverseOnScroll={true}
            className="font-light text-2xl stat-heading max-sm:text-xs"
            text="Views"
          />
        </h1>
        <h1 className="text-5xl font-bold max-sm:text-lg">
          <TextRevealerOnScroll
            text="76K+"
            reverseOnScroll={true}
            className="stat-heading leading-14 max-sm:leading-10"
          />
          <TextRevealerOnScroll
            reverseOnScroll={true}
            className="font-light text-2xl stat-heading max-sm:text-xs"
            text="Likes"
          />
        </h1>
        <h1 className="text-5xl font-bold max-sm:text-lg">
          <TextRevealerOnScroll
            text="22.2K+"
            reverseOnScroll={true}
            className="stat-heading leading-14 max-sm:leading-10"
          />
          <TextRevealerOnScroll
            reverseOnScroll={true}
            className="font-light text-2xl stat-heading max-sm:text-xs"
            text="Cross Platform Followers"
          />
        </h1>
      </div>
    </div>
  );
};

// ================== DESCRIPTION SECTION ==================
export const DescriptionSection = ({ videoTextRef }) => {
  useLayoutEffect(() => {
    if (!videoTextRef?.current) return;

    // Agar screen size mobile hai (<= 640px) to animation skip karo
    if (window.innerWidth <= 640) return;

    const splits = [];
    const ctx = gsap.context(() => {
      const paras = document.querySelectorAll(".videoDetailsPara");
      paras.forEach((para) => {
        const split = new SplitType(para, { types: "chars" });
        splits.push(split);
        const chars = split.chars;

        const charGroups = [
          chars.slice(0, Math.ceil(chars.length / 4)),
          chars.slice(Math.ceil(chars.length / 4), Math.ceil(chars.length / 2)),
          chars.slice(
            Math.ceil(chars.length / 2),
            Math.ceil((3 * chars.length) / 4)
          ),
          chars.slice(Math.ceil((3 * chars.length) / 4)),
        ];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: para,
            start: "top 100%",
            end: "bottom 50%",
            scrub: 0.2,
            markers: true,
            toggleActions: "play none none reverse",
          },
        });

        const animations = [
          {
            x: 80,
            y: -30,
            scale: 0.85,
            rotate: 3,
            filter: "blur(3px)",
            duration: 0.6,
          },
          {
            x: -80,
            y: -30,
            scale: 0.85,
            rotate: -3,
            filter: "blur(3px)",
            duration: 0.6,
          },
          {
            x: 80,
            y: 30,
            scale: 0.9,
            rotate: 2,
            filter: "blur(3px)",
            duration: 0.8,
          },
          {
            x: -80,
            y: 30,
            scale: 0.9,
            rotate: -2,
            filter: "blur(3px)",
            duration: 0.8,
          },
        ];

        charGroups.forEach((group, groupIndex) => {
          const anim = animations[groupIndex % animations.length];
          tl.from(
            group,
            {
              ...anim,
              opacity: 0,
              stagger: 0.015,
              ease: "power2.inOut",
              onComplete: () => gsap.set(group, { filter: "blur(0px)" }),
            },
            groupIndex * 0.15
          );
        });
      });
    }, videoTextRef);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [videoTextRef]);

  return (
    <div className="text-[42px] text-start overflow-hidden font-[arial] tracking-wide leading-11 flex flex-col justify-start w-full h-full max-sm:leading-5 max-sm:text-[12px] max-sm:justify-center max-sm:pt-8">
      <span className="w-full h-[40%] relative flex items-center px-12 max-sm:px-5 max-sm:items-end">
        <span
          className="w-1/2 h-1/2 mix-blend-difference text-justify p-16 pl-0 videoDetailsPara max-sm:p-0 max-sm:text-left max-sm:h-full"
          ref={videoTextRef}
        >
          <p className="max-sm:text-justify">
            This video has been created with the purpose of spreading
          </p>
          <p className="max-sm:text-justify">
            awareness along with providing entertainment.
          </p>
        </span>
        <span className="h-1/2 w-1/2 relative text-justify p-16 pr-0 videoDetailsPara max-sm:p-0">
          <p>I have no intention of hurting any religious sentiments, as I</p>
          <p>believe that the Divine resides in everyone.</p>
        </span>
      </span>
      <span className="w-full h-[40%] flex items-end px-12 max-sm:px-5 max-sm:h-1/2 max-sm:items-end">
        <span className="w-1/2 h-full p-16 pl-0 relative videoDetailsPara max-sm:p-0">
          <p className="max-sm:text-justify">
            However, what is wrong must be shown as wrong. Since it is a
          </p>
          <p className="max-sm:text-justify">
            film, creative liberty has been taken in the final scene to
          </p>
          <p className="max-sm:text-justify">depict the Waqf Amendment Bill</p>
        </span>
        <span className="text-justify relative w-1/2 h-full p-16 pr-0 videoDetailsPara max-sm:p-0 max-sm:h-1/2">
          <p>Since it is a film, creative liberty has been taken in the</p>
          <p>destroying the unlimited powers of the Waqf Board.</p>
        </span>
      </span>
    </div>
  );
};
