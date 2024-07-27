import { IS_SERVER } from "@/utils";
import { useRef, useSyncExternalStore } from "react";

type Size = {
  width: number;
  height: number;
};

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
    if (!IS_SERVER()) {
      globalThis.window.addEventListener("resize", cb);
    }

    return () => {
      if (!IS_SERVER()) {
        globalThis.window.removeEventListener("resize", cb);
      }
    };
  };

  const getSnapshot = () => {
    if (IS_SERVER()) {
      return prevSize.current;
    }

    const current: Size = {
      width: globalThis.window.innerWidth,
      height: globalThis.window.innerHeight,
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
