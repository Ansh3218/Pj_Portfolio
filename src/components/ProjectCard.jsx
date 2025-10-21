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
      {/* Video Grid - 2 per row */}
      <div className="flex flex-wrap gap-[2vw] w-full h-full">
        {videos.map((video, idx) => (
          <div
            key={idx}
            className="w-[calc(50%-1vw)] relative overflow-hidden group cursor-pointer max-sm:w-full transition-all duration-200 hover:rounded-[30px] h-full"
          >
            <video
              muted
              loop
              src={video.videoSrc}
              className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
            />

            {/* PLAY Overlay */}
            <div
              className="absolute inset-0 hover:bg-black/50 flex items-center justify-center transition-all duration-300"
              onClick={() => handlePlay(video)}
            >
              <p className="uppercase text-[2.5vw] max-sm:text-[8vw] font-bold border-[3px] border-white rounded-full px-[3vw] py-[0.2vw] font-[arial] opacity-0 group-hover:opacity-100 transition-all text-gray-100 duration-300">
                PLAY
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Video Popup */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <video
            src={activeVideo.videoSrc}
            autoPlay
            controls
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  );
};

export default ProjectCard;
