"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

/* ==========================================
   TYPES
========================================== */

type Artwork3DProps = {
  imageUrl: string;
  aspectRatio?: number;

  frameImage?: string;
  frameType?: string;
  frameColor?: string;

  frameWidth?: number;
  passepartoutWidth?: number;

  displayMode?: "frame" | "canvas";
};

type FrameModelProps = {
  imageUrl: string;
  aspectRatio: number;

  frameImage?: string;
  frameType?: string;
  frameColor?: string;

  frameWidth?: number;
  passepartoutWidth?: number;

  displayMode?: "frame" | "canvas";
};

/* ==========================================
   FRAME MODEL
========================================== */

function FrameModel({
  imageUrl,
  aspectRatio,
  frameImage,
  frameType = "black",
  frameColor = "#121418",
  frameWidth = 0.62,
  passepartoutWidth = 0.72,
  displayMode = "frame",
}: FrameModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = useLoader(
    THREE.TextureLoader,
    imageUrl
  );

  /* ==========================================
     ARTWORK DIMENSIONS
  ========================================== */

  const dimensions = useMemo(() => {
    const maxHeight = 12;
    const maxWidth = 13;

    let artworkWidth =
      maxHeight * aspectRatio;

    let artworkHeight =
      maxHeight;

    if (artworkWidth > maxWidth) {
      artworkWidth = maxWidth;

      artworkHeight =
        maxWidth / aspectRatio;
    }

    return {
      artworkWidth,
      artworkHeight,
    };
  }, [aspectRatio]);

  /* ==========================================
     DYNAMIC DIMENSIONS
  ========================================== */

  const frameThickness = Math.max(
    0.3,
    Math.min(frameWidth, 1.2)
  );

  const frameDepth = 0.8;

  const matSize =
    displayMode === "canvas"
      ? 0
      : Math.max(
          0,
          passepartoutWidth
        );

  const matDepth =
    displayMode === "canvas"
      ? 0
      : 0.18;

  const outerWidth =
    displayMode === "canvas"
      ? dimensions.artworkWidth
      : dimensions.artworkWidth +
        matSize * 2 +
        frameThickness * 2;

  const outerHeight =
    displayMode === "canvas"
      ? dimensions.artworkHeight
      : dimensions.artworkHeight +
        matSize * 2 +
        frameThickness * 2;

  /* ==========================================
     TEXTURE SETTINGS
  ========================================== */

  useMemo(() => {
    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.minFilter =
      THREE.LinearFilter;

    texture.magFilter =
      THREE.LinearFilter;

    texture.generateMipmaps =
      false;

    texture.needsUpdate = true;
  }, [texture]);

  /* ==========================================
     SUBTLE 3D MOVEMENT
  ========================================== */

  useFrame((state) => {
    if (!groupRef.current) return;

    const time =
      state.clock.getElapsedTime();

    const autoRotation =
      Math.sin(time * 0.35) * 0.045;

    const pointerRotation =
      state.pointer.x * 0.035;

    groupRef.current.rotation.y =
      autoRotation +
      pointerRotation;

    groupRef.current.rotation.x =
      state.pointer.y * 0.008;

    groupRef.current.position.y =
      Math.sin(time * 0.7) *
      0.05;
  });

  return (
    <group ref={groupRef}>

      {/* ======================================
          CANVAS VERSION
      ====================================== */}

      {displayMode === "canvas" && (
        <>
          {/* CANVAS DEPTH */}

          <mesh
            position={[0, 0, -0.22]}
            castShadow
          >
            <boxGeometry
              args={[
                dimensions.artworkWidth,
                dimensions.artworkHeight,
                0.45,
              ]}
            />

            <meshStandardMaterial
              color="#E9E4DB"
              roughness={0.85}
              metalness={0}
            />
          </mesh>

          {/* ARTWORK */}

          <mesh
            position={[0, 0, 0.02]}
            receiveShadow
          >
            <planeGeometry
              args={[
                dimensions.artworkWidth,
                dimensions.artworkHeight,
              ]}
            />

            <meshBasicMaterial
              map={texture}
              toneMapped={false}
            />
          </mesh>
        </>
      )}

      {/* ======================================
          FRAMED VERSION
      ====================================== */}

      {displayMode === "frame" && (
        <>

          {/* WALL CONTACT SHADOW */}

          <mesh
            position={[
              0.28,
              -0.22,
              -0.72,
            ]}
            scale={[1.04, 1.04, 1]}
          >
            <boxGeometry
              args={[
                outerWidth,
                outerHeight,
                0.08,
              ]}
            />

            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.16}
              depthWrite={false}
            />
          </mesh>

          {/* BACK PANEL */}

          <mesh
            position={[0, 0, -0.32]}
            castShadow
          >
            <boxGeometry
              args={[
                outerWidth,
                outerHeight,
                frameDepth,
              ]}
            />

            <meshStandardMaterial
              color="#090A0C"
              roughness={0.42}
              metalness={0.08}
            />
          </mesh>

          {/* TOP FRAME */}

          <mesh
            position={[
              0,
              outerHeight / 2 -
                frameThickness / 2,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                outerWidth,
                frameThickness,
                frameDepth,
              ]}
            />

            <meshStandardMaterial
              color={frameColor}
              roughness={0.28}
              metalness={
                frameType === "metal"
                  ? 0.65
                  : 0.14
              }
            />
          </mesh>

          {/* BOTTOM FRAME */}

          <mesh
            position={[
              0,
              -outerHeight / 2 +
                frameThickness / 2,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                outerWidth,
                frameThickness,
                frameDepth,
              ]}
            />

            <meshStandardMaterial
              color={frameColor}
              roughness={0.28}
              metalness={
                frameType === "metal"
                  ? 0.65
                  : 0.14
              }
            />
          </mesh>

          {/* LEFT FRAME */}

          <mesh
            position={[
              -outerWidth / 2 +
                frameThickness / 2,
              0,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                frameThickness,
                outerHeight,
                frameDepth,
              ]}
            />

            <meshStandardMaterial
              color={frameColor}
              roughness={0.28}
              metalness={
                frameType === "metal"
                  ? 0.65
                  : 0.14
              }
            />
          </mesh>

          {/* RIGHT FRAME */}

          <mesh
            position={[
              outerWidth / 2 -
                frameThickness / 2,
              0,
              0,
            ]}
            castShadow
          >
            <boxGeometry
              args={[
                frameThickness,
                outerHeight,
                frameDepth,
              ]}
            />

            <meshStandardMaterial
              color={frameColor}
              roughness={0.28}
              metalness={
                frameType === "metal"
                  ? 0.65
                  : 0.14
              }
            />
          </mesh>

          {/* INNER SHADOW */}

          <mesh
            position={[0, 0, 0.1]}
          >
            <boxGeometry
              args={[
                dimensions.artworkWidth +
                  matSize * 2.1,
                dimensions.artworkHeight +
                  matSize * 2.1,
                0.12,
              ]}
            />

            <meshStandardMaterial
              color="#090909"
              roughness={0.7}
            />
          </mesh>

          {/* PASSEPARTOUT */}

          {matSize > 0 && (
            <mesh
              position={[0, 0, 0.16]}
              receiveShadow
            >
              <boxGeometry
                args={[
                  dimensions.artworkWidth +
                    matSize * 2,
                  dimensions.artworkHeight +
                    matSize * 2,
                  matDepth,
                ]}
              />

              <meshStandardMaterial
                color="#F4F1EB"
                roughness={0.9}
                metalness={0}
              />
            </mesh>
          )}

          {/* ARTWORK */}

          <mesh
            position={[0, 0, 0.275]}
            receiveShadow
          >
            <planeGeometry
              args={[
                dimensions.artworkWidth,
                dimensions.artworkHeight,
              ]}
            />

            <meshBasicMaterial
              map={texture}
              toneMapped={false}
            />
          </mesh>

          {/* GLASS */}

          <mesh
            position={[0, 0, 0.31]}
          >
            <planeGeometry
              args={[
                dimensions.artworkWidth,
                dimensions.artworkHeight,
              ]}
            />

            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.035}
              roughness={0.08}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.08}
            />
          </mesh>

          {/* GLASS REFLECTION */}

          <mesh
            position={[
              -dimensions.artworkWidth *
                0.18,
              0,
              0.325,
            ]}
            rotation={[0, 0, -0.22]}
          >
            <planeGeometry
              args={[
                dimensions.artworkWidth *
                  0.16,
                dimensions.artworkHeight *
                  1.4,
              ]}
            />

            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.025}
              depthWrite={false}
            />
          </mesh>

        </>
      )}
    </group>
  );
}

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function Artwork3D({
  imageUrl,
  aspectRatio = 0.75,

  frameImage,
  frameType = "black",
  frameColor = "#121418",

  frameWidth = 0.62,
  passepartoutWidth = 0.72,

  displayMode = "frame",
}: Artwork3DProps) {
  return (
    <div className="h-full w-full">

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 24],
          fov: 38,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >

        {/* AMBIENT LIGHT */}

        <ambientLight
          intensity={1.15}
        />

        {/* MAIN GALLERY LIGHT */}

        <directionalLight
          position={[6, 8, 10]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
        />

        {/* FILL LIGHT */}

        <directionalLight
          position={[-6, 3, 6]}
          intensity={0.75}
        />

        {/* TOP LIGHT */}

        <pointLight
          position={[0, 8, 6]}
          intensity={1.2}
          distance={20}
        />

        {/* ARTWORK */}

        <FrameModel
          imageUrl={imageUrl}
          aspectRatio={aspectRatio}
          frameImage={frameImage}
          frameType={frameType}
          frameColor={frameColor}
          frameWidth={frameWidth}
          passepartoutWidth={
            passepartoutWidth
          }
          displayMode={displayMode}
        />

        {/* STUDIO ENVIRONMENT */}

        <Environment preset="studio" />

      </Canvas>
    </div>
  );
}