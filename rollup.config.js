import { defineConfig } from "rollup";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import fs from "fs";
import postCssProcessor from "postcss";
import postcssImport from "postcss-import";
import cssnano from "cssnano";

const themes = ["light", "dark", "warm", "smoke", "neon", "soft"];
const dist = (name) => `dist/${name}`;

const mode = process.env.MODE || "all";
const selectedTheme = process.env.THEME || "light";
const defaultTheme = process.env.DEFAULT_THEME || "light";
const shouldMinify = process.env.MINIFY !== "false";

// Determine what themes we need to process
const getRequiredThemes = () => {
  switch (mode) {
    case "theme":
      return [selectedTheme];
    case "core":
      return [];
    case "full":
    case "umd":
      return themes; // Need all for bundle
    case "all":
      return themes; // Generate everything
    default:
      return themes;
  }
};

// Process CSS with PostCSS
const processThemeCss = async (theme) => {
  try {
    const rawCss = fs.readFileSync(`src/themes/${theme}.css`, "utf8");
    const processor = postCssProcessor([
      postcssImport(), // Resolve @import statements
      cssnano({ preset: "default" }), // Minify CSS
    ]);

    const result = await processor.process(rawCss, {
      from: `src/themes/${theme}.css`,
      to: undefined, // We're not writing to file
    });

    return result.css;
  } catch (error) {
    console.warn(`⚠️  Error processing theme ${theme}:`, error.message);
    return "";
  }
};

// Pre-process required themes
const requiredThemes = getRequiredThemes();
const processedThemes = {};

console.log(`🎨 Processing themes: ${requiredThemes.join(", ") || "none"}`);

// Process themes before build
for (const theme of requiredThemes) {
  processedThemes[theme] = await processThemeCss(theme);
}

const escapeJson = (str) => JSON.stringify(str);

// Determine output mode
const outputMode = mode === "all" ? "both" : shouldMinify ? "both" : "normal";

// Factory for builds
const createBuild = (config) => {
  const { type, theme, defaultTheme: dt } = config;

  const buildVariant = (minify = false) => {
    let filename, replacements;

    switch (type) {
      case "theme":
        filename = `calendarizer.${theme}${minify ? ".min" : ""}.js`;
        replacements = {
          __DEFAULT_THEME_CSS__: escapeJson(processedThemes[theme] || ""),
          __THEME_LIST__: "undefined",
        };
        break;

      case "full":
        filename = `calendarizer.${minify ? "min" : "full"}.js`;
        replacements = {
          __DEFAULT_THEME_CSS__: escapeJson(processedThemes[dt] || ""),
          __THEME_LIST__: escapeJson(processedThemes),
        };
        break;

      case "core":
        filename = `calendarizer.core${minify ? ".min" : ""}.js`;
        replacements = {
          __DEFAULT_THEME_CSS__: '""',
          __THEME_LIST__: "undefined",
        };
        break;

      case "umd":
        filename = `calendarizer.${minify ? "umd.min" : "umd"}.js`;
        replacements = {
          __DEFAULT_THEME_CSS__: escapeJson(processedThemes[dt] || ""),
          __THEME_LIST__: escapeJson(processedThemes),
        };
        break;

      default:
        throw new Error(`Unknown build type: ${type}`);
    }

    return {
      input: "src/calendarizer.js",
      output: {
        file: dist(filename),
        format: type === "umd" ? "umd" : "esm",
        ...(type === "umd" && { name: "Calendarizer" }),
      },
      plugins: [
        postcss({
          inject: false,
          extract: false,
          minimize: false, // We already processed CSS
        }),
        replace({
          preventAssignment: true,
          values: replacements,
        }),
        ...(minify ? [terser()] : []),
      ],
    };
  };

  return outputMode === "both"
    ? [buildVariant(false), buildVariant(true)]
    : [buildVariant(false)];
};

// Validation
if (mode === "theme" && !themes.includes(selectedTheme)) {
  throw new Error(
    `Theme "${selectedTheme}" not found. Available: ${themes.join(", ")}`
  );
}
if (
  (mode === "full" || mode === "umd" || mode === "all") &&
  !themes.includes(defaultTheme)
) {
  throw new Error(
    `Default theme "${defaultTheme}" not found. Available: ${themes.join(", ")}`
  );
}

// Logs
console.log(`📦 Rollup mode: ${mode}`);
if (mode === "theme") console.log(`🎨 Theme: ${selectedTheme}`);
if (mode === "full" || mode === "umd" || mode === "all")
  console.log(`🎨 Default theme: ${defaultTheme}`);
console.log(`🔧 Minification: ${shouldMinify ? "Enabled" : "Disabled"}`);

// Export config
export default defineConfig(() => {
  switch (mode) {
    case "core":
      return createBuild({ type: "core" });

    case "theme":
      return createBuild({ type: "theme", theme: selectedTheme });

    case "full":
      return createBuild({ type: "full", defaultTheme });

    case "umd":
      return createBuild({ type: "umd", defaultTheme });

    default: // "all"
      return [
        ...createBuild({ type: "full", defaultTheme }),
        ...createBuild({ type: "umd", defaultTheme }),
        ...createBuild({ type: "core" }),
        ...themes.flatMap((theme) => createBuild({ type: "theme", theme })),
      ];
  }
});
