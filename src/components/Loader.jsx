import React, { useState, useEffect, useMemo } from "react";

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);

  // Increase progress smoothly 0 → 100
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            onDone && onDone();
          }, 100); // faster transition
          return 100;
        }
        return p + 1;
      });
    }, 30); // FASTER speed (40 → 10)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden select-none flex items-center justify-center">
      {/* BG Blobs */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-0 left-1/4 w-96 h-96 sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-white/15 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 sm:w-[450px] sm:h-[450px] lg:w-[550px] lg:h-[550px] bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 sm:w-[520px] sm:h-[520px] lg:w-[620px] lg:h-[620px] bg-white/12 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {useMemo(
          () =>
            [...Array(28)].map((_, i) => {
              const duration = 18 + Math.random() * 10;
              const delay = Math.random() * 5;

              return (
                <div
                  key={i}
                  className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${duration}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            }),
          []
        )}
      </div>

      {/* Center Loader */}
      <div className="flex flex-col items-center gap-3 z-20">
        {/* Blinking LOADING Text */}
        <p className="text-white text-[1.5vw] max-sm:text-[5vw] tracking-[0.5em] font-light animate-blink font-[gilroy]">
          LOADING
        </p>

        {/* Simple % increasing */}
        <p className="text-white text-[1vw] max-sm:text-[3.5vw] font-light opacity-40 font-[poppins]">
          {progress}%
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.1);
          }
          66% {
            transform: translate(-40px, 50px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 9s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          30% {
            opacity: 0.45;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-140vh) translateX(60px);
            opacity: 0;
          }
        }

        @keyframes blink {
          0% {
            opacity: 0.25;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.25;
          }
        }
        .animate-blink {
          animation: blink 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
