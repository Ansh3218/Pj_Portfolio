import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const NavModel = ({ straighten, NavBoxHovered }) => {
  const meshRef = useRef(); // reference to the 3D mesh
  const curveRef = useRef(); // reference for the curve path
  const animationRef = useRef(); // reference for GSAP animation

  // Initial curve points for the tube geometry
  const initialPoints = [
    new THREE.Vector3(-20, 0, 0),
    new THREE.Vector3(-18, 1, 0),
    new THREE.Vector3(-16, 0, 0),
    new THREE.Vector3(-14, 1, 0),
    new THREE.Vector3(-12, 0, 0),
    new THREE.Vector3(-10, 1, 0),
    new THREE.Vector3(-8, 0, 0),
    new THREE.Vector3(-6, 1, 0),
    new THREE.Vector3(-4, 0, 0),
    new THREE.Vector3(-2, 1, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 1, 0),
    new THREE.Vector3(4, 0, 0),
    new THREE.Vector3(6, 1, 0),
    new THREE.Vector3(8, 0, 0),
    new THREE.Vector3(10, 1, 0),
    new THREE.Vector3(12, 0, 0),
    new THREE.Vector3(14, 1, 0),
    new THREE.Vector3(16, 0, 0),
    new THREE.Vector3(18, 1, 0),
    new THREE.Vector3(20, 0, 0),
  ];

  // Store animated points and original points
  const pointsRef = useRef(initialPoints.map((p) => p.clone()));
  const originalPoints = useRef(initialPoints.map((p) => p.clone()));

  // Create a smooth curve path
  curveRef.current = new THREE.CatmullRomCurve3(pointsRef.current);

  // Create tube geometry along the curve
  const tubeGeometry = useRef(
    new THREE.TubeGeometry(curveRef.current, 200, 0.15, 8, false)
  );

  // Animate mesh moving left to right continuously
  useEffect(() => {
    if (meshRef.current) {
      // Start from -4
      meshRef.current.position.x = -4;

      // Infinite loop animation along x-axis
      animationRef.current = gsap.timeline({
        repeat: -1,
        paused: straighten, // paused if straighten = true
      });
      animationRef.current.to(meshRef.current.position, {
        x: 4,
        duration: 2.6,
        ease: "linear",
        onComplete: () => {
          // Reset instantly for seamless loop
          gsap.set(meshRef.current.position, { x: -4 });
        },
      });
    }

    return () => {
      if (animationRef.current) animationRef.current.kill(); // cleanup GSAP
    };
  }, []);

  // Toggle between straight and curved line
  useEffect(() => {
    if (animationRef.current) {
      straighten ? animationRef.current.pause() : animationRef.current.resume();
    }

    // Animate curve points
    pointsRef.current.forEach((point, index) => {
      const targetY = straighten ? 0 : originalPoints.current[index].y;
      gsap.to(point, {
        y: targetY,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          // Update curve and regenerate geometry
          curveRef.current = new THREE.CatmullRomCurve3(pointsRef.current);
          tubeGeometry.current.dispose();
          tubeGeometry.current = new THREE.TubeGeometry(
            curveRef.current,
            200,
            0.15,
            16,
            false
          );
          if (meshRef.current) {
            meshRef.current.geometry = tubeGeometry.current;
          }
        },
      });
    });
  }, [straighten]);

  // Change color on hover (⚠️ keep this black/gray as it is, no white replacement)
  useEffect(() => {
    if (meshRef.current) {
      const targetColor = NavBoxHovered
        ? new THREE.Color("black")
        : new THREE.Color("gray");

      gsap.to(meshRef.current.material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [NavBoxHovered]);

  return (
    <mesh
      ref={meshRef}
      geometry={tubeGeometry.current}
      position={[-4, -0.2, 3.2]} // mesh positioned slightly below
    >
      <meshStandardMaterial />
    </mesh>
  );
};

const NavBox = ({ straighten, NavBoxHovered }) => {
  return (
    <Canvas gl={{ powerPreference: "high-performance" }}>
      <ambientLight intensity={2} /> {/* white light for illumination */}
      <NavModel straighten={straighten} NavBoxHovered={NavBoxHovered} />
    </Canvas>
  );
};

export default NavBox;
