// Theme lives on <html data-theme>. index.html sets it before React loads
// so the page never flashes the wrong colors.
const KEY = "theme";
const META = { dark: "#06080c", light: "#f4f6f9" };

export const getTheme = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function setTheme(theme) {
  const root = document.documentElement;
  root.classList.add("theme-anim");
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode: the choice just won't persist */
  }
  window.setTimeout(() => root.classList.remove("theme-anim"), 400);
}
