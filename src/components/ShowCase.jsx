import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
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
      cylinderSegments: [230, 60],
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
  if (width < 480) return { radius: 1.2, height: 0.7, scale: 0.6 };
  if (width < 640) return { radius: 1.3, height: 0.75, scale: 0.65 };
  if (width < 768) return { radius: 1.4, height: 0.8, scale: 0.75 };
  if (width < 1000) return { radius: 1.5, height: 0.85, scale: 0.85 };
  if (width < 1440) return { radius: 1.6, height: 0.95, scale: 0.95 };
  return { radius: 1.7, height: 1, scale: 1 };
};

// 🟢 Get Camera Settings
const getCameraSettings = (width) => {
  if (width < 480) return { fov: 40, position: [0, 0, 4.4] };
  if (width < 640) return { fov: 38, position: [0, 0, 4] };
  if (width < 768) return { fov: 35, position: [0, 0, 3.5] };
  if (width < 1000) return { fov: 32, position: [0, 0, 3.8] };
  if (width < 1440) return { fov: 28, position: [0, 0, 4] };
  return { fov: 25, position: [0, 0, 5.5] };
};

// 🟢 3D Cylinder Scene with Image Texture
export const ShowCaseScene = ({ isDragging }) => {
  const Cyl = useRef(null);
  const groupRef = useRef(null);
  const [imgTexture, setImgTexture] = useState(null);
  const config = useResponsiveConfig();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/assets/Images/HeroImg.png", (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 7;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      setImgTexture(texture);
    });
  }, []);

  // 🟢 Responsive sizing and positioning
  useEffect(() => {
    const handleResize = () => {
      if (Cyl.current && groupRef.current) {
        const width = window.innerWidth;
        const { scale } = getCylinderSize(width);

        groupRef.current.scale.setScalar(scale);

        // Adjust position based on screen size
        if (width < 640) {
          groupRef.current.position.set(0, -0.3, 0);
        } else if (width < 1000) {
          groupRef.current.position.set(0, -0.15, 0);
        } else {
          groupRef.current.position.set(0, 0, 0);
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
  useFrame((state, delta) => {
    if (Cyl.current && !isDragging) {
      const perf = getPerformanceSettings(config.width);
      Cyl.current.rotation.y += delta * perf.rotationSpeed;
    }
  });

  const { radius, height } = getCylinderSize(config.width);
  const perf = getPerformanceSettings(config.width);

  return (
    <group ref={groupRef} rotation={[0.1, 0.3, 0.25]}>
      <mesh ref={Cyl}>
        <cylinderGeometry
          args={[radius, radius, height, ...perf.cylinderSegments, true]}
        />
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

// 🟢 Full Canvas Component
export const ShowCaseCanvas = () => {
  const containerRefs = useRef([]);
  const textRefs = useRef([]);
  const blurRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const config = useResponsiveConfig();

  const textLines = [
    "Content that doesn't just play",
    "INNOVATION NEVER STOPS ",
    "IT PERFORMS",
  ];

  useEffect(() => {
    const width = window.innerWidth;
    const perf = getPerformanceSettings(width);

    containerRefs.current.forEach((container, i) => {
      const texts = textRefs.current[i]?.filter(Boolean);
      if (!container || !texts?.length) return;

      const textWidth = texts[0].getBoundingClientRect().width;
      const gap = width < 640 ? 25 : width < 1000 ? 35 : 50;
      const totalWidth = textWidth + gap;
      const direction = i % 2 === 0 ? -1 : 1;
      const containerWidth = container.getBoundingClientRect().width;

      texts.forEach((text, index) => {
        gsap.set(text, { x: index * totalWidth * direction });
      });

      gsap.to(texts, {
        x: direction === 1 ? `+=${totalWidth}` : `-=${totalWidth}`,
        duration: perf.textDuration,
        ease: "linear",
        repeat: -1,
        modifiers: {
          x: (x) => {
            let xVal = parseFloat(x);
            if (direction === 1 && xVal > containerWidth + textWidth) {
              xVal -= texts.length * totalWidth;
            } else if (direction === -1 && xVal < -textWidth) {
              xVal += texts.length * totalWidth;
            }
            return xVal + "px";
          },
        },
      });
    });

    const tl = gsap.timeline();
    tl.to(".marquee-line", { opacity: 1, duration: 1, ease: "power2.out" })
      .to(
        blurRef.current,
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
        "-=0.5"
      )
      .to(
        canvasWrapperRef.current,
        { opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.8"
      );
  }, []);

  const perf = getPerformanceSettings(config.width);
  const camera = getCameraSettings(config.width);

  // Get text size based on width
  const getTextSize = () => {
    if (config.width < 480) return "28vw";
    if (config.width < 640) return "16vw";
    if (config.width < 768) return "14vw";
    if (config.width < 1000) return "12vw";
    if (config.width < 1440) return "10vw";
    return "15vw";
  };

  // Get blur size based on width
  const getBlurSize = () => {
    if (config.width < 480) return "w-[180px] h-[180px]";
    if (config.width < 640) return "w-[220px] h-[220px]";
    if (config.width < 768) return "w-[260px] h-[260px]";
    if (config.width < 1000) return "w-[300px] h-[300px]";
    return "w-[350px] h-[350px]";
  };

  const getMarqueeHeight = () => {
    if (config.width < 640) return "h-[18vh]";
    if (config.width < 1000) return "h-[18vh]";
    return "h-[30vh]";
  };

  return (
    <div className="h-screen max-w-screen w-full relative overflow-x-hidden bg-black">
      {/* 🔥 Background Infinite Marquee - Fully Responsive */}
      <div className="absolute inset-0 flex flex-col justify-around z-0 pointer-events-none">
        {textLines.map((line, i) => (
          <div
            key={i}
            ref={(el) => (containerRefs.current[i] = el)}
            className={`relative ${getMarqueeHeight()} overflow-hidden marquee-line opacity-0`}
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  if (!textRefs.current[i]) textRefs.current[i] = [];
                  textRefs.current[i][idx] = el;
                }}
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-light tracking-wider uppercase"
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
            ))}
          </div>
        ))}
      </div>

      {/* 🔥 Center blur - Fully Responsive */}
      <div
        ref={blurRef}
        className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none opacity-0 scale-75"
      >
        <div
          className={`${getBlurSize()} rounded-full bg-black/70 blur-2xl mix-blend-multiply`}
        ></div>
      </div>

      {/* 🔥 3D Model - Performance Optimized */}
      <div
        ref={canvasWrapperRef}
        className="relative z-20 opacity-0 h-screen w-full flex items-center justify-center"
      >
        <Canvas
          camera={{
            fov: camera.fov,
            position: camera.position,
          }}
          frameloop="always"
          dpr={perf.dpr}
          gl={{
            powerPreference: config.isSmall ? "low-power" : "high-performance",
            antialias: perf.antialias,
          }}
        >
          {!config.isMobile && (
            <OrbitControls
              enableZoom={false}
              onStart={() => setIsDragging(true)}
              onEnd={() => setIsDragging(false)}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}
          <ambientLight intensity={config.isSmall ? 0.6 : 0.5} />
          <directionalLight
            position={[2, 2, 5]}
            intensity={config.isSmall ? 1.3 : 2}
            castShadow={perf.shadowMap}
          />
          <ShowCaseScene isDragging={isDragging} />
          <EffectComposer>
            <Bloom
              mipmapBlur
              intensity={perf.bloomIntensity}
              luminanceThreshold={0.65}
              luminanceSmoothing={0.5}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};
