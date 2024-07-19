import { p5i } from 'p5i'
import { useRef } from "react";

export default function LeafArt() {
  const el = useRef<HTMLDivElement | null>(null);
  const {
    mount,
    unmount,
    createCanvas,
    background,
    noFill,
    stroke,
    noise,
    noiseSeed,
    resizeCanvas,
    cos,
    sin,
    TWO_PI,
  } = p5i();

  return <div ref={el}></div>;
}
