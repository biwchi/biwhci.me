import type { MouseEvent } from "react";
import { createContext, useContext } from "react";

export type Theme = "light" | "dark";
export const DEFAULT_THEME_VAL = "light";

const DEFAULT_VALUE: ThemeProvider = {
  theme: DEFAULT_THEME_VAL,
  toggleDark: () => {},
};

type ThemeProvider = {
  theme: Theme;
  toggleDark: (e: MouseEvent) => void;
};

export const ThemeContext = createContext<ThemeProvider>(DEFAULT_VALUE);
export const useTheme = () => useContext(ThemeContext);
