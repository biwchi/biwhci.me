"use client";

import {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ThemeContext, Theme, DEFAULT_THEME_VAL } from "@/providers";

interface ViewTransitionDocument extends Document {
  startViewTransition?: () => any;
}

const toggleThemeWithViewTransition = (
  current: Theme,
  set: Dispatch<SetStateAction<Theme>>,
  e: MouseEvent
) => {
  const doc = document as ViewTransitionDocument;
  const isAppearanceTransition =
    doc.startViewTransition &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isAppearanceTransition) {
    set(current === "light" ? "dark" : "light");
    return;
  }

  const nextThemeValue = current === "light" ? "dark" : "light";
  const isDark = nextThemeValue === "dark";

  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  // @ts-expect-error: Transition API
  const tranistion = doc.startViewTransition!(async () => {
    set(nextThemeValue);
  });

  tranistion.ready.then(async () => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      { clipPath: isDark ? clipPath.reverse() : clipPath },
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

  const saveTheme = (theme: Theme) => localStorage.setItem("theme", theme);
  const getTheme = () => localStorage.getItem("theme");
  const toggle = (e: MouseEvent) =>
    toggleThemeWithViewTransition(theme, setTheme, e);

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
      value={{ theme: theme ?? DEFAULT_THEME_VAL, toggle }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
