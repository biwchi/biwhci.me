"use client";

import { useWindowSize } from "@/hooks";
import { useTheme } from "@/providers";
import { p5i, P5I } from "p5i";
import { useEffect, useRef } from "react";

import LEAF_IMAGE_DARK from "@/public/leaf_dark.png";
import LEAF_IMAGE_LIGHT from "@/public/leaf_light.png";

type Rotation = {
  axis: "x" | "y" | "z";
  value: number;
  speed: number;
  x: number;
};

type Leaf = {
  x: number;
  y: number;
  z: number;
  prevXSpeed: number;
  ySpeed: number;
  xSpeedVariation: number;
  rotation: Rotation;
};

type Wind = {
  magnitude: number;
  maxSpeed: number;
  minSpeed: number;
  duration: number;
  start: number;
  speed: (t: number, y: number) => number;
};

const DARK_COLOR = "#282627";
const LIGHT_COLOR = "#ede2d9";
const LEAF_COUNT = 40;

const default_wind = {
  magnitude: 8,
  maxSpeed: 10,
  minSpeed: 4,
  duration: 100,
  start: 0,
  speed: () => 0,
};

const default_leaf: Leaf = {
  x: 0,
  y: 0,
  z: 0,
  prevXSpeed: 0,
  ySpeed: 0,
  xSpeedVariation: 0,
  rotation: {
    x: 0,
    speed: 0,
    value: 0,
    axis: "x",
  },
};

export default function LeafArt() {
  const p5iRef = useRef<P5I>(p5i());
  const { theme } = useTheme();
  const { width } = useWindowSize();

  const {
    mount,
    unmount,
    createCanvas,
    angleMode,
    DEGREES,
    WEBGL,
    background,
    sin,
    noStroke,
    image,
    resizeCanvas,
    loadImage,
    CENTER,
    imageMode,
    degrees,
    frameRate,
    PI,
  } = p5iRef.current;

  const el = useRef<HTMLDivElement | null>(null);

  const color = useRef(theme === "dark" ? DARK_COLOR : LIGHT_COLOR);
  const leafCount = useRef(LEAF_COUNT);
  
  const w = useRef(innerWidth ?? 0);
  const h = useRef(innerHeight ?? 0);

  const leafLight = useRef<any>();
  const leafDark = useRef<any>();

  const leaves = useRef<Leaf[]>([]);
  const wind = useRef<Wind>(default_wind);

  function resetLeaf(leaf: Leaf, frameCount = 0) {
    leaf.x = -w.current / 2 - Math.random() * w.current * 1.75;
    leaf.y = -h.current / 2;
    leaf.z = Math.random() * 100 + 50;

    if (frameCount === 0) {
      leaf.y = (Math.random() * h.current) / 2;
    }

    leaf.ySpeed = Math.random() + 1.5;
    leaf.xSpeedVariation = Math.random() * 0.8 - 0.4;

    const randomAxis = Math.random();
    leaf.rotation.speed = Math.random() * 10;

    if (randomAxis > 0.5) {
      leaf.rotation.axis = "x";
    } else if (randomAxis > 0.25) {
      leaf.rotation.axis = "y";
      leaf.rotation.x = Math.random() * 180 + 90;
    } else {
      leaf.rotation.axis = "z";
      leaf.rotation.x = Math.random() * 360 - 180;
      leaf.rotation.speed = Math.random() * 3;
    }
  }

  function updateLeaf(leaf: Leaf, frameCount = 0) {
    const speed = wind.current.speed(frameCount - wind.current.start, leaf.y);
    let xSpeed = speed + leaf.xSpeedVariation;

    leaf.x += xSpeed;
    leaf.y += leaf.ySpeed;
    leaf.rotation.value += leaf.rotation.speed;

    if (leaf.x > w.current / 2 + 10 || leaf.y > h.current / 2 + 10) {
      resetLeaf(leaf, frameCount);
    }
  }

  function updateWind(frameCount = 0) {
    const { duration, start } = wind.current;

    if (!(frameCount == 1 || frameCount > start + duration)) {
      return;
    }

    wind.current.magnitude = Math.random() * wind.current.maxSpeed;
    wind.current.duration =
      wind.current.magnitude * 50 + (Math.random() * 20 - 10);
    wind.current.start = frameCount;

    wind.current.speed = (frameCount: number, y: number) => {
      const a =
        ((wind.current.magnitude / 2) * (h.current - (2 * (y / 2)) / 3)) /
        h.current;

      const asin = sin(
        degrees(((2 * PI) / wind.current.duration) * frameCount + (3 * PI) / 2)
      );

      return a * asin + a;
    };
  }

  function createLeaves() {
    Array.from({ length: leafCount.current }).forEach((_, idx) => {
      const leaf = { ...default_leaf, rotation: { ...default_leaf.rotation } };
      resetLeaf(leaf);
      leaves.current.push(leaf);
    });
  }

  function setup() {
    createCanvas(w.current, h.current, WEBGL);
    background(color.current);
    noStroke();
    imageMode(CENTER);
    angleMode(DEGREES);
    frameRate(75);

    createLeaves();
  }

  function draw({
    frameCount,
    rotateX,
    rotateY,
    rotateZ,
    translate,
    push,
    pop,
  }: P5I) {
    background(color.current);
    updateWind(frameCount);
    const leafAsset =
      color.current !== DARK_COLOR ? leafDark.current : leafLight.current;

    leaves.current.forEach((leaf) => {
      updateLeaf(leaf, frameCount);
      const w = leaf.z / 5;
      const h = leaf.z / 5;

      push();
      translate(leaf.x, leaf.y, leaf.z);

      if (leaf.rotation.axis !== "x") {
        rotateX(leaf.rotation.x);
      }

      if (leaf.rotation.axis === "x") {
        rotateX(leaf.rotation.value);
      } else if (leaf.rotation.axis === "y") {
        rotateY(leaf.rotation.value);
      } else {
        rotateZ(leaf.rotation.value);
      }

      image(leafAsset, 0, 0, w, h);

      pop();
    });

    // clear unsed leaves
  }

  function restart() {
    leaves.current = [];
    wind.current = default_wind;

    if (!el.current) {
      return;
    }

    mount(el.current, {
      setup,
      draw,
      preload: () => {
        leafLight.current = loadImage(LEAF_IMAGE_LIGHT.src);
        leafDark.current = loadImage(LEAF_IMAGE_DARK.src);
      },
    });
  }

  useEffect(() => {
    restart();

    window.addEventListener("resize", () => {
      w.current = innerWidth;
      h.current = innerHeight;

      resizeCanvas(w.current, h.current);
    });

    return () => {
      unmount();

      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    color.current = theme === "dark" ? DARK_COLOR : LIGHT_COLOR;
  }, [theme]);

  useEffect(() => {
    if (width < 768) {
      wind.current.maxSpeed = 5;
    } else {
      wind.current.maxSpeed = 10;
    }

    const prevLeafCount = leafCount.current;

    if (width < 768 && width > 450) {
      leafCount.current = 20;
    } else if (width < 450) {
      leafCount.current = 10;
    } else {
      leafCount.current = LEAF_COUNT;
    }

    if (prevLeafCount == leafCount.current) {
      return;
    }

    if (prevLeafCount > leafCount.current) {
      const diff = prevLeafCount - leafCount.current;
      leaves.current.splice(0, diff);
    } else {
      const diff = leafCount.current - prevLeafCount;

      Array.from({ length: diff }).forEach((_, idx) => {
        const leaf = {
          ...default_leaf,
          rotation: { ...default_leaf.rotation },
        };

        resetLeaf(leaf);
        leaves.current.push(leaf);
      });
    }
  }, [width]);

  return (
    <div ref={el} className="fixed -z-[1] inset-0 pointer-events-none"></div>
  );
}
