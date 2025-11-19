import { useState, useEffect, useRef } from "react";

const ProjectCard = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  const handlePlay = (video) => {
    setActiveVideo(video);
    setIsLoading(true);
  };

  const handleClose = () => {
    setActiveVideo(null);
    setIsLoading(true);
  };

  // ESC press → close fullscreen
  useEffect(() => {
    const closeOnEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  // Handle video loading
  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Video play error:", err);
          setIsLoading(false);
        });
    }
  }, [activeVideo]);

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
              autoPlay
              playsInline
              preload="metadata"
              src={video.videoSrc}
              className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            {/* PLAY Overlay */}
            <div
              className="absolute inset-0 hover:bg-black/40 flex items-center justify-center transition-all duration-300"
              onClick={() => handlePlay(video)}
            >
              <p className="uppercase text-[2.5vw] max-sm:text-[8vw] font-bold border-[3px] border-white rounded-full px-[3vw] py-[0.2vw] opacity-0 group-hover:opacity-100 transition-all text-gray-100 duration-300">
                PLAY
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* True Custom Fullscreen Video */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          {/* Close Button - Better hover & click area */}
          <button
            onClick={handleClose}
            className="
    absolute top-4 right-4 z-[10000]
    text-white text-3xl font-bold

    w-14 h-14 rounded-full 
    bg-black/50 backdrop-blur-sm

    flex items-center justify-center 
    leading-none            /* ✨ FIX 1: Remove text shift */
    
    hover:bg-red-600 hover:scale-110 hover:rotate-90
    transition-all duration-300 ease-out
    active:scale-95 cursor-pointer
  "
            aria-label="Close video"
          >
            ✕
          </button>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}

          <video
            ref={videoRef}
            src={activeVideo.videoSrc}
            muted={false}
            loop
            playsInline
            preload="auto"
            className="max-w-full max-h-full object-contain"
            onLoadedData={() => setIsLoading(false)}
          />
        </div>
      )}
    </>
  );
};

export default ProjectCard;
