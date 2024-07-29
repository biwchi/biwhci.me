"use client";

import { p5i, P5I } from "p5i";
import { useEffect, useRef } from "react";

import ArtFrame from "./ArtFrame";
import { DARK_COLOR, LIGHT_COLOR } from "./const";
import { useTheme } from "@/providers";

type Meteor = {
  x: number;
  y: number;
  condition: number;
  xSpeed: number;
  ySpeed: number;
  initialWidth: number;
  width: number;

  startBurningAt: number | null;
};

const ITEMS_COUNT = 3;

export default function MeteorArt() {
  const { theme } = useTheme();

  const p5 = useRef(p5i());
  const el = useRef<HTMLDivElement>(null);

  const w = useRef(innerWidth);
  const h = useRef(innerHeight);
  const artColor = useRef(theme === "dark" ? DARK_COLOR : LIGHT_COLOR);

  const meteors = useRef<Meteor[]>([]);
  const { mount, unmount } = p5.current;

  function reset(meteor: Meteor) {
    meteor.x = Math.random() * w.current - w.current / 2;
    meteor.y = Math.random() * h.current;
    meteor.condition = 100;
    meteor.width = Math.random() * 50 + 50;
    meteor.initialWidth = meteor.width;
    meteor.xSpeed = 30;
    meteor.ySpeed = 4;

    meteor.startBurningAt = null;
  }

  function update(meteor: Meteor, frame = 0) {
    if (meteor.condition == 0 || meteor.width < 0) {
      reset(meteor);
    }

    meteor.x += meteor.xSpeed;
    meteor.y += meteor.ySpeed;
    meteor.startBurningAt = Math.random() > 0.80 ? frame : null;

    if (meteor.startBurningAt) {
      meteor.condition -= 5;
      meteor.width -= meteor.initialWidth * (1 - meteor.condition / 100);
    }
  }

  function create(frame = 0) {
    Array.from({ length: ITEMS_COUNT }).forEach((_, idx) => {
      const meteor: Meteor = {
        x: 0,
        y: 0,
        condition: 0,
        xSpeed: 0,
        ySpeed: 0,
        initialWidth: 0,
        width: 0,
        startBurningAt: null,
      };

      reset(meteor);
      meteors.current.push(meteor);
    });
  }

  function setup({ createCanvas, frameRate, noStroke, frameCount }: P5I) {
    createCanvas(w.current, h.current);
    noStroke();
    frameRate(75);

    create(frameCount);
  }

  function draw({
    stroke,
    strokeWeight,
    line,
    frameCount,
    background,
    atan2,
    sin,
    cos,
  }: P5I) {
    background(artColor.current);

    const meteorColor = theme === "dark" ? LIGHT_COLOR : DARK_COLOR;

    meteors.current.forEach((meteor) => {
      update(meteor, frameCount);

      const angle = atan2(meteor.ySpeed, meteor.xSpeed);
      const endX = meteor.x - meteor.width * cos(angle);
      const endY = meteor.y - meteor.width * sin(angle);

      stroke(meteorColor);
      strokeWeight(3);
      line(meteor.x, meteor.y, endX, endY);

      // ellipse(meteor.x, meteor.y, 4,4);
    });
  }

  useEffect(() => {
    if (!el.current) {
      return;
    }

    mount(el.current, { setup, draw });

    () => {
      unmount();
    };
  });

  return <ArtFrame ref={el} />;
}
