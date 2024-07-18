"use client";

import {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ThemeContext, Theme } from "@/providers";

interface ViewTransitionDocument extends Document {
  startViewTransition?: () => any;
}

const toggleDark = (
  current: Theme,
  set: Dispatch<SetStateAction<Theme>>,
  e: MouseEvent
) => {
  const doc = document as ViewTransitionDocument;
  const isAppearanceTransition =
    doc.startViewTransition &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isAppearanceTransition) {
    set(current === "light" ? "dark" : "light");
    return;
  }

  const isDark = current === "dark";
  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  // @ts-expect-error: Transition API
  const tranistion = doc.startViewTransition!(async () => {
    set(current === "light" ? "dark" : "light");
  });

  tranistion.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      { clipPath: isDark ? [...clipPath].reverse() : clipPath },
      {
        duration: 400,
        easing: "ease-out",
        pseudoElement: isDark
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      }
    );
  });
};

export default function ThemeProvider(props: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(null as unknown as Theme);

  const saveTheme = (theme: Theme) => {
    localStorage.setItem("theme", theme);
  };

  const getTheme = () => {
    return localStorage.getItem("theme");
  };

  const toggle = (e: MouseEvent) => toggleDark(theme, setTheme, e);

  useEffect(() => {
    const storedTheme = getTheme();

    if (storedTheme) {
      setTheme(storedTheme as Theme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(prefersDark.matches ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }

    saveTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme: theme ?? "light", toggleDark: toggle }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
