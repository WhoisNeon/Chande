<p align="center">
  <a href="https://whoisneon.github.io/Chande/"><img src="https://img.shields.io/badge/demo-online-brightgreen?style=for-the-badge"></a>
  <a href="https://github.com/WhoisNeon/Chande/actions/workflows/static.yml"><img src="https://img.shields.io/badge/deploy-GitHub%20Pages-blue?style=for-the-badge"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-orange?style=for-the-badge"></a>
</p>

---

## 📋 Table of Contents

- [About Chande!?](#-about-chande)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Local Setup](#local-setup)
- [Tech Stack](#-tech-stack)
- [APIs & External Services](#-apis--external-services)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#️-author)

---

## 👋 About Chande!?

Chande!? is a simple, fast, and customizable web app that displays real-time fiat, gold, and cryptocurrency prices. Select and reorder the currencies you care about, switch between dark and light themes, and tap any card to copy its price. It is built as a Progressive Web App (PWA), so it installs to your home screen and works across desktop, tablet, and mobile — no build step, no framework, no dependencies to install.

---

## ✨ Features

-   **Real-time Rates:** Live prices for fiat currencies, gold (incl. 18k gold), and cryptocurrencies, fetched from two APIs in parallel.
-   **Customizable Currency List:** Add, remove, search, and reorder currencies via drag & drop or arrow buttons — your selection is saved locally and restored on your next visit.
-   **Price History at a Glance:** Each card shows the change since the last time you viewed it (↑/↓), and clicking a card opens a modal with a one-click copy button.
-   **Theme Toggle:** Seamlessly switch between dark and light modes; the choice is remembered.
-   **Responsive Design:** Optimized for a consistent experience on desktops, tablets, and mobile devices.
-   **Progressive Web App (PWA):** Installable with a service worker for fast startup and offline shell support.

---

## 📂 Project Structure

```
.
├── index.html                        # Entry point — loads styles, scripts, and manifest
├── LICENSE                           # MIT license
├── README.md                         # This file
├── .github/
│   └── workflows/
│       └── static.yml                # Deploys the site to GitHub Pages on push to main
└── src/
    ├── script.js                     # App logic: data fetching, UI, modals, drag & drop, PWA
    ├── styles.css                    # All styles, including dark-mode theme support
    ├── currency-meta.json            # Currency definitions: name, flag icon, type, API keys
    ├── manifest.json                 # PWA manifest (name, icons, theme colors)
    ├── service-worker.js             # Registers the app shell for PWA/offline support
    ├── SF-Pro-Rounded-Regular.otf    # Bundled display font
    └── icons/                        # PWA icons (48, 72, 96, 144, 192, 512 px)
```

---

## 🔴 Live Demo

[![Live Demo](https://img.shields.io/badge/Chande-Live%20Demo-green?style=for-the-badge)](https://whoisneon.github.io/Chande/)

---

## 🚀 Usage

1.  **View Rates:** Open the site to see current prices for your selected currencies.
2.  **Customize Currencies:** Click the settings icon (<i class="ph ph-gear"></i>) to open the currency selector. Add, remove, search, or reorder currencies with drag & drop or the arrow buttons.
3.  **Toggle Theme:** Use the theme toggle button (<i class="ph ph-sun"></i> / <i class="ph ph-moon"></i>) to switch between light and dark modes.
4.  **Copy Price:** Click on any currency card to open a price modal, view its price, and copy it to the clipboard.

### Local Setup

**Prerequisites:** any modern web browser and [Git](https://git-scm.com/). Node.js or Python is optional but recommended for serving the site locally.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/WhoisNeon/Chande.git
    cd Chande
    ```

2.  **Serve the site locally** — the app loads `src/currency-meta.json` with `fetch()`, which browsers block on `file://` URLs, so open it through a local server instead of double-clicking `index.html`:

    ```bash
    # Option A — Node.js
    npx serve .

    # Option B — Python
    python -m http.server 8000
    ```

    Then open the URL printed in your terminal (e.g. `http://localhost:3000` or `http://localhost:8000`).

3.  **Customize currencies (optional):** edit `src/currency-meta.json` to add or change currencies. Each entry looks like:

    ```json
    {
      "usd": {
        "en": "US Dollar",
        "icon": "https://raw.githubusercontent.com/HatScripts/circle-flags/.../us.svg",
        "type": "fiat",
        "apiKey": "USD"
      }
    }
    ```

    `type` is one of `fiat`, `gold`, or `crypto`; `apiKey` (and `apiSymbol` for crypto) must match the field returned by the corresponding API.

There is no build step — the code runs as-is.

---

## 🛠️ Tech Stack

| Technology            |                                                                    Icon                                                                    |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------: |
| **HTML5**             |        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="40" height="40"/>         |
| **CSS3**              |          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40"/>          |
| **JavaScript (ES6+)** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40"/> |

No frameworks and no build step — just plain HTML, CSS, and ES6+ JavaScript. Third-party libraries are loaded from CDN:

-   [Sortable.js](https://sortablejs.github.io/Sortable/) — drag & drop reordering in the currency selector
-   [Phosphor Icons](https://phosphoricons.com/) — icon set used throughout the UI

---

## 🌐 APIs & External Services

-   **Fiat & Gold prices:** `https://chand.pages.dev/api` — returns `{ fiat: { CODE: { sell } }, gold: { ... }, updated }`.
-   **Crypto prices:** `https://api.bitpin.org/api/v1/mkt/tickers/` — spot tickers from Bitpin; pairs are resolved via `apiSymbol` in `src/currency-meta.json`.
-   **Currency metadata:** `src/currency-meta.json` (local) — display names and flag icons from [circle-flags](https://github.com/HatScripts/circle-flags).
-   **Phosphor Icons:** `https://unpkg.com/@phosphor-icons/web`
-   **Sortable.js:** `https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js`
-   **GoatCounter (analytics):** `https://chande.goatcounter.com/count`

---

## 🚢 Deployment

The site is deployed automatically to **GitHub Pages** by the [`static.yml`](.github/workflows/static.yml) workflow: every push to `main` uploads the repository as static content and publishes it. You can also trigger a deploy manually from the **Actions** tab (*Run workflow*).

Live URL: <https://whoisneon.github.io/Chande/>

---

## 🧩 Troubleshooting

-   **Data not loading / empty cards:** Check your internet connection and open the browser dev console (F12 → Network) to confirm both price APIs respond. Note that opening the page via `file://` fails on the metadata fetch — serve the folder over HTTP instead (see [Local Setup](#local-setup)).
-   **Prices stuck or outdated:** Price data is fetched from remote APIs on each refresh; if they are down, the console logs `Error fetching data:`.
-   **PWA installation issues:** Check the dev console for service worker registration errors. `src/service-worker.js` and `src/manifest.json` must be reachable, and the page must be served over HTTPS (or `localhost`).

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, feel free to fork the repository and submit a pull request. You can also open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## ✍️ Author

Created by **[CertMusashi](https://github.com/CertMusashi)**.
Revamped by **[WhoisNeon](https://github.com/WhoisNeon)**.
