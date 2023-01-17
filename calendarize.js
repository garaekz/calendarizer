class Calendarizer extends HTMLElement {
  constructor() {
    super();
    this.__opened = null;
    this.__button = null;
    this.google = null;
    this.outlook = null;
    this.yahoo = null;
  }
  static get observedAttributes() {
    return [
      "button",
      "title",
      "date-start",
      "timezone",
      "location",
      "organizer",
      "content",
    ];
  }
  get button() {
    return this.getAttribute("button");
  }
  get title() {
    return this.getAttribute("title");
  }
  get dateStart() {
    return this.getAttribute("date-start");
  }
  get dateEnd() {
    return this.getAttribute("date-end");
  }
  get timezone() {
    return this.getAttribute("timezone");
  }
  get location() {
    return this.getAttribute("location");
  }
  get organizer() {
    return this.getAttribute("organizer");
  }
  get content() {
    return this.getAttribute("content");
  }

  set button(newData) {
    return this.setAttribute("button", newData);
  }
  set title(newData) {
    return this.setAttribute("title", newData);
  }
  set dateStart(newData) {
    return this.setAttribute("date-start", newData);
  }
  set dateEnd(newData) {
    return this.setAttribute("date-end", newData);
  }
  set timezone(newData) {
    return this.setAttribute("timezone", newData);
  }
  set location(newData) {
    return this.setAttribute("location", newData);
  }
  set organizer(newData) {
    return this.setAttribute("organizer", newData);
  }
  set content(newData) {
    return this.setAttribute("content", newData);
  }
  parseDate = (dt) => {
    const d = new Date(Date.parse(dt))
    return {d: String(d.getDate()).padStart(2, '0'), m: String(d.getMonth()+1).padStart(2, '0'), y: d.getFullYear(), h: String(d.getHours()).padStart(2, '0'), n: String(d.getMinutes()).padStart(2, '0')}
  }
  googleDateFormat = (dt) => {
    const d = this.parseDate(dt)
    return `${d.y}${d.m}${d.d}T${d.h}${d.n}:00`;
  }
  outlookDateFormat = (dt) => {
    const d = this.parseDate(dt).
    return `${d.y}-${d.m}-${d.d}T${d.h}:${d.n}:00`;
  }
  lbr = (str) => {
    str = str.replace(/<br>/g, '%0A%0A')
    str = str.replace(/<br\/>/g, '%0A%0A')
    return encodeURIComponent(str)
  }
  genGoogleLink = () => {
    return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURI(this.title)}&dates=${this.googleDateFormat(this.dateStart)}/${this.googleDateFormat(this.dateEnd)}&ctz=${this.timezone}&details=${encodeURI(this.content)}&location=${encodeURI(this.location)}&pli=1`
  }
  genOutlookLink = () => {
    return `https://outlook.live.com/calendar/0/deeplink/compose?rru=addevent&path=%2Fcalendar%2Faction%2Fcompose&startdt=${this.outlookDateFormat(this.dateStart)}&enddt=${this.outlookDateFormat(this.dateEnd)}&subject=${encodeURI(this.title)}&body=${encodeURI(this.content)}&location=${encodeURI(this.location)}&allday=false`
  }
  genYahooLink = () => {
    return `https://calendar.yahoo.com/?v=60&title=${encodeURI(this.title)}&desc=${this.lbr(this.content)}&in_loc=${encodeURI(this.location)}&st=${this.googleDateFormat(this.dateStart)}&et=${this.googleDateFormat(this.dateEnd)}`
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    var container = document.createElement("div");
    container.setAttribute("class", "container");
    container.style = "display: inline-block"
    this.__button = document.createElement("button");
    this.__button.innerHTML = `${this.button} <span class="btn-arrow"></span>`;
    this.__button.setAttribute("class", "btn-cal-dropdown");
    var detailContainer = document.createElement("ul");
    detailContainer.setAttribute("class", "dropdown-cal-menu");
    this.google = document.createElement("li");
    this.google.innerHTML = `<a href="${this.genGoogleLink()}" target="_blank"><li>Google Calendar</li></a>`;
    this.outlook = document.createElement("li");
    this.outlook.innerHTML = `<a href="${this.genOutlookLink()}" target="_blank"><li>Outlook Calendar</li></a>`;
    this.yahoo = document.createElement("li");
    this.yahoo.innerHTML = `<a href="${this.genYahooLink()}" target="_blank"><li>Yahoo Calendar</li></a>`;

    const style = document.createElement("style");
    style.textContent = 
    `
    .btn-buy:hover {
      background: #6e6cfb;
    }
    .btn-cal-dropdown {
      font-family: Poppins, Helvetica, sans-serif;
      border: 1px solid #6e6cfb;
      border-radius: 5px;
      font-size: 12px;
      font-weight: bold;
      padding: 10px 15px;
      background: #fff;
      margin: 2px;
      position: relative;
    }
    .btn-cal-dropdown:hover {
      background: #6e6cfb;
      color: #fff
    }
    .btn-cal-dropdown:hover .btn-arrow,
    .btn-cal-dropdown:focus .btn-arrow {
      border-top: 5px solid #fff;
    }
    .btn-cal-dropdown:active,
    .btn-cal-dropdown:focus {
      outline: none;
      background: #6e6cfb;
      color: #fff;
    }
    .btn-arrow {
      width: 0;
      height: 0;
      border-top: 5px solid #000;
      border-right: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid transparent;
      position: relative;
      top: 10px;
      margin-left: 15px;
    }
    .dropdown-cal-menu {
      position: absolute;
      z-index: 1000;
      display: none;
      min-width: 160px;
      padding: 5px 0;
      margin: -1px 0 0 0;
      list-style: none;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      background-clip: padding-box;
    }
    .dropdown-cal-menu a {
      text-decoration: none;
    }
    .dropdown-cal-menu a li {
      font-size: 12px;
      font-family: arial,sans-serif;
      color: #222;
      padding: 5px 15px;
    }
    .dropdown-cal-menu a li:hover {
      background-color: #bae2fc;
    }
    .show {
      display: block;
    }
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);
    container.appendChild(this.__button);
    container.appendChild(detailContainer);
    detailContainer.appendChild(this.google);
    detailContainer.appendChild(this.outlook);
    detailContainer.appendChild(this.yahoo);
    
    const toggleVisibility = (e) => {
      e.classList.toggle("show");
    };
  
    const handleDropdown = (e) => {
      const clickedItem = e.parentElement.lastChild;
      toggleVisibility(clickedItem);
  
      if (!this.__opened) {
        this.__opened = clickedItem;
      } else if (this.__opened == clickedItem) {
        this.__opened = null;
      } else {
        toggleVisibility(this.__opened);
        this.__opened = clickedItem;
      }
    };

    document.addEventListener('click', (event) => {
      if (this.__button == event.path[0]) {
        handleDropdown(this.__button);
      } else if (this.__opened) {
        toggleVisibility(this.__opened);
        this.__opened = null;
      }
    });  
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal) {
      switch (attr) {
        case 'button':
          this.__button.innerHTML = `${newVal} <span class="btn-arrow"></span>`;
          break;
        default:
          this.google.innerHTML = `<a href="${this.genGoogleLink()}" target="_blank"><li>Google Calendar</li></a>`;
          this.outlook.innerHTML = `<a href="${this.genOutlookLink()}" target="_blank"><li>Outlook Calendar</li></a>`;
          this.yahoo.innerHTML = `<a href="${this.genYahooLink()}" target="_blank"><li>Yahoo Calendar</li></a>`;
          break;
      }
    }
  }
}

function init() {
  customElements.define("calendarizer-io", Calendarizer);
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css?family=Poppins&display=swap';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

if (window.attachEvent) {
  window.attachEvent("onload", init);
} else if (window.addEventListener) {
  window.addEventListener("load", init, false);
} else {
  document.addEventListener("load", init, false);
}
