/*!
 * calendarizer v1.0.1
 * (c) 2025 David Garay
 * Released under the MIT License
 */
class Calendarizer extends HTMLElement {
  constructor() {
    super();
    this.__opened = null;
    this.__button = null;
    this.google = null;
    this.outlook = null;
    this.yahoo = null;
    this.ics = null;
    this.__currentBlobUrl = null;
  }

  static get observedAttributes() {
    return [
      "button",
      "title",
      "date-start",
      "date-end",
      "timezone",
      "location",
      "organizer",
      "content",
      "theme",
      "theme-url",
    ];
  }

  getAttr(name, fallback = "") {
    return this.getAttribute(name) || fallback;
  }

  get button() {
    return this.getAttr("button", "Add to Calendar");
  }
  get title() {
    return this.getAttr("title");
  }
  get dateStart() {
    return this.getAttr("date-start");
  }
  get dateEnd() {
    return this.getAttr("date-end");
  }
  get timezone() {
    return this.getAttr("timezone");
  }
  get location() {
    return this.getAttr("location");
  }
  get organizer() {
    return this.getAttr("organizer");
  }
  get content() {
    return this.getAttr("content");
  }
  get theme() {
    return this.getAttr("theme", "light");
  }
  get themeUrl() {
    return this.getAttr("theme-url");
  }

  setAttr(name, value) {
    if (value !== null && value !== undefined) {
      this.setAttribute(name, value);
    }
  }

  set button(val) {
    this.setAttr("button", val);
  }
  set title(val) {
    this.setAttr("title", val);
  }
  set dateStart(val) {
    this.setAttr("date-start", val);
  }
  set dateEnd(val) {
    this.setAttr("date-end", val);
  }
  set timezone(val) {
    this.setAttr("timezone", val);
  }
  set location(val) {
    this.setAttr("location", val);
  }
  set organizer(val) {
    this.setAttr("organizer", val);
  }
  set content(val) {
    this.setAttr("content", val);
  }
  set theme(val) {
    this.setAttr("theme", val);
  }
  set themeUrl(val) {
    this.setAttr("theme-url", val);
  }

  isValidDate(dt) {
    return !isNaN(new Date(dt).getTime());
  }

  parseDate(dt) {
    const d = new Date(dt);
    return {
      d: String(d.getDate()).padStart(2, "0"),
      m: String(d.getMonth() + 1).padStart(2, "0"),
      y: d.getFullYear(),
      h: String(d.getHours()).padStart(2, "0"),
      n: String(d.getMinutes()).padStart(2, "0"),
    };
  }

  googleDateFormat(dt) {
    return this.isValidDate(dt)
      ? new Date(dt).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      : "";
  }

  outlookDateFormat(dt) {
    const d = this.parseDate(dt);
    return `${d.y}-${d.m}-${d.d}T${d.h}:${d.n}:00`;
  }

  escapeICS(str) {
    return (str || "").replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");
  }

  isValidTimezone(tz) {
    try {
      new Intl.DateTimeFormat("en", { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }

  localDateFormat(dt) {
    return this.isValidDate(dt)
      ? new Date(dt)
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d{3}Z$/, "")
      : "";
  }

  lbr(str) {
    return encodeURIComponent(
      (str || "").replace(/<br\s*\/?>(\r\n|\n)?/gi, "\n\n")
    );
  }

  genGoogleLink() {
    return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
      this.title
    )}&dates=${this.googleDateFormat(this.dateStart)}/${this.googleDateFormat(
      this.dateEnd
    )}&ctz=${encodeURIComponent(this.timezone)}&details=${this.lbr(
      this.content
    )}&location=${encodeURIComponent(this.location)}&pli=1`;
  }

  genOutlookLink() {
    return `https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent&path=%2Fcalendar%2Faction%2Fcompose&startdt=${this.outlookDateFormat(
      this.dateStart
    )}&enddt=${this.outlookDateFormat(
      this.dateEnd
    )}&subject=${encodeURIComponent(this.title)}&body=${this.lbr(
      this.content
    )}&location=${encodeURIComponent(this.location)}&allday=false`;
  }

  genYahooLink() {
    return `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(
      this.title
    )}&desc=${this.lbr(this.content)}&in_loc=${encodeURIComponent(
      this.location
    )}&st=${this.googleDateFormat(this.dateStart)}&et=${this.googleDateFormat(
      this.dateEnd
    )}`;
  }

  genICSContent() {
    const hasValidTZ = this.isValidTimezone(this.timezone);
    const cleanContent = (this.content || "").replace(
      /<br\s*\/?>(\r\n|\n)?/gi,
      "\\n"
    );

    const start = hasValidTZ
      ? this.localDateFormat(this.dateStart)
      : this.googleDateFormat(this.dateStart);
    const end = hasValidTZ
      ? this.localDateFormat(this.dateEnd)
      : this.googleDateFormat(this.dateEnd);

    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Calendarizer//ES",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@calendarizer`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `SUMMARY:${this.escapeICS(this.title)}`,
      `DESCRIPTION:${this.escapeICS(cleanContent)}`,
      `LOCATION:${this.escapeICS(this.location)}`,
      hasValidTZ
        ? `DTSTART;TZID=${this.timezone}:${start}`
        : `DTSTART:${start}`,
      hasValidTZ ? `DTEND;TZID=${this.timezone}:${end}` : `DTEND:${end}`,
      ...(this.organizer
        ? [`ORGANIZER:${this.escapeICS(this.organizer)}`]
        : []),
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
  }

  genICSBlobLink() {
    if (this.__currentBlobUrl) URL.revokeObjectURL(this.__currentBlobUrl);
    const blob = new Blob([this.genICSContent()], {
      type: "text/calendar;charset=utf-8",
    });
    this.__currentBlobUrl = URL.createObjectURL(blob);
    return this.__currentBlobUrl;
  }

  updateCalendarLinks() {
    if (this.google) this.google.querySelector("a").href = this.genGoogleLink();
    if (this.outlook)
      this.outlook.querySelector("a").href = this.genOutlookLink();
    if (this.yahoo) this.yahoo.querySelector("a").href = this.genYahooLink();
    if (this.ics) {
      const icsLink = this.ics.querySelector("a");
      if (icsLink.href.startsWith("blob:")) URL.revokeObjectURL(icsLink.href);
      icsLink.href = this.genICSBlobLink();
    }
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });

    const selectedTheme = this.getAttribute("theme")?.trim();
    const hasThemeAttr = this.hasAttribute("theme");

    let styleApplied = false;

    try {
      const themeMap =
        typeof undefined === "string"
          ? JSON.parse(undefined)
          : undefined;
      if (hasThemeAttr && selectedTheme && themeMap?.[selectedTheme]) ;
    } catch (_) {
      // fallback to default below
    }

    if (!styleApplied && ".btn-cal-dropdown{align-items:center;border-radius:6px;cursor:pointer;display:inline-flex;font-family:Poppins,Helvetica,sans-serif;font-size:14px;font-weight:600;margin:2px;padding:10px 16px;position:relative;transition:background .3s ease,transform .2s ease}.btn-cal-dropdown:active{transform:scale(.98)}.btn-arrow{border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #f5f5f5;height:0;margin-left:10px;transition:transform .3s ease;width:0}.btn-cal-dropdown[aria-expanded=true] .btn-arrow{transform:rotate(180deg)}.dropdown-cal-menu{border-radius:8px;display:block;list-style:none;min-width:200px;opacity:0;padding:5px 0;pointer-events:none;position:absolute;transform:scale(.95) translateY(-10px);transform-origin:top;transition:all .25s ease;z-index:1000}.dropdown-cal-menu.show{opacity:1;pointer-events:auto;transform:scale(1) translateY(0)}.dropdown-cal-menu li{font-family:Arial,sans-serif;font-size:13px;transition:background-color .15s ease}.dropdown-cal-menu a{padding:10px 16px;transition:background-color .15s ease,color .2s ease}.dropdown-cal-menu li:first-child{border-radius:8px 8px 0 0}.dropdown-cal-menu li:last-child{border-radius:0 0 8px 8px}.btn-cal-dropdown{backdrop-filter:blur(.5em);background-color:rgba(40,40,40,.8);border:.0625em solid hsla(0,0%,100%,.08);color:#eee;font-family:Inter,sans-serif}.btn-cal-dropdown:hover{background-color:rgba(60,60,60,.85);box-shadow:0 0 .5em hsla(0,0%,100%,.08)}.dropdown-cal-menu{backdrop-filter:blur(.75em);background-color:hsla(0,0%,8%,.95);border:.0625em solid hsla(0,0%,100%,.08);border-radius:.75em;box-shadow:0 1em 2em rgba(0,0,0,.6);color:#eee}.dropdown-cal-menu li{color:#ddd;font-family:Inter,sans-serif;font-size:.9375em;margin:0;padding:0}.dropdown-cal-menu a{border-radius:.5em;color:#ccc;display:block;padding:.75em 1.25em;text-decoration:none;transition:background .2s ease,box-shadow .2s ease}.dropdown-cal-menu a:hover{background-color:rgba(80,80,80,.4);box-shadow:0 0 .5em hsla(0,0%,100%,.05);text-decoration:none}") {
      const style = document.createElement("style");
      style.textContent = ".btn-cal-dropdown{align-items:center;border-radius:6px;cursor:pointer;display:inline-flex;font-family:Poppins,Helvetica,sans-serif;font-size:14px;font-weight:600;margin:2px;padding:10px 16px;position:relative;transition:background .3s ease,transform .2s ease}.btn-cal-dropdown:active{transform:scale(.98)}.btn-arrow{border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #f5f5f5;height:0;margin-left:10px;transition:transform .3s ease;width:0}.btn-cal-dropdown[aria-expanded=true] .btn-arrow{transform:rotate(180deg)}.dropdown-cal-menu{border-radius:8px;display:block;list-style:none;min-width:200px;opacity:0;padding:5px 0;pointer-events:none;position:absolute;transform:scale(.95) translateY(-10px);transform-origin:top;transition:all .25s ease;z-index:1000}.dropdown-cal-menu.show{opacity:1;pointer-events:auto;transform:scale(1) translateY(0)}.dropdown-cal-menu li{font-family:Arial,sans-serif;font-size:13px;transition:background-color .15s ease}.dropdown-cal-menu a{padding:10px 16px;transition:background-color .15s ease,color .2s ease}.dropdown-cal-menu li:first-child{border-radius:8px 8px 0 0}.dropdown-cal-menu li:last-child{border-radius:0 0 8px 8px}.btn-cal-dropdown{backdrop-filter:blur(.5em);background-color:rgba(40,40,40,.8);border:.0625em solid hsla(0,0%,100%,.08);color:#eee;font-family:Inter,sans-serif}.btn-cal-dropdown:hover{background-color:rgba(60,60,60,.85);box-shadow:0 0 .5em hsla(0,0%,100%,.08)}.dropdown-cal-menu{backdrop-filter:blur(.75em);background-color:hsla(0,0%,8%,.95);border:.0625em solid hsla(0,0%,100%,.08);border-radius:.75em;box-shadow:0 1em 2em rgba(0,0,0,.6);color:#eee}.dropdown-cal-menu li{color:#ddd;font-family:Inter,sans-serif;font-size:.9375em;margin:0;padding:0}.dropdown-cal-menu a{border-radius:.5em;color:#ccc;display:block;padding:.75em 1.25em;text-decoration:none;transition:background .2s ease,box-shadow .2s ease}.dropdown-cal-menu a:hover{background-color:rgba(80,80,80,.4);box-shadow:0 0 .5em hsla(0,0%,100%,.05);text-decoration:none}";
      this.shadowRoot.appendChild(style);
    }

    if (this.themeUrl) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this.themeUrl;
      this.shadowRoot.appendChild(link);
    }

    const container = document.createElement("div");
    container.className = "container";
    container.style = "display: inline-block; position: relative";

    this.__button = document.createElement("button");
    this.__button.innerHTML = `${this.button} <span class="btn-arrow"></span>`;
    this.__button.className = "btn-cal-dropdown";
    this.__button.setAttribute("aria-haspopup", "true");
    this.__button.setAttribute("aria-expanded", "false");
    this.__button.setAttribute("role", "button");

    const detailContainer = document.createElement("ul");
    detailContainer.className = "dropdown-cal-menu";
    detailContainer.setAttribute("role", "menu");

    this.google = document.createElement("li");
    this.google.setAttribute("role", "menuitem");
    this.google.innerHTML = `<a href="${this.genGoogleLink()}" target="_blank" rel="noopener">Google Calendar</a>`;

    this.outlook = document.createElement("li");
    this.outlook.setAttribute("role", "menuitem");
    this.outlook.innerHTML = `<a href="${this.genOutlookLink()}" target="_blank" rel="noopener">Outlook Calendar</a>`;

    this.yahoo = document.createElement("li");
    this.yahoo.setAttribute("role", "menuitem");
    this.yahoo.innerHTML = `<a href="${this.genYahooLink()}" target="_blank" rel="noopener">Yahoo Calendar</a>`;

    this.ics = document.createElement("li");
    this.ics.setAttribute("role", "menuitem");
    this.ics.innerHTML = `<a href="${this.genICSBlobLink()}" download="event.ics">Apple / ICS File</a>`;

    container.appendChild(this.__button);
    container.appendChild(detailContainer);
    detailContainer.appendChild(this.google);
    detailContainer.appendChild(this.outlook);
    detailContainer.appendChild(this.yahoo);
    detailContainer.appendChild(this.ics);
    this.shadowRoot.appendChild(container);

    const toggleVisibility = (el) => {
      el.classList.toggle("show");
      this.__button.setAttribute(
        "aria-expanded",
        el.classList.contains("show")
      );
      this.__opened = el.classList.contains("show") ? el : null;
    };

    this.__button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const menu = this.__button.nextElementSibling;
        toggleVisibility(menu);
      }
    });

    document.addEventListener("click", (event) => {
      const path = event.composedPath();
      const clickedButton = path.includes(this.__button);
      const menu = this.__button.nextElementSibling;
      if (clickedButton) {
        toggleVisibility(menu);
      } else if (this.__opened) {
        this.__opened.classList.remove("show");
        this.__button.setAttribute("aria-expanded", "false");
        this.__opened = null;
      }
    });
  }

  disconnectedCallback() {
    if (this.__currentBlobUrl) {
      URL.revokeObjectURL(this.__currentBlobUrl);
      this.__currentBlobUrl = null;
    }
  }

  attributeChangedCallback(attr, _oldVal, newVal) {
    if (!this.__button) return;
    if (attr === "button") {
      this.__button.innerHTML = `${newVal} <span class="btn-arrow"></span>`;
    } else if (
      [
        "title",
        "date-start",
        "date-end",
        "timezone",
        "location",
        "organizer",
        "content",
      ].includes(attr)
    ) {
      this.updateCalendarLinks();
    }
  }
}

function init() {
  if (!customElements.get("calendarizer")) {
    customElements.define("calendarizer", Calendarizer);
  }
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
