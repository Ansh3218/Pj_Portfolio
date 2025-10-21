import React from "react";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Outlet } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import CustomPixelText from "./CustomPixelText";
import { videos } from "../Data/Video";

const VideoGallery = () => {
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    gsap.fromTo(
      ".hero",
      { height: "60px" },
      {
        height: "550px",
        stagger: 0.2, // har row ke liye stagger
        scrollTrigger: {
          trigger: ".lol",
          start: "top 90%",
          end: "top -150%",
          scrub: true,
        },
      }
    );
  });

  // 2 videos per row
  const rows = [];
  for (let i = 0; i < videos.length; i += 2) {
    rows.push(videos.slice(i, i + 2));
  }

  return (
    <div className="px-[2vw] bg-black">
      <div className="pt-[0vh] max-md:pt-[30vh] max-lg:pt-[45vh]">
        <CustomPixelText
          textString="ALL WORK"
          textAlignments={["left"]}
          fontSizes={["200"]}
          canvasSizes={[{ h: "300", w: "1400" }]}
          gapY={20}
          fontFamily="arial"
        />
      </div>

      <div className="lol mt-[5vh]">
        {rows.map((rowVideos, idx) => (
          <div
            key={idx}
            className="hero w-full mb-[5vh] overflow-hidden"
            style={{ height: "60px" }} // inline style for GSAP animation
          >
            <ProjectCard videos={rowVideos} />
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default VideoGallery;
