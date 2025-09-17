import React from "react";
import PjBg from "../../public/assets/Images/2.jpg";
import {
  LongIntroduction,
  ShortIntroduction,
} from "../components/Introduction.jsx";
import PjCanvasImg from "../components/PjCanvasImg";
import PjFrontHeading from "../components/PjFrontHeading.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import PageTransition from "../components/PageTransition.jsx";
const About = () => {
  return (
    <>
      <PjFrontHeading />
      <LongIntroduction />
      <PjCanvasImg />
    </>
  );
};

export default PageTransition(About);
