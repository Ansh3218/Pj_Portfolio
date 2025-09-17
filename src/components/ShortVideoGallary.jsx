import React from "react";
import CommonShortVideo from "./CommonShortVideo";

import Typography from "../../public/assets/Video/Bat Gauge.mp4";
import AnotherVideo from "../../public/assets/Video/Typography.mp4";

const videos = [
  {
    id: 1,
    title: "Lorem AI",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid qui molestias deleniti...",
    videoSrc: Typography,
  },
  {
    id: 2,
    title: "Dolor Sit",
    description:
      "Dolor sit amet consectetur adipisicing elit. Vitae cum nesciunt, excepturi consequuntur...",
    videoSrc: AnotherVideo,
  },
  {
    id: 3,
    title: "Creative Design",
    description:
      "Ut inventore? In, delectus? Quaerat necessitatibus reprehenderit quibusdam expedita quos.",
    videoSrc: Typography,
  },
];

const ShortVideoGallery = () => {
  return (
    <div className="flex flex-wrap gap-10 justify-center">
      {videos.map((video) => (
        <CommonShortVideo
          key={video.id}
          title={video.title}
          description={video.description}
          videoSrc={video.videoSrc}
        />
      ))}
    </div>
  );
};

export default ShortVideoGallery;
