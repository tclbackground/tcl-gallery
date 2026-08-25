export type ArtworkSize = "A3" | "A2" | "A1";

export type ArtworkFinish = "framed" | "canvas";

export type FrameType = {
  id: string;
  name: string;
  image: string;
  frameColor: string;
  additionalPrice?: number;
};

export type FrameSizeConfig = {
  price: number;
  frameWidth: number;
  passepartoutWidth: number;
  frameTypes: FrameType[];
};

export const FRAME_CONFIG: Record<
  ArtworkSize,
  FrameSizeConfig
> = {
  /* =========================================
     A3
  ========================================= */

  A1: {
    price: 5000,

    // 0.2 inch frame
    frameWidth: 0.2,

    // 1 inch passepartout
    passepartoutWidth: 0,

    frameTypes: [
      {
        id: "a3-black",
        name: "Black",
        image: "/images/frames/A3/black.png",
        frameColor: "#1A1A1A",
      },

      {
        id: "a3-white",
        name: "White",
        image: "/images/frames/A3/white.png",
        frameColor: "#F5F5F0",
      },
    ],
  },

  /* =========================================
     A2
  ========================================= */

  A2: {
    price: 10000,

    // 1 inch frame
    frameWidth: 1,

    // 1.5 inch passepartout
    passepartoutWidth: 1.5,

    frameTypes: [
      {
        id: "a2-black",
        name: "Black",
        image: "/images/frames/A2/black.png",
        frameColor: "#1A1A1A",
      },

      {
        id: "a2-brown",
        name: "Brown",
        image: "/images/frames/A2/brown.png",
        frameColor: "#6B442B",
      },

      {
        id: "a2-gold-brushed",
        name: "Gold Brushed",
        image: "/images/frames/A2/gold-brushed.png",
        frameColor: "#B08D57",
      },

      {
        id: "a2-silver-brushed",
        name: "Silver Brushed",
        image: "/images/frames/A2/silver-brushed.png",
        frameColor: "#9A9A9A",
      },

      {
        id: "a2-silver",
        name: "Silver",
        image: "/images/frames/A2/Silver.png",
        frameColor: "#C0C0C0",
      },

      {
        id: "a2-walnut",
        name: "Walnut",
        image: "/images/frames/A2/walnut.png",
        frameColor: "#5B3A29",
      },

      {
        id: "a2-white",
        name: "White",
        image: "/images/frames/A2/white.png",
        frameColor: "#F5F5F0",
      },
    ],
  },

  /* =========================================
     A1
  ========================================= */

  A3: {
    price: 5000,

    // 0.2 inch synthetic frame
    frameWidth: 0.5,

    // No passepartout
    passepartoutWidth: 1.0,

    frameTypes: [
      {
        id: "a1-black",
        name: "Black",
        image: "/images/frames/A1/black.png",
        frameColor: "#111111",
      },

      {
        id: "a1-copper",
        name: "Copper",
        image: "/images/frames/A1/copper.png",
        frameColor: "#B87333",
      },

      {
        id: "a1-gold",
        name: "Gold",
        image: "/images/frames/A1/gold.png",
        frameColor: "#C9A227",
      },

      {
        id: "a1-walnut",
        name: "Walnut",
        image: "/images/frames/A1/walnut.png",
        frameColor: "#5B3A29",
      },

      {
        id: "a1-white",
        name: "White",
        image: "/images/frames/A1/white.png",
        frameColor: "#F5F5F0",
      },
    ],
  },
};

/* =========================================
   GET DEFAULT FRAME
========================================= */

export const getDefaultFrame = (
  size: ArtworkSize
): FrameType | undefined => {
  return FRAME_CONFIG[size]?.frameTypes?.[0];
};

/* =========================================
   GET FRAME WIDTH
========================================= */

export const getFrameWidth = (
  size: ArtworkSize
): number => {
  return FRAME_CONFIG[size]?.frameWidth ?? 0;
};

/* =========================================
   GET PASSEPARTOUT WIDTH
========================================= */

export const getPassepartoutWidth = (
  size: ArtworkSize,
  finish: ArtworkFinish = "framed"
): number => {
  // A2 stretched canvas
  if (size === "A2" && finish === "canvas") {
    return 0;
  }

  return FRAME_CONFIG[size]?.passepartoutWidth ?? 0;
};