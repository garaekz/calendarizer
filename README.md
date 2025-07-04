# 📅 Calendarizer

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Calendar Support](https://img.shields.io/badge/calendar-Google%20%7C%20Outlook%20%7C%20ICS-blue)](#)
[![Web Component](https://img.shields.io/badge/web--component-native-orange)](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
[![Themes](https://img.shields.io/badge/themes-6%20built--in-purple)](#)
[![Minified Size](https://img.shields.io/bundlephobia/minzip/calendarizer-io?label=min%20size)](https://bundlephobia.com/package/calendarizer-io)
[![Made by David Garay](https://img.shields.io/badge/made%20by-David%20Garay-%23e91e63)](https://dagacoding.com)

**Calendarizer** is a lightweight, zero-dependency Web Component (`<calendarizer-io>`) that lets users instantly add events to their favorite calendar apps: **Google**, **Outlook**, **Yahoo**, or download a universal `.ics` file compatible with **Apple Calendar**, **Outlook Desktop**, and more.

Fully customizable. Themed or theme-free. Plug & play.

📘 También disponible en: [Español 🇲🇽](./README.es.md)

## 🚀 Quick Start

### 1. Include the script

Embed it locally:

```html
<script src="calendarizer.js" type="module"></script>
```

Or use a minified version (e.g. CDN):

```html
<script src="calendarizer.min.js" type="module"></script>
```

### 2. Add the component

```html
<calendarizer-io
  title="Product Launch"
  date-start="2025-08-01T09:00"
  date-end="2025-08-01T10:30"
  timezone="America/Mexico_City"
  location="Mexico City"
  organizer="mailto:host@example.com"
  content="Join us for the new product release.<br>Live demo and Q&A included."
  button="Add to calendar"
  theme="dark"
  theme-url="https://yoursite.com/custom-calendar-theme.css"
/>
```

## 📌 Attributes

| Attribute    | Type                 | Required | Description                                         |
| ------------ | -------------------- | -------- | --------------------------------------------------- |
| `title`      | `string`             | ✅       | Event title                                         |
| `date-start` | `ISO string`         | ✅       | Start datetime (`YYYY-MM-DDTHH:mm`)                 |
| `date-end`   | `ISO string`         | ✅       | End datetime                                        |
| `timezone`   | `IANA string`        | ✅       | Timezone (e.g. `America/New_York`, `UTC`)           |
| `location`   | `string`             | ✅       | Event location (physical or virtual)                |
| `content`    | `string` (HTML-safe) | ✅       | Event description (supports `<br>` for line breaks) |
| `organizer`  | `string`             | ❌       | Optional organizer info (`mailto:` or name)         |
| `button`     | `string`             | ❌       | Button label (default: `"Add to calendar"`)         |
| `theme`      | `string`             | ❌       | Built-in theme: `light`, `dark`, `neon`, etc.       |
| `theme-url`  | `URL`                | ❌       | Optional custom CSS URL — overrides built-in themes |

## 📆 Calendar Support

- ✅ Google Calendar
- ✅ Outlook (Web & Desktop)
- ✅ Yahoo Calendar
- ✅ Apple Calendar (`.ics`)
- ✅ Thunderbird & all `.ics`-compatible clients

## 🎨 Theming & Styling

- Use `theme="light"` or `theme="dark"` for built-in styles.
- Use `theme-url="..."` to override styles with custom CSS.
- `theme-url` **always takes precedence** over `theme`.
- Encapsulated via **Shadow DOM** for full style isolation.

### Built-in themes:

- `light` _(default)_
- `dark`
- `warm`
- `smoke`
- `neon`
- `soft`

## 🔧 Build System

Calendarizer ships with a flexible CLI build tool.

### 🛠 CLI Flags

| Flag             | Description                                         |
| ---------------- | --------------------------------------------------- |
| `--theme=name`   | Build a single theme (e.g. `neon`, `smoke`)         |
| `--default=name` | Set the default theme in full/all builds            |
| `--core`         | Build only the core module (no themes included)     |
| `--mode=type`    | Choose: `all` (default), `full`, `theme`, or `core` |
| `--no-minify`    | Skip `.min.js` output                               |
| `--help`         | Show help text                                      |

### 🧪 Build Examples

```bash
pnpm run build --theme=neon
pnpm run build --default=dark --mode=full
pnpm run build --core
pnpm run build --all --no-minify
```

## 📦 Output Bundles

| File                       | Description                             |
| -------------------------- | --------------------------------------- |
| `calendarizer.full.js`     | All themes embedded, default is `light` |
| `calendarizer.min.js`      | Minified version of full build          |
| `calendarizer.core.js`     | Core only, requires `theme-url`         |
| `calendarizer.core.min.js` | Minified core build                     |
| `calendarizer.dark.js`     | Single-theme bundle (e.g. dark only)    |
| `calendarizer.dark.min.js` | Minified single-theme version           |
| ... and others per theme   | Based on `src/themes/*.css`             |

## ⚙️ Framework Support

Works seamlessly in any modern frontend stack:

```jsx
<calendarizer-io
  title="Launch Meeting"
  date-start="2025-08-01T15:00"
  date-end="2025-08-01T16:00"
  timezone="America/Los_Angeles"
  content="Live Zoom event with our team"
  button="Add it"
/>
```

- ✅ React
- ✅ Vue
- ✅ Svelte
- ✅ Astro
- ✅ Vanilla HTML

## 📁 `.ics` File Structure

Generated `.ics` files follow RFC 5545 spec and include:

- `DTSTART` / `DTEND` with proper UTC or TZID
- `UID`, `DTSTAMP`, `ORGANIZER`, and `DESCRIPTION`
- Proper line folding, escaping, and timezone handling

## 🛡 Security Notes

- Uses `rel="noopener"` to prevent window hijacking
- Sanitizes content before `.ics` export
- IANA timezone support built-in (`tzdata` fallback optional)

## 🧪 Dev Scripts

```json
"scripts": {
  "build": "node scripts/build.js",
  "build:help": "node scripts/build.js --help",
  "build:core": "node scripts/build.js --core",
  "build:all": "node scripts/build.js --all --default=dark",
  "build:theme": "node scripts/build.js --theme=warm",
  "build:theme:neon": "node scripts/build.js --theme=neon",
  "build:theme:dark": "node scripts/build.js --theme=dark",
  "build:theme:smoke": "node scripts/build.js --theme=smoke",
  "build:full": "node scripts/build.js --mode=full",
  "build:full:dark": "node scripts/build.js --default=dark --mode=full",
  "build:full:neon": "node scripts/build.js --default=neon --mode=full",
  "build:dev": "node scripts/build.js --all --no-minify",
  "dev": "npm run build:dev"
}
```

## 📄 License

[MIT](./LICENSE) © 2025 David Garay

Made with ❤️ by [David Garay](https://dagacoding.com)
