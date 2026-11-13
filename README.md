# AirQuant — Understand Air. Predict Tomorrow.

> **Intelligent Environmental Monitoring & Machine Learning Prediction Platform for Indian Cities**
> High-Fidelity Product Demonstration for Faculty Evaluation, Environmental Startup Pitch & Research Showcase.

---

## 🌿 Brand Identity
- **Product Name:** AirQuant
- **Tagline:** *Understand Air. Predict Tomorrow.*
- **Palette:** Off-white background (`#F8FAF9`), Deep Forest Green (`#145C46`), Emerald Accents (`#10B981`), Dark Charcoal (`#1F2937`).
- **Standard:** India Central Pollution Control Board (CPCB) NAQI 2014 Framework.
- **Default Demonstration Station:** **Vasundhara, Ghaziabad, Uttar Pradesh** (AQI 178, Moderate).

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js (v18+ recommended, tested on v24)
- npm (v9+)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** (or the port Vite outputs) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🧭 Pages & Completed Feature Matrix

| # | Route | Module | Key Capabilities |
|---|---|---|---|
| 1 | `/` | **Landing Page** | High-impact hero with city search, *Air Quality at a Glance*, *Why AirQuant* (Monitor, Analyze, Predict), interactive forecast preview chart, Pan-India coverage grid, 4-step pipeline explanation, and footer. |
| 2 | `/dashboard` | **Main Dashboard** | Default **Ghaziabad** node (AQI 178, PM2.5: 92, PM10: 151, NO2: 36, SO2: 12, CO: 0.8, O3: 48), custom circular SVG AQI gauge, CPCB color scale, 6 criteria pollutant cards with real-time sparklines, 24h & weekly Recharts trends, meteorological matrix (Temp, Humidity, Wind), and health recommendations. |
| 3 | `/live` | **Live Monitoring** | Real-time CAAQMS telemetry stream, sensor diagnostics table (BAM-1020, Nephelometry, Chemiluminescence, NDIR), data quality index (99.8%), raw JSON payload inspector modal, and instant stream re-polling. |
| 4 | `/map` | **India Air Map** | Interactive Leaflet OpenStreetMap with 15 Indian metropolitan CAAQMS stations, custom color-coded numeric AQI marker pins, interactive popups, city search, state filter, CPCB severity filter, floating legend, and selected station side drawer. |
| 5 | `/predictions` | **AI Predictions** | Machine learning air forecasting with 24-hour, 3-day, and 7-day forecast horizons, 95% confidence intervals, 3 evaluated model cards (**XGBoost**, **Random Forest**, **Gradient Boost**) with sample metrics (MAE, RMSE, R²), model accuracy benchmark bar charts, and 5-stage ML pipeline diagram. |
| 6 | `/historical` | **Historical Analysis** | Filterable longitudinal analytics (Past 7, 14, 30 days), metric selector (AQI, PM2.5, PM10, NO2), chart style toggle (smooth area vs. discrete bars), statistical highlights (peak day, cleanest day, mean, exceedance days), and raw registry table. |
| 7 | `/compare` | **City Comparison** | Multi-city comparative benchmarking (2 to 6 cities), comparative bar chart (AQI, PM2.5, PM10, Predicted), cleanest-to-most-polluted leaderboard ranking, and multi-parameter comparative matrix. |
| 8 | `/health` | **Health Insights** | Interactive CPCB NAQI 6-tier educational framework (Good, Satisfactory, Moderate, Poor, Very Poor, Severe), vulnerable demographic guidance (Children, Elderly, Asthmatics), and scientific toxicology breakdown of the 6 criteria pollutants. |
| 9 | `/alerts` | **Alerts & Triggers** | Functional watchdog alert configuration with threshold sliders, city selector, condition switches, localStorage persistence, active/disable toggles, rule deletion, and simulated dispatch history. |
| 10 | `/about` | **About AirQuant** | Brand philosophy, architectural stack breakdown, mission statement, environmental responsibility principles, and faculty evaluation demo disclaimer. |

---

## 🏗️ Project Architecture

```
AirQuantMiniProject/
├── public/
│   └── logo-icon.svg             # Minimal air/wind wave and botanical logo
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AQIBadge.tsx          # CPCB category color badge
│   │   │   ├── CircularGauge.tsx     # 240-degree SVG circular gauge
│   │   │   ├── DemoBanner.tsx        # Persistent top demo mode badge
│   │   │   ├── MetricSparkline.tsx   # 24h trend sparkline
│   │   │   └── PollutantCard.tsx     # Clean criteria pollutant metric card
│   │   └── layout/
│   │       ├── Layout.tsx            # Main shell uniting navigation & views
│   │       ├── Navbar.tsx            # City typeahead search, time, alerts drawer
│   │       └── Sidebar.tsx           # Collapsible SaaS navigation drawer
│   ├── context/
│   │   └── CityContext.tsx           # Global state, selected city, comparison, alerts
│   ├── data/
│   │   └── mockData.ts               # Realistic local demo dataset for 15 Indian cities
│   ├── pages/
│   │   ├── AboutPage.tsx             # Brand identity & tech stack
│   │   ├── AlertsPage.tsx            # Alert watchdog triggers
│   │   ├── ComparisonPage.tsx        # Multi-city comparison & ranking
│   │   ├── DashboardPage.tsx         # Main executive dashboard
│   │   ├── HealthInsightsPage.tsx    # CPCB health standards & clinical guide
│   │   ├── HistoricalPage.tsx        # Longitudinal trends & statistics
│   │   ├── LandingPage.tsx           # High-impact presentation landing page
│   │   ├── LiveMonitoringPage.tsx    # Real-time CAAQMS station stream
│   │   ├── MapPage.tsx               # Leaflet geospatial India map
│   │   └── PredictionsPage.tsx       # AI forecasting models & metrics
│   ├── types/
│   │   └── index.ts                  # Comprehensive TypeScript interfaces
│   ├── App.tsx                       # React Router configuration
│   ├── index.css                     # Tailwind base, typography, Leaflet fixes
│   └── main.tsx                      # Vite React entry point
├── index.html                        # Plus Jakarta Sans, Inter, Leaflet CDN
├── package.json
├── postcss.config.js
├── tailwind.config.js                # Custom palette: #F8FAF9, #145C46, #10B981
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 📌 Demonstration Notice
All ambient telemetry readings, historical curves, and machine learning performance figures are realistically simulated demo values for educational and presentation purposes.

