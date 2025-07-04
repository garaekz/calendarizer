#!/usr/bin/env node

import { spawn } from "child_process";

// Available themes for validation
const THEMES = ["light", "dark", "warm", "smoke", "neon", "soft"];
const MODES = ["all", "full", "theme", "core", "umd"];

// Parse CLI args like --theme=smoke into { THEME: "smoke" }
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith("--")) {
    const [key, value] = arg.slice(2).split("=");
    acc[key.toUpperCase().replace(/-/g, "_")] = value ?? "true";
  }
  return acc;
}, {});

// Helpers
const has = (key) => Object.hasOwn(args, key);
const exitWithError = (msg) => {
  console.error(`❌ ${msg}`);
  process.exit(1);
};

// Show help
if (has("HELP") || has("H")) {
  console.log(`
🚀 Calendarizer Build Tool

Usage:
  npm run build [options]

Options:
  --theme=<name>     Build single theme (${THEMES.join(", ")})
  --default=<name>   Set default theme for full builds
  --mode=<mode>      Build mode (${MODES.join(", ")})
  --core             Build core version (no themes)
  --all              Build all variants (default)
  --no-minify        Skip minified versions
  --help             Show this help

Examples:
  pnpm run build --theme=neon
  pnpm run build --default=dark --mode=full
  pnpm run build --core
  pnpm run build --all --no-minify
  `);
  process.exit(0);
}

// Validate theme names
if (has("THEME") && !THEMES.includes(args.THEME)) {
  exitWithError(
    `Invalid theme "${args.THEME}". Available: ${THEMES.join(", ")}`
  );
}

if (
  (has("DEFAULT") || has("DEFAULT_THEME")) &&
  !THEMES.includes(args.DEFAULT || args.DEFAULT_THEME)
) {
  exitWithError(
    `Invalid default theme "${
      args.DEFAULT || args.DEFAULT_THEME
    }". Available: ${THEMES.join(", ")}`
  );
}

if (has("MODE") && !MODES.includes(args.MODE)) {
  exitWithError(`Invalid mode "${args.MODE}". Available: ${MODES.join(", ")}`);
}

// Validate conflicting flags
if (
  has("THEME") &&
  (has("DEFAULT") || has("DEFAULT_THEME") || has("CORE") || has("ALL"))
) {
  exitWithError("--theme cannot be combined with --default, --core, or --all.");
}

if (
  has("CORE") &&
  (has("THEME") || has("DEFAULT") || has("DEFAULT_THEME") || has("ALL"))
) {
  exitWithError("--core cannot be combined with --theme, --default, or --all.");
}

if ((has("DEFAULT") || has("DEFAULT_THEME")) && (has("THEME") || has("CORE"))) {
  exitWithError("--default cannot be combined with --theme or --core.");
}

// Infer build mode
let mode;

if (has("CORE")) {
  mode = "core";
} else if (has("THEME")) {
  mode = "theme";
} else if (has("ALL")) {
  mode = "all";
} else if (has("DEFAULT") || has("DEFAULT_THEME")) {
  mode = has("MODE") ? args.MODE : "full";
} else if (has("MODE")) {
  mode = args.MODE;
}

// Handle --no-minify flag
const shouldMinify = !has("NO_MINIFY");

// Set environment variables for Rollup
const env = {
  ...process.env,
  MODE: mode,
  THEME: args.THEME || "light",
  DEFAULT_THEME: args.DEFAULT_THEME || args.DEFAULT || "light",
  MINIFY: shouldMinify.toString(),
};

// Display summary
console.log(`🚀 Building Calendarizer:
  Mode:    ${env.MODE}
  Theme:   ${env.THEME}
  Default: ${env.DEFAULT_THEME}
  Minify:  ${env.MINIFY}
`);

// Spawn Rollup
const rollup = spawn("rollup", ["-c"], {
  env,
  stdio: "inherit",
  shell: process.platform === "win32", // Windows compatibility
});

rollup.on("error", (error) => {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
});

rollup.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Build completed successfully!");
  } else {
    console.error(`❌ Build failed with exit code ${code}`);
  }
  process.exit(code);
});
