import CustomPixelText from "../components/CustomPixelText";
import Clock from "../components/Clock";
import "../index.css";
import TopHoverLine from "../components/TopHoverLine";
import { Link } from "react-router-dom";
import TextBlinkHover from "../components/TextBlinkHover";
import Footer from "../components/Footer";
import { TextRevealer } from "../components/RevealTextAnimation"; // ✅ fixed
import PageTransition from "../components/PageTransition";
import MobileSizeText from "../components/MobileSizeText";

const Contact = ({
  bgColor = "",
  textColor = "",
  textStroke = "",
  lineColor = "",
}) => {
  const links = [
    { name: "Instagram", url: "#" },
    { name: "Youtube", url: "#" },
    { name: "Twitter", url: "#" },
    { name: "Facebook", url: "#" },
  ];

  return (
    <section>
      <div
        style={{
          background: bgColor || "black",
          color: textColor || "#9B9B88",
        }}
        className="w-full h-auto min-h-[90vh] flex flex-col items-center justify-center overflow-x-hidden"
      >
        <div className="w-full h-full flex items-center justify-center relative flex-col">
          <div className="text-[22px] font-[Timerfonts] font-semibold w-96 h-16 text-end pr-5 my-14 leading-6 flex flex-col items-end max-sm:w-64 max-sm:text-xs">
            <Clock />
            <TextRevealer className="text-lg max-sm:text-[11px]" text="India" />
          </div>
          <div className="block max-sm:hidden">
            {/* Pixel Text */}
            <CustomPixelText
              textString="LET'S CREATE"
              fontFamily="avalors personal use only"
              fontSizes={[210]}
              fontWeight="bold"
              strokeColor={textStroke ? "#9B9B88" : "black"}
              fontColor={textColor ? "black" : "#9B9B88"}
              strokeWidth={5}
              canvasSizes={[{ w: 1470, h: 200 }]}
            />
          </div>
          <div className="hidden max-sm:block">
            <MobileSizeText
              text={`LET'S \n CREATE`}
              className="max-sm:text-[20vw] px-1"
            />
          </div>
        </div>
        {/* Contact Links */}
        <div className="social-media-links w-full h-full">
          <div className="contact w-full h-full flex justify-around p-14 pt-28 max-sm:flex-col max-sm:pt-16 max-sm:p-1">
            {/* Email */}
            <div className="email w-1/2 my-5 flex flex-col gap-y-14 pl-5 max-sm:w-full max-sm:pl-0">
              <TopHoverLine lineColor={lineColor ? lineColor : "#9B9B88"}>
                <div className="flex items-center gap-3 pt-3 text-xl font-semibold w-[40rem] max-sm:text-xs">
                  <span className="h-[5px] w-6 mt-1.5"></span>
                  <TextRevealer text="pj@example.com" />
                </div>
              </TopHoverLine>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-0 my-5 w-1/2 p-4 max-sm:w-full max-sm:items-end max-sm:gap-y-1">
              {links.map((link, i) => (
                <Link
                  key={i}
                  to={link.url}
                  className="flex items-center gap-3 w-1/3 font-semibold text-lg group max-sm:gap-0 max-sm:text-xs"
                >
                  <span className="w-6 h-[3px]" />
                  <TextBlinkHover text={link.name} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div>
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default PageTransition(Contact);
