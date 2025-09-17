import React, { useRef } from "react";
import { ShowCaseCanvas } from "../components/ShowCase";
import {
  TrendingVideo,
  HeadingSection,
  VideoSection,
} from "../components/TrendingVideo";
import { ShortIntroduction } from "../components/Introduction";
import VideoGallery from "../components/CommonShortVideo";
import { Link, useNavigate } from "react-router-dom";
import { TextRevealerOnScroll } from "../components/RevealTextAnimation";
import PageTransition from "../components/PageTransition";
import MobileSizeText from "../components/MobileSizeText";
import Faq from "../components/Faq";
import PjCanvasImg from "../components/PjCanvasImg";
import Footer from "../components/Footer";

const Hero = () => {
  const worktextRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <div className="h-auto max-w-screen min-h-screen w-full">
        <ShowCaseCanvas />
        <VideoSection />
        <div className="w-full max-w-[100vw] h-auto overflow-x-hidden">
          <ShortIntroduction />
        </div>
        <MobileSizeText
          text={`\n \n WORK`}
          className="text-[28vw] hidden max-sm:block"
        />
        <HeadingSection worktextRef={worktextRef} />
        <VideoGallery limit={6} />
        <Faq />
        <Footer />
      </div>
    </>
  );
};

export default PageTransition(Hero);
