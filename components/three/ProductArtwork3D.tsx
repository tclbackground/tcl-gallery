"use client";

import {
  Canvas,
  useFrame,
  useLoader,
} from "@react-three/fiber";

import {
  Environment,
} from "@react-three/drei";

import * as THREE from "three";

import {
  useMemo,
  useRef,
} from "react";


/* =========================================
   TYPES
========================================= */

type ProductArtwork3DProps = {
  imageUrl: string;

  aspectRatio?: number;

  frameWidth?: number;

  passepartoutWidth?: number;

  displayMode?: "frame" | "canvas";
};


type ProductFrameModelProps = {
  imageUrl: string;
frameImage?: string;
  aspectRatio: number;

  frameWidth: number;

  passepartoutWidth: number;

  displayMode: "frame" | "canvas";
};


/* =========================================
   PRODUCT FRAME MODEL
========================================= */

function ProductFrameModel({
  imageUrl,
  aspectRatio,
  frameWidth,
  passepartoutWidth,
  displayMode,
}: ProductFrameModelProps) {
  const groupRef =
    useRef<THREE.Group>(null);


  /* =========================================
     LOAD ARTWORK
  ========================================= */

  const texture =
    useLoader(
      THREE.TextureLoader,
      imageUrl
    );


  /* =========================================
     TEXTURE SETTINGS
  ========================================= */

  useMemo(() => {
    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.minFilter =
      THREE.LinearFilter;

    texture.magFilter =
      THREE.LinearFilter;

    texture.generateMipmaps =
      false;

    texture.needsUpdate =
      true;
  }, [texture]);


  /* =========================================
     SAFE ASPECT RATIO
  ========================================= */

  const safeRatio =
    Number.isFinite(aspectRatio) &&
    aspectRatio > 0
      ? aspectRatio
      : 0.75;


  /* =========================================
     ARTWORK ORIENTATION

     Landscape → wide frame
     Portrait → tall frame
     Square → square frame
  ========================================= */

  const isLandscape =
    safeRatio > 1.05;

  const isPortrait =
    safeRatio < 0.95;


  /* =========================================
     ARTWORK DIMENSIONS
  ========================================= */

  const maxDimension = 12;

  const maxWidth = 13;

  let artworkWidth: number;

  let artworkHeight: number;


  if (isLandscape) {
    artworkWidth =
      maxWidth;

    artworkHeight =
      artworkWidth /
      safeRatio;
  }

  else if (isPortrait) {
    artworkHeight =
      maxDimension;

    artworkWidth =
      artworkHeight *
      safeRatio;
  }

  else {
    artworkWidth =
      maxDimension;

    artworkHeight =
      maxDimension;
  }


  /* =========================================
     PRODUCT FRAME DIMENSIONS

     Convert inches into 3D scale.

     Example:

     A3 → 0.5 inch frame
     A2 → 1 inch frame
     A1 → 0.2 inch frame
  ========================================= */

  const frameScale = 0.62;

  const frameThickness =
    Math.max(
      0.12,
      frameWidth * frameScale
    );


  const frameDepth = 0.8;


  /* =========================================
     PASSEPARTOUT

     A1 sends:

     passepartoutWidth = 0

     Therefore no mat board.
  ========================================= */

  const hasPassepartout =
    Number.isFinite(
      passepartoutWidth
    ) &&
    passepartoutWidth > 0;


  const passepartoutScale =
    0.72;


  const matSize =
    hasPassepartout
      ? passepartoutWidth *
        passepartoutScale
      : 0;


  const matDepth =
    hasPassepartout
      ? 0.18
      : 0;


  /* =========================================
     OUTER DIMENSIONS
  ========================================= */

  const outerWidth =
    artworkWidth +
    matSize * 2 +
    frameThickness * 2;


  const outerHeight =
    artworkHeight +
    matSize * 2 +
    frameThickness * 2;


  /* =========================================
     SUBTLE PRODUCT MOVEMENT
  ========================================= */

  useFrame((state) => {
    if (!groupRef.current) return;

    const time =
      state.clock.getElapsedTime();


    const autoRotation =
      Math.sin(time * 0.35) *
      0.045;


    const pointerRotation =
      state.pointer.x *
      0.035;


    groupRef.current.rotation.y =
      autoRotation +
      pointerRotation;


    groupRef.current.rotation.x =
      state.pointer.y *
      0.008;


    groupRef.current.position.y =
      Math.sin(time * 0.7) *
      0.05;
  });


  /* =========================================
     STRETCHED CANVAS
  ========================================= */

  if (displayMode === "canvas") {
    return (
      <group ref={groupRef}>

        {/* Canvas depth */}

        <mesh
          position={[0, 0, -0.35]}
          castShadow
        >
          <boxGeometry
            args={[
              artworkWidth,
              artworkHeight,
              0.7,
            ]}
          />

          <meshStandardMaterial
            color="#E8E3DA"
            roughness={0.85}
          />
        </mesh>


        {/* Artwork */}

        <mesh
          position={[0, 0, 0.02]}
        >
          <planeGeometry
            args={[
              artworkWidth,
              artworkHeight,
            ]}
          />

          <meshBasicMaterial
            map={texture}
            toneMapped={false}
          />
        </mesh>

      </group>
    );
  }


  /* =========================================
     FRAMED ARTWORK
  ========================================= */

  return (
    <group ref={groupRef}>

      {/* ===============================
          WALL CONTACT SHADOW
      =============================== */}

      <mesh
        position={[
          0.28,
          -0.22,
          -0.72,
        ]}
        scale={[
          1.04,
          1.04,
          1,
        ]}
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


      {/* ===============================
          BACK PANEL
      =============================== */}

      <mesh
        position={[
          0,
          0,
          -0.32,
        ]}
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


      {/* ===============================
          TOP FRAME
      =============================== */}

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
          color="#121418"
          roughness={0.28}
          metalness={0.14}
        />
      </mesh>


      {/* ===============================
          BOTTOM FRAME
      =============================== */}

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
          color="#121418"
          roughness={0.28}
          metalness={0.14}
        />
      </mesh>


      {/* ===============================
          LEFT FRAME
      =============================== */}

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
          color="#121418"
          roughness={0.28}
          metalness={0.14}
        />
      </mesh>


      {/* ===============================
          RIGHT FRAME
      =============================== */}

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
          color="#121418"
          roughness={0.28}
          metalness={0.14}
        />
      </mesh>


      {/* ===============================
          INNER RECESSED SHADOW

          Only needed when passepartout
          exists.
      =============================== */}

      {hasPassepartout && (
        <mesh
          position={[
            0,
            0,
            0.1,
          ]}
        >
          <boxGeometry
            args={[
              artworkWidth +
                matSize * 2.1,

              artworkHeight +
                matSize * 2.1,

              0.12,
            ]}
          />

          <meshStandardMaterial
            color="#090909"
            roughness={0.7}
          />
        </mesh>
      )}


      {/* ===============================
          PASSEPARTOUT / MAT BOARD

          A1 = 0

          Therefore this entire mesh
          does not exist.
      =============================== */}

      {hasPassepartout && (
        <mesh
          position={[
            0,
            0,
            0.16,
          ]}
          receiveShadow
        >
          <boxGeometry
            args={[
              artworkWidth +
                matSize * 2,

              artworkHeight +
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


      {/* ===============================
          ARTWORK
      =============================== */}

      <mesh
        position={[
          0,
          0,
          hasPassepartout
            ? 0.275
            : 0.18,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={[
            artworkWidth,
            artworkHeight,
          ]}
        />

        <meshBasicMaterial
          map={texture}
          toneMapped={false}
        />
      </mesh>


      {/* ===============================
          GLASS
      =============================== */}

      <mesh
        position={[
          0,
          0,
          hasPassepartout
            ? 0.31
            : 0.215,
        ]}
      >
        <planeGeometry
          args={[
            artworkWidth,
            artworkHeight,
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

    </group>
  );
}


/* =========================================
   PRODUCT ARTWORK 3D
========================================= */

export default function ProductArtwork3D({
  imageUrl,
  aspectRatio = 0.75,
  frameWidth = 0.5,
  passepartoutWidth = 0,
  displayMode = "frame",
}: ProductArtwork3DProps) {
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

        {/* ===============================
            AMBIENT LIGHT
        =============================== */}

        <ambientLight
          intensity={1.15}
        />


        {/* ===============================
            MAIN LIGHT
        =============================== */}

        <directionalLight
          position={[
            6,
            8,
            10,
          ]}
          intensity={2.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
        />


        {/* ===============================
            FILL LIGHT
        =============================== */}

        <directionalLight
          position={[
            -6,
            3,
            6,
          ]}
          intensity={0.75}
        />


        {/* ===============================
            TOP LIGHT
        =============================== */}

        <pointLight
          position={[
            0,
            8,
            6,
          ]}
          intensity={1.2}
          distance={20}
        />


        {/* ===============================
            PRODUCT FRAME
        =============================== */}

        <ProductFrameModel
          imageUrl={imageUrl}
          
          aspectRatio={aspectRatio}
          frameWidth={frameWidth}
          passepartoutWidth={
            passepartoutWidth
          }
          displayMode={displayMode}
        />


        {/* ===============================
            STUDIO ENVIRONMENT
        =============================== */}

        <Environment
          preset="studio"
        />

      </Canvas>
    </div>
  );
}