"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

function Frame({
  artwork,
  width = 24,
  height = 18,
}: {
  artwork: string;
  width?: number;
  height?: number;
}) {
  const [baseColor, normalMap, roughnessMap, artworkTexture] = useTexture([
    "/textures/blackwood/basecolor.png",
    "/textures/blackwood/normal.png",
    "/textures/blackwood/roughness.png",
    artwork,
  ]);

  baseColor.wrapS = baseColor.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;

  const scale = 0.1;

  const frameWidth = width * scale;
  const frameHeight = height * scale;

  const border = 0.15;
  const depth = 0.12;

  const frameMaterial = new THREE.MeshStandardMaterial({
    map: baseColor,
    normalMap,
    roughnessMap,
    roughness: 0.45,
    metalness: 0,
  });

  return (
    <group>
      {/* Artwork */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[frameWidth, frameHeight]} />
        <meshStandardMaterial map={artworkTexture} />
      </mesh>

      {/* Top */}
      <mesh position={[0, frameHeight / 2 + border / 2, 0]}>
        <boxGeometry args={[frameWidth + border * 2, border, depth]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Bottom */}
      <mesh position={[0, -frameHeight / 2 - border / 2, 0]}>
        <boxGeometry args={[frameWidth + border * 2, border, depth]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Left */}
      <mesh position={[-frameWidth / 2 - border / 2, 0, 0]}>
        <boxGeometry args={[border, frameHeight, depth]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>

      {/* Right */}
      <mesh position={[frameWidth / 2 + border / 2, 0, 0]}>
        <boxGeometry args={[border, frameHeight, depth]} />
        <primitive object={frameMaterial} attach="material" />
      </mesh>
    </group>
  );
}

export default function PhotoFrame3D() {
  return (
    <div className="h-[600px] w-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
        <ambientLight intensity={1.5} />

        <directionalLight position={[3, 4, 5]} intensity={2} />

        <Frame
          artwork="images/artwork/a-door-to-some-where-beautiful.jpeg"
          width={24}
          height={18}
        />

        <OrbitControls enableZoom />
      </Canvas>
    </div>
  );
}