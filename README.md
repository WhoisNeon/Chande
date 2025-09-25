<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge"></a>
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge"></a>
  <a href="https://whoisneon.github.io/Chande"><img src="https://img.shields.io/badge/demo-online-purple?style=for-the-badge"></a>
</p>

---

## 📋 Table of Contents

- [About Chande!?](#-about-chande)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Live Demo](#-live-demo)
- [Usage](#-usage)
- [Tech Stack](#-tech-stack)
- [APIs Used](#-apis-used)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Author](#️-author)

---

## 👋 About Chande!?

Chande!? is a simple, fast, and customizable web application designed to display real-time currency exchange rates. It allows users to select and reorder their preferred currencies, toggle between dark and light themes. Built as a Progressive Web App (PWA), it offers a seamless experience across devices.

---

## ✨ Features

-   **Real-time Currency Rates:** Displays up-to-date exchange rates for various currencies.
-   **Customizable Currency List:** Users can add, remove, and reorder currencies to personalize their view.
-   **Interactive Price:** A modal price allows for quick view and copying of prices.
-   **Theme Toggle:** Seamlessly switch between dark and light modes.
-   **Responsive Design:** Optimized for a consistent experience on desktops, tablets, and mobile devices.
-   **Progressive Web App (PWA):** Installable and works offline, providing an app-like experience.

---

## 📂 Project Structure

```
.
├── index.html      # Main HTML file
├── styles.css      # Main CSS file with theme support
├── script.js       # Main JavaScript logic for data fetching, UI interactions, and PWA
├── LICENSE         # Project license file
├── README.md       # This README file
├── refrence.md     # Reference README file (for project documentation)
└── src/
    ├── manifest.json       # PWA manifest file
    ├── screenshot.jpg      # Project screenshot
    ├── service-worker.js   # PWA service worker for offline capabilities
    ├── SF-Pro-Rounded-Regular.otf # Custom font file
    └── icons/              # Application icons for various sizes
        ├── 48x48.png
        ├── 72x72.png
        ├── 96x96.png
        ├── 144x144.png
        ├── 192x192.png
        └── 512x512.png
```

---

## 🔴 Live Demo

[![Live Demo](https://img.shields.io/badge/Chande-Live%20Demo-green?style=for-the-badge)](https://whoisneon.github.io/Chande)

---

## 🚀 Usage

1.  **View Rates:** Open `index.html` in your browser to see current currency rates.
2.  **Customize Currencies:** Click the settings icon (<i class="ph ph-gear"></i>) to open the currency selector. Add, remove, or reorder currencies.
3.  **Toggle Theme:** Use the theme toggle button (<i class="ph ph-sun"></i> / <i class="ph ph-moon"></i>) to switch between light and dark modes.
4.  **Copy Price:** Click on any currency card to open a price modal, view its price, and copy it to the clipboard.

### Local Setup

To run Chande!? locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/WhoisNeon/Chande.git
    cd Chande
    ```
2.  **Open `index.html`:** Simply open the `index.html` file in your web browser. No further configuration is needed for basic functionality.

---

## 🛠️ Tech Stack

| Technology            |                                                                    Icon                                                                    |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------: |
| **HTML5**             |        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" width="40" height="40"/>         |
| **CSS3**              |          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" width="40" height="40"/>          |
| **JavaScript (ES6+)** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="40" height="40"/> |

---

## 🌐 APIs Used

-   **Chande-api:** `https://raw.githubusercontent.com/CertMusashi/Chande-api/refs/heads/main/arz.json` for fetching currency data.
-   **Phosphor Icons:** `https://unpkg.com/@phosphor-icons/web` for UI icons.
-   **Sortable.js:** `https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js` for drag-and-drop reordering of currency cards.
-   **GoatCounter:** `https://chande.goatcounter.com/count` for website analytics.

---

## 🧩 Troubleshooting

-   **Data not loading:** Ensure you have an active internet connection. The application fetches data from a remote API.
-   **PWA installation issues:** Check your browser's developer console for service worker registration errors. Ensure `service-worker.js` and `manifest.json` are correctly configured.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, feel free to fork the repository and submit a pull request. You can also open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## ✍️ Author

Created by **[CertMusashi](https://github.com/CertMusashi)**.
Revamped by **[WhoisNeon](https://github.com/WhoisNeon)**.
