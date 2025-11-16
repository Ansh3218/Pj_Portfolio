import React from "react";
import CustomPixelText from "./CustomPixelText";
import MobileSizeText from "./MobileSizeText";
import { TextRevealer, TextRevealerOnScroll } from "./RevealTextAnimation";

export const LongIntroduction = () => {
  return (
    <div className="w-full h-auto bg-black">
      {/* Desktop Layout */}
      <div className="about w-full min-h-[100vh] h-auto text-center text-gray-300 font-semibold font-[poppins] flex items-center justify-center gap-y-4 max-sm:hidden py-28">
        <div className="text-center">
          <div className="text-lg text-gray-400 font-semibold font-[poppins]">
            <h1 className="pr-10">(About)</h1>
          </div>

          <TextRevealerOnScroll
            duration={3}
            text={`Hey, I’m Prashant Joshi a storyteller who just happens to use video editing as the medium. My journey kicked off in 2018, editing my own dance choreography videos on Kinemaster. What started as a hobby slowly grew into a full-time craft, and today I work with industry-standard tools like Premiere Pro and After Effects, editing for creators, filmmakers, and brands. Over the years, I’ve worked with 50+ clients from different corners of India ( and a few abroad too ) Most of my projects revolve around films and content creators both short and long form but I’ve also collaborated with businesses, and I’m looking to expand more in that space. One of the highlights of my journey so far has been a short film I created that went viral across multiple social media platforms, crossing millions of views and 1.1 Million+ on my own YouTube channel. That project made me realize how powerful editing can be when storytelling and visuals click perfectly. At the end of the day, for me, editing isn’t just about cuts, transitions, or effects it’s about shaping emotions, simplifying complex ideas, and creating videos that leave a lasting impact. Whether it’s a 15-second reel or a 15-minute film, I bring the same passion into every frame`}
            className="text-lg text-justify m-auto border-r-2 pt-10 pr-10 border-gray-300 w-[80%] px-6"
          ></TextRevealerOnScroll>
        </div>

        <div className="relative">
          <p className="absolute left-40 text-xl text-gray-400">
            learning, experimenting, <br /> + years of experience
          </p>
          <CustomPixelText
            textString="5"
            textAlignments={["left"]}
            fontSizes={["250"]}
            canvasSizes={[{ h: "250", w: "700" }]}
            gapY={-300}
            fontFamily="poppins"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="hidden max-sm:flex max-sm:flex-col max-sm:min-h-[100vh] max-sm:w-full max-sm:bg-black max-sm:text-gray-300 max-sm:p-4">
        {/* About Section */}
        <div className="max-sm:text-center max-sm:mb-8 max-sm:pt-8">
          <div className="max-sm:text-lg max-sm:text-gray-400 max-sm:font-semibold max-sm:font-[poppins] max-sm:mb-6">
            <h1>(About)</h1>
          </div>

          <p className="max-sm:text-base max-sm:text-justify max-sm:px-4 max-sm:leading-relaxed max-sm:border-l-2 max-sm:border-gray-300 max-sm:pl-4">
            Hey, I’m Prashant Joshi —a storyteller who just happens to use video
            editing as the medium. My journey kicked off in 2018, editing my own
            dance choreography videos on Kinemaster. What started as a hobby
            slowly grew into a full-time craft, and today I work with
            industry-standard tools like Premiere Pro and After Effects, editing
            for creators, filmmakers, and brands. Over the years, I’ve worked
            with 50+ clients from different corners of India (and a few abroad
            too). Most of my projects revolve around films and content
            creators—both short and long form—but I’ve also collaborated with
            businesses, and I’m looking to expand more in that space. One of the
            highlights of my journey so far has been a short film I created that
            went viral across multiple social media platforms, crossing millions
            of views and 1.1 Million+ on my own YouTube channel. That project
            made me realize how powerful editing can be when storytelling and
            visuals click perfectly. At the end of the day, for me, editing
            isn’t just about cuts, transitions, or effects—it’s about shaping
            emotions, simplifying complex ideas, and creating videos that leave
            a lasting impact. Whether it’s a 15-second reel or a 15-minute film,
            I bring the same passion into every frame.
          </p>
        </div>

        {/* Experience Section */}
        <div className="max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between max-sm:flex-1">
          <p className="max-sm:text-lg max-sm:text-gray-400 max-sm:text-end max-sm:w-full max-sm:p-[8vw]">
            learning, experimenting, <br /> + years of experience
          </p>
          <div className="max-sm:w-1/3">
            <h1 className="font-black text-[#acacac] max-sm:text-[8rem] max-sm:leading-none max-sm:inline-block max-sm:m-auto max-sm:w-full max-sm:pl-[20vw]">
              5
            </h1>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShortIntroduction = () => {
  return (
    <div className="w-full h-auto bg-black">
      {/* Desktop Layout */}
      <div className="about w-full min-h-[70vh] h-auto text-center text-gray-300 font-semibold font-[poppins] flex items-center justify-center gap-y-4 max-sm:hidden">
        <div className="text-center">
          <div className="text-lg text-gray-400 font-semibold font-[poppins]">
            <TextRevealerOnScroll text="(About)" className="pr-10" />
          </div>

          <TextRevealerOnScroll
            duration={1.2}
            reverseOnScroll={true}
            stagger={0.03}
            text={`I’m a video editor with 5+ years of experience started back in 2018 on Kinemaster, now \n rolling with Premiere Pro & After Effects. Worked with 50+ clients across India and \n abroad, edited everything from short-form reels to full-length films, and even pulled \n off a viral short film that hit millions of views (1.1M+ on my own YouTube). My thing? \n  Turning raw footage into stories that people actually want to watch and share.
`}
            className="text-lg text-center m-auto pt-6 overflow-hidden"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="hidden max-sm:flex max-sm:flex-col max-sm:min-h-[60vh] max-sm:w-full max-sm:bg-black max-sm:text-[#A3A38F] max-sm:justify-center max-sm:items-center max-sm:p-4">
        <div className="max-sm:text-center max-sm:w-full">
          <div className="max-sm:text-lg max-sm:text-[#A3A38F] max-sm:font-semibold max-sm:font-[poppins] max-sm:mb-6">
            <h1 className="text-[#A3A38F]">(About)</h1>
          </div>

          <p className="max-sm:text-base max-sm:text-justify max-sm:px-2 max-sm:leading-relaxed max-sm:max-w-md max-sm:mx-auto">
            I’m a video editor with 5+ years of experience started back in 2018
            on Kinemaster, now rolling with Premiere Pro & After Effects. Worked
            with 50+ clients across India and abroad, edited everything from
            short-form reels to full-length films, and even pulled off a viral
            short film that hit millions of views (1.1M+ on my own YouTube). My
            thing? Turning raw footage into stories that people actually want to
            watch and share.
          </p>
        </div>
      </div>
    </div>
  );
};
