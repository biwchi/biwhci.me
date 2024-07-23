import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Size = {
  width: number;
  height: number;
};

const IS_SERVER = typeof window === "undefined";

export function useWindowSize() {
  const prevSize = useRef<Size>({
    width: 0,
    height: 0,
  });

  const isEqual = (prev: Size, current: Size) => {
    for (const key in prev) {
      const k = key as keyof Size;

      if (prev[k] !== current[k]) {
        return false;
      }
    }

    return true;
  };

  const subscribe = (cb: () => void) => {
    if (!IS_SERVER) {
      window.addEventListener("resize", cb);
    }

    return () => {
      if (!IS_SERVER) {
        window.removeEventListener("resize", cb);
      }
    };
  };

  const getSnapshot = () => {
    const current: Size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    if (!isEqual(prevSize.current, current)) {
      prevSize.current = current;
      return current;
    }

    return prevSize.current;
  };

  const cached = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => prevSize.current
  );

  return {
    get width() {
      return cached.width;
    },
    get height() {
      return cached.height;
    },
  };
}
