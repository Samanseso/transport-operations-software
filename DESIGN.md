# DESIGN.md — Enterprise Fleet Management System Design Specification

This document defines the visual aesthetic, design tokens, layout patterns, UI components, and complete screen catalog for the **Michael Archangel Transport Operations Software** enterprise platform upgrade.

---

## 1. Design Vision & Aesthetic Direction

### Core Aesthetic: "Precision Telematics & Operational Clarity"
* **Visual Style**: Clean, modern enterprise UI with dark/light adaptive modes, sleek micro-borders, glassmorphism card overlays, crisp typography, and high-visibility status indicators.
* **Tone**: Professional, trustworthy, precise, and highly responsive.
* **Density**: High-information density optimized for dispatchers and fleet managers on desktop, paired with high-contrast, touch-optimized interfaces for drivers on mobile.

---

## 2. Design System Tokens & Color Palette

### 2.1 Color System (HSL / Hex)

```
├── Brand Primary       : #0284c7 (Sky 600 - Active states, primary action buttons)
├── Brand Primary Dark  : #0369a1 (Sky 700 - Hover states, active tabs)
├── Brand Secondary    : #0f172a (Slate 900 - Headers, sidebar background, dark mode body)
├── Accent Emerald     : #10b981 (Emerald 500 - Success, Pickup badge, completed trips)
├── Accent Amber       : #f59e0b (Amber 500 - Warnings, Pending status, maintenance due)
├── Accent Rose        : #ef4444 (Rose 500 - Errors, Dropoff badge, cancelled, overdue)
├── Accent Indigo      : #6366f1 (Indigo 500 - In-transit, dispatch active)
├── Surface Light      : #f8fafc (Slate 50 - Dashboard background)
├── Card Light         : #ffffff (White - Content cards, modals, dropdowns)
├── Surface Dark       : #0f172a (Slate 900 - Dark mode background)
├── Card Dark          : #1e293b (Slate 800 - Dark mode card surfaces)
└── Border Subdued     : #e2e8f0 (Slate 200 light) / #334155 (Slate 700 dark)
```

### 2.2 Status Color Mapping

| Trip / Vehicle Status | Badge Background | Text Color | Dot Indicator |
| :--- | :--- | :--- | :--- |
| `PENDING` / `ASSIGNED` | `#FEF3C7` (Amber 100) | `#D97706` (Amber 700) | `#F59E0B` |
| `GOING TO PICKUP` | `#E0F2FE` (Sky 100) | `#0284C7` (Sky 700) | `#0284C7` |
| `WAITING` | `#EDE9FE` (Violet 100) | `#6D28D9` (Violet 700) | `#8B5CF6` |
| `GOING TO DROPOFF` | `#E0E7FF` (Indigo 100) | `#4338CA` (Indigo 700) | `#6366F1` |
| `COMPLETE` | `#D1FAE5` (Emerald 100) | `#047857` (Emerald 700) | `#10B981` |
| `CANCELLED` | `#FEE2E2` (Rose 100) | `#B91C1C` (Rose 700) | `#EF4444` |
| `IN_MAINTENANCE` | `#FFEDD5` (Orange 100) | `#C2410C` (Orange 700) | `#F97316` |

### 2.3 Typography & Hierarchy
* **Primary Font Family**: `Instrument Sans`, `Inter`, -apple-system, sans-serif.
* **Code / License Font**: `JetBrains Mono`, `Fira Code`, monospace (for Vehicle Plate Numbers, Tracking IDs, GPS coordinates).

| Element | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **Page Title (H1)** | `1.5rem (24px)` | `700 (Bold)` | `1.25` |
| **Section Header (H2)** | `1.25rem (20px)` | `600 (SemiBold)` | `1.3` |
| **Card Header (H3)** | `1.0rem (16px)` | `600 (SemiBold)` | `1.4` |
| **Body Text** | `0.875rem (14px)` | `400 (Normal)` | `1.5` |
| **Small / Captions** | `0.75rem (12px)` | `500 (Medium)` | `1.4` |
| **Badge / Micro Tag** | `0.6875rem (11px)` | `700 (Bold)` | `1.0` |

---

## 3. Global Layout Architecture & Shell Specifications

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP HEADER BAR: Logo | Organization/Branch Switcher | Global Search | Notifications | Profile │
├───────────────┬────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR       │ MAIN CONTENT AREA                                                      │
│ • Dashboard   │                                                                        │
│ • Fleet       │ ┌──────────────────────────────────┐ ┌───────────────────────────────┐ │
│ • Dispatches  │ │ LEFT PANEL: DISPATCH LIST        │ │ RIGHT PANEL: REALTIME MAP     │ │
│ • Tasks       │ │ • Search & Filters               │ │ • Leaflet Map Container       │ │
│ • Maintenance │ │ • Card Item Active Selection     │ │ • 3-Point Badges (Truck, A, B)│ │
│ • Invoices    │ │ • Status Tags                    │ │ • Dynamic Route Polyline      │ │
│ • Reports     │ └──────────────────────────────────┘ └───────────────────────────────┘ │
└───────────────┴────────────────────────────────────────────────────────────────────────┘
```

### Layout Shell Rules:
1. **Collapsible Dual Sidebar**: Left primary navigation sidebar + optional module contextual sub-sidebar.
2. **Full-Height Split Screen**: Dispatch & Tracking views use full viewport height (`calc(100vh - 64px)`) with fixed list panel + fluid Leaflet map.
3. **Floating Card Overlays**: Floating details panel over map (`FloatingReservationDetails`) with glassmorphism (`backdrop-blur-sm bg-white/90`).

---

## 4. UI Component Library Specifications

### 4.1 Leaflet Map Marker Badges
* **Driver Truck Marker (`vehicleIcon`)**: Custom `L.divIcon` displaying a blue **DRIVER TRUCK** badge above the animated `truck.png` icon.
* **Pickup Location Marker (`pickupIcon`)**: Custom `L.divIcon` displaying a green pill badge (`PICKUP`) with a pin stem.
* **Dropoff Location Marker (`dropoffIcon`)**: Custom `L.divIcon` displaying a red pill badge (`DROPOFF`) with a pin stem.

### 4.2 Form Controls & Wizard Stepper
* **Reservation Wizard Stepper**: 4-step progress indicator (*Vehicle & Date $\rightarrow$ Locations $\rightarrow$ Cargo Details $\rightarrow$ Review & Dispatch*).
* **Location Search Input**: Auto-complete geocoding input powered by OpenStreetMap Nominatim with live lat/lng coordinate preview.

### 4.3 Mobile Driver PWA Components
* **Big Touch Status Action Button**: Prominent full-width button to cycle task status (*Start $\rightarrow$ Arrived at Pickup $\rightarrow$ Going to Dropoff $\rightarrow$ Arrived at Dropoff*).
* **Location Error Overlay Banner**: Top amber warning bar displaying geolocation status and access instructions.
* **Digital Signature Pad**: HTML5 Canvas component capturing customer signature on delivery completion.

---

## 5. Complete Page Catalog by User Role

### 5.1 System Super Admin Pages
1. **`/admin/tenants`** — Multi-Tenant Management (Create, edit, suspend organization accounts).
2. **`/admin/system-health`** — Platform Infrastructure & Reverb WebSocket Cluster Monitor.
3. **`/admin/global-logs`** — Cross-Tenant System Audit Log Search & Security Inspector.

### 5.2 Company Administrator / Executive Pages
4. **`/dashboard`** — Executive BI Dashboard (Fleet utilization, SLA delivery rates, total revenue, active trips).
5. **`/settings/organization`** — Organization Profile, Branches, and Branding Settings.
6. **`/users`** — User & Staff Management (Assign roles: Admin, Dispatcher, Fleet Manager, Driver, Finance).
7. **`/settings/pricing`** — Rate Cards & Dynamic Pricing Engine Rules.

### 5.3 Fleet Manager Pages
8. **`/fleet`** — Fleet Vehicle Inventory (Grid & List views with payload, status, fuel indicators).
9. **`/fleet/{id}`** — Vehicle Detail Page (Specs, license plate, assigned driver, maintenance history, active dispatch).
10. **`/fleet/maintenance`** — Preventive Maintenance & Service Schedules (Oil change, tire rotation, repairs log).
11. **`/fleet/fuel`** — Fuel Logs & Anomaly Monitor (Liters, cost, km/L efficiency graphs).
12. **`/drivers`** — Driver Roster & License Compliance Tracking (Driver licenses, contact, status, assigned truck).

### 5.4 Dispatcher / Operations Pages
13. **`/active-dispatches`** — Real-Time Active Dispatches Control Center (Split list + 3-point live tracking map).
14. **`/reservations`** — Reservation Management & Filterable Master List.
15. **`/reservations/create`** — 4-Step Guided Reservation Booking Wizard.
16. **`/reservations/{id}`** — Reservation Detail View & Waypoint Management.
17. **`/dispatch/planner`** — Automated Dispatch Matching & Schedule Calendar Planner.

### 5.5 Driver Pages (Mobile Responsive PWA)
18. **`/driver/dashboard`** — Driver Mobile Overview (Today's tasks, active trip, vehicle assignment).
19. **`/tasks`** — Assigned Task List (Upcoming, active, and completed driver jobs).
20. **`/tasks/{id}`** — Live Task Execution & Turn-by-Turn Map View (10s GPS streaming, status update trigger).
21. **`/tasks/{id}/pod`** — Digital Proof of Delivery (Customer e-signature canvas, cargo photo upload).

### 5.6 Customer Pages (Customer Self-Service Portal)
22. **`/customer/dashboard`** — Customer Home Overview (Active shipments count, recent orders, quick book button).
23. **`/my-active-reservations`** — Live Shipment Tracker (Customer live map view of driver truck moving to delivery).
24. **`/my-reservations/new`** — Customer Reservation Booking Request Form.
25. **`/customer/invoices`** — Customer Invoices & Payment Receipts.

### 5.7 Finance Officer Pages
26. **`/finance/invoices`** — Billing & Invoices Operations (Generate invoices, mark payments, view overdue balances).
27. **`/finance/reports`** — Revenue, Cost per Kilometer & Financial Audit Reports.

---

## 6. Summary Matrix of User Roles & Screen Access

| Page Domain | Super Admin | Company Admin | Fleet Mgr | Dispatcher | Driver | Customer | Finance |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Tenant & System Health | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Executive BI Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| User & Role Management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Fleet Inventory & Vehicles | ✅ | ✅ | ✅ | 👁️ Read | ❌ | ❌ | ❌ |
| Maintenance & Fuel Logs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Active Dispatches Control | ✅ | ✅ | 👁️ Read | ✅ | ❌ | ❌ | ❌ |
| Reservation Booking Wizard | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Driver Task Execution | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Proof of Delivery (PoD) | ❌ | ❌ | ❌ | 👁️ Read | ✅ | 👁️ Read | ❌ |
| Customer Live Tracker | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Invoicing & Billing | ✅ | ✅ | ❌ | ❌ | ❌ | 👁️ Invoices | ✅ |
