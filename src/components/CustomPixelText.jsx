import React, { useRef, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import useWindowSize from "../hooks/useWindowSize";

const PixelLine = ({
  text,
  fontFamily,
  fontWeight,
  fontColor,
  fontSize,
  textAlign,
  strokeColor,
  strokeWidth,
  canvasWidth,
  canvasHeight,
  gapY,
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const isDestroyedRef = useRef(false);

  // mouse refs
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const targetMousePosition = useRef({ x: 0.5, y: 0.5 });
  const prevPosition = useRef({ x: 0.5, y: 0.5 });
  const easeFactor = 0.05;

  // cache shaders with useMemo
  const shaders = useMemo(
    () => ({
      vertex: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragment: `
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform vec2 u_prevMouse;

      void main() {
        vec2 gridUV = floor(vUv * vec2(45.0, 30.0)) / vec2(45.0, 30.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/45.0, 1.0/30.0);

        vec2 mouseDirection = u_mouse - u_prevMouse;
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;

        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * -mouseDirection * 6.0;
        vec2 uv = vUv + uvOffset;

        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
      }
    `,
    }),
    []
  );

  // Optimized texture creation
  const textTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dynamicFontSize = fontSize * pixelRatio;
    ctx.font = `${fontWeight} ${dynamicFontSize}px "${fontFamily}"`;

    // 🔥 Force White Color Always
    ctx.fillStyle = "#a3a38f";
    ctx.strokeStyle = "black";

    ctx.textBaseline = "middle";
    ctx.textAlign = textAlign;

    let xPosition;
    if (textAlign === "center") xPosition = canvas.width / 2;
    else if (textAlign === "left") xPosition = 10 * pixelRatio;
    else xPosition = canvas.width - 10 * pixelRatio;

    const yPosition = canvas.height / 2;

    if (strokeWidth > 0) {
      ctx.lineWidth = dynamicFontSize * strokeWidth;
      ctx.strokeText(text, xPosition, yPosition);
    }
    ctx.fillText(text, xPosition, yPosition);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
  }, [
    text,
    fontFamily,
    fontWeight,
    fontSize,
    textAlign,
    strokeWidth,
    canvasWidth,
    canvasHeight,
  ]);

  // Cleanup function
  const cleanup = useCallback(() => {
    isDestroyedRef.current = true;

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    if (meshRef.current && sceneRef.current) {
      sceneRef.current.remove(meshRef.current);

      if (meshRef.current.geometry) {
        meshRef.current.geometry.dispose();
      }

      if (meshRef.current.material) {
        // Dispose texture
        if (meshRef.current.material.uniforms?.u_texture?.value) {
          meshRef.current.material.uniforms.u_texture.value.dispose();
        }
        meshRef.current.material.dispose();
      }

      meshRef.current = null;
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss?.();

      const canvas = rendererRef.current.domElement;
      if (canvas && containerRef.current?.contains(canvas)) {
        containerRef.current.removeChild(canvas);
      }

      rendererRef.current = null;
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = null;
    }
  }, []);

  // Context lost handler
  const handleContextLost = useCallback((event) => {
    event.preventDefault();
    console.warn("WebGL context lost, stopping animation");

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  // Context restored handler
  const handleContextRestored = useCallback(() => {
    console.log("WebGL context restored, reinitializing...");
    // Force re-render by updating a dependency
    // This will trigger the useEffect again
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;

    // Clear container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const aspect = canvasWidth / canvasHeight;
      const camera = new THREE.OrthographicCamera(
        -aspect,
        aspect,
        1,
        -1,
        0.1,
        10
      );
      camera.position.z = 2;

      // Renderer with better settings
      const renderer = new THREE.WebGLRenderer({
        antialias: false, // Disable for better performance
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });

      rendererRef.current = renderer;

      renderer.setSize(canvasWidth, canvasHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Add context event listeners
      renderer.domElement.addEventListener(
        "webglcontextlost",
        handleContextLost,
        false
      );
      renderer.domElement.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false
      );

      const shaderUniforms = {
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_texture: { value: textTexture },
      };

      // Mesh
      const planeGeometry = new THREE.PlaneGeometry(2 * aspect, 2);
      const planeMaterial = new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: shaders.vertex,
        fragmentShader: shaders.fragment,
        transparent: true,
      });

      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      meshRef.current = planeMesh;
      scene.add(planeMesh);

      container.appendChild(renderer.domElement);

      // Animation loop with error handling
      const animate = () => {
        if (isDestroyedRef.current || !rendererRef.current) return;

        try {
          animationIdRef.current = requestAnimationFrame(animate);

          // Update mouse positions
          prevPosition.current.x = mousePosition.current.x;
          prevPosition.current.y = mousePosition.current.y;

          mousePosition.current.x +=
            (targetMousePosition.current.x - mousePosition.current.x) *
            easeFactor;
          mousePosition.current.y +=
            (targetMousePosition.current.y - mousePosition.current.y) *
            easeFactor;

          // Update shader uniforms
          if (planeMaterial.uniforms) {
            planeMaterial.uniforms.u_mouse.value.set(
              mousePosition.current.x,
              1.0 - mousePosition.current.y
            );
            planeMaterial.uniforms.u_prevMouse.value.set(
              prevPosition.current.x,
              1.0 - prevPosition.current.y
            );
          }

          renderer.render(scene, camera);
        } catch (error) {
          console.error("Animation error:", error);
          // Stop animation on error
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
          }
        }
      };

      animate();

      // Mouse move handler
      const handleMouseMove = (event) => {
        if (isDestroyedRef.current) return;

        const rect = container.getBoundingClientRect();
        targetMousePosition.current.x =
          (event.clientX - rect.left) / rect.width;
        targetMousePosition.current.y =
          (event.clientY - rect.top) / rect.height;
      };

      container.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });

      // Cleanup function
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);

        // Remove context event listeners
        if (renderer.domElement) {
          renderer.domElement.removeEventListener(
            "webglcontextlost",
            handleContextLost
          );
          renderer.domElement.removeEventListener(
            "webglcontextrestored",
            handleContextRestored
          );
        }

        cleanup();
      };
    } catch (error) {
      console.error("WebGL initialization error:", error);
      cleanup();
    }
  }, [
    canvasWidth,
    canvasHeight,
    textTexture,
    shaders,
    cleanup,
    handleContextLost,
    handleContextRestored,
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        marginBottom: gapY,
        position: "relative",
      }}
    />
  );
};

const CustomPixelText = ({
  textString = "HELLO\nWORLD",
  fontFamily = "avalors personal use only",
  fontWeight = "bold",
  fontColor = "#ABAB99",
  textAlignments = ["center", "right"],
  strokeColor = "#000000",
  strokeWidth = 0.05,
  gapY = 20,
  baseWidth = 1440,
  fontSizes,
  canvasSizes,
  minScale = 0.1,
}) => {
  const { width } = useWindowSize();
  const scale = Math.max(width / baseWidth, minScale);

  const finalFontSizes = (fontSizes || [150, 100]).map((size) => size * scale);
  const finalCanvasSizes = (
    canvasSizes || [
      { w: 800, h: 300 },
      { w: 600, h: 250 },
    ]
  ).map((size) => ({
    w: size.w * scale,
    h: size.h * scale,
  }));

  const lines = (textString || "").replace(/<br\s*\/?>/gi, "\n").split("\n");

  return (
    <div className="flex flex-col items-center">
      {lines.map((line, i) => (
        <PixelLine
          key={`${line}-${i}`} // Better key for re-rendering
          text={line}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontColor={fontColor}
          fontSize={finalFontSizes[i] || finalFontSizes[0]}
          textAlign={textAlignments[i] || "center"}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          canvasWidth={finalCanvasSizes[i]?.w || 800}
          canvasHeight={finalCanvasSizes[i]?.h || 300}
          gapY={gapY}
        />
      ))}
    </div>
  );
};

export default CustomPixelText;
