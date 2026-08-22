# 🏙️ UrbanTwin AI — Smart City Digital Twin & Multi-Agent Operations Cockpit

UrbanTwin AI is an interactive, predictive smart city digital twin command center. It models municipal operations, simulates disruptions (traffic bottlenecks, population surges, weather floods), calculates multi-system resource impacts, and orchestrates automated emergency dispatches with AI green-wave signal coordination.

---

## ✨ Features

- **🌐 Multi-City Digital Twin**: Switch live telemetry across 6 global metropolitan cities: Chandigarh 🇮🇳, New Delhi 🇮🇳, Mumbai 🇮🇳, Bengaluru 🇮🇳, London 🇬🇧, and New York City 🇺🇸.
- **🚨 Interactive Custom Incident Placement**: Click anywhere on the map to spawn accidents or water leaks, or clear the map for testing.
- **🏥 Geographic Nearest Hospital Triage Engine**: Calculates Haversine distances to hospitals in real-time, triaging emergency units to the closest facility with available ICU beds.
- **🎛️ Dual What-If Sandbox Simulators**:
  - **Module 1 (Traffic & Road Bottlenecks)**: Road closures, traffic surge slider, and weather disruptions with dedicated mobility graphs.
  - **Module 2 (Population Surge & 5-Sector Urban Twin)**: Population growth slider ($+0\%$ to $+100\%$) modeling Economy loss ($\$k/\text{day}$), Traffic load (%), Water demand (MLD), Energy load (MWh), and Municipal waste (Tons).
- **🧠 Tailored Logical AI Interventions**: Generates situation-specific interventions (VMS message diversions, stormwater sump pumps, smart water grid throttling, battery storage dispatch).
- **🤖 Grounded Gemini AI Operations Copilot**: Integrated with Google Gemini 2.5 Flash, grounded in live city telemetry and ICU bed metrics.
- **🔐 Secure Role-Based Authentication & Database**: Built-in persistent user database with exclusive Super-Admin access.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/urbantwin-ai.git
cd urbantwin-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) or [http://localhost:3000/](http://localhost:3000/) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 Super-Admin Credentials
- **Email**: `sanchitsoodan2405@gmail.com`
- **Password**: `@123`
- **Role**: `Super Admin (System Owner)`

---

## 🛠️ Built With
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **Mapping**: Leaflet, React-Leaflet, CartoDB Light & Voyager Tiles
- **Data Visualizations**: Recharts
- **AI Integration**: Google Gemini API (`@google/genai`)
