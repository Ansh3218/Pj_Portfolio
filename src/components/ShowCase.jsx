import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// 🟢 3D Cylinder Scene with Image Texture
export const ShowCaseScene = () => {
  const Cyl = useRef(null);
  const groupRef = useRef(null);
  const [imgTexture, setImgTexture] = useState(null);

  useEffect(() => {
    // ✅ Load Image instead of Video
    const loader = new THREE.TextureLoader();
    loader.load("/assets/Images/PJ.JPG", (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1); // control tiling
      setImgTexture(texture);
    });
  }, []);

  // 🟢 Responsive sizing and positioning
  useEffect(() => {
    const handleResize = () => {
      if (Cyl.current && groupRef.current) {
        const isMobile = window.matchMedia("(max-width: 640px)").matches;

        // Mobile responsive cylinder size
        if (isMobile) {
          groupRef.current.scale.setScalar(0.7); // Scale down to 70%
          groupRef.current.position.set(0, -0.2, 0); // Slightly lower position
        } else {
          groupRef.current.scale.setScalar(1); // Normal scale
          groupRef.current.position.set(0, 0, 0); // Normal position
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🟢 Bounce Animation on load - Mobile responsive
  useEffect(() => {
    if (Cyl.current) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;

      Cyl.current.position.y = isMobile ? 3 : 5; // Less bounce on mobile
      gsap.to(Cyl.current.position, {
        y: 0.25,
        duration: isMobile ? 2 : 2.5, // Faster on mobile
        ease: "elastic.out(1, 0.50)",
        delay: 0.3,
      });
    }
  }, []);

  // 🟢 Continuous Rotation - Mobile optimized
  useFrame((state, delta) => {
    if (Cyl.current) {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const rotationSpeed = isMobile ? 0.3 : 0.5; // Slower on mobile for performance
      Cyl.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.15]}>
      <mesh ref={Cyl}>
        <cylinderGeometry
          args={
            window.matchMedia("(max-width: 640px)").matches
              ? [1.4, 1.4, 0.8, 120, 80, true] // Mobile: smaller, less geometry
              : [1.7, 1.7, 1, 150, 100, true] // Desktop: original size
          }
        />
        {imgTexture && (
          <meshStandardMaterial
            map={imgTexture}
            side={THREE.DoubleSide}
            color={"#cccccc"}
            emissive={"#111111"}
            emissiveIntensity={0.5}
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

  const textLines = [
    "FUTURE IS HERE ",
    "INNOVATION NEVER STOPS ",
    "BEYOND IMAGINATION",
  ];

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    containerRefs.current.forEach((container, i) => {
      const texts = textRefs.current[i]?.filter(Boolean);
      if (!container || !texts?.length) return;

      const textWidth = texts[0].getBoundingClientRect().width;
      const gap = isMobile ? 30 : 50; // Less gap on mobile
      const totalWidth = textWidth + gap;
      const direction = i % 2 === 0 ? -1 : 1;
      const containerWidth = container.getBoundingClientRect().width;

      texts.forEach((text, index) => {
        gsap.set(text, { x: index * totalWidth * direction });
      });

      gsap.to(texts, {
        x: direction === 1 ? `+=${totalWidth}` : `-=${totalWidth}`,
        duration: isMobile ? 20 : 15, // Slower on mobile for readability
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

  return (
    <div className="h-screen max-w-screen w-full relative overflow-x-hidden bg-black">
      {/* 🔥 Background Infinite Marquee - Mobile Responsive */}
      <div className="absolute inset-0 flex flex-col justify-around z-0 pointer-events-none max-sm:justify-center max-sm:gap-10">
        {textLines.map((line, i) => (
          <div
            key={i}
            ref={(el) => (containerRefs.current[i] = el)}
            className="relative h-[30vh] overflow-hidden marquee-line opacity-0 max-sm:h-[15vh]"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  if (!textRefs.current[i]) textRefs.current[i] = [];
                  textRefs.current[i][idx] = el;
                }}
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-light tracking-wider max-sm:tracking-wide"
                style={{
                  fontSize: window.matchMedia("(max-width: 640px)").matches
                    ? "20vw"
                    : "15vw",
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

      {/* 🔥 Center blur - Mobile Responsive */}
      <div
        ref={blurRef}
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0 scale-75"
      >
        <div className="w-[400px] h-[400px] rounded-full bg-black/90 blur-3xl mix-blend-overlay max-sm:w-[250px] max-sm:h-[250px] max-sm:blur-2xl"></div>
      </div>

      {/* 🔥 3D Model - Mobile Responsive */}
      <div
        ref={canvasWrapperRef}
        className="relative z-20 opacity-0 h-screen w-full"
      >
        <Canvas
          camera={{
            fov: window.matchMedia("(max-width: 640px)").matches ? 35 : 25,
            position: [
              0,
              0,
              window.matchMedia("(max-width: 640px)").matches ? 6.5 : 5.5,
            ],
          }}
          frameloop="always"
          dpr={
            window.matchMedia("(max-width: 640px)").matches
              ? [1, 1.2]
              : [1, 1.5]
          }
          gl={{
            powerPreference: "high-performance",
            antialias: !window.matchMedia("(max-width: 640px)").matches, // Disable AA on mobile for performance
          }}
        >
          {/* <OrbitControls enableZoom={false} /> */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[2, 2, 5]}
            intensity={
              window.matchMedia("(max-width: 640px)").matches ? 1.5 : 2
            }
          />
          <ShowCaseScene />
          <EffectComposer>
            <Bloom
              mipmapBlur
              intensity={
                window.matchMedia("(max-width: 640px)").matches ? 0.15 : 0.2
              }
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};
