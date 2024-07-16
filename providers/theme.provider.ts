import { createContext, useContext, useMemo } from "react";
type Theme = "light" | "dark";

const DEFAULT_VAL = "light";

export const ThemeProvider = createContext<Theme>(DEFAULT_VAL);
