(function () {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme);
    return;
  }

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
})();
