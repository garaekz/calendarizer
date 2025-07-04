class ThemeHandler {
  constructor() {
    this.root = document.documentElement;
    this.toggler = document.getElementById("theme-toggler");
    this.theme = this.root.getAttribute("data-theme");
    this.#bindEvents();
    this.#updateToggler();
  }

  #bindEvents() {
    this.toggler?.addEventListener("click", () => this.toggle());
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!localStorage.getItem("theme")) {
        this.#setTheme(e.matches ? "dark" : "light");
      }
    };
    mql.addEventListener
      ? mql.addEventListener("change", onChange)
      : mql.addListener(onChange);
  }

  toggle() {
    this.#setTheme(this.theme === "dark" ? "light" : "dark");
  }

  #setTheme(theme) {
    this.theme = theme;
    this.root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    this.#updateToggler();
  }

  #updateToggler() {
    if (!this.toggler) return;
    const isDark = this.theme === "dark";
    this.toggler.textContent = isDark ? "☀️" : "🌙";
    this.toggler.setAttribute(
      "aria-label",
      `Switch to ${isDark ? "light" : "dark"} theme`
    );
  }
}

new ThemeHandler();
