import { useState } from "react";

const ProjectCard = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState(null);

  const handlePlay = (video) => {
    setActiveVideo(video);
  };

  const handleClose = () => {
    setActiveVideo(null);
  };

  return (
    <>
      {/* Video Grid */}
      <div className="flex flex-wrap gap-4 w-full justify-between font-[arial]">
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="w-1/2 relative duration-200 transition-all hover:rounded-[30px] overflow-hidden h-full group cursor-pointer max-sm:w-full max-sm:h-[50%]"
          >
            <video
              muted
              src={video.videoSrc}
              className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            {/* PLAY Button */}
            <div
              className="absolute left-0 top-0 w-full h-full hover:bg-black/50 flex items-center justify-center transition-all duration-300"
              onClick={() => handlePlay(video)}
            >
              <p className="uppercase text-[3vw] font-bold border-[3px] border-white rounded-full px-[2vw] leading-[3.5vw] font-[arial] opacity-0 group-hover:opacity-100 transition-all text-gray-100 duration-300">
                PLAY
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen / Half-screen Video Overlay */}
      {activeVideo && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <video
            src={activeVideo.videoSrc}
            autoPlay
            className={`${
              activeVideo.title.toLowerCase().includes("portrait")
                ? "h-[50vh] w-[80vw]" // Portrait → full height
                : "h-[90vh] w-[80vw]" // Landscape → half screen height
            } object-contain rounded-2xl overflow-hidden`}
          />
        </div>
      )}
    </>
  );
};

export default ProjectCard;
