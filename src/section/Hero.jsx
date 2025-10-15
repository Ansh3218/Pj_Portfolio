import React, { useRef } from "react";
import { ShowCaseCanvas } from "../components/ShowCase";
import {
  VideoSection,
} from "../components/TrendingVideo";
import { ShortIntroduction } from "../components/Introduction";
import PageTransition from "../components/PageTransition";
import MobileSizeText from "../components/MobileSizeText";
import Faq from "../components/Faq";
import Footer from "../components/Footer";

const Hero = () => {
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
        {/* <HeadingSection worktextRef={worktextRef} /> */}
        <Faq />
        <Footer />
      </div>
    </>
  );
};

export default PageTransition(Hero);
