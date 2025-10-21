import React from "react";
import CommonShortVideo from "./CommonShortVideo";
import { videos } from "../Data/Video";
const ShortVideoGallery = () => {
  return (
    <div className="flex flex-wrap gap-10 justify-center flex-row">
      {videos.map((video, index) => (
        <CommonShortVideo
          key={index}
          title={video.title}
          description={video.text}
          videoSrc={video.videoSrc}
        />
      ))}
    </div>
  );
};

export default ShortVideoGallery;
