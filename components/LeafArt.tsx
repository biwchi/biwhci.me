"use client";

import { useTheme } from "@/providers";
import { p5i, P5I } from "p5i";
import { useEffect, useRef } from "react";
import LEAF_IMAGE from "@/public/leaf.png";

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
  ySpeed: number;
  xSpeedVariation: number;
  rotation: Rotation;
};

type Wind = {
  magnitude: number;
  maxSpeed: number;
  duration: number;
  start: number;
  speed: (t: number, y: number) => number;
};

const DARK_COLOR = "#282627";
const LIGHT_COLOR = "#ede2d9";
const LEAF_COUNT = 20;

const default_wind = {
  magnitude: 1.2,
  maxSpeed: 12,
  duration: 500,
  start: 0,
  speed: () => 0,
};

export default function LeafArt() {
  const p5iRef = useRef<P5I>(p5i());
  const { theme } = useTheme();
  const {
    mount,
    unmount,
    createCanvas,
    WEBGL,
    background,
    fill,
    sin,
    texture,
    noStroke,
    image,
    loadImage,
    PI,
  } = p5iRef.current;

  const el = useRef<HTMLDivElement | null>(null);

  const color = theme === "dark" ? DARK_COLOR : LIGHT_COLOR;
  const w = innerWidth;
  const h = innerHeight;
  const leafImage = useRef<any>();

  const leaves = useRef<Leaf[]>([]);
  const wind = useRef<Wind>(default_wind);

  function resetLeaf(leaf: Leaf) {
    leaf.x = Math.random() * w - w / 2;
    leaf.y = -10;
    leaf.z = Math.random() * 200;

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
    const xSpeed = speed + leaf.xSpeedVariation;
    leaf.x += xSpeed;
    leaf.y += leaf.ySpeed;
    leaf.rotation.value += leaf.rotation.speed;

    if (leaf.x > w + 10 || leaf.y > h + 10) {
      resetLeaf(leaf);
    }
  }

  function updateWind(frameCount = 0) {
    const { duration, start } = wind.current;

    if (!(frameCount == 0 || frameCount > start + duration)) {
      return;
    }

    wind.current.magnitude = Math.random() * wind.current.maxSpeed;
    wind.current.duration =
      wind.current.magnitude * 50 + (Math.random() * 20 - 10);
    wind.current.start = frameCount;

    wind.current.speed = (t: number, y: number) => {
      const a = ((wind.current.magnitude / 2) * (h - (2 * y) / 3)) / h;
      return a * sin(((2 * PI) / wind.current.duration) * t + (3 * PI) / 2) + a;
    };
  }

  function createLeaves() {
    Array.from({ length: LEAF_COUNT }).forEach((_, idx) => {
      const leaf: Leaf = {
        x: 0,
        y: 0,
        z: 0,
        ySpeed: 0,
        xSpeedVariation: 0,
        rotation: {
          x: 0,
          speed: 0,
          value: 0,
          axis: "x",
        },
      };

      resetLeaf(leaf);
      leaves.current.push(leaf);
    });
  }

  function setup() {
    createCanvas(w, h, WEBGL);
    background("#ccc");
    noStroke();

    createLeaves();
  }

  function draw({
    frameCount,
    rotateX,
    rotateY,
    rotateZ,
    translate,
    plane,
  }: P5I) {
    background("#ccc");
    updateWind(frameCount);
    console.log(leaves)
    leaves.current.forEach((leaf) => {
      updateLeaf(leaf, frameCount);
      const w = leaf.z / 5;
      const h = leaf.z / 5;

      if (leaf.rotation.axis === "x") {
        rotateX(leaf.rotation.x);
      } else if (leaf.rotation.axis === "y") {
        rotateY(leaf.rotation.value);
      } else {
        rotateZ(leaf.rotation.value);
      }

      image(leafImage.current, leaf.x, leaf.y, w, h);
    });
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
        leafImage.current = loadImage(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/125707/leaf.svg"
        );
      },
    });
  }

  useEffect(() => {
    restart();

    return () => {
      unmount();
    };
  }, []);

  useEffect(() => {
    restart();
  }, [theme]);

  return (
    <div ref={el} className="fixed -z-[1] inset-0 pointer-events-none"></div>
  );
}
