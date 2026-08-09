# 🚚 Michael Archangel Fleet Operations System Blueprint (Production Specification)

```
                    MICHAEL ARCHANGEL TRUCKING OPERATIONS SOFTWARE
                                 (Single-Company Platform)
                                             │
        ┌───────────────────┬────────────────┼───────────────────┬───────────────────┐
        ▼                   ▼                ▼                   ▼                   ▼
┌──────────────────┐ ┌────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  ADMINISTRATOR   │ │   DISPATCHER   │ │   DRIVER (PWA)   │ │ CUSTOMER PORTAL  │ │  FINANCE & OPS   │
│ (Full Fleet,     │ │ (Order Booking,│ │ (Mobile Tasks,   │ │ (Self-Service    │ │ (Invoicing, Rate │
│  Users & Logs)   │ │  Active Map)   │ │  Live GPS Map)   │ │  Order Track)    │ │  Cards, Fuel)    │
└──────────────────┘ └────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 1. 🛡️ Administrator & Operations Control Center

### 1.1 Executive Operations Dashboard
* **URL Route**: `/dashboard`
* **Access Role**: Administrator, Operations Manager
* **Purpose**: Provide operational leadership with high-level visibility over daily fleet activity, truck availability, order throughput, revenue trends, and live driver tracking.
* **Layout Structure**: Top 4-card KPI metric grid + 2-column main analytics split view (Left 60% Active Map & Activity Log, Right 40% Vehicle Status Donut & Fleet Capacity).
* **Key Features**:
  * Real-time counters: Active Reservations, Dispatches In Transit, Available Vehicles, Completed Today.
  * Embedded live interactive mini-map showing real-time driver truck markers.
  * Donut chart breakdown of vehicle availability (`AVAILABLE`, `IN_TRANSIT`, `IN_MAINTENANCE`).
  * Live Activity Feed timeline recording reservation creations, status changes, and driver assignments.
* **Components Used**:
  * `StatCard` (Metric card with trend indicators and sparklines).
  * `MiniMapPreview` (Leaflet canvas with active driver truck custom `L.divIcon` markers).
  * `DonutChart` / `ProgressBar` (Vehicle status distribution visualizer).
  * `ActivityFeedList` (Timeline with color-coded status badges and relative time tags).
* **Data & WebSocket Subscriptions**:
  * `private-dispatches` channel listening for `ReservationStatusChanged`.
  * `private-vehicle-locations` channel listening for `VehicleLocationUpdated`.

---

### 1.2 Master Reservation Management
* **URL Route**: `/reservations`
* **Access Role**: Administrator, Dispatcher, Operations Manager
* **Purpose**: Centralized command page to filter, search, sort, assign, and manage all customer transport bookings across their lifecycle.
* **Layout Structure**: Top action bar with primary `+ Create Reservation` CTA + Multi-filter toolbar + Tabbed master data table.
* **Key Features**:
  * Filter tabs: `All`, `Pending`, `Assigned`, `In Transit`, `Completed`, `Cancelled`.
  * Multi-column search across Reservation ID, Customer Name, Contact Number, Pickup Address, Dropoff Address.
  * Date range picker filter with preset filters (*Today, This Week, This Month*).
  * Quick-action table row menu: `Assign Driver`, `View Route Map`, `Edit Details`, `Download Waybill PDF`, `Cancel Reservation`.
  * Bulk export to CSV/Excel format.
* **Components Used**:
  * `DataTable` (Sticky header, hover states, server-side pagination, sorting controls).
  * `StatusBadge` (Color-coded pills: Amber for Pending, Sky for Going to Pickup, Violet for Waiting, Indigo for In Transit, Emerald for Completed, Rose for Cancelled).
  * `DateRangePicker` & `SelectDropdown` filter primitives.
  * `ActionButtonGroup` (`+ Create Reservation`, `Export`).

---

### 1.3 4-Step Guided Reservation Booking Wizard
* **URL Route**: `/reservations/create`
* **Access Role**: Administrator, Dispatcher
* **Purpose**: Guided workflow to create transport orders with automated vehicle availability checking, address geocoding, and distance-based fare calculation.
* **Layout Structure**: Centered multi-step wizard container with top progress step indicator.
* **Wizard Steps**:
  * **Step 1 (Schedule & Fleet Allocation)**: Select pickup date & time. Interactive vehicle selection grid showing real-time available vs busy trucks based on payload capacity.
  * **Step 2 (Pickup & Dropoff Locations)**: Nominatim geocoded address inputs with instant Leaflet interactive map preview displaying origin and destination pins.
  * **Step 3 (Cargo Specifications)**: Service type selection (*Standard Delivery, Heavy Cargo, Express Transport*), weight (kg), cargo description, and special handling notes.
  * **Step 4 (Pricing Review & Dispatch)**: Automatic fare breakdown powered by pricing engine rules ($\text{Base Rate} + \text{Distance} \times \text{Per-KM Rate}$), driver assignment dropdown, and submission trigger.
* **Components Used**:
  * `ProgressStepper` (Visual 4-step progress bar).
  * `VehicleCardGrid` (Radio grid displaying model, plate number badge, and max payload capacity).
  * `AddressAutoCompleteInput` (Debounced Nominatim API geocoder).
  * `LeafletMapPreview` (Interactive Leaflet map showing `[Pickup]` green pin and `[Dropoff]` red pin).
  * `FareCalculatorCard` (Live price breakdown summary).

---

### 1.4 Reservation Detail & Waypoint Inspector
* **URL Route**: `/reservations/{id}`
* **Access Role**: Administrator, Dispatcher, Customer Support
* **Purpose**: Full-page inspection of a single reservation, featuring live trip status progression, interactive route map, driver details, payment breakdown, and audit trail.
* **Layout Structure**: Top order header banner + 2-column detailed split view.
* **Key Features**:
  * Header banner showcasing current reservation status step and primary actions (*Update Status, Reassign Driver, Print Waybill*).
  * Route preview Leaflet map displaying GraphHopper calculated polyline path between pickup and dropoff points.
  * Customer Contact Card with quick phone/email trigger.
  * Driver & Vehicle Assignment Card featuring live location link.
  * Audit Timeline logging every status change, timestamp, and user action.
* **Components Used**:
  * `OrderStatusBanner` (Color-coded header bar with action buttons).
  * `RouteMapPreview` (Leaflet canvas with pickup/dropoff markers and route polyline).
  * `CustomerProfileCard` & `AssignedDriverCard`.
  * `AuditTimeline` (Vertical history feed with user avatars and timestamp badges).

---

### 1.5 Real-Time Active Dispatches Control Center
* **URL Route**: `/active-dispatches`
* **Access Role**: Administrator, Dispatcher
* **Purpose**: Operational control room to track all live ongoing deliveries across the city on a full-height interactive map with instant WebSocket position updates.
* **Layout Structure**: Full-height split screen (Left 380px fixed list drawer + Right fluid Leaflet map viewport).
* **Key Features**:
  * **3-Point Marker Map**: Live animated Driver Truck (`vehicleIcon`), Pickup Badge (`pickupIcon`), Dropoff Badge (`dropoffIcon`).
  * Live GraphHopper polyline route connecting driver position $\rightarrow$ pickup location $\rightarrow$ dropoff location.
  * Sub-second position streaming over Laravel Reverb WebSockets (`VehicleLocationUpdated` broadcast).
  * Floating glassmorphic bottom card overlay displaying active reservation specs, estimated ETA, and remaining distance.
  * Interactive camera triggers: `[Focus Driver]`, `[Auto-Fit Bounds]`.
* **Components Used**:
  * `SplitPaneLayout` (Left drawer + Right fluid map container).
  * `LeafletMapContainer` (TileLayer, custom HTML `L.divIcon` badges).
  * `FloatingReservationDetails` (Glassmorphic map overlay card).
  * `FocusDriverButton` & `WebSocketStatusIndicator` (Pulsing green dot: `Reverb Connected`).

---

### 1.6 Fleet Vehicle Management
* **URL Route**: `/fleet`
* **Access Role**: Administrator, Operations Manager, Dispatcher (Read-only)
* **Purpose**: Inventory management page for company transport vehicles, capacity tracking, assigned drivers, and operational readiness toggle.
* **Layout Structure**: View switcher header (Grid Cards / Data Table) + Status filter toolbar + Vehicle inventory layout.
* **Key Features**:
  * Vehicle cards showing model, license plate tag (`monospace`), payload capacity, assigned driver name, status badge (`AVAILABLE`, `IN_TRANSIT`, `IN_MAINTENANCE`).
  * `+ Register New Vehicle` modal (Model, Plate Number, Max Payload Weight, Fuel Type, Year).
  * Maintenance toggle button to quickly pull vehicles out of active dispatch availability.
  * Direct link to Vehicle Maintenance & Telemetry log.
* **Components Used**:
  * `ViewToggle` (Grid / Table view mode switcher).
  * `VehicleCard` (Vehicle icon, plate tag, capacity meter, status badge).
  * `RegisterVehicleModal` (Form modal dialog).

---

### 1.7 Vehicle Telemetry & Maintenance Manager
* **URL Route**: `/fleet/maintenance`
* **Access Role**: Administrator, Operations Manager
* **Purpose**: Track scheduled vehicle servicing, oil changes, tire replacements, repair costs, and fleet downtime metrics.
* **Layout Structure**: Top KPI stats (Scheduled Services, Overdue Maintenance, Total Maintenance Spend) + Maintenance Schedule Table + Service Entry Modal.
* **Key Features**:
  * Record service logs (Vehicle ID, Service Type, Odometer Reading, Cost, Service Center, Next Due Date/Km).
  * Flag vehicles as `IN_MAINTENANCE` which automatically removes them from reservation dispatch options.
  * Automated service reminders based on vehicle odometer thresholds.
* **Components Used**:
  * `StatCard` (Maintenance KPIs).
  * `MaintenanceTable` (Service records with status badges: `SCHEDULED`, `COMPLETED`, `OVERDUE`).
  * `LogServiceModal` (Form dialog).

---

### 1.8 Fuel Management & Efficiency Inspector
* **URL Route**: `/fleet/fuel`
* **Access Role**: Administrator, Operations Manager, Finance
* **Purpose**: Monitor fleet fuel consumption, fuel fill logs, cost per kilometer, and detect potential fuel theft or efficiency anomalies.
* **Layout Structure**: Top metric summary (Total Liters, Total Fuel Cost, Fleet Avg Km/L) + Fuel Efficiency Bar Chart + Driver Fuel Log Table.
* **Key Features**:
  * Log fuel entries (Vehicle ID, Driver, Liters Purchased, Total Cost, Receipt Photo, Current Odometer).
  * Auto-calculated Km/L efficiency formula based on delta between consecutive odometer logs.
  * Anomaly detection tag for entries falling below fleet efficiency thresholds.
* **Components Used**:
  * `FuelMetricSummaryCards`.
  * `EfficiencyChart` (Km/L efficiency per vehicle model).
  * `FuelLogTable` with receipt image lightbox preview.

---

### 1.9 User & Staff Roster Management
* **URL Route**: `/users`
* **Access Role**: Administrator
* **Purpose**: Manage system user accounts, assign operational roles (`ADMINISTRATOR`, `DISPATCHER`, `DRIVER`, `CUSTOMER`), and configure staff credentials.
* **Layout Structure**: Top role segment tabs (*All Users, Administrators, Dispatchers, Drivers, Customers*) + User master table + Add user modal.
* **Key Features**:
  * Create new staff user modal (Name, Email, Role, Phone Number, Password).
  * Driver-specific profile fields (Driver License Number, Assigned Vehicle, License Expiry Date).
  * Account activation toggle (`ACTIVE` vs `DEACTIVATED`).
* **Components Used**:
  * `RoleTabs` bar.
  * `UserDataTable` (Avatars, role badges, action buttons).
  * `AddUserModal` (Form dialog).

---

### 1.10 Operational Announcements & Fleet Bulletins
* **URL Route**: `/announcements`
* **Access Role**: Administrator, Operations Manager (Write), All Roles (Read)
* **Purpose**: Broadcast urgent operational updates, weather alerts, road blockages, or company bulletins to target audiences (Drivers, Dispatchers, Customers).
* **Layout Structure**: Audience tabs (*All, Drivers, Dispatchers, Customers*) + Announcement Cards Feed + Create Announcement Modal.
* **Key Features**:
  * Target specific audiences (`ALL`, `DRIVER`, `DISPATCHER`, `CUSTOMER`).
  * Schedule publication start date and expiration date.
  * Priority alert flags (`URGENT`, `INFO`, `FEATURED`).
* **Components Used**:
  * `AnnouncementCard` (Priority badge, venue tag, target audience pill).
  * `CreateAnnouncementModal` (Rich text editor form).

---

### 1.11 System Security & Operational Audit Logs
* **URL Route**: `/logs`
* **Access Role**: Administrator
* **Purpose**: Security and compliance log inspection monitoring all user actions, reservation edits, driver status changes, and vehicle modifications.
* **Layout Structure**: Filter toolbar + High-density log terminal table.
* **Key Features**:
  * Filter logs by date range, action type (`CREATE`, `UPDATE`, `DELETE`), module, or user.
  * Expandable JSON log rows showing detailed before/after attribute diffs.
  * Performed-by user attribution and timestamp tracking.
* **Components Used**:
  * `LogFilterBar` (Date picker, action selector, search input).
  * `LogTerminalTable` with expandable code diff block.
  * `ActionBadge` (`CREATE`: Emerald, `UPDATE`: Sky, `DELETE`: Rose).

---

## 2. 📱 Driver Mobile Operations (Responsive PWA)

### 2.1 Driver Mobile Home Dashboard
* **URL Route**: `/driver/dashboard`
* **Access Role**: Driver
* **Purpose**: High-contrast, touch-optimized mobile overview screen for drivers displaying current truck assignment, active job alert, and today's schedule.
* **Layout Structure**: Mobile-optimized single-column container (`max-w-md mx-auto p-4 flex flex-col gap-4`).
* **Key Features**:
  * Driver Header displaying profile photo, driver name, and assigned truck monospace plate tag.
  * **Active Task Hero Card**: Prominent touch card showcasing current trip details, pickup address, dropoff address, appointment time, and direct `[Open Active Task / Navigate]` button.
  * Quick metrics: Completed Trips Today vs Assigned Remaining.
  * Mobile Bottom Navigation Bar (*Home, Tasks, Profile*).
* **Components Used**:
  * `DriverHeaderCard`.
  * `ActiveTaskHeroCard` (Large touch target card with bold typography).
  * `MobileBottomNav` (Fixed bottom touch navigation).

---

### 2.2 Driver Assigned Task List
* **URL Route**: `/tasks`
* **Access Role**: Driver
* **Purpose**: View all current, upcoming, and completed delivery jobs assigned to the driver.
* **Layout Structure**: Top status segment control + Stacked mobile task cards list.
* **Key Features**:
  * Segment tabs (*Active, Upcoming, Completed*).
  * Task cards featuring appointment time, customer name, pickup/dropoff suburb tags, cargo type, and status pill.
  * Tap task card to launch live trip execution view.
* **Components Used**:
  * `SegmentedTabs` (Touch segment switcher).
  * `MobileTaskCard` (Touch card with chevron link).

---

### 2.3 Live Task Execution & Turn-by-Turn GPS Map View
* **URL Route**: `/tasks/{id}`
* **Access Role**: Driver
* **Purpose**: Primary trip execution screen while driving, streaming high-accuracy GPS coordinates to Laravel Reverb every 10 seconds.
* **Layout Structure**: Top 65vh Leaflet map container + Bottom collapsible touch action sheet.
* **Key Features**:
  * **Geolocation Warning Banner**: Amber alert banner displayed if browser location services are blocked.
  * **Interactive Map**: Displays current driver truck marker, pickup location pin, dropoff location pin, and GraphHopper route line.
  * **10-Second GPS Telematics Engine**: Automatically posts high-accuracy GPS coordinates (`lat`, `lng`) to `/tasks/location` API endpoint every 10 seconds.
  * **Big Stage Action Button**: Prominent 56px touch button cycling status (*"Arrived at Pickup"* $\rightarrow$ *"Cargo Loaded / In Transit"* $\rightarrow$ *"Arrived at Dropoff"*).
  * Quick-dial button to call customer directly.
* **Components Used**:
  * `LocationWarningBanner`.
  * `DriverLeafletMap` (65vh height, vehicle marker, polyline route).
  * `BigStageActionButton` (Full-width touch button).
  * `PhoneCallButton` (`tel:` schema trigger).

---

### 2.4 Digital Proof of Delivery (PoD)
* **URL Route**: `/tasks/{id}/pod`
* **Access Role**: Driver
* **Purpose**: Capture recipient signature and photo evidence upon dropoff to officially complete the reservation.
* **Layout Structure**: Touch-optimized single-column mobile form.
* **Key Features**:
  * Recipient Name input field.
  * **Touch Signature Pad**: HTML5 Canvas signature drawing component with `[Clear Canvas]` trigger.
  * Cargo Delivery Photo Uploader (Mobile camera trigger).
  * Submit button transitions dispatch status to `COMPLETE` and releases assigned vehicle to `AVAILABLE`.
* **Components Used**:
  * `SignaturePadCanvas` (Touch signature drawer).
  * `CameraUploadZone` (Mobile camera input).
  * `PrimarySubmitButton`.

---

### 2.5 Driver Pre-Trip Safety & Vehicle Inspection Checklist
* **URL Route**: `/driver/inspection`
* **Access Role**: Driver
* **Purpose**: Mandatory pre-trip safety checklist completed by drivers before starting their daily shift.
* **Layout Structure**: Mobile step-by-step checklist form.
* **Key Features**:
  * Inspect vehicle items: Tire Pressure, Brakes, Headlights/Taillights, Fuel Level, Odometer Reading.
  * Flag defects or damages with photo upload.
  * Submits inspection report to fleet manager.
* **Components Used**:
  * `ChecklistGroup` (Toggle switches).
  * `OdometerInput`.
  * `DefectsPhotoUpload`.

---

### 2.6 Driver Mobile Fuel & Expense Logger
* **URL Route**: `/driver/expenses`
* **Access Role**: Driver
* **Purpose**: Allow drivers to quickly log gas fill-ups or out-of-pocket road expenses for company reimbursement.
* **Layout Structure**: Mobile single-column form with photo receipt capture.
* **Key Features**:
  * Select Expense Category (*Fuel, Toll Fee, Parking, Minor Repair*).
  * Input Amount ($), Liters (if fuel), Odometer Reading.
  * Capture fuel receipt photo via phone camera.
* **Components Used**:
  * `ExpenseCategorySelector`.
  * `ReceiptCameraUpload`.
  * `SubmitExpenseButton`.

---

## 3. 📦 Customer Self-Service Portal

### 3.1 Customer Portal Home Dashboard
* **URL Route**: `/customer/dashboard`
* **Access Role**: Customer
* **Purpose**: Overview screen for customers to monitor active deliveries, review past bookings, and request new shipments.
* **Layout Structure**: Welcome hero banner + Quick stat summary cards + Active shipments list + New Booking CTA button.
* **Key Features**:
  * Metric cards: Active Deliveries, Total Completed Orders, Pending Requests.
  * Active shipment cards featuring 4-stage visual progress stepper (*Order Placed $\rightarrow$ Vehicle Assigned $\rightarrow$ In Transit $\rightarrow$ Delivered*).
  * Quick-action button: `+ Request New Transport`.
* **Components Used**:
  * `CustomerWelcomeBanner`.
  * `StatCards`.
  * `ActiveShipmentCard` (With embedded visual stage stepper).

---

### 3.2 Customer Live Shipment Tracker
* **URL Route**: `/my-active-reservations`
* **Access Role**: Customer
* **Purpose**: Real-time customer tracking view displaying assigned driver truck moving live on a Leaflet map towards destination.
* **Layout Structure**: Split view (Left status & ETA drawer + Right live Leaflet map canvas).
* **Key Features**:
  * Real-time WebSocket map updates showing driver truck position moving live along the route polyline.
  * 4-stage visual delivery timeline.
  * Estimated time of arrival (ETA) and remaining distance counter.
  * Masked dispatcher support phone number for privacy protection.
* **Components Used**:
  * `SplitPaneTracker` (Status drawer + Leaflet tracking map).
  * `LiveTruckMarker` (Subscribed to Reverb WebSocket channel).
  * `ProgressStepper` (4-stage progress indicator).

---

### 3.3 Customer Reservation Request Form
* **URL Route**: `/my-reservations/new`
* **Access Role**: Customer
* **Purpose**: Customer form to submit new transport booking requests directly to dispatchers.
* **Layout Structure**: Centered form container with geocoded map pin preview.
* **Key Features**:
  * Pickup and Dropoff address auto-complete with map pin placement.
  * Preferred pickup date and time selector.
  * Cargo service type, total weight (kg), and special handling instructions.
  * Submits request in `PENDING` status awaiting dispatcher confirmation and vehicle assignment.
* **Components Used**:
  * `FormContainerCard`.
  * `AddressAutoCompleteInput`.
  * `LeafletMapPreview`.

---

### 3.4 Customer Shipment Detail & Proof of Delivery Inspector
* **URL Route**: `/my-reservations/{id}`
* **Access Role**: Customer
* **Purpose**: View full delivery record of a completed shipment, including digital signature proof and delivery photo.
* **Layout Structure**: 2-column detail view (Left delivery summary & cost + Right Proof of Delivery card).
* **Key Features**:
  * Downloadable Waybill / Delivery Receipt PDF.
  * View captured customer e-signature image.
  * View delivery cargo condition photo.
* **Components Used**:
  * `DeliverySummaryCard`.
  * `PoDSignatureViewer`.
  * `DownloadReceiptButton`.

---

### 3.5 Customer Invoices & Billing Portal
* **URL Route**: `/customer/invoices`
* **Access Role**: Customer
* **Purpose**: View billing history, outstanding balances, and download tax invoices for completed bookings.
* **Layout Structure**: Top balance summary card + Invoice table + Payment instructions drawer.
* **Key Features**:
  * Table of customer invoices with status tags (`PAID`, `UNPAID`, `OVERDUE`).
  * Download PDF tax invoice per trip.
  * View payment options (GCash, Bank Transfer, Cash on Delivery).
* **Components Used**:
  * `InvoiceTable`.
  * `PaymentMethodCard`.
  * `DownloadPdfButton`.

---

## 4. 💵 Finance & Rate Administration

### 4.1 Dynamic Rate Cards & Pricing Engine
* **URL Route**: `/settings/pricing`
* **Access Role**: Administrator, Finance
* **Purpose**: Configure pricing rules, service base rates, distance rates per kilometer, and travel time surcharges.
* **Layout Structure**: Service Type Rate Cards + Add Pricing Rule Modal.
* **Key Features**:
  * Set Base Rate ($), Distance Rate ($/km), and Travel Time Rate ($/min) per service type (*Standard Freight, Heavy Duty, Express Delivery*).
  * Live pricing preview simulator (Input test distance in km $\rightarrow$ Outputs calculated total price).
* **Components Used**:
  * `ServiceRateCard`.
  * `PricingSimulatorCard`.
  * `EditPricingModal`.

---

### 4.2 Billing & Invoice Operations
* **URL Route**: `/finance/invoices`
* **Access Role**: Administrator, Finance
* **Purpose**: Generate customer invoices, verify payment reference numbers, and record payment settlements.
* **Layout Structure**: Top financial KPIs (Total Revenue, Unpaid Invoices, Paid Today) + Filterable Invoices Data Table.
* **Key Features**:
  * Filter invoices by status (`UNPAID`, `PAID`, `PARTIAL`).
  * Record payment entry (Reference number, payment method, amount paid, paid timestamp).
  * Export financial summary to Excel/CSV.
* **Components Used**:
  * `FinancialStatCards`.
  * `InvoicesDataTable`.
  * `RecordPaymentModal`.

---

## 5. ⚙️ System Administration & Settings

### 5.1 Organization Profile & Operational Rules
* **URL Route**: `/settings/organization`
* **Access Role**: Administrator
* **Purpose**: Configure company operating hours, dispatch auto-assignment preferences, company branding, and SMS/Email notifications setup.
* **Layout Structure**: Left tab sidebar (*General Profile, Dispatch Rules, Notifications*) + Right form panel.
* **Key Features**:
  * Company name, support phone number, operating address.
  * Automatic driver dispatch assignment toggle.
  * Notification triggers for drivers and customers.
* **Components Used**:
  * `SettingsNavTabs`.
  * `OrganizationForm`.

---

### 5.2 System Telemetry & WebSocket Health Monitor
* **URL Route**: `/admin/system-health`
* **Access Role**: Administrator
* **Purpose**: Real-time infrastructure monitoring covering Laravel Reverb WebSocket connections, queue worker performance, database latency, and API quotas.
* **Layout Structure**: 4-quadrant telemetry dashboard + Failed jobs log terminal.
* **Key Features**:
  * Live line graph of active Reverb WebSocket client connections.
  * Queue job throughput bar chart.
  * External API quota usage (GraphHopper routing API, Nominatim geocoder).
  * One-click controls: `[Restart Queue Workers]`, `[Flush Failed Jobs]`.
* **Components Used**:
  * `TelemetryLineChart`.
  * `QuotaProgressGauge`.
  * `FailedJobsTerminalTable`.

---

## 6. 🧭 Complete Page Catalog & Role Access Matrix

| Page Title | URL Route | Target Access Roles | Primary UI Components | Real-Time Events / APIs |
| :--- | :--- | :--- | :--- | :--- |
| **Executive Dashboard** | `/dashboard` | Admin, Ops Mgr | Stat Cards, Mini Map Preview, Donut Chart, Activity Feed | `VehicleLocationUpdated`, `ReservationStatusChanged` |
| **Master Reservations** | `/reservations` | Admin, Dispatcher, Ops | Data Table, Status Badges, Filters, Date Range Picker | REST API (`/reservations`) |
| **Create Reservation Wizard** | `/reservations/create` | Admin, Dispatcher | 4-Step Stepper, Vehicle Cards, Address Autocomplete, Map Preview | Nominatim Geocoder, Pricing Calculator API |
| **Reservation Detail** | `/reservations/{id}` | Admin, Dispatcher | Status Header, Route Map, Customer Card, Audit Log Timeline | GraphHopper Polyline API, Audit Logs |
| **Active Dispatches Control** | `/active-dispatches` | Admin, Dispatcher | Split-Pane, 3-Point Markers, Reverb Sockets, Floating Overlay | Reverb WebSockets (`private-vehicle-locations`) |
| **Fleet Inventory** | `/fleet` | Admin, Ops Mgr, Dispatcher | Vehicle Cards Grid, View Switcher, Register Vehicle Modal | REST API (`/fleet`) |
| **Fleet Maintenance** | `/fleet/maintenance` | Admin, Ops Mgr | Service Stats, Maintenance Table, Log Service Modal | Odometer Threshold Alerts |
| **Fuel & Efficiency** | `/fleet/fuel` | Admin, Ops Mgr, Finance | Fuel Metric Summary, Km/L Efficiency Chart, Fuel Log Table | Delta Km/L Calculation Engine |
| **User & Staff Roster** | `/users` | Admin | Role Tabs, User Data Table, Add User Dialog Modal | Sanctum Auth & User Roles |
| **Operational Announcements**| `/announcements` | All Roles (Read), Admin (Write) | Announcement Cards Feed, Audience Tabs, Announcement Modal | REST API (`/announcements`) |
| **System Security Logs** | `/logs` | Admin | Filter Bar, Log Terminal Table, Expandable JSON Diff | Eloquent SystemLog Audit Trail |
| **Driver Mobile Dashboard** | `/driver/dashboard` | Driver | Mobile Header, Active Task Hero Card, Mobile Bottom Nav | Driver Task API |
| **Driver Task List** | `/tasks` | Driver | Segmented Tabs, Mobile Task Cards, Status Badges | REST API (`/tasks`) |
| **Live Task Execution Map** | `/tasks/{id}` | Driver | Location Alert Banner, 65vh Leaflet Map, Big Stage Button (56px) | 10s Geolocation Telematics (`/tasks/location`) |
| **Proof of Delivery (PoD)** | `/tasks/{id}/pod` | Driver, Customer | Touch Signature Canvas, Photo Camera Uploader, Submit Button | Image Upload API, Base64 Signature |
| **Driver Safety Inspection** | `/driver/inspection` | Driver | Checklist Switches, Odometer Input, Defects Photo Upload | Inspection Logs API |
| **Driver Expense Logger** | `/driver/expenses` | Driver | Expense Category Selector, Receipt Camera Upload | Reimbursement API |
| **Customer Home Dashboard** | `/customer/dashboard` | Customer | Stat Cards, Active Shipment Cards, Progress Stage Stepper | Customer Reservations API |
| **Customer Live Tracker** | `/my-active-reservations` | Customer | Split Tracker, Live WebSocket Leaflet Map, 4-Stage Stepper | Reverb WebSockets (`private-vehicle-locations`) |
| **Customer Booking Form** | `/my-reservations/new` | Customer | Form Card, Address Autocomplete, Location Map Preview | Nominatim Geocoder API |
| **Customer Shipment Detail** | `/my-reservations/{id}` | Customer | Delivery Summary Card, PoD Signature Viewer, Download PDF | PDF Generator API |
| **Customer Invoices** | `/customer/invoices` | Customer | Invoice Table, Payment Method Cards, Download PDF Button | Customer Invoices API |
| **Rate Cards & Pricing** | `/settings/pricing` | Admin, Finance | Service Rate Cards, Pricing Simulator, Edit Pricing Modal | Pricing Engine Formula |
| **Finance & Invoicing** | `/finance/invoices` | Admin, Finance | Financial Stat Cards, Invoices Table, Record Payment Modal | Payments & Invoices API |
| **Organization Settings** | `/settings/organization` | Admin | Settings Nav Tabs, Organization Form | Company Settings API |
| **System Telemetry & Health** | `/admin/system-health` | Admin | Telemetry Line Chart, Quota Progress Gauge, Failed Jobs Log | Reverb Metrics & Queue Inspector |

---

## 7. 🔌 Real-Time Telematics & Technical Specifications

### 7.1 WebSocket Broadcasting Events (Laravel Reverb)
1. **`VehicleLocationUpdated`**:
   - **Channel**: `private-vehicle-locations`
   - **Payload**:
     ```json
     {
       "vehicle_id": "VH-102",
       "driver_id": "DRV-004",
       "driver_name": "Juan Dela Cruz",
       "latitude": 14.599512,
       "longitude": 120.984222,
       "speed_kmh": 42.5,
       "heading": 180,
       "updated_at": "2026-08-09 15:50:00"
     }
     ```
2. **`ReservationStatusChanged`**:
   - **Channel**: `private-dispatches`
   - **Payload**:
     ```json
     {
       "reservation_id": "RES-8842",
       "old_status": "GOING TO PICKUP",
       "new_status": "IN TRANSIT",
       "vehicle_id": "VH-102",
       "updated_at": "2026-08-09 15:50:00"
     }
     ```

### 7.2 Driver GPS Telematics Heartbeat Loop
* **Interval**: Every 10 seconds while on `/tasks/{id}` screen.
* **Accuracy Requirement**: High Accuracy (`enableHighAccuracy: true`, `timeout: 8000`, `maximumAge: 0`).
* **Fallback & Battery Handling**: Automatically throttles to 30 seconds when vehicle is stationary (`speed_kmh < 2`) to optimize battery consumption.
* **Error Handling**: Displays top amber warning banner with explicit instructions if browser geolocation permission is denied or running over unsecure HTTP.

---

### 💡 Summary of Production Readiness Enhancements:
1. **End-to-End Operational Lifecycle**: Extends core dispatching into fleet maintenance (`/fleet/maintenance`), fuel efficiency tracking (`/fleet/fuel`), and safety inspections (`/driver/inspection`).
2. **Financial Integrations**: Complete pricing engine (`/settings/pricing`) paired with invoice management (`/finance/invoices`) and customer billing (`/customer/invoices`).
3. **Enterprise Communications**: Operational announcements broadcast system (`/announcements`) targeting specific fleet roles.
4. **Resilient Telematics**: Sub-second location streaming over Laravel Reverb WebSockets paired with fallback battery-preservation rules.
