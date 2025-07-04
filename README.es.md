# 📅 Calendarizer (Español)

**Calendarizer** es un Web Component ligero y sin dependencias (`<calendarizer>`) que permite a los usuarios agregar eventos a su calendario favorito: **Google**, **Outlook**, **Yahoo** o descargar un archivo `.ics` compatible con **Apple Calendar**, Outlook de escritorio y otros.

Totalmente personalizable. Con temas integrados o sin estilos. Listo para usarse.

## 🚀 Inicio Rápido

### 1. Incluye el script

Inclúyelo localmente:

```html
<script src="calendarizer.js" type="module"></script>
```

O usa la versión minificada (CDN o local):

```html
<script src="calendarizer.min.js" type="module"></script>
```

### 2. Usa el componente

```html
<calendarizer
  title="Lanzamiento de Producto"
  date-start="2025-08-01T09:00"
  date-end="2025-08-01T10:30"
  timezone="America/Mexico_City"
  location="Ciudad de México"
  organizer="mailto:host@example.com"
  content="Acompáñanos en el lanzamiento del nuevo producto.<br>Incluye demo en vivo y sesión de preguntas."
  button="Agregar al calendario"
  theme="dark"
  theme-url="https://tusitio.com/estilos-personalizados.css"
/>
```

## 📌 Atributos Soportados

| Atributo     | Tipo                 | Requerido | Descripción                                                |
| ------------ | -------------------- | --------- | ---------------------------------------------------------- |
| `title`      | `string`             | ✅        | Título del evento                                          |
| `date-start` | `ISO string`         | ✅        | Fecha/hora de inicio (`YYYY-MM-DDTHH:mm`)                  |
| `date-end`   | `ISO string`         | ✅        | Fecha/hora de finalización                                 |
| `timezone`   | `string` (IANA)      | ✅        | Zona horaria (ej. `America/Mexico_City`, `UTC`)            |
| `location`   | `string`             | ✅        | Lugar del evento (físico o virtual)                        |
| `content`    | `string` (HTML-safe) | ✅        | Descripción del evento (puedes usar `<br>` para saltos)    |
| `organizer`  | `string`             | ❌        | Email o nombre del organizador (opcional, usado en `.ics`) |
| `button`     | `string`             | ❌        | Texto del botón (por defecto: `"Add to calendar"`)         |
| `theme`      | `string`             | ❌        | Tema visual: `light`, `dark`, etc.                         |
| `theme-url`  | `URL`                | ❌        | URL de tu CSS personalizado (anula `theme`)                |

## 📆 Compatibilidad de Calendarios

- ✅ Google Calendar
- ✅ Outlook (web y escritorio)
- ✅ Yahoo Calendar
- ✅ Apple Calendar (`.ics`)
- ✅ Thunderbird y otros clientes `.ics`

## 🎨 Temas y Estilos

- Usa `theme="light"` o `theme="dark"` para temas integrados.
- Usa `theme-url="..."` para cargar tu propio CSS.
- `theme-url` **tiene prioridad** sobre `theme`.
- Shadow DOM asegura encapsulamiento de estilos.

### Temas integrados:

- `light` _(por defecto)_
- `dark`
- `warm`
- `smoke`
- `neon`
- `soft`

## 🔧 Sistema de Build

Calendarizer incluye un sistema de build flexible desde CLI.

### 🛠 Opciones

| Flag             | Descripción                                            |
| ---------------- | ------------------------------------------------------ |
| `--theme=name`   | Compila solo el tema seleccionado (ej: `neon`, `dark`) |
| `--default=name` | Define el tema por defecto en compiles `full` o `all`  |
| `--core`         | Compila solo el módulo base (sin temas)                |
| `--mode=tipo`    | `all` (default), `full`, `theme`, o `core`             |
| `--no-minify`    | Omite la generación de versiones `.min.js`             |
| `--help`         | Muestra ayuda de uso                                   |

### 🧪 Ejemplos de build

```bash
pnpm run build --theme=neon
pnpm run build --default=dark --mode=full
pnpm run build --core
pnpm run build --all --no-minify
```

## 📦 Archivos generados

| Archivo                                     | Descripción                                          |
| ------------------------------------------- | ---------------------------------------------------- |
| `calendarizer.full.js`                      | Todos los temas integrados (`light` por defecto)     |
| `calendarizer.min.js`                       | Versión minificada del build completo                |
| `calendarizer.core.js`                      | Sin temas, solo funcionalidad (requiere `theme-url`) |
| `calendarizer.core.min.js`                  | Versión minificada de core                           |
| `calendarizer.dark.js`                      | Solo el tema `dark`                                  |
| `calendarizer.dark.min.js`                  | Versión minificada del tema `dark`                   |
| ... y más dependiendo de `src/themes/*.css` |                                                      |

## ⚙️ Uso en Frameworks

Se puede usar en React, Vue, Svelte, Astro y cualquier framework moderno:

```jsx
<calendarizer
  title="Reunión de Lanzamiento"
  date-start="2025-08-01T15:00"
  date-end="2025-08-01T16:00"
  timezone="America/Los_Angeles"
  content="Evento en vivo por Zoom"
  button="Agendar"
/>
```

## 📁 Archivos `.ics`

Calendarizer genera `.ics` válidos y bien formateados con:

- `DTSTART`, `DTEND` (UTC o TZID)
- `UID`, `DTSTAMP`, `ORGANIZER`
- Descripciones escapadas y con saltos de línea
- Compatibilidad RFC 5545

## 🛡 Seguridad

- Uso de `rel="noopener"` para evitar hijacking de ventanas
- Sanitización del contenido antes de exportar `.ics`
- Soporte de zonas horarias con base en IANA (`tzdata`)

## 📄 Licencia

[MIT](./LICENSE) © 2025 David Garay

Hecho con ❤️ por [David Garay](https://dagacoding.com)
