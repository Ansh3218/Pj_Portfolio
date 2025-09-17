import React from "react";
import CustomPixelText from "./CustomPixelText";
import MobileSizeText from "./MobileSizeText";
import PjImg from "../../public/assets/Images/PJ.JPG";

const PjFrontHeading = () => {
  return (
    <>
      <div className="w-full h-auto min-h-screen relative">
        {/* Desktop Layout */}
        <div className="h-screen w-full flex justify-start gap-x-16 items-center text-white max-sm:hidden">
          <div className="img w-[40vw] h-[40vw] flex items-end">
            <p className="text-xl pr-5 text-right font-semibold">
              Prashant Joshi
            </p>
            <img src={PjImg} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="heading">
            <CustomPixelText
              textString={`LOREM \n ISPU`}
              textAlignments={["center", "right"]}
              fontSizes={["220", "230"]}
              canvasSizes={[
                { h: "400", w: "800" },
                { h: "300", w: "670" },
              ]}
              gapY={-160}
              fontFamily="gilroy"
            />
          </div>
        </div>

        <div className="hidden max-sm:flex max-sm:flex-col max-sm:min-h-screen max-sm:w-full max-sm:text-white">
          {/* Mobile Text Section */}
          <div className="max-sm:flex max-sm:justify-center max-sm:items-center max-sm:flex-1 max-sm:w-full max-sm:overflow-hidden">
            <MobileSizeText
              text="LOREM ISPU"
              className="max-sm:text-[25vw] max-sm:pt-5 max-sm:leading-[0.9]"
            />
          </div>
          <div className="max-sm:w-full max-sm:h-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:p-4 max-sm:pt-12">
            <div className="max-sm:w-[100vw] max-sm:h-[100vw] max-sm:relative max-sm:px-2">
              <img
                src={PjImg}
                alt=""
                className="max-sm:w-full max-sm:h-full max-sm:object-cover max-sm:rounded-2xl"
              />
            </div>
            <p className="max-sm:text-lg max-sm:mt-3 max-sm:font-semibold">
              Prashant Joshi
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PjFrontHeading;
