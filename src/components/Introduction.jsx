import React from "react";
import CustomPixelText from "./CustomPixelText";
import MobileSizeText from "./MobileSizeText";
import { TextRevealerOnScroll } from "./RevealTextAnimation";

export const LongIntroduction = () => {
  return (
    <div className="w-full h-auto bg-black">
      {/* Desktop Layout */}
      <div className="about w-full min-h-[100vh] h-auto text-center text-gray-300 font-semibold font-[poppins] flex items-center justify-center gap-y-4 max-sm:hidden">
        <div className="text-center">
          <div className="text-lg text-gray-400 font-semibold font-[poppins]">
            <h1 className="pr-10">(About)</h1>
          </div>

          <p className="text-xl text-justify m-auto border-r-2 pt-8 pr-12 border-gray-300 w-[55%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
            nisi et eos voluptatum officiis iusto consectetur doloremque maiores
            excepturi distinctio ipsam. Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Dolorum praesentium minus repellendus, labore eos
            tempora, nobis vitae eum iure consequuntur tenetur natus saepe,
            ipsam ut quaerat quos soluta maiores temporibus?
          </p>
        </div>

        <div className="relative">
          <p className="absolute left-64 text-xl text-gray-400">
            learning, experimenting, <br /> + years of experience
          </p>
          <CustomPixelText
            textString="10"
            textAlignments={["left"]}
            fontSizes={["250"]}
            canvasSizes={[{ h: "250", w: "700" }]}
            gapY={-300}
            fontFamily="gilroy"
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
            nisi et eos voluptatum officiis iusto consectetur doloremque maiores
            excepturi distinctio ipsam. Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Dolorum praesentium minus repellendus, labore eos
            tempora, nobis vitae eum iure consequuntur tenetur natus saepe,
            ipsam ut quaerat quos soluta maiores temporibus?
          </p>
        </div>

        {/* Experience Section */}
        <div className="max-sm:flex max-sm:flex-row-reverse max-sm:items-center max-sm:justify-between max-sm:flex-1">
          <p className="max-sm:text-lg max-sm:text-gray-400 max-sm:text-end max-sm:w-1/2">
            learning, experimenting, <br /> + years of experience
          </p>
          <div className="max-sm:w-1/2">
            <MobileSizeText
              text="10"
              className="max-sm:text-[8rem] max-sm:leading-none max-sm:inline-block max-sm:m-auto max-sm:w-full"
            />
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
            stagger={0.03}
            text={`Lorem ipsum dolor sit amet consectetur adipisicing elit. \n Perferend is nisi et eos voluptatum officiis iusto \n  consectetur doloremque maiores excepturi distinction \n ipsam. Lorem ipsum dolor sit, amet consectetur`}
            className="text-xl text-center m-auto pt-6 overflow-hidden"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="hidden max-sm:flex max-sm:flex-col max-sm:min-h-[70vh] max-sm:w-full max-sm:bg-black max-sm:text-gray-300 max-sm:justify-center max-sm:items-center max-sm:p-4">
        <div className="max-sm:text-center max-sm:w-full">
          <div className="max-sm:text-lg max-sm:text-gray-400 max-sm:font-semibold max-sm:font-[poppins] max-sm:mb-6">
            <h1>(About)</h1>
          </div>

          <p className="max-sm:text-base max-sm:text-center max-sm:px-4 max-sm:leading-relaxed max-sm:max-w-md max-sm:mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferend
            is nisi et eos voluptatum officiis iusto consectetur doloremque
            maiores excepturi distinction ipsam. Lorem ipsum dolor sit, amet
            consectetur
          </p>
        </div>
      </div>
    </div>
  );
};
