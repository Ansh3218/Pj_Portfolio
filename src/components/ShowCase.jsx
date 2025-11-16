import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// 🟢 Responsive Configuration Hook
const useResponsiveConfig = () => {
  const [config, setConfig] = useState({
    isMobile: false,
    isTablet: false,
    isSmall: false,
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
  });

  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      setConfig({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isSmall: width < 1000,
        width,
      });
    };

    updateConfig();
    window.addEventListener("resize", updateConfig);
    return () => window.removeEventListener("resize", updateConfig);
  }, []);

  return config;
};

// 🟢 Get Performance Settings based on screen size
const getPerformanceSettings = (width) => {
  if (width < 640) {
    // Mobile phones
    return {
      cylinderSegments: [100, 40],
      bloomIntensity: 0.8,
      dpr: [1, 1.5],
      antialias: false,
      shadowMap: false,
      rotationSpeed: 0.35,
      animDuration: 1.8,
      bounceHeight: 2.5,
      textDuration: 15,
      textureFiltering: "low",
    };
  } else if (width < 768) {
    // Large phones
    return {
      cylinderSegments: [100, 70],
      bloomIntensity: 0.5,
      dpr: [1, 1.2],
      antialias: false,
      shadowMap: false,
      rotationSpeed: 0.3,
      animDuration: 2,
      bounceHeight: 3,
      textDuration: 18,
    };
  } else if (width < 1000) {
    // Tablets
    return {
      cylinderSegments: [120, 80],
      bloomIntensity: 1.5,
      dpr: [1, 1.3],
      antialias: true,
      shadowMap: false,
      rotationSpeed: 0.28,
      animDuration: 2.2,
      bounceHeight: 3.5,
      textDuration: 22,
    };
  } else if (width < 1440) {
    // Small laptops
    return {
      cylinderSegments: [140, 90],
      bloomIntensity: 2.5,
      dpr: [1, 1.5],
      antialias: true,
      shadowMap: true,
      rotationSpeed: 0.25,
      animDuration: 2.5,
      bounceHeight: 5,
      textDuration: 28,
    };
  } else {
    // Large screens
    return {
      cylinderSegments: [150, 100],
      bloomIntensity: 4,
      dpr: [1, 2],
      antialias: true,
      shadowMap: true,
      rotationSpeed: 0.25,
      animDuration: 2.5,
      bounceHeight: 5,
      textDuration: 30,
    };
  }
};

// 🟢 Get Cylinder Size based on screen size
const getCylinderSize = (width) => {
  if (width < 480) return { radius: 1.1, height: 0.9, scale: 0.9 };
  if (width < 640) return { radius: 1.3, height: 1.1, scale: 0.9 };
  if (width < 768) return { radius: 1.4, height: 0.8, scale: 0.75 };
  if (width < 1000) return { radius: 1.5, height: 0.85, scale: 0.85 };
  if (width < 1440) return { radius: 1.6, height: 0.95, scale: 0.95 };
  return { radius: 1.7, height: 1.2, scale: 1 };
};

// 🟢 Get Camera Settings
const getCameraSettings = (width) => {
  if (width < 480) return { fov: 40, position: [0, 0, 3.5] };
  if (width < 640) return { fov: 38, position: [0, 0, 4] };
  if (width < 768) return { fov: 35, position: [0, 0, 3.5] };
  if (width < 1000) return { fov: 32, position: [0, 0, 3.8] };
  if (width < 1440) return { fov: 28, position: [0, 0, 4] };
  return { fov: 25, position: [0, 0, 5.7] };
};

// 🟢 3D Cylinder Scene with Image Texture
export const ShowCaseScene = ({ isDragging }) => {
  const Cyl = useRef(null);
  const groupRef = useRef(null);
  // const [imgTexture, setImgTexture] = useState(null);
  const config = useResponsiveConfig();

  const imgTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/assets/Images/HeroImg.png");
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 12;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // 🟢 Responsive sizing and positioning
  useEffect(() => {
    const handleResize = () => {
      if (Cyl.current && groupRef.current) {
        const width = window.innerWidth;
        const { scale } = getCylinderSize(width);

        groupRef.current.scale.setScalar(scale);

        const rotationFix = 0.35; // rotation ke wajah se adjust value

        if (width < 640) {
          groupRef.current.position.set(0.05, -rotationFix + 0.5, 0);
        } else if (width < 1000) {
          groupRef.current.position.set(0, -rotationFix + 0.1, 0);
        } else {
          groupRef.current.position.set(0, -rotationFix + 0.25, 0);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🟢 Bounce Animation on load
  useEffect(() => {
    if (Cyl.current) {
      const width = window.innerWidth;
      const perf = getPerformanceSettings(width);

      Cyl.current.position.y = perf.bounceHeight;
      gsap.to(Cyl.current.position, {
        y: 0.25,
        duration: perf.animDuration,
        ease: "elastic.out(1, 0.40)",
        delay: 0.3,
      });
    }
  }, []);

  // 🟢 Continuous Rotation - Performance optimized
  const speed = useRef(0.25);

  useFrame((_, delta) => {
    if (!isDragging) Cyl.current.rotation.y += delta * speed.current;
  });

  const { radius, height } = getCylinderSize(config.width);
  const perf = getPerformanceSettings(config.width);

  // 🔥 Cylinder geometry optimized with useMemo
  const cylinderGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      perf.cylinderSegments[0],
      perf.cylinderSegments[1],
      true
    );
  }, [radius, height, perf.cylinderSegments]);

  // 🟢 GLOBAL GSAP PERFORMANCE BOOST
  useEffect(() => {
    gsap.ticker.fps(30);
  }, []);
  return (
    <group ref={groupRef} rotation={[0.1, 0.3, 0.25]}>
      <mesh ref={Cyl}>
        <primitive object={cylinderGeometry} attach="geometry" />
        {imgTexture && (
          <meshStandardMaterial
            map={imgTexture}
            side={THREE.DoubleSide}
            emissive={"black"}
            emissiveIntensity={0.5}
            transparent={true}
          />
        )}
      </mesh>
    </group>
  );
};
export const ShowCaseCanvas = () => {
  const containerRefs = useRef([]);
  const textRefs = useRef([]);
  const blurRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const config = useResponsiveConfig();

  const textLines = [
    "Content that doesn't just play",
    "INNOVATION NEVER STOPS",
    "IT PERFORMS",
  ];

  const perf = getPerformanceSettings(config.width);
  const camera = getCameraSettings(config.width);

  // --- MARQUEE SETTINGS (game-speed) ---
  // Make this smaller for faster speed (seconds)
  // You can tweak these values as per 'game speed' feel
  const baseDuration = config.isMobile ? 8 : 10; // seconds (lower = faster)
  // Use perf.textDuration to scale if you want, but this is explicit fast value:
  const marqueeDuration = Math.max(
    12,
    Math.round(baseDuration * (1 / perf.textDuration))
  );

  const marqueeGap = config.width < 640 ? 80 : config.width < 1000 ? 30 : 50;

  // Helper re-used from your original code
  const getTextSize = () => {
    if (config.width < 480) return "30vw";
    if (config.width < 640) return "28vw";
    if (config.width < 768) return "35vw";
    if (config.width < 1000) return "25vw";
    if (config.width < 1440) return "10vw";
    return "12vw";
  };

  const getMarqueeHeight = () => {
    if (config.width < 780) return "h-[20vh]";
    if (config.width < 1000) return "h-[18vh]";
    return "h-[30vh]";
  };

  // Inline CSS for marquee (paste to global CSS if you prefer)
  // This will be rendered as part of component
  const marqueeCSS = `
    .__marquee {
      position: relative;
      overflow: hidden;
      pointer-events: none;
    }
    .__marquee-inner {
      display: flex;
      width: 200%; /* two copies create smooth loop */
      will-change: transform;
      transform: translateZ(0);
      animation-timing-function: linear;
      animation-iteration-count: infinite;
      animation-name: __marqueeMove;
      animation-duration: var(--marquee-duration, ${marqueeDuration}s);
    }
    .__marquee-inner.reverse {
      animation-direction: reverse;
    }
    .__marquee-track {
      display: flex;
      align-items: center;
      gap: 0; /* item spacing handled by padding on item */
      white-space: nowrap;
    }
    .__marquee-item {
      display: inline-block;
      padding-right: ${marqueeGap}px;
      will-change: transform;
    }

    @keyframes __marqueeMove {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); } /* move exactly half (since width=200%) */
    }
  `;

  // inject style once (so user doesn't need global stylesheet)
  useEffect(() => {
    let styleEl = document.getElementById("__marquee-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "__marquee-styles";
      styleEl.innerHTML = marqueeCSS;
      document.head.appendChild(styleEl);
    } else {
      styleEl.innerHTML = marqueeCSS; // update if responsive values changed
    }
    return () => {
      // keep style (don't remove) — ok to leave
    };
  }, [marqueeDuration, marqueeGap, config.width]);

  // Keep GSAP only for entrance opacity + canvas fade (lightweight)
  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(".marquee-line", { opacity: 1, duration: 0.6, ease: "power2.out" })
      .to(
        blurRef.current,
        { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3"
      )
      .to(
        canvasWrapperRef.current,
        { opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  // Controls memo (your previous)
  const controls = useMemo(() => {
    return (
      <OrbitControls
        enableZoom={false}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
        enableDamping={true}
        dampingFactor={0.05}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.PAN,
        }}
      />
    );
  }, [config.width]);

  const getBlurSize = () => {
    if (config.width < 480) return "w-[180px] h-[180px]";
    if (config.width < 640) return "w-[220px] h-[220px]";
    if (config.width < 768) return "w-[260px] h-[260px]";
    if (config.width < 1000) return "w-[300px] h-[300px]";
    return "w-[450px] h-[350px]";
  };

  const getLineGap = () => {
    if (config.width < 480) return "gap-y-[120px]";
    if (config.width < 640) return "gap-y-[90px]";
    if (config.width < 768) return "gap-y-[60px]";
    return "gap-[40px]";
  };

  return (
    <div className="h-screen max-w-screen w-full relative overflow-x-hidden bg-black">
      {/* MARQUEE: CSS-driven, same duration, alternate direction */}
      <div
        className={`absolute inset-0 flex flex-col ${getLineGap()} z-0 pointer-events-none`}
      >
        {textLines.map((line, i) => (
          <div
            key={i}
            ref={(el) => (containerRefs.current[i] = el)}
            className={`relative ${getMarqueeHeight()} overflow-hidden marquee-line opacity-0 __marquee`}
          >
            {/* inner has two copies (width:200%) for seamless loop */}
            <div
              className={`__marquee-inner ${i % 2 === 1 ? "reverse" : ""}`}
              style={{ ["--marquee-duration"]: `${marqueeDuration}s` }}
              aria-hidden
            >
              <div className="__marquee-track">
                <div
                  className="__marquee-item uppercase"
                  style={{
                    fontSize: getTextSize(),
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 90%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "#A3A38F",
                  }}
                >
                  {line}
                </div>
                <div
                  className="__marquee-item"
                  style={{
                    fontSize: getTextSize(),
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 90%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "#A3A38F",
                  }}
                >
                  {line}
                </div>
              </div>

              {/* duplicate second half for continuous loop */}
              <div className="__marquee-track" aria-hidden>
                <div
                  className="__marquee-item"
                  style={{
                    fontSize: getTextSize(),
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 90%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "#A3A38F",
                  }}
                >
                  {line}
                </div>
                <div
                  className="__marquee-item"
                  style={{
                    fontSize: getTextSize(),
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 30%, rgba(255,255,255,0) 90%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {line}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blur */}
      <div
        ref={blurRef}
        className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none opacity-0 scale-75"
      >
        <div
          className={`${getBlurSize()} rounded-full bg-black/70 blur-2xl mix-blend-multiply`}
        ></div>
      </div>

      {/* 3D Canvas */}
      <div
        ref={canvasWrapperRef}
        className="relative z-20 opacity-0 w-full flex items-center justify-center 
           h-[65vh] max-sm:h-[50vh] max-sm:mt-[50%] sm:h-[70vh] md:h-[90vh] lg:h-screen"
      >
        <Canvas
          camera={{
            fov: camera.fov,
            position: camera.position,
          }}
          frameloop="always"
          dpr={config.isMobile ? 1 : perf.dpr}
          gl={{
            powerPreference: config.isSmall ? "low-power" : "high-performance",
            antialias: perf.antialias,
          }}
        >
          {controls}
          <ambientLight intensity={config.isSmall ? 0.6 : 0.5} />
          <directionalLight
            position={[2, 2, 5]}
            intensity={config.isSmall ? 1.3 : 2}
            castShadow={perf.shadowMap}
          />
          <ShowCaseScene isDragging={isDragging} />
          {!config.isMobile && (
            <EffectComposer>
              <Bloom
                mipmapBlur
                intensity={perf.bloomIntensity}
                luminanceThreshold={0.65}
                luminanceSmoothing={0.5}
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </div>
  );
};
