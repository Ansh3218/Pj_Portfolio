import React, { useState, useEffect, useMemo } from "react";
import { motion, useSpring, useTransform } from "motion/react";

function RollingNumber({ mv, number, height }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let value = offset * height;
    if (offset > 5) value -= 10 * height;
    return value;
  });

  return (
    <motion.span
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        y,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {number}
    </motion.span>
  );
}

function RollingDigit({ place, value, height, digitWidth }) {
  if (place === 100) {
    const smoothTrigger = Math.max(0, value - 90);
    let animatedValue = useSpring(smoothTrigger, {
      stiffness: 90,
      damping: 16,
    });

    useEffect(() => {
      animatedValue.set(Math.max(0, value - 90));
    }, [value, animatedValue]);

    return (
      <div
        style={{
          height,
          width: digitWidth,
          position: "relative",
          overflow: "hidden",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <RollingNumber
            key={i}
            mv={animatedValue}
            number={i}
            height={height}
          />
        ))}
      </div>
    );
  }

  let animatedValue = useSpring(value / place, { stiffness: 90, damping: 10 });

  useEffect(() => {
    animatedValue.set(value / place);
  }, [value, place, animatedValue]);

  return (
    <div
      style={{
        height,
        width: digitWidth,
        position: "relative",
        overflow: "hidden",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <RollingNumber key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({
    height: 250,
    fontSize: "18vw",
    digitWidth: "1ch",
  });

  // Responsive & Dynamic Width Calculation
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      let height, fontSize, digitWidth;

      if (width < 480) {
        // Mobile Small
        height = 160;
        fontSize = "32vw";
        digitWidth = "0.95ch";
      } else if (width < 640) {
        // Mobile
        height = 200;
        fontSize = "30vw";
        digitWidth = "1ch";
      } else if (width < 768) {
        // Tablet
        height = 180;
        fontSize = "24vw";
        digitWidth = "1.05ch";
      } else if (width < 1024) {
        // Small Desktop
        height = 220;
        fontSize = "20vw";
        digitWidth = "1.1ch";
      } else {
        // Large Desktop
        height = 280;
        fontSize = "18vw";
        digitWidth = "1.15ch";
      }

      setDimensions({ height, fontSize, digitWidth });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden select-none">
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
              const duration = 12 + Math.random() * 8;
              const delay = Math.random() * 1;

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

      {/* Rolling Number - Fully Responsive & No Collapse */}
      <div className="absolute bottom-8 right-8 flex items-end justify-end">
        <div
          className="flex items-center justify-center tracking-tight select-none"
          style={{
            fontWeight: 900,
            lineHeight: 0.8,
            fontSize: dimensions.fontSize,
            letterSpacing: "-0.02em",
          }}
        >
          {[100, 10, 1].map((place) => (
            <RollingDigit
              key={place}
              place={place}
              value={progress}
              height={dimensions.height}
              digitWidth={dimensions.digitWidth}
            />
          ))}

          <span
            className="opacity-40 ml-1"
            style={{
              fontSize: `calc(${dimensions.fontSize} * 0.9)`,
              marginBottom: "0.1em",
            }}
          >
            %
          </span>
        </div>
      </div>

      {/* Tailwind + CSS Animations */}
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
      `}</style>
    </div>
  );
}
