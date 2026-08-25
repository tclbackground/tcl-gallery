"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type Artwork3DProps = {
  imageUrl: string;
  aspectRatio?: number;

  frameColor?: string;
  frameThickness?: number;
  frameDepth?: number;
  material?: "wood" | "synthetic" | "metal";
  matSize?: number;
  showPassepartout?: boolean;
};

type FrameModelProps = {
  imageUrl: string;
  aspectRatio: number;

  frameColor: string;
  frameThickness: number;
  frameDepth: number;
  material: "wood" | "synthetic" | "metal";
  matSize: number;
  showPassepartout: boolean;
};

function FrameModel({
  imageUrl,
  aspectRatio,
  frameColor,
  frameThickness,
  frameDepth,
  material,
  matSize,
  showPassepartout,
}: FrameModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = useLoader(THREE.TextureLoader, imageUrl);

  const dimensions = useMemo(() => {
    const maxHeight = 12;
    const maxWidth = 13;

    let artworkWidth = maxHeight * aspectRatio;
    let artworkHeight = maxHeight;

    if (artworkWidth > maxWidth) {
      artworkWidth = maxWidth;
      artworkHeight = maxWidth / aspectRatio;
    }

    return {
      artworkWidth,
      artworkHeight,
    };
  }, [aspectRatio]);

  const actualMatSize = showPassepartout ? matSize : 0;

  const outerWidth =
    dimensions.artworkWidth +
    actualMatSize * 2 +
    frameThickness * 2;

  const outerHeight =
    dimensions.artworkHeight +
    actualMatSize * 2 +
    frameThickness * 2;

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
  }, [texture]);

  const materialProperties = useMemo(() => {
    switch (material) {
      case "metal":
        return {
          roughness: 0.22,
          metalness: 0.55,
        };

      case "synthetic":
        return {
          roughness: 0.35,
          metalness: 0.08,
        };

      case "wood":
      default:
        return {
          roughness: 0.42,
          metalness: 0.04,
        };
    }
  }, [material]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    const autoRotation = Math.sin(time * 0.35) * 0.045;

    const pointerRotation = state.pointer.x * 0.035;

    groupRef.current.rotation.y =
      autoRotation + pointerRotation;

    groupRef.current.rotation.x =
      state.pointer.y * 0.008;

    groupRef.current.position.y =
      Math.sin(time * 0.7) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* BACK DEPTH */}

      <mesh
        position={[0, 0, -frameDepth * 0.42]}
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
          color={frameColor}
          roughness={0.5}
          metalness={0.04}
        />
      </mesh>

      {/* TOP FRAME */}

      <mesh
        position={[
          0,
          outerHeight / 2 - frameThickness / 2,
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
          roughness={materialProperties.roughness}
          metalness={materialProperties.metalness}
        />
      </mesh>

      {/* BOTTOM FRAME */}

      <mesh
        position={[
          0,
          -outerHeight / 2 + frameThickness / 2,
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
          roughness={materialProperties.roughness}
          metalness={materialProperties.metalness}
        />
      </mesh>

      {/* LEFT FRAME */}

      <mesh
        position={[
          -outerWidth / 2 + frameThickness / 2,
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
          roughness={materialProperties.roughness}
          metalness={materialProperties.metalness}
        />
      </mesh>

      {/* RIGHT FRAME */}

      <mesh
        position={[
          outerWidth / 2 - frameThickness / 2,
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
          roughness={materialProperties.roughness}
          metalness={materialProperties.metalness}
        />
      </mesh>

      {/* INNER SHADOW */}

      <mesh position={[0, 0, frameDepth * 0.1]}>
        <boxGeometry
          args={[
            dimensions.artworkWidth +
              actualMatSize * 2.15,
            dimensions.artworkHeight +
              actualMatSize * 2.15,
            0.1,
          ]}
        />

        <meshStandardMaterial
          color="#080808"
          roughness={0.8}
        />
      </mesh>

      {/* PASSEPARTOUT */}

      {showPassepartout && (
        <mesh
          position={[0, 0, frameDepth * 0.16]}
          receiveShadow
        >
          <boxGeometry
            args={[
              dimensions.artworkWidth +
                actualMatSize * 2,
              dimensions.artworkHeight +
                actualMatSize * 2,
              0.18,
            ]}
          />

          <meshStandardMaterial
            color="#F4F1EB"
            roughness={0.92}
            metalness={0}
          />
        </mesh>
      )}

      {/* ARTWORK */}

      <mesh
        position={[
          0,
          0,
          frameDepth * 0.28,
        ]}
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
        position={[
          0,
          0,
          frameDepth * 0.3,
        ]}
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
          -dimensions.artworkWidth * 0.18,
          0,
          frameDepth * 0.31,
        ]}
        rotation={[0, 0, -0.22]}
      >
        <planeGeometry
          args={[
            dimensions.artworkWidth * 0.16,
            dimensions.artworkHeight * 1.4,
          ]}
        />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.025}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Artwork3D({
  imageUrl,
  aspectRatio = 0.75,

  frameColor = "#121418",
  frameThickness = 0.62,
  frameDepth = 0.8,
  material = "wood",
  matSize = 0.72,
  showPassepartout = true,
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
        <ambientLight intensity={1.15} />

        <directionalLight
          position={[6, 8, 10]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
        />

        <directionalLight
          position={[-6, 3, 6]}
          intensity={0.75}
        />

        <pointLight
          position={[0, 8, 6]}
          intensity={1.2}
          distance={20}
        />

        <FrameModel
          imageUrl={imageUrl}
          aspectRatio={aspectRatio}
          frameColor={frameColor}
          frameThickness={frameThickness}
          frameDepth={frameDepth}
          material={material}
          matSize={matSize}
          showPassepartout={showPassepartout}
        />

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}