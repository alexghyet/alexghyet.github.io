// Canvas can't read CSS custom properties cheaply every frame, so the
// palettes live here too. Keep in sync with the theme tokens in index.css.
const dark = {
  bg: "#06080c",
  tile: "#0c1118",
  line: "#1a2330",
  text: "#e8eef5",
  muted: "#8a97a8",
  dim: "#4d5a6b",
  green: "#5cf2a0",
  pink: "#ff5c8a",
  blue: "#5aa9ff",
  amber: "#ffc857",
};

const light = {
  bg: "#f4f6f9",
  tile: "#ffffff",
  line: "#e3e8ef",
  text: "#0e1521",
  muted: "#5d6878",
  dim: "#8a94a3",
  green: "#0a9a55",
  pink: "#d61f5c",
  blue: "#2463eb",
  amber: "#b26b00",
};

export const PALETTES = { dark, light };
export const PALETTE = dark;

export const currentTheme = () =>
  typeof document !== "undefined" && document.documentElement.dataset.theme === "light"
    ? "light"
    : "dark";
