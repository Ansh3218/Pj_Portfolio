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
    // Har row ko individually animate karo
    gsap.utils.toArray(".hero").forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          height: "100px",
          opacity: 0.5,
        },
        {
          height: "600px",
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 95%", // jab element bottom me aye tab start
            end: "top 20%", // jab element top pe aye tab end
            scrub: 1,
            // markers: true, // debugging ke liye uncomment karo
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
  }, []);

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
            style={{ height: "100px" }} // initial height
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
