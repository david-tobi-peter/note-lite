import { Theme } from "@/lib";
import { useState, useEffect } from "react";

const THEME_KEY = "note-lite-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme: Theme = savedTheme
      ? savedTheme
      : (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    setTheme(currentTheme => {
      const newTheme = currentTheme === "light" ? "dark" : "light";

      localStorage.setItem(THEME_KEY, newTheme);

      document.documentElement.classList.remove(currentTheme);
      document.documentElement.classList.add(newTheme);

      return newTheme;
    });
  };

  return { theme, toggleTheme };
};