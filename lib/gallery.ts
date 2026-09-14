// Original reference artwork; source URLs are recorded in public/images/gallery/sources.json.
// The widths, order, and entrance transforms follow the reference's three gallery rows.
export type GalleryImage = {
  file: string;
  alt: string;
  width: number;
  zoom?: number;
  background?: string;
  entrance?: { x?: number; y?: number; scale?: number; rotate?: number; rotateX?: number; rotateY?: number };
};

const rise = { y: 1000, scale: 2, rotateX: 30 };

export const galleryRows: { height: number; drift: [number, number]; images: GalleryImage[] }[] = [
  {
    height: 317,
    drift: [-90, -160],
    images: [
      { file: "CAnTuyC7rYGbO1sbhC8LNj6E", alt: "Natural supplements product advertising design", width: 297.85, entrance: { x: -1500, y: 300, scale: 2.5, rotate: -5, rotateY: 70 } },
      { file: "xU3Y5CRvHR14O0gvFohqrB3Yk", alt: "Laptop website presentation on a yellow background", width: 482, zoom: 1.37, background: "#ffe063" },
      { file: "am0JIL2cCzcIYLmZLvS6WH9le3w", alt: "B2B growth website presented on a tablet", width: 297.85, entrance: { x: -1800, y: 900, scale: 2.5, rotate: -15, rotateY: 90 } },
      { file: "Q0EhmPUW3FYrVagtcCUuSyJMDvk", alt: "Luxury watch website in a black laptop mockup", width: 297.85, entrance: { x: -600, y: -200, scale: 1.5, rotate: 5, rotateY: 50 } },
      { file: "D5to85TmmFI4rAuvfbNqLXriSc", alt: "Chainora Web3 website with violet lighting", width: 482 },
      { file: "nqWPDqP2Irs65djTJlJLtKJ5SI", alt: "Green finance dashboard website", width: 297.85, entrance: { x: -2800, y: 400, scale: 3, rotate: -5, rotateY: 100 } },
      { file: "i916afitKfiXJSseSlUPBigThAY", alt: "Projector advertising artwork", width: 297.85, entrance: rise },
      { file: "gyO7XGlp9Yni2YeIKMM32BcJRA", alt: "Colorful product campaign artwork", width: 298, entrance: { x: -1800, y: -900, scale: 2.5, rotate: 15, rotateY: 90 } },
    ],
  },
  {
    height: 311,
    drift: [165, 294],
    images: [
      { file: "WM37fJNWkOHdwpPvGrRSVJthUtI", alt: "Square product campaign design", width: 292.21, entrance: { x: -600, y: 200, scale: 1.5, rotate: -5, rotateY: 50 } },
      { file: "oXx5YN6Rc4ffiyEC9Ma4Yi0BM", alt: "Security camera advertising design", width: 292.21, entrance: { x: -200, y: 350, scale: 1.5, rotate: -5, rotateY: 25 } },
      { file: "b4CY8gkPahGjizIhAciARATwzlk", alt: "Nexora analytics dashboard in a laptop mockup", width: 482 },
      { file: "oRhHTzpqddTThlSWiKtFphEd21E", alt: "Solar power website with a modern home", width: 482 },
      { file: "8fO9XaNyKpuVdGGfeDDRzGUgInY", alt: "Dark Web3 services interface", width: 482 },
      { file: "sttHb559xjXgWpZ62JkaQjSZN8U", alt: "Nexus digital collectibles website", width: 482 },
      { file: "K5ZYk6KiG3VZB1CsIfLWWHiek", alt: "Square brand campaign artwork", width: 292.21, entrance: { x: -600, y: 500, scale: 1.5, rotate: 5, rotateY: 70 } },
      { file: "FyBg39SgHwjd3nWZVqrXWBJzjk", alt: "Colorful social campaign design", width: 292.21, entrance: { x: -200, y: -350, scale: 1.5, rotate: 5, rotateY: 25 } },
    ],
  },
  {
    height: 312,
    drift: [-160, -286],
    images: [
      { file: "ektPYkRwXdAGe7RkgchAZ4fSmk", alt: "Portrait format brand poster", width: 293.15, entrance: rise },
      { file: "00percz9Dsm8T9bbRGe5AxQqic", alt: "Colorful advertising poster", width: 293.15, entrance: rise },
      { file: "WM8gQoz00dgaQ7eyaW0taPHq0", alt: "Bright school campaign design", width: 293.15, entrance: rise },
      { file: "n4xJE7DTHUZ93mTRnbi4Xri0jJo", alt: "Nexus collectibles website with a glowing violet portrait", width: 298, entrance: { x: -3400, y: 1200, scale: 2.5, rotate: -5, rotateY: 100 } },
      { file: "g1VFefknZSeoiT4BVjChP4fdE", alt: "Nexora analytics website and dashboard", width: 482, zoom: 1.44 },
      { file: "mSAHUvCX34mHcptANvUCPc", alt: "Solar panel website in a laptop mockup", width: 293.15, entrance: rise },
      { file: "ybvhXwGpxN1X6bd9nXlTwsSLwWk", alt: "All-in-one workspace product website", width: 482 },
      { file: "vAnV0Iqejx7KLDiOALy7fNBrEY", alt: "Explore space astronaut artwork", width: 293.15, entrance: { y: 400, scale: 1.5, rotateX: 20 } },
      { file: "6bd3nMepnkBDyJdUje3gSO7bp6Y", alt: "Portrait format creative campaign artwork", width: 293.15, entrance: rise },
    ],
  },
];
