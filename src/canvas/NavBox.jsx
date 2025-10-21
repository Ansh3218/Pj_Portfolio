import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const NavModel = ({ straighten, NavBoxHovered }) => {
  const meshRef = useRef();
  const curveRef = useRef();
  const animationRef = useRef();

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

  const pointsRef = useRef(initialPoints.map((p) => p.clone()));
  const originalPoints = useRef(initialPoints.map((p) => p.clone()));

  curveRef.current = new THREE.CatmullRomCurve3(pointsRef.current);

  const tubeGeometry = useRef(
    new THREE.TubeGeometry(curveRef.current, 200, 0.15, 8, false)
  );

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.x = -4;

      animationRef.current = gsap.timeline({
        repeat: -1,
        paused: false, // 👈 Initially false rakho
      });

      animationRef.current.to(meshRef.current.position, {
        x: 4,
        duration: 2.6,
        ease: "linear",
        onComplete: () => {
          gsap.set(meshRef.current.position, { x: -4 });
        },
      });
    }

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, []);

  // 👇 Yeh effect straighten prop ke change pe trigger hoga
  useEffect(() => {
    console.log("Straighten changed:", straighten); // Debug ke liye

    if (animationRef.current) {
      if (straighten) {
        animationRef.current.pause();
      } else {
        animationRef.current.resume();
      }
    }

    // Animate curve points
    pointsRef.current.forEach((point, index) => {
      const targetY = straighten ? 0 : originalPoints.current[index].y;

      gsap.to(point, {
        y: targetY,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
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
  }, [straighten]); // 👈 Dependency array mein straighten hai

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
      position={[-4, -0.2, 3.2]}
    >
      <meshStandardMaterial />
    </mesh>
  );
};

const NavBox = ({ straighten, NavBoxHovered }) => {
  return (
    <Canvas gl={{ powerPreference: "high-performance" }}>
      <ambientLight intensity={2} />
      <NavModel straighten={straighten} NavBoxHovered={NavBoxHovered} />
    </Canvas>
  );
};

export default NavBox;
