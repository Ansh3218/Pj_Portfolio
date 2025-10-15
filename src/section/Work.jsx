import CustomPixelText from "../components/CustomPixelText";
import {
  TrendingVideo,
  HeadingSection,
  LinesSection,
} from "../components/TrendingVideo";
import gsap from "gsap";
import { useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/all";
import CommonShortVideo from "../components/CommonShortVideo";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import MobileSizeText from "../components/MobileSizeText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Work = () => {
  const linesRef = useRef([]);
  const worktextRef = useRef(null);

  return (
    <div className="works-container bg-black w-full h-auto min-h-screen">
      <HeadingSection worktextRef={worktextRef} />
      <div className="">
        <MobileSizeText
          text={`\n  \n WORK`}
          className="hidden max-sm:block max-sm:text-[28vw] pt-3"
        />
      </div>
      <LinesSection linesRef={linesRef} />
      <div className="works-navigate py-10">
        <TrendingVideo triggerRef={linesRef} />
      </div>
      <div className="min-h-full h-auto w-full pb-12">
        <CommonShortVideo />
      </div>
      <Footer />
    </div>
  );
};

export default PageTransition(Work);
