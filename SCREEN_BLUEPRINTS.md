# Enterprise Fleet & Transport Management System — Screen Blueprint Specification (SCREEN_BLUEPRINTS.md)

**Document Version**: 1.0.0  
**Target Consumer**: Google Stitch / Lead Frontend Architect  
**System Scope**: 27 Enterprise Platform Pages across 7 Operational Roles  

---

# SECTION A: SYSTEM SUPER ADMIN BLUEPRINTS

---

## 1. Page: `/admin/tenants` — Multi-Tenant Account Management

### 1. Screen Overview
* **Purpose**: Provision, configure, monitor, and audit tenant organization accounts across the SaaS platform.
* **Business Objective**: Maintain tenant lifecycle control, ensure data isolation, monitor enterprise subscription tiers, and manage customer accounts.
* **Primary User**: System Super Admin.
* **Secondary Users**: Platform Operations Manager, Customer Success Lead.
* **Business Value**: Prevents unauthorized access across tenant boundaries, enables instant provisioning, and tracks tenant-level SaaS revenue metrics.
* **Success Metrics**: Tenant provisioning time < 30 seconds, zero tenant data leakage incidents, 100% accurate subscription billing status tracking.

### 2. User Intent
* **Goal**: Review active tenant health, provision a new enterprise tenant, or suspend delinquent accounts.
* **Key Decisions**: Is a tenant exceeding fleet limits? Should account status be suspended or upgraded?
* **Primary Information Needed**: Active tenant count, total vehicles managed platform-wide, MRR, tenant status list.
* **Secondary Information Needed**: Tenant subscription start date, contact administrator details, storage utilization.

### 3. User Journey
* **Entry Points**: Super Admin Sidebar $\rightarrow$ Tenants tab; System Health alert notification; Direct URL.
* **Typical Workflow**: View metric bar $\rightarrow$ Filter tenant list by plan/status $\rightarrow$ Click tenant row to view side drawer details $\rightarrow$ Edit quotas or trigger status change.
* **Alternative Workflow**: Search tenant by domain $\rightarrow$ Click `[Provision Tenant]` $\rightarrow$ Complete multi-step modal.
* **Exit Points**: Navigate to `/admin/system-health` or `/admin/global-logs`.
* **Follow-up Actions**: Audit logs written for tenant state changes.

### 4. Information Architecture
* **Level 1 (Highest Priority)**: Tenant Name, Domain, Status (`ACTIVE`, `SUSPENDED`), Total Vehicles, Plan Tier.
* **Level 2 (Operational)**: Tenant Admin Contact Email, Provisioning Date, Billing Cycle Status.
* **Level 3 (Supporting)**: API rate limits, Active Driver count, Allocated Database instance ID.
* **Level 4 (Historical)**: Account modification log history, past invoice receipts.

### 5. Layout Blueprint
* **Header**: System breadcrumb, Page Title (*Tenant Organizations*), Tenant Count Badge, Primary Action Button (`+ Provision New Tenant`).
* **Toolbar**: Search Input (by Name, Domain, Admin Email), Plan Filter Dropdown, Status Filter Tabs (*All, Active, Suspended, Pending Provision*), Bulk Actions Menu.
* **Content**: Top 3 Stat Cards + High-Density Master Data Table.
* **Drawers**: Right-sliding Tenant Detail Drawer (380px) displaying tenant metrics, admin info, and quota sliders.
* **Modals**: Tenant Provisioning Modal (Multi-step modal: Company Details $\rightarrow$ Admin Account $\rightarrow$ Plan & Quotas).

### 6. Component Inventory
* Search bar, Command bar, Metric Cards (3), Data Table with sticky header, Status Badges, Pagination, Slide-over Drawer, Multi-step Modal, Confirm Dialog, Toast notifications, Skeleton loading rows, Empty state graphic.

### 7. Data Requirements
* **Required**: Tenant ID, Company Name, Domain, Admin Email, Status, Created Date.
* **Calculated**: Active Vehicle Count (sum of tenant vehicles), MRR per tenant.
* **Real-time**: Connection status indicator.

### 8. User Actions
* **Primary**: `Provision Tenant`, `Save Tenant Settings`.
* **Secondary**: `Edit Quotas`, `Export Tenant Roster`.
* **Bulk**: `Bulk Suspend`, `Bulk Export`.
* **Dangerous**: `Delete Tenant Account` (Requires 2FA code + typed company name confirmation).

### 9. Business Rules
* Only System Super Admin can provision or suspend tenants.
* Subdomain must be unique across the platform regex `^[a-z0-9-]+$`.
* Tenant suspension immediately revokes all tenant user Sanctum bearer tokens and WebSocket connections.

### 10. States
* **Loading**: Table skeleton rows (5 rows).
* **Empty**: Graphic illustration + *"No tenants found matching search criteria."*
* **Success**: Green toast notification on provisioning.

### 11. Accessibility
* Focus trap inside side drawer and provisioning modal.
* `aria-expanded` attributes on tenant row drawers.
* Full keyboard navigation for table row focus (`ArrowUp`/`ArrowDown`).

### 12. Enterprise UX Enhancements
* `Cmd+K` global command shortcut for quick tenant search.
* Side drawer context retention.

### 13. Mobile Considerations
* Desktop priority screen. On mobile, table collapses into card list with swipe actions for quick suspend/edit.

### 14. Performance Considerations
* Server-side pagination (25 records/page). Indexed database queries on `tenant_id` and `domain`.

### 15. UX Risks
* Accidental suspension of active enterprise tenant $\rightarrow$ Reduced via two-step modal warning with explicit typing confirmation.

### 16. Stitch Generation Notes
* High density desktop dashboard layout. Neutral dark canvas with prominent status badges (`Emerald` for Active, `Rose` for Suspended).

---

## 2. Page: `/admin/system-health` — Infrastructure & WebSocket Cluster Monitor

### 1. Screen Overview
* **Purpose**: Real-time infrastructure telemetry monitoring including WebSocket channels, queue workers, database latency, and API quotas.
* **Business Objective**: Maintain 99.99% system uptime, identify memory leaks or socket drops, and ensure real-time driver tracking reliability.
* **Primary User**: System Super Admin, DevOps Engineer.
* **Secondary Users**: Lead System Architect.
* **Business Value**: Eliminates WebSocket disconnection downtime and prevents database bottleneck failures during peak dispatch hours.
* **Success Metrics**: Sub-second socket latency, zero failed queue jobs, 100% API service availability.

### 2. User Intent
* **Goal**: Verify WebSocket cluster health and monitor background queue job execution rates.
* **Key Decisions**: Are queue workers congested? Is Reverb socket memory overflowing?
* **Primary Information Needed**: Active Reverb connections count, Queue job processing speed, Database query latency.
* **Secondary Information Needed**: GraphHopper API quota usage, Failed job stack traces.

### 3. User Journey
* **Entry Points**: Super Admin Sidebar $\rightarrow$ System Health; Automated Slack/Email Alert link.
* **Workflow**: Review top health status indicator $\rightarrow$ Inspect WebSocket live chart $\rightarrow$ Check queue worker stack $\rightarrow$ Restart workers if congested.
* **Exit Points**: Navigate to `/admin/global-logs`.

### 4. Information Architecture
* **Level 1**: Overall System Status (`HEALTHY`, `DEGRADED`), Active Socket Connections (`1,842`), Queue Processing Rate.
* **Level 2**: GraphHopper API Quota Gauge, MySQL Connection Pool Utilization, Memory Consumption.
* **Level 3**: Failed Job Stack Traces list, Reverb Server CPU load graphs.
* **Level 4**: Past 24-hour uptime logs.

### 5. Layout Blueprint
* **Header**: Page Title (*System Health & Telemetry*), Real-Time Status Pulse Badge, Refresh Rate Selector (*5s, 10s, Manual*).
* **Content**: 4-Quadrant Metric Grid:
  1. Top-Left: Active Reverb WebSocket Sockets Live Area Graph.
  2. Top-Right: Queue Worker Jobs/Sec Bar Chart.
  3. Bottom-Left: Database Latency & Memory Gauge.
  4. Bottom-Right: External API Quota Gauges (GraphHopper, Nominatim).
* **Footer Table**: Failed Queue Jobs Table with Expandable Trace Triggers.

### 6. Component Inventory
* Metric Cards (4), Real-Time Line Charts, Radial Progress Gauges, Status Pulse Indicators, Stack Trace Terminal Log Viewer, Action Buttons (`Flush Queue`, `Restart Cluster`).

### 7. Data Requirements
* **Real-time**: Reverb Socket Connections (polled or streamed via WebSocket metrics channel).
* **Calculated**: API quota percentages, Average DB response time (ms).

### 8. User Actions
* **Primary**: `Restart Queue Workers`, `Flush Failed Jobs`.
* **Secondary**: `Download Infrastructure Diagnostics Log`.
* **Dangerous**: `Purge All Redis Cache` (Requires confirm dialog).

### 9. Business Rules
* Actions restricted to Super Admin role.
* Failed job retries capped at 3 attempts automatically before logging stack trace.

### 10. States
* **Live Streaming**: Continuous chart rendering with animated pulse dot.
* **Degraded State**: Amber warning banner when queue latency > 5000ms.

### 11. Accessibility
* High-contrast telemetry charts. Text alternatives provided for graph data.

### 12. Enterprise UX Enhancements
* Real-time socket status pulse dot in top header across all super admin views.

### 13. Mobile Considerations
* Responsive 1-column stack layout on mobile devices.

### 14. Performance Considerations
* Telemetry charts throttled to 5-second polling to avoid self-inflicted API congestion.

### 15. UX Risks
* Overwhelming metrics $\rightarrow$ Mitigated by top high-level health summary badge (`ALL SYSTEMS OPERATIONAL`).

### 16. Stitch Generation Notes
* Dark mode terminal aesthetic with glowing chart lines (`Sky 500` for sockets, `Emerald 500` for queues, `Amber 500` for warnings).

---

## 3. Page: `/admin/global-logs` — Cross-Tenant System Audit Log Search

### 1. Screen Overview
* **Purpose**: System-wide security inspection and immutable audit trail viewer across all tenants.
* **Business Objective**: Provide full traceability for compliance, security investigation, and operational auditing.
* **Primary User**: System Super Admin, Security Officer.
* **Business Value**: Protects platform integrity, assists in legal compliance, and tracks unauthorized configuration changes.
* **Success Metrics**: Instant log lookup (< 200ms search latency), 100% record coverage for `CREATE`/`UPDATE`/`DELETE` events.

### 2. User Intent
* **Goal**: Investigate a specific user action, locate system error origins, or audit security events.
* **Primary Information**: Timestamp, Tenant Name, User, Role, Action Type, Module, IP Address.
* **Secondary Information**: User-Agent string, Full JSON attribute diff payload.

### 3. User Journey
* **Entry Points**: Super Admin Sidebar $\rightarrow$ Global Logs; Link from Tenant Detail Drawer.
* **Workflow**: Enter filter parameters (Date Range, Action: `DELETE`) $\rightarrow$ Search log terminal $\rightarrow$ Expand row JSON diff to inspect payload changes.

### 4. Information Architecture
* **Level 1**: Timestamp, Action (`CREATE`, `UPDATE`, `DELETE`, `AUTH_FAIL`), User Name & Role, Target Module.
* **Level 2**: Tenant Name, IP Address, Resource ID.
* **Level 3**: Full JSON Attribute Diff (`before` vs `after`).
* **Level 4**: Browser User-Agent string, Request UUID.

### 5. Layout Blueprint
* **Header**: Page Title (*Global Security Audit Logs*), Log Retention Counter, Export Button.
* **Filter Bar**: Date Range Picker, Tenant Dropdown, Action Multiselect, Module Filter, Free Text Search Input.
* **Content**: Terminal-Style Data Table with Expandable Row JSON Inspector.

### 6. Component Inventory
* Filter Bar, Date Range Picker, Data Table, Code Block Diff Viewer, Badges (`CREATE`: Emerald, `UPDATE`: Sky, `DELETE`: Rose), Search Input, Pagination.

### 7. Data Requirements
* **Required**: Log ID, Timestamp, Tenant ID, User ID, Action, Module, Performed To ID, IP.
* **Calculated**: JSON payload diff formatting.

### 8. User Actions
* **Primary**: `Apply Filters`, `Export Audit Trail (CSV/JSON)`.
* **Secondary**: `Copy JSON Diff to Clipboard`.

### 9. Business Rules
* Audit logs are read-only and immutable. No delete or edit options exist.
* Log retention default set to 365 days.

### 10. States
* **Loading**: Code block shimmer loader.
* **Empty**: *"No audit logs found for the selected filter parameters."*

### 11. Accessibility
* Accessible expandable rows using `aria-expanded` and keyboard `Space`/`Enter` triggers.

### 12. Enterprise UX Enhancements
* One-click JSON diff copy button and syntax highlighting.

### 13. Mobile Considerations
* Desktop primary tool. On mobile, table horizontal scrolls with sticky timestamp column.

### 14. Performance Considerations
* Server-side log pagination with indexed database indexes on `created_at`, `tenant_id`, and `action`.

### 15. UX Risks
* Unreadable raw JSON $\rightarrow$ Resolved via structured visual diff viewer showing `key: old_value -> new_value`.

### 16. Stitch Generation Notes
* Compact, terminal-inspired layout with dark slate background and syntax-highlighted code expanders.

---

# SECTION B: COMPANY ADMINISTRATOR BLUEPRINTS

---

## 4. Page: `/dashboard` — Executive BI & Operations Dashboard

### 1. Screen Overview
* **Purpose**: Provide company executives and administrators with an operational overview of fleet performance, revenue trends, and delivery SLA metrics.
* **Business Objective**: Deliver decision support data to maximize vehicle utilization, control transport costs, and ensure delivery SLA compliance.
* **Primary User**: Company Administrator, Executive Manager.
* **Secondary Users**: Operations Director, Fleet Manager.
* **Business Value**: Optimizes fleet productivity, identifies revenue trends, and provides immediate operational visibility.
* **Success Metrics**: Fleet utilization rate > 80%, Delivery SLA > 95%, Average reservation dispatch lead time < 15 mins.

### 2. User Intent
* **Goal**: Check overall company operational health, spot delivery bottlenecks, and monitor monthly revenue performance.
* **Primary Information**: Fleet Utilization Gauge, On-Time SLA %, Monthly Revenue, Total Active Deliveries.
* **Secondary Information**: Vehicle status breakdown, Recent activity timeline, Top delivery destinations.

### 3. User Journey
* **Entry Points**: Default post-login landing page for Company Admin; Sidebar $\rightarrow$ Executive Dashboard.
* **Workflow**: Scan top KPI cards $\rightarrow$ Review active trip map preview $\rightarrow$ Click metric card to drill down to `/fleet` or `/active-dispatches`.

### 4. Information Architecture
* **Level 1**: Active Trips Counter, Fleet Utilization Rate %, On-Time Delivery SLA %, Monthly Transport Revenue.
* **Level 2**: Live Map Snippet (Active Dispatches), Vehicle Status Mix (Pie chart), Revenue vs Mileage Trend (Combo graph).
* **Level 3**: Recent Reservation Requests list, Fuel Expense Summary.
* **Level 4**: System notifications feed.

### 5. Layout Blueprint
* **Header**: Company Logo & Branch Switcher Dropdown, Page Title (*Executive Dashboard*), Date Range Selector (*Today, This Week, This Month*).
* **Top Metric Bar**: 4 KPI Cards (Utilization, SLA %, Revenue, Active Dispatches).
* **Main Grid (2 Columns)**:
  * Left Column (2/3 width): Revenue vs Mileage Combo Chart + Active Trips Mini Map.
  * Right Column (1/3 width): Fleet Status Distribution Donut Chart + Recent Operations Activity Feed.

### 6. Component Inventory
* Metric Cards with Sparklines (4), Area/Bar Combination Chart, Donut Chart, Mini Map Overlay, Activity Feed List, Branch Switcher Dropdown, Date Range Picker.

### 7. Data Requirements
* **Real-time**: Active dispatches counter, live map marker coordinates via Reverb WebSockets.
* **Calculated**: Utilization %, On-Time SLA %, Monthly Revenue aggregate.

### 8. User Actions
* **Primary**: `Change Date Range`, `Filter by Branch`.
* **Secondary**: `Drill Down to Fleet Inventory`, `Export Executive Summary PDF`.

### 9. Business Rules
* Data is scoped strictly to the logged-in user's `tenant_id` and selected `branch_id`.

### 10. States
* **Loading**: Card skeleton shimmer loaders.
* **Empty**: Welcome card with *"No active dispatches today. Click [Create Reservation] to get started."*

### 11. Accessibility
* Accessible chart alternatives with screen-reader data tables.

### 12. Enterprise UX Enhancements
* Customizable card layout arrangement and exportable PDF report generation.

### 13. Mobile Considerations
* Stacks single-column on mobile screens with scrollable horizontal KPI cards.

### 14. Performance Considerations
* Cached aggregates for monthly revenue metrics refreshed hourly.

### 15. UX Risks
* Information overload $\rightarrow$ Mitigated by grouping metrics into clear executive cards.

### 16. Stitch Generation Notes
* Executive dashboard aesthetic. Neutral canvas with vibrant sky blue accents for primary metrics and emerald highlights for SLA compliance.

---

## 5. Page: `/settings/organization` — Company Profile & Branch Settings

### 1. Screen Overview
* **Purpose**: Configure organization profile details, branch offices, operating hours, and dispatch rules.
* **Business Objective**: Maintain accurate company metadata, manage branch operating boundaries, and establish dispatch default parameters.
* **Primary User**: Company Administrator.
* **Business Value**: Centralizes multi-branch organizational management and ensures unified dispatch configurations.

### 2. User Intent
* **Goal**: Update company contact info, add a new regional branch, or adjust dispatch operational defaults.
* **Primary Information**: Company Name, Tax ID, Primary Branch List, Dispatch Defaults.
* **Secondary Information**: Operating radius km, Branch Manager contact, Logo asset.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Settings $\rightarrow$ Organization.
* **Workflow**: Select settings tab (*General, Branches, Dispatch Defaults*) $\rightarrow$ Update form values $\rightarrow$ Click `[Save Settings]`.

### 4. Information Architecture
* **Level 1**: Company Name, Tax ID, Primary Contact, Branch Roster.
* **Level 2**: Operating Hours, Default Mileage Rate, Branch Operating Radius.
* **Level 3**: Dispatch Auto-Assign rules, System Branding Assets.

### 5. Layout Blueprint
* **Header**: Page Title (*Organization & Branch Settings*), Primary Action (`Save Changes`).
* **Content (2 Columns)**:
  * Left Navigation Tabs: *General Profile, Branches, Notification Rules, Dispatch Defaults*.
  * Right Content Panel: Form inputs and Branch Master Table with `+ Add Branch` modal trigger.

### 6. Component Inventory
* Tab Navigation, Form Inputs, Select Dropdowns, File Upload Dropzone, Branch Table, Add Branch Modal, Toast notifications.

### 7. Data Requirements
* **Required**: Organization Name, Primary Address, Default Currency, Branch Name, Branch City.

### 8. User Actions
* **Primary**: `Save Changes`, `+ Add Regional Branch`.
* **Secondary**: `Upload Logo Asset`, `Edit Branch Operating Radius`.

### 9. Business Rules
* Changes apply company-wide to all branches under the active tenant.

### 10. States
* **Success**: Floating green toast banner (*"Organization settings updated successfully."*).

### 11. Accessibility
* Standard form label associations (`htmlFor`/`id`) and keyboard tab order.

### 12. Enterprise UX Enhancements
* Live logo preview and interactive branch operating radius map drawer.

### 13. Mobile Considerations
* Full-width single-column layout on mobile.

### 14. Performance Considerations
* Organization settings cached in Redis for fast application-wide request hydration.

### 15. UX Risks
* Unsaved form changes $\rightarrow$ Prevented via browser unload prompt and unsaved changes confirmation dialog.

### 16. Stitch Generation Notes
* Clean settings layout with structured form sections, dark slate card surfaces, and border-divided form fields.

---

## 6. Page: `/users` — User & Staff Management

### 1. Screen Overview
* **Purpose**: Provision staff accounts, assign operational roles, manage passwords, and configure user permissions.
* **Business Objective**: Maintain secure access control across dispatchers, fleet managers, drivers, and financial staff.
* **Primary User**: Company Administrator.
* **Success Metrics**: User provisioning time < 1 min, zero orphaned user accounts.

### 2. User Intent
* **Goal**: Add a new driver or dispatcher, adjust user role assignments, or revoke access for departed staff.
* **Primary Information**: User Name, Email, Role Badge, Branch Assignment, Status.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ User Management.
* **Workflow**: Filter by Role (*Drivers*) $\rightarrow$ Click `+ Add User` $\rightarrow$ Complete form modal $\rightarrow$ Send invite email.

### 4. Information Architecture
* **Level 1**: Name, Email, Role (`ADMIN`, `DISPATCHER`, `FLEET_MGR`, `DRIVER`, `FINANCE`), Status (`ACTIVE`, `INACTIVE`).
* **Level 2**: Branch Assignment, Contact Number, Last Login Timestamp.
* **Level 3**: User Permissions Matrix, Assigned Vehicle (if Driver).

### 5. Layout Blueprint
* **Header**: Page Title (*User & Staff Management*), Total Staff Counter, Primary Action (`+ Add New User`).
* **Filter Bar**: Role Filter Tabs (*All, Admins, Dispatchers, Fleet Managers, Drivers, Finance*), Search Input, Status Selector.
* **Content**: User Master Data Table with Avatar & Role Badges + Side User Detail Panel.

### 6. Component Inventory
* Role Tabs, Data Table, Avatar, Status Badges, Add User Modal, Search Input, Pagination, Action Dropdown Menu.

### 7. Data Requirements
* **Required**: Name, Email, Role, Branch ID.
* **Optional**: Phone number, Avatar image, License number (for Drivers).

### 8. User Actions
* **Primary**: `Add New User`, `Save User Role`.
* **Secondary**: `Reset Password`, `Resend Invitation Email`.
* **Dangerous**: `Deactivate Account` (Requires confirmation).

### 9. Business Rules
* Drivers must have valid phone numbers for SMS tracking integration.
* Cannot deactivate the last remaining Company Administrator account.

### 10. States
* **Empty**: *"No users found matching the selected role."*

### 11. Accessibility
* Accessible modal focus traps and table row keyboard selection.

### 12. Enterprise UX Enhancements
* Quick role-switching toggle for administrative debugging in non-production.

### 13. Mobile Considerations
* Responsive table collapses into user profile cards on small screens.

### 14. Performance Considerations
* Server-side paginated queries with indexed role filtering.

### 15. UX Risks
* Accidental account deactivation $\rightarrow$ Requires explicit confirmation step.

### 16. Stitch Generation Notes
* Professional staff management table with color-coded role tags (`Sky` for Dispatcher, `Indigo` for Fleet Mgr, `Emerald` for Driver).

---

## 7. Page: `/settings/pricing` — Rate Cards & Dynamic Pricing Engine Rules

### 1. Screen Overview
* **Purpose**: Configure pricing rate cards, distance/time billing multipliers, and special cargo surcharges.
* **Business Objective**: Automate delivery quote generation and ensure accurate, profitable invoice pricing.
* **Primary User**: Company Administrator, Finance Officer.

### 2. User Intent
* **Goal**: Update per-kilometer delivery charges, configure vehicle model rate multipliers, or add a heavy cargo surcharge.
* **Primary Information**: Base Fares by Vehicle Type, Distance Rate ($/km), Hourly Rate ($/hr), Cargo Surcharges.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Settings $\rightarrow$ Rate Cards & Pricing.
* **Workflow**: Select Rate Card $\rightarrow$ Adjust distance rate input $\rightarrow$ Click `[Test Price Calculator]` $\rightarrow$ Save Rate Card.

### 4. Information Architecture
* **Level 1**: Base Fare Matrix, Distance Rate ($/km), Time Rate ($/hr).
* **Level 2**: Vehicle Type Multipliers, Fuel Surcharge Percentage, Weekend Delivery Surcharge.
* **Level 3**: Rate Card Effective Dates, Historical Pricing Rules.

### 5. Layout Blueprint
* **Header**: Page Title (*Pricing Engine & Rate Cards*), Active Rate Card Badge, Action (`Save Rate Card`).
* **Content (2 Columns)**:
  * Left Column (2/3 width): Rate Card Form Grid (Base Fares, Per-KM Rates, Vehicle Multipliers).
  * Right Column (1/3 width): Interactive Trip Quote Test Calculator (Input distance & cargo $\rightarrow$ View live price calculation).

### 6. Component Inventory
* Form Input Fields, Currency Inputs, Vehicle Rate Table, Live Calculator Card, Save Button, Toast notifications.

### 7. Data Requirements
* **Calculated**: Total Estimated Trip Price = `Base Fare + (Distance * Rate/KM) + Surcharges`.

### 8. User Actions
* **Primary**: `Save Rate Card Settings`, `Test Quote Calculator`.
* **Secondary**: `Create Seasonal Rate Card Duplicate`.

### 9. Business Rules
* Price calculations automatically round up to two decimal places.
* Changes apply immediately to new reservation bookings without altering past invoices.

### 10. States
* **Calculator Live Update**: Price breakdown recalculates instantly on keypress inside the test calculator panel.

### 11. Accessibility
* Clear numeric input focus and currency symbol accessibility labels.

### 12. Enterprise UX Enhancements
* Live interactive quote preview calculator widget directly beside rate card configurations.

### 13. Mobile Considerations
* Stacked single-column layout on mobile.

### 14. Performance Considerations
* Pricing rules cached in memory for zero-latency reservation quote generation.

### 15. UX Risks
* Erroneous pricing entries ($180/km instead of $1.80/km) $\rightarrow$ Guarded by min/max numeric validation bounds.

### 16. Stitch Generation Notes
* Financial rule builder aesthetic with high-contrast monetary input cards and live calculator preview widget.

---

# SECTION C: FLEET MANAGER BLUEPRINTS

---

## 8. Page: `/fleet` — Fleet Vehicle Inventory & Status Grid

### 1. Screen Overview
* **Purpose**: Oversee vehicle inventory, check real-time availability, monitor fuel levels, and manage assets.
* **Business Objective**: Maximize vehicle availability, monitor asset health, and prevent dispatching unavailable trucks.
* **Primary User**: Fleet Manager.
* **Secondary Users**: Dispatcher, Maintenance Tech.
* **Success Metrics**: Fleet availability rate > 85%, zero unlogged vehicle downtime events.

### 2. User Intent
* **Goal**: Find an available heavy cargo truck, inspect fleet fuel levels, or flag a vehicle for maintenance servicing.
* **Primary Information**: Vehicle License Plate, Model, Payload Capacity, Status Badge, Fuel Level %.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Fleet Inventory; Dashboard Fleet Utilization link.
* **Workflow**: Filter by Status (`AVAILABLE`) $\rightarrow$ Search plate number $\rightarrow$ Click vehicle card to view `/fleet/{id}` details.

### 4. Information Architecture
* **Level 1**: Plate Number, Vehicle Model, Status (`AVAILABLE`, `IN_MAINTENANCE`, `DISPATCHED`), Fuel Level %.
* **Level 2**: Assigned Driver Name, Payload Capacity (kg), Current Odometer Reading.
* **Level 3**: Vehicle VIN, Maintenance Due Km, Last Inspection Date.

### 5. Layout Blueprint
* **Header**: Page Title (*Fleet Vehicle Inventory*), Total Vehicles Counter, Action (`+ Register New Vehicle`).
* **Filter Bar**: View Toggle (Grid Cards / Data Table), Status Filter Pills (*All, Available, Dispatched, Maintenance*), Search Bar, Vehicle Model Dropdown.
* **Content**: Vehicle Card Grid (Responsive 3-column grid) OR Master Data Table.

### 6. Component Inventory
* Metric Banner, View Switcher (Grid/Table), Vehicle Cards, License Plate Monospace Badges, Fuel Level Progress Bars, Status Badges, Register Vehicle Modal.

### 7. Data Requirements
* **Required**: Vehicle ID, Plate Number, Model, Capacity, Status, Fuel Level %.
* **Real-time**: Status update broadcasts via Reverb WebSockets when dispatch status changes.

### 8. User Actions
* **Primary**: `Register New Vehicle`, `Change Vehicle Status`.
* **Secondary**: `Export Fleet Roster`, `Assign Driver`.

### 9. Business Rules
* Vehicles with status `IN_MAINTENANCE` cannot be assigned in reservation dispatches.

### 10. States
* **Empty**: *"No vehicles match the selected filter criteria."*

### 11. Accessibility
* Accessible high-contrast fuel level progress bar indicators.

### 12. Enterprise UX Enhancements
* Quick-action status toggle directly on vehicle cards for fleet managers.

### 13. Mobile Considerations
* Card grid automatically scales to single column on phone viewports.

### 14. Performance Considerations
* Lazy loading images of vehicle models; client-side grid/table view toggle caching.

### 15. UX Risks
* Accidental status change of active truck $\rightarrow$ Restricted while dispatch is active.

### 16. Stitch Generation Notes
* Visual asset management layout with dark cards, bold monospace plate badges, and colorful fuel progress indicators.

---

## 9. Page: `/fleet/{id}` — Vehicle Detail & Lifecycle Inspection Page

### 1. Screen Overview
* **Purpose**: Single vehicle 360-degree overview including technical specifications, assigned driver, service logs, and live tracking snippet.
* **Primary User**: Fleet Manager.
* **Business Value**: Centralizes total cost of ownership (TCO) tracking for individual fleet assets.

### 2. User Intent
* **Goal**: Inspect a vehicle's complete history, check when oil service is due, or review active dispatch status.
* **Primary Information**: License Plate, Model Specs, Odometer, Assigned Driver, Maintenance History, Current Status.

### 3. User Journey
* **Entry Points**: `/fleet` Inventory card click; Active Dispatch map link.
* **Workflow**: Review vehicle header banner $\rightarrow$ Check maintenance meter $\rightarrow$ Switch tabs (*Service History / Fuel Logs / Active Dispatch*).

### 4. Information Architecture
* **Level 1**: Plate Number, Model, Status, Odometer Reading, Assigned Driver Profile.
* **Level 2**: Specs Grid (Payload capacity, dimensions, tank size, VIN), Maintenance Counter (Km to next service).
* **Level 3**: Service Log History table, Active Dispatch Mini Map.

### 5. Layout Blueprint
* **Header**: Back Link (`← Back to Fleet`), Vehicle License Plate Title, Status Badge, Quick Actions (`Edit Specs`, `Schedule Service`).
* **Top Banner Card**: Vehicle Photo, Driver Avatar, Primary Metrics (Payload, Odometer, Fuel Level).
* **Tab Panel**: 3 Content Tabs (*Overview & Specs, Maintenance History, Fuel Logs & Dispatches*).

### 6. Component Inventory
* Vehicle Photo Banner, Spec Grid Cards, Odometer Meter, Driver Card, Tab Navigation, Service Table, Mini Map Preview.

### 7. Data Requirements
* **Required**: Full Vehicle Record, Driver Relation, Maintenance Logs collection, Fuel Entries collection.

### 8. User Actions
* **Primary**: `Schedule Maintenance`, `Assign Different Driver`.
* **Secondary**: `Update Odometer Log`, `Edit Vehicle Specs`.

### 9. Business Rules
* Updating odometer automatically recalculates km remaining until next preventive maintenance.

### 10. States
* **Service Overdue State**: Red banner alert if odometer exceeds maintenance trigger limit.

### 11. Accessibility
* Keyboard navigation across tabs (`ArrowLeft`/`ArrowRight`).

### 12. Enterprise UX Enhancements
* Interactive odometer progress meter showing percentage remaining until recommended factory service.

### 13. Mobile Considerations
* Responsive single-column scrollable asset details page.

### 14. Performance Considerations
* Tab content lazy-loaded upon tab activation.

### 15. UX Risks
* Missing maintenance history $\rightarrow$ Clear empty state trigger with `[+ Log Past Service]` button.

### 16. Stitch Generation Notes
* Deep asset inspection design featuring prominent monospace plate header and high-contrast spec cards.

---

## 10. Page: `/fleet/maintenance` — Preventive Maintenance & Inspection Schedules

### 1. Screen Overview
* **Purpose**: Schedule, track, and manage routine vehicle servicing, repairs, and safety inspections.
* **Business Objective**: Prevent roadside vehicle breakdowns, extend asset lifespans, and ensure fleet safety compliance.
* **Primary User**: Fleet Manager, Maintenance Technician.
* **Success Metrics**: Zero unscheduled breakdown events, 100% on-time preventive maintenance compliance.

### 2. User Intent
* **Goal**: Schedule an upcoming oil change, review repair costs, or mark a service task as completed.
* **Primary Information**: Overdue Maintenance Alerts, Scheduled Service List, Vehicle Plate, Service Type, Status.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Maintenance; Vehicle Detail page link.
* **Workflow**: Inspect top overdue alert bar $\rightarrow$ Click `+ Log Maintenance` $\rightarrow$ Complete service form modal $\rightarrow$ Vehicle status automatically updates.

### 4. Information Architecture
* **Level 1**: Overdue Service Alerts, Service Type, Vehicle Plate, Scheduled Date, Status (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`).
* **Level 2**: Maintenance Cost ($), Vendor/Technician, Odometer Trigger.
* **Level 3**: Service Description notes, Parts Replaced invoice scan.

### 5. Layout Blueprint
* **Header**: Page Title (*Preventive Maintenance & Repairs*), Overdue Counter Badge, Primary Action (`+ Log Service Task`).
* **Alert Bar**: Top Amber Warning Bar highlighting vehicles with overdue service requirements.
* **Content**: 2 View Modes (Calendar Schedule View / Maintenance Data Table).

### 6. Component Inventory
* Alert Banner, Calendar View, Maintenance Table, Service Modal, Status Badges, Cost Aggregate Cards.

### 7. Data Requirements
* **Calculated**: Total Fleet Maintenance Expenses this month ($).

### 8. User Actions
* **Primary**: `Log Service Task`, `Mark Service Complete`.
* **Secondary**: `Export Maintenance Expenses CSV`.

### 9. Business Rules
* Marking service `IN_PROGRESS` automatically switches target vehicle status to `IN_MAINTENANCE`.
* Completing service reverts vehicle status back to `AVAILABLE`.

### 10. States
* **Overdue Alert State**: Highlighted red row for past-due maintenance tasks.

### 11. Accessibility
* Accessible calendar view with keyboard day selection.

### 12. Enterprise UX Enhancements
* Automatic maintenance trigger generator based on mileage thresholds.

### 13. Mobile Considerations
* Responsive calendar switches to list agenda view on phone viewports.

### 14. Performance Considerations
* Server-side paginated service logs with indexed vehicle relationships.

### 15. UX Risks
* Unlogged repairs $\rightarrow$ Prominent `[+ Quick Log]` button on header.

### 16. Stitch Generation Notes
* Service operations design with clear calendar agenda components and warning indicators for overdue items.

---

## 11. Page: `/fleet/fuel` — Fuel Logs & Anomaly Monitoring

### 1. Screen Overview
* **Purpose**: Monitor fuel refills, calculate fleet km/liter efficiency, and flag abnormal fuel consumption or theft anomalies.
* **Primary User**: Fleet Manager, Finance Officer.
* **Business Value**: Controls fuel expenditure (largest operational expense) and detects fuel theft or mechanical degradation.

### 2. User Intent
* **Goal**: Log a fuel refill, review vehicle efficiency trends, or investigate a fuel consumption anomaly alert.
* **Primary Information**: Total Fuel Expenses, Average Fleet Efficiency (km/L), Fuel Anomaly Alerts, Log Entries.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Fuel Logs; Dashboard link.
* **Workflow**: Review top efficiency line chart $\rightarrow$ Filter anomaly log entries $\rightarrow$ Verify driver fuel receipt upload.

### 4. Information Architecture
* **Level 1**: Total Fuel Expenses ($), Average Fleet Efficiency (km/L), Anomaly Warning Badges.
* **Level 2**: Fuel Entry Date, Vehicle Plate, Driver, Liters Added, Total Cost, Calculated Efficiency (km/L).
* **Level 3**: Fuel Station Name, Receipt Attachment image.

### 5. Layout Blueprint
* **Header**: Page Title (*Fuel Logs & Efficiency Monitor*), Action (`+ Add Fuel Log`).
* **Top Metric Bar**: 3 Cards (Expenses, Avg Efficiency, Flagged Anomalies).
* **Main Section**: 2-Column Grid (Left: Fuel Efficiency Trend Line Graph; Right: Flagged Anomalies Panel).
* **Bottom Section**: Master Fuel Log Data Table.

### 6. Component Inventory
* Metric Cards, Line Graph, Anomaly Cards, Data Table, Add Fuel Modal, Receipt Image Viewer.

### 7. Data Requirements
* **Calculated**: `Efficiency (km/L) = (Current Odometer - Previous Odometer) / Liters Added`.

### 8. User Actions
* **Primary**: `Add Fuel Entry`, `Flag Anomaly Entry`.
* **Secondary**: `Download Fuel Expense Report`.

### 9. Business Rules
* Entries yielding efficiency < 4.0 km/L for light trucks automatically generate an Anomaly Alert flag.

### 10. States
* **Anomaly Alert State**: Red warning badge on log rows with sub-normal efficiency calculations.

### 11. Accessibility
* Accessible data tables matching chart data points.

### 12. Enterprise UX Enhancements
* Automated receipt image preview lightbox directly inside log rows.

### 13. Mobile Considerations
* Driver mobile quick fuel log entry screen optimized for smartphone camera receipt uploads.

### 14. Performance Considerations
* Chart aggregation queries cached in Redis for fast dashboard loading.

### 15. UX Risks
* Incorrect odometer entry $\rightarrow$ Guarded by validation checking `Current Odometer > Previous Odometer`.

### 16. Stitch Generation Notes
* Analytical telematics layout with glowing efficiency line graphs and warning badges for anomalous entries.

---

## 12. Page: `/drivers` — Driver Roster & License Compliance Tracking

### 1. Screen Overview
* **Purpose**: Manage driver profiles, track license expiration compliance, verify medical clearances, and monitor safety scores.
* **Primary User**: Fleet Manager, Operations Manager.
* **Success Metrics**: 100% valid driver licenses, zero compliance expiration violations during road dispatches.

### 2. User Intent
* **Goal**: Verify if a driver's license is valid, check driver safety scores, or assign a driver to a vehicle.
* **Primary Information**: Driver Name, License Number, License Expiration Date, Assigned Vehicle, Safety Score.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Driver Roster.
* **Workflow**: Inspect compliance warning banner $\rightarrow$ Filter by License Status (`EXPIRING_SOON`) $\rightarrow$ Notify driver to update license copy.

### 4. Information Architecture
* **Level 1**: Driver Name, Avatar, License Expiration Badge (Color-coded), Assigned Vehicle, Safety Score (e.g. `96/100`).
* **Level 2**: Contact Phone Number, License Category Type, Total Completed Trips.
* **Level 3**: Driver Document Scans, Past Safety Incident Logs.

### 5. Layout Blueprint
* **Header**: Page Title (*Driver Roster & Compliance*), Total Drivers Count, Action (`+ Add New Driver`).
* **Compliance Alert Banner**: Top Yellow/Red bar highlighting drivers with licenses expiring within 30 days.
* **Content**: Driver Card Grid OR Master Driver Data Table.

### 6. Component Inventory
* Alert Banner, Driver Cards, Compliance Badges, Safety Score Meters, Avatar, Add Driver Modal.

### 7. Data Requirements
* **Required**: Driver Name, Phone Number, License Number, License Expiration Date.

### 8. User Actions
* **Primary**: `Add Driver`, `Update License Info`.
* **Secondary**: `Assign Vehicle`, `Export Driver Roster`.

### 9. Business Rules
* Drivers with `EXPIRED` licenses are automatically blocked from being assigned in dispatch wizards.

### 10. States
* **Expired License State**: Red badge with warning icon on driver card.

### 11. Accessibility
* Accessible color-independent text indicators for expiration badges (*"Expired"* text alongside color).

### 12. Enterprise UX Enhancements
* Visual driver safety score meter component.

### 13. Mobile Considerations
* Responsive single-column grid on phone viewports.

### 14. Performance Considerations
* Server-side paginated roster queries with indexed license expiration dates.

### 15. UX Risks
* Unnoticed expired license $\rightarrow$ Prevented via persistent top compliance alert banner.

### 16. Stitch Generation Notes
* Driver management roster design with prominent compliance badge tags and driver avatar profile cards.

---

# SECTION D: DISPATCHER / OPERATIONS BLUEPRINTS

---

## 13. Page: `/active-dispatches` — Real-Time Active Dispatches Control Center

### 1. Screen Overview
* **Purpose**: Real-time operational control center for tracking active delivery dispatches on a live WebSocket map.
* **Business Objective**: Maintain continuous visibility over active shipments, detect delivery delays, and monitor driver progress.
* **Primary User**: Dispatcher, Operations Manager.
* **Success Metrics**: Sub-second GPS update latency, 100% active dispatch map coverage, rapid delay resolution.

### 2. User Intent
* **Goal**: Monitor live driver movements, verify if a shipment is on schedule, or check current stage progress (`GOING TO PICKUP`).
* **Primary Information**: Active Dispatch List, Driver Truck Location, Pickup Marker, Dropoff Marker, Route Line, ETA.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Active Dispatches; Executive Dashboard map click.
* **Workflow**: View left dispatch list $\rightarrow$ Click active trip card $\rightarrow$ Map flies to 3-point route bounds $\rightarrow$ Inspect floating delivery details card overlay.

### 4. Information Architecture
* **Level 1**: 3-Point Map Layout (Driver Truck Marker, Pickup Badge Marker, Dropoff Badge Marker), Route Polyline, Status Stage.
* **Level 2**: Driver Name, Customer Name, Scheduled Appointment Time, Remaining Distance & ETA.
* **Level 3**: Cargo Description, Vehicle Model, Customer Phone Contact.
* **Level 4**: Past status transition timestamp log.

### 5. Layout Blueprint
* **Full-Height Split Screen Layout**:
  * **Left Panel (380px fixed width)**: Search Input, Status Filter Tabs (*All Active, Going to Pickup, In Transit*), Active Dispatch Card List.
  * **Right Panel (Fluid remaining width, 100vh)**: Dynamic Leaflet Map Container.
* **Floating Card Overlay**: Centered bottom overlay card (`FloatingReservationDetails`) with glassmorphism styling, displaying order tabs (*Details, Driver, Vehicle*).

### 6. Component Inventory
* Split Pane Container, Search Input, Status Tabs, Active Dispatch Cards, Leaflet Map, 3-Point Markers (`vehicleIcon`, `pickupIcon`, `dropoffIcon`), Route Polyline, Floating Detail Card, Focus Driver Button.

### 7. Data Requirements
* **Real-time**: Driver lat/lng streamed via Reverb WebSockets channel (`vehicles`) every 10s.
* **Calculated**: Remaining distance and ETA via GraphHopper route engine.

### 8. User Actions
* **Primary**: `Select Dispatch Row` (Centers map on 3 points), `Click [Focus Driver]`.
* **Secondary**: `Call Driver`, `Send Customer ETA Update`.
* **Dangerous**: `Force Cancel Dispatch` (Requires confirm dialog).

### 9. Business Rules
* Map padding automatically clamped (max 80px) to prevent viewport collapse when fitting 3-point bounds.

### 10. States
* **Live WebSocket Connected**: Green pulse dot in header (*"Reverb Live: Connected"*).
* **GPS Signal Lost State**: Amber badge on driver card if GPS update age > 60 seconds.

### 11. Accessibility
* Accessible text alternatives for route statuses and map markers.

### 12. Enterprise UX Enhancements
* 3-point automated bounding box centering (`[Driver Truck, Pickup, Dropoff]`) on selection.

### 13. Mobile Considerations
* On mobile, split-pane switches to full-width map with collapsible bottom sheet list panel.

### 14. Performance Considerations
* Map markers rendered via lightweight Leaflet vector layers; marker lerp animation smoothed via `requestAnimationFrame`.

### 15. UX Risks
* Map viewport collapse from bad padding $\rightarrow$ Prevented by safe `Math.min(padding, 80)` clamping.

### 16. Stitch Generation Notes
* Operations control center aesthetic. Full-height map canvas with deep slate list drawer, high-contrast route polyline (`#0284c7`), and floating glassmorphic detail cards.

---

## 14. Page: `/reservations` — Reservation Management Master List

### 1. Screen Overview
* **Purpose**: Master management list for filtering, reviewing, editing, and searching all customer reservation bookings.
* **Primary User**: Dispatcher, Administrator.

### 2. User Intent
* **Goal**: Search for a customer reservation, filter bookings by date, or initiate a new reservation dispatch.
* **Primary Information**: Reservation ID, Customer Name, Scheduled Date & Time, Pickup/Dropoff, Vehicle & Driver, Status.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Reservations.
* **Workflow**: Enter search text or pick date range $\rightarrow$ Inspect reservation row $\rightarrow$ Click row to view `/reservations/{id}`.

### 4. Information Architecture
* **Level 1**: Reservation ID, Customer Name, Date & Time, Status Badge (`PENDING`, `DISPATCHED`, `COMPLETED`, `CANCELLED`).
* **Level 2**: Pickup Address, Dropoff Address, Assigned Vehicle Model & Driver.
* **Level 3**: Service Cargo Type, Total Rate Quote ($).

### 5. Layout Blueprint
* **Header**: Page Title (*Reservations & Bookings*), Total Counter, Primary Action (`+ New Reservation Booking`).
* **Filter Bar**: Date Range Picker, Status Multi-Select, Service Type Dropdown, Search Input, Bulk Actions.
* **Content**: Master Reservation Data Table with Sticky Header.

### 6. Component Inventory
* Filter Bar, Date Picker, Multiselect, Data Table, Status Badges, Pagination, Action Menu.

### 7. Data Requirements
* **Required**: Full Reservation Records with Customer, Dispatch, Vehicle, and Driver relations.

### 8. User Actions
* **Primary**: `+ New Reservation Booking`, `View Details`.
* **Secondary**: `Edit Booking`, `Cancel Reservation`.
* **Bulk**: `Batch Assign Drivers`, `Export Orders CSV`.

### 9. Business Rules
* Reservations in `COMPLETED` status cannot be edited.

### 10. States
* **Empty**: *"No reservations match your filter criteria."*

### 11. Accessibility
* High-contrast table headers and keyboard navigable row actions.

### 12. Enterprise UX Enhancements
* Saved table filter presets (*"Today's Unassigned Bookings"*).

### 13. Mobile Considerations
* Responsive table collapses to order cards on small viewports.

### 14. Performance Considerations
* Server-side paginated queries (25/page) with Eloquent eager loading of relations.

### 15. UX Risks
* Unassigned bookings overlooked $\rightarrow$ Highlighted with amber badge tags.

### 16. Stitch Generation Notes
* Clean operational data table layout with clear status badges and quick action menus.

---

## 15. Page: `/reservations/create` — 4-Step Guided Reservation Booking Wizard

### 1. Screen Overview
* **Purpose**: Multi-step wizard for creating new customer reservations, choosing available vehicles, and geocoding delivery waypoints.
* **Primary User**: Dispatcher, Administrator.
* **Success Metrics**: Reservation creation time < 2 minutes, zero vehicle double-booking conflicts.

### 2. User Intent
* **Goal**: Book a new delivery, select an available vehicle for a specific date, and enter pickup/dropoff locations.
* **Primary Information**: Date Selector, Available Vehicles Grid, Pickup/Dropoff Addresses, Cargo Details, Quote Summary.

### 3. User Journey
* **Entry Points**: `/reservations` $\rightarrow$ `+ New Reservation Booking` button.
* **Workflow**:
  * **Step 1**: Select Date $\rightarrow$ Choose Available Vehicle Card.
  * **Step 2**: Enter Pickup & Dropoff Addresses (Auto-complete) $\rightarrow$ Preview on Leaflet map.
  * **Step 3**: Enter Cargo Weight, Service Type & Special Instructions.
  * **Step 4**: Review Rate Quote Summary $\rightarrow$ Click `[Confirm & Dispatch]`.

### 4. Information Architecture
* **Level 1**: Step Progress Stepper, Vehicle Cards Grid (Step 1), Location Map Preview (Step 2), Rate Quote Summary (Step 4).
* **Level 2**: Vehicle Specs (Payload kg, Dimensions), Geocoded Lat/Lng coordinates.
* **Level 3**: Customer Contact Info, Cargo Notes.

### 5. Layout Blueprint
* **Header**: Wizard Title (*New Freight Reservation*), Cancel Link (`✕ Cancel`).
* **Top Bar**: 4-Step Visual Progress Stepper (*1. Vehicle & Date $\rightarrow$ 2. Locations $\rightarrow$ 3. Cargo Details $\rightarrow$ 4. Review & Dispatch*).
* **Step Content Area (Centered Card)**: Form inputs, Grid Cards, or Map Preview depending on active step.
* **Footer Controls**: `[← Back]` button, `[Next Step →]` primary button.

### 6. Component Inventory
* Stepper Component, Calendar Picker, Vehicle Availability Cards, Address Autocomplete Input, Leaflet Location Preview Map, Form Controls, Rate Quote Summary Card, Primary Action Buttons.

### 7. Data Requirements
* **Step 1**: Real-time check of available vs unavailable vehicles for target date.
* **Step 2**: Nominatim Geocoding API responses.
* **Step 4**: Rate engine price calculation.

### 8. User Actions
* **Primary**: `Next Step`, `Confirm & Dispatch Reservation`.
* **Secondary**: `Back Step`, `Cancel Wizard`.

### 9. Business Rules
* Unavailable vehicles (already dispatched or in maintenance) are disabled in Step 1 grid.

### 10. States
* **Geocoding Loading**: Shimmer loader on location map preview while fetching coordinates.

### 11. Accessibility
* Accessible stepper navigation with `aria-current="step"`.

### 12. Enterprise UX Enhancements
* Interactive Leaflet location picker map preview embedded directly in Step 2.

### 13. Mobile Considerations
* Responsive single-column wizard steps on mobile screens.

### 14. Performance Considerations
* Geocoding requests debounced by 400ms to avoid unnecessary API calls.

### 15. UX Risks
* Incorrect pickup location $\rightarrow$ Mitigated by showing visual pin preview on map before proceeding.

### 16. Stitch Generation Notes
* Structured wizard layout with prominent top stepper, dark card containers, and interactive map preview.

---

## 16. Page: `/reservations/{id}` — Reservation Detail View & Waypoint Manager

### 1. Screen Overview
* **Purpose**: Comprehensive detail view of a single reservation including lifecycle status, cargo details, assigned driver, invoice, and audit log.
* **Primary User**: Dispatcher, Customer Support Agent.

### 2. User Intent
* **Goal**: Inspect full details of a reservation, verify driver assignment, or review historical changes.
* **Primary Information**: Reservation ID, Status Banner, Pickup/Dropoff Addresses, Driver Profile, Cargo Details, Invoice Summary.

### 3. User Journey
* **Entry Points**: `/reservations` table row click; Active Dispatch floating card link.
* **Workflow**: Review top order status banner $\rightarrow$ Check route map preview $\rightarrow$ Inspect audit history timeline.

### 4. Information Architecture
* **Level 1**: Order Status Banner, Reservation ID, Customer Name, Scheduled Date & Time.
* **Level 2**: Driver Contact Profile, Vehicle Details, Pickup & Dropoff Addresses, Route Map Preview.
* **Level 3**: Cargo Description, Service Surcharges, Financial Invoice Breakdown.
* **Level 4**: Audit History Log Timeline.

### 5. Layout Blueprint
* **Header**: Back Link (`← Back to Reservations`), Order ID Header, Status Badge, Actions (`Edit Reservation`, `Print Summary`).
* **Content (2 Columns)**:
  * Left Column (2/3 width): Order Details Card, Route Map Preview, Cargo Description, Financial Summary.
  * Right Column (1/3 width): Customer Info Card, Driver Contact Card, Audit History Timeline.

### 6. Component Inventory
* Status Banner, Map Preview Container, Spec Cards, Customer Card, Driver Card, Financial Invoice Breakdown, Audit Timeline.

### 7. Data Requirements
* **Required**: Complete Reservation Record with Customer, Dispatch, Vehicle, Driver, and System Log relations.

### 8. User Actions
* **Primary**: `Edit Booking`, `Contact Driver`.
* **Secondary**: `Print Order Summary PDF`, `Cancel Reservation`.

### 9. Business Rules
* Changes to pickup/dropoff trigger an automatic log entry in `SystemLog`.

### 10. States
* **Cancelled Order State**: Red banner alert with cancellation reason text.

### 11. Accessibility
* Accessible text labels for timeline logs and status badges.

### 12. Enterprise UX Enhancements
* Timeline audit log component detailing every state change with user attribution.

### 13. Mobile Considerations
* Responsive single-column scrollable order details page.

### 14. Performance Considerations
* Server-side hydration with eager loaded Eloquent relationships.

### 15. UX Risks
* Unclear driver contact info $\rightarrow$ High-contrast driver card with one-touch phone trigger.

### 16. Stitch Generation Notes
* Detailed order management page with prominent top status banner, dark cards, and audit timeline component.

---

## 17. Page: `/dispatch/planner` — Automated Dispatch Matching & Schedule Calendar Planner

### 1. Screen Overview
* **Purpose**: Visual calendar timeline matrix for scheduling vehicle dispatches and auto-matching available drivers.
* **Primary User**: Dispatcher, Operations Manager.
* **Success Metrics**: Zero scheduling overlaps, optimized driver workload distribution.

### 2. User Intent
* **Goal**: Plan vehicle dispatches for the week, spot idle fleet time blocks, and drag-and-drop schedule reservations.
* **Primary Information**: Vehicle Timeline Matrix (Rows = Vehicles, Columns = Hours/Days), Scheduled Dispatch Blocks, Unassigned Orders List.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Dispatch Planner.
* **Workflow**: View timeline matrix $\rightarrow$ Drag unassigned reservation onto an available vehicle timeline slot $\rightarrow$ System verifies payload & schedule fit.

### 4. Information Architecture
* **Level 1**: Vehicle Timeline Grid, Scheduled Dispatch Blocks (Color-coded by status), Unassigned Bookings Drawer.
* **Level 2**: Vehicle Specs, Driver Shift Hours, Order Duration.
* **Level 3**: Distance km, Fuel required estimate.

### 5. Layout Blueprint
* **Header**: Page Title (*Dispatch Schedule Planner*), Date Navigator (`◄ Today ►`), View Mode Switcher (*Day, Week, Vehicle Matrix*).
* **Main Section**: Split View:
  * Left Drawer (280px): Unassigned Reservations Sidebar List.
  * Right Container (Fluid): Interactive Drag-and-Drop Schedule Matrix Grid.

### 6. Component Inventory
* Calendar Matrix, Draggable Timeline Bars, Unassigned Orders Sidebar, Date Navigator, Auto-Match Button, Tooltip Popovers.

### 7. Data Requirements
* **Real-time**: Real-time vehicle conflict detection engine.

### 8. User Actions
* **Primary**: `Drag & Drop Dispatch`, `Click [Auto-Match AI]`.
* **Secondary**: `Change Calendar View Mode`, `Export Schedule`.

### 9. Business Rules
* Overlapping schedule blocks on the same vehicle are blocked by validation rules.

### 10. States
* **Conflict Warning State**: Red flashing indicator if drag-and-drop exceeds vehicle payload or conflicts with existing dispatch.

### 11. Accessibility
* Accessible keyboard alternatives (`Enter` to select order $\rightarrow$ Arrow keys to select vehicle timeline slot).

### 12. Enterprise UX Enhancements
* Visual drag-and-drop timeline grid matrix with automated conflict detection.

### 13. Mobile Considerations
* Desktop primary tool. On mobile, converts to agenda list format.

### 14. Performance Considerations
* Timeline matrix virtualization for large fleets (> 50 vehicles).

### 15. UX Risks
* Accidental double-booking $\rightarrow$ Prevented by immediate visual conflict warnings.

### 16. Stitch Generation Notes
* Planning calendar design featuring deep slate grid background with colorful timeline blocks representing dispatches.

---

# SECTION E: DRIVER BLUEPRINTS (MOBILE RESPONSIVE PWA)

---

## 18. Page: `/driver/dashboard` — Driver Mobile Home Overview

### 1. Screen Overview
* **Purpose**: Mobile home dashboard for drivers to view active assigned vehicle, today's schedule, and launch active trip tracking.
* **Primary User**: Driver.
* **Success Metrics**: One-tap navigation to active task, 100% driver awareness of daily schedule.

### 2. User Intent
* **Goal**: Check assigned truck plate number, review today's trip schedule, and start the next assigned delivery.
* **Primary Information**: Assigned Vehicle Plate, Active Task Hero Card, Pickup/Dropoff Addresses, Today's Task Counters.

### 3. User Journey
* **Entry Points**: Mobile web post-login default page; App icon tap.
* **Workflow**: Open mobile dashboard $\rightarrow$ Inspect Active Task Hero Card $\rightarrow$ Tap `[Start Navigation / Open Task]`.

### 4. Information Architecture
* **Level 1**: Active Task Hero Card (Pickup address, Dropoff address, Status), `[Open Active Task]` Button.
* **Level 2**: Assigned Vehicle Card (Plate number, Model), Today's Task Summary (Assigned: 2, Complete: 3).
* **Level 3**: Recent completed trip log.

### 5. Layout Blueprint
* **Single-Column Mobile Layout (`max-w-md mx-auto p-4`)**:
  * **Header**: Driver Avatar, Welcome Text (*"Hello, Marco"*), Assigned Vehicle Monospace Badge.
  * **Active Task Hero Card**: Large card with bold addresses, status pill, and large primary button.
  * **Summary Grid**: 2 Stat Cards (*Pending Tasks, Completed Today*).
  * **Bottom Navigation Bar**: 4 Touch Tabs (*Home, Tasks, Vehicle, Profile*).

### 6. Component Inventory
* Driver Header, Hero Task Card, Monospace License Badge, Quick Stat Cards, Primary Action Buttons, Mobile Bottom Navigation Bar.

### 7. Data Requirements
* **Required**: Driver Profile, Assigned Vehicle, Active Reservation record.

### 8. User Actions
* **Primary**: `[Open Active Task / Navigate]`.
* **Secondary**: `Call Dispatcher`, `View Completed Tasks`.

### 9. Business Rules
* Displays active assigned task prominently at the top of the mobile screen.

### 10. States
* **No Active Task State**: Hero card displays *"No active deliveries assigned. Stand by for dispatch instructions."*

### 11. Accessibility
* Large touch targets (minimum 48px height) for all mobile buttons.

### 12. Enterprise UX Enhancements
* One-tap direct launch into live navigation execution screen.

### 13. Mobile Considerations
* Designed mobile-first for smartphone viewports.

### 14. Performance Considerations
* Minimal asset payload for fast loading over cellular 4G/5G connections.

### 15. UX Risks
* Confusion about active task $\rightarrow$ Mitigated by high-contrast active task hero card at top of viewport.

### 16. Stitch Generation Notes
* Clean mobile PWA aesthetic with dark slate cards, sky blue action buttons, and prominent monospace license plate tags.

---

## 19. Page: `/tasks` — Driver Assigned Task List

### 1. Screen Overview
* **Purpose**: View all upcoming, active, and completed delivery jobs assigned to the driver.
* **Primary User**: Driver.

### 2. User Intent
* **Goal**: Find an upcoming delivery job, review pickup time, or check details of past completed trips.
* **Primary Information**: Scheduled Time, Customer Name, Pickup Suburb, Dropoff Suburb, Service Type, Status Badge.

### 3. User Journey
* **Entry Points**: Mobile Bottom Nav $\rightarrow$ Tasks; Dashboard `View All` link.
* **Workflow**: Select Segmented Tab (*Active / Upcoming / Completed*) $\rightarrow$ Tap task card to view `/tasks/{id}`.

### 4. Information Architecture
* **Level 1**: Task Scheduled Time, Status Badge, Pickup Suburb, Dropoff Suburb.
* **Level 2**: Customer Name, Cargo Service Type, Reservation ID.
* **Level 3**: Special Handling Notes.

### 5. Layout Blueprint
* **Single-Column Mobile Layout (`max-w-md mx-auto p-4`)**:
  * **Header**: Page Title (*Assigned Tasks*), Task Count.
  * **Tab Bar**: Segmented Controls (*Active (1), Upcoming (2), Completed (14)*).
  * **Content Area**: Stacked Task List Cards with `[chevron-right]` indicators.

### 6. Component Inventory
* Mobile Header, Segmented Tab Control, Task Cards, Status Badges, Chevron Links.

### 7. Data Requirements
* **Required**: Driver's assigned dispatches collection sorted by schedule timestamp.

### 8. User Actions
* **Primary**: `Select Task Card`.
* **Secondary**: `Filter Tasks by Tab`.

### 9. Business Rules
* Active task always appears pinned at the top of the Active tab list.

### 10. States
* **Empty**: *"No upcoming tasks scheduled for today."*

### 11. Accessibility
* High-contrast text labels and clear touch target spacing.

### 12. Enterprise UX Enhancements
* Segmented tab counters showing number of tasks per status.

### 13. Mobile Considerations
* Mobile-first responsive touch layout.

### 14. Performance Considerations
* Paginated completed task history.

### 15. UX Risks
* Accidental opening of wrong task $\rightarrow$ Clear address & scheduled time on card face.

### 16. Stitch Generation Notes
* Mobile card feed design with high-contrast text and dark card containers.

---

## 20. Page: `/tasks/{id}` — Live Task Execution & Turn-by-Turn Map View

### 1. Screen Overview
* **Purpose**: Primary mobile trip execution screen for drivers while on the road, handling 10s GPS streaming and stage updates.
* **Business Objective**: Stream accurate real-time driver coordinates to WebSockets and guide driver through delivery stages.
* **Primary User**: Driver.
* **Success Metrics**: 100% continuous GPS streaming, 10s update interval, smooth stage transitions.

### 2. User Intent
* **Goal**: Follow route map, update trip status (`GOING TO PICKUP` $\rightarrow$ `WAITING` $\rightarrow$ `GOING TO DROPOFF`), and contact customer.
* **Primary Information**: Top Geolocation Alert (if HTTP IP), Live Route Map, Big Stage Action Button, Customer Contact triggers.

### 3. User Journey
* **Entry Points**: Driver Dashboard Hero Card; `/tasks` list item click.
* **Workflow**: Open live task page $\rightarrow$ Background 10s GPS starts streaming $\rightarrow$ Tap big stage button (*"Arrived at Pickup"*) $\rightarrow$ Complete delivery $\rightarrow$ Redirect to `/tasks/{id}/pod`.

### 4. Information Architecture
* **Level 1**: Top Location Alert Banner (if location blocked), 70vh Map View, Big Primary Stage Action Button.
* **Level 2**: Appointment Time, Customer Name, Pickup Address, Dropoff Address.
* **Level 3**: Phone Contact Button, Special Cargo Instructions.

### 5. Layout Blueprint
* **Full Mobile Viewport Layout**:
  * **Top Alert Banner**: Amber bar displayed if `navigator.geolocation` permission is blocked.
  * **Map Area (70vh)**: Responsive Leaflet Map with Driver Truck Marker, Pickup Marker, Dropoff Marker, Polyline Route, and `[Focus Driver]` float button.
  * **Bottom Task Panel (Rounded-t-xl bg-white/slate-900 -translate-y-6)**: Appointment Time, Customer Name, Pickup/Dropoff addresses, Big Primary Stage Button (*"Arrived at Pickup"*), Phone Trigger.

### 6. Component Inventory
* Location Warning Banner, Leaflet Map, 3-Point Markers, Focus Button, Bottom Action Panel, Big Stage Button, Phone Trigger.

### 7. Data Requirements
* **Real-time**: High-accuracy `navigator.geolocation` (10s interval) posted to `/tasks/update`.

### 8. User Actions
* **Primary**: `Tap Big Stage Button` (Cycles trip stage).
* **Secondary**: `Tap Phone Icon` (Triggers phone call), `Tap [Focus Driver]`.

### 9. Business Rules
* Stage transitions update reservation status instantly and log system audit record.
* Final stage (`Arrived at Dropoff`) automatically redirects driver to Proof of Delivery screen (`/tasks/{id}/pod`).

### 10. States
* **Location Blocked Alert State**: Amber top bar displaying instructions to enable location or access via `http://localhost:8000`.

### 11. Accessibility
* Large primary action button spanning full screen width with 56px touch height.

### 12. Enterprise UX Enhancements
* Automated stage button progression requiring single-tap confirmation per trip milestone.

### 13. Mobile Considerations
* Optimized for single-handed mobile operational use while in vehicle.

### 14. Performance Considerations
* Marker position updates animated smoothly via `requestAnimationFrame` without full map re-renders.

### 15. UX Risks
* Accidental status tap while driving $\rightarrow$ Large high-contrast button with confirmation prompt for final completion.

### 16. Stitch Generation Notes
* High-impact mobile navigation layout. 70vh interactive map with dark slate bottom action sheet and vibrant sky blue stage button.

---

## 21. Page: `/tasks/{id}/pod` — Digital Proof of Delivery & Signature Capture

### 1. Screen Overview
* **Purpose**: Capture customer e-signature, recipient name, and cargo delivery photos upon reaching dropoff destination.
* **Primary User**: Driver, Customer.
* **Success Metrics**: 100% digital proof of delivery capture rate for completed dispatches.

### 2. User Intent
* **Goal**: Obtain customer signature, upload cargo photo, and mark delivery completed.
* **Primary Information**: Order Summary, Recipient Name Input, Signature Pad Canvas, Photo Dropzone, Submit Button.

### 3. User Journey
* **Entry Points**: Auto-redirected from `/tasks/{id}` upon reaching final delivery stage.
* **Workflow**: Enter recipient name $\rightarrow$ Hand phone to customer for touch signature $\rightarrow$ Snap cargo photo $\rightarrow$ Tap `[Submit Proof & Complete Task]`.

### 4. Information Architecture
* **Level 1**: Order ID Header, Recipient Name Input, Touch Signature Pad Canvas, Submit Button.
* **Level 2**: Cargo Photo Upload Dropzone, Driver Delivery Notes.
* **Level 3**: Timestamp and GPS coordinate metadata attachment.

### 5. Layout Blueprint
* **Single-Column Mobile Layout (`max-w-md mx-auto p-4`)**:
  * **Header**: Page Title (*Digital Proof of Delivery*), Order ID Badge.
  * **Form Content**:
    * Recipient Name Input Field.
    * Touch Signature Pad Canvas with `[Clear Canvas]` trigger.
    * Cargo Photo Capture Button / Dropzone.
    * Driver Delivery Notes Textarea.
  * **Footer Action**: Full-width primary button `[Submit Proof & Complete Task]`.

### 6. Component Inventory
* Form Inputs, Touch Signature Canvas Pad, Camera Photo Uploader, Clear Button, Primary Action Button, Toast notifications.

### 7. Data Requirements
* **Required**: Recipient Name, Base64 Signature Data URL, Cargo Photo Asset.
* **Calculated**: Delivery Completion Timestamp & GPS Lat/Lng stamp.

### 8. User Actions
* **Primary**: `Submit Proof of Delivery`, `Clear Signature Canvas`.
* **Secondary**: `Capture Cargo Photo`.

### 9. Business Rules
* Signature or Photo upload is mandatory before dispatch status can transition to `COMPLETE`.

### 10. States
* **Submitting State**: Spinner loader on submit button while uploading photo asset.

### 11. Accessibility
* Clear touch canvas boundaries and high-contrast form fields.

### 12. Enterprise UX Enhancements
* Automatic embedded timestamp and GPS coordinate watermark on uploaded delivery photos.

### 13. Mobile Considerations
* Canvas touch event handlers optimized for mobile fingers/stylus drawing.

### 14. Performance Considerations
* Signature canvas and camera photos compressed on client side before upload.

### 15. UX Risks
* Messy signature drawing $\rightarrow$ Prominent `[Clear Canvas]` button provided.

### 16. Stitch Generation Notes
* Mobile touch form design with dark card background, white signature canvas area, and prominent submit button.

---

# SECTION F: CUSTOMER PORTAL BLUEPRINTS

---

## 22. Page: `/customer/dashboard` — Customer Portal Home Overview

### 1. Screen Overview
* **Purpose**: Self-service home portal for customers to track active shipments, review past bookings, and request new freight transport.
* **Primary User**: Customer.
* **Success Metrics**: Customer self-service adoption rate > 70%, reduced customer support inquiry calls.

### 2. User Intent
* **Goal**: Check current active shipment status, review total transport expenses, or launch a new booking request.
* **Primary Information**: Active Shipments Counter, Quick Tracking Card, Recent Orders List, `+ Book New Freight` CTA.

### 3. User Journey
* **Entry Points**: Customer post-login default page; Sidebar $\rightarrow$ Home.
* **Workflow**: View active shipment hero card $\rightarrow$ Click `[Track Shipment]` $\rightarrow$ Redirect to live map `/my-active-reservations`.

### 4. Information Architecture
* **Level 1**: Active Shipments Counter, Live Tracking Hero Card, `+ Book New Freight` Action Button.
* **Level 2**: Total Completed Bookings, Total Freight Spend ($), Recent Bookings List.
* **Level 3**: Customer Account Representative Contact Info.

### 5. Layout Blueprint
* **Top Hero Banner**: Welcome Greeting (*"Welcome back, Acme Logistics"*), Primary CTA Button (`+ Request New Freight Booking`).
* **Top Metric Bar**: 3 Summary Cards (*Active Shipments: 2, Completed: 18, Total Spend: $2,450*).
* **Main Section (2 Columns)**:
  * Left Column (2/3 width): Active Shipments Card List with progress stage indicators.
  * Right Column (1/3 width): Quick Booking Request Box & Customer Support Card.

### 6. Component Inventory
* Hero Banner, Metric Cards, Active Shipment Cards, Stage Stepper, Quick Booking Widget, Support Contact Card.

### 7. Data Requirements
* **Required**: Customer's active and historical reservations collection.

### 8. User Actions
* **Primary**: `+ Request New Freight Booking`, `Track Active Shipment`.
* **Secondary**: `Download Past Invoices`.

### 9. Business Rules
* Displays data restricted strictly to reservations belonging to the logged-in customer's `customer_id`.

### 10. States
* **No Active Shipments**: Hero card displays *"No active shipments in transit. Need cargo transported? Click [Book New Freight]."*

### 11. Accessibility
* Accessible color contrast and structured card focus targets.

### 12. Enterprise UX Enhancements
* Visual stage progress indicator on active shipment cards.

### 13. Mobile Considerations
* Responsive single-column layout on small viewports.

### 14. Performance Considerations
* Customer dashboard data hydrated via server-driven Inertia props.

### 15. UX Risks
* Unclear shipment status $\rightarrow$ Clear 4-stage visual progress stepper on active order cards.

### 16. Stitch Generation Notes
* Clean customer portal layout with dark cards, sky blue CTAs, and emerald status highlights.

---

## 23. Page: `/my-active-reservations` — Customer Live Delivery Tracker

### 1. Screen Overview
* **Purpose**: Customer real-time tracking page displaying assigned truck movement, live route map, and delivery ETA.
* **Primary User**: Customer.
* **Success Metrics**: Zero customer support status calls, high customer satisfaction (CSAT) rating.

### 2. User Intent
* **Goal**: Watch assigned delivery truck moving live on the map, check estimated time of arrival, and verify delivery stage.
* **Primary Information**: Real-Time Map, Driver Truck Marker, Pickup/Dropoff Markers, 4-Stage Visual Stepper, Delivery ETA.

### 3. User Journey
* **Entry Points**: Customer Dashboard link; Email tracking link.
* **Workflow**: Open tracking page $\rightarrow$ Inspect live Leaflet map $\rightarrow$ Watch animated driver truck moving $\rightarrow$ View delivery ETA.

### 4. Information Architecture
* **Level 1**: Live Map View, 4-Stage Progress Stepper (*Order Placed $\rightarrow$ Vehicle Assigned $\rightarrow$ On The Way $\rightarrow$ Delivered*), Delivery ETA.
* **Level 2**: Driver Name, Vehicle Plate Number, Pickup Address, Dropoff Address.
* **Level 3**: Cargo Description, Customer Support trigger.

### 5. Layout Blueprint
* **Split View Layout**:
  * **Left Panel (360px)**: Active Shipment Selector List, 4-Stage Progress Stepper, Delivery Details Card, Support Trigger.
  * **Right Panel (Fluid 100vh)**: Live Leaflet Map Container with 3-Point Markers and dynamic route polyline.

### 6. Component Inventory
* Split View Layout, Active Order Cards, 4-Stage Stepper, Live Leaflet Map, 3-Point Markers, Route Polyline, ETA Badge.

### 7. Data Requirements
* **Real-time**: Driver lat/lng streamed via Reverb WebSockets channel.

### 8. User Actions
* **Primary**: `Select Active Order`, `Recenter Map`.
* **Secondary**: `Contact Customer Support`.

### 9. Business Rules
* Customer view masks precise driver personal phone number for privacy, providing customer support proxy instead.

### 10. States
* **Live WebSocket Connected**: Pulsing emerald dot showing *"Live Tracking Active"*.

### 11. Accessibility
* Accessible text updates for live ETA changes.

### 12. Enterprise UX Enhancements
* Automated bounds auto-fit centering Driver, Pickup, and Dropoff points.

### 13. Mobile Considerations
* On mobile, displays map full-width with swipeable bottom sheet details panel.

### 14. Performance Considerations
* WebSocket subscription automatically unsubscribes when customer leaves page.

### 15. UX Risks
* Driver offline status $\rightarrow$ Displays clear badge *"Driver location updated 2 mins ago"*.

### 16. Stitch Generation Notes
* Customer tracking design featuring full-height map canvas, dark status drawer, and vibrant route polyline.

---

## 24. Page: `/my-reservations/new` — Customer Booking Request Form

### 1. Screen Overview
* **Purpose**: Allow customers to submit new freight transport requests online directly into the reservation pipeline.
* **Primary User**: Customer.

### 2. User Intent
* **Goal**: Submit a freight booking request specifying pickup, dropoff, date, and cargo type.
* **Primary Information**: Pickup Address, Dropoff Address, Date & Time, Cargo Type, Weight (kg).

### 3. User Journey
* **Entry Points**: Customer Dashboard `+ Book New Freight` button.
* **Workflow**: Enter addresses $\rightarrow$ Select date $\rightarrow$ Specify cargo $\rightarrow$ Click `[Submit Booking Request]`.

### 4. Information Architecture
* **Level 1**: Pickup & Dropoff Address Autocomplete Inputs, Requested Date & Time, Cargo Service Type.
* **Level 2**: Estimated Cargo Weight (kg), Special Delivery Instructions.
* **Level 3**: Estimated Fare Quote Range ($).

### 5. Layout Blueprint
* **Centered Card Form Layout (`max-w-2xl mx-auto py-8`)**:
  * **Header**: Form Title (*Request Freight Booking*), Subtitle (*Fill in cargo details to request transport*).
  * **Form Sections**:
    * 1. Locations Section (Pickup & Dropoff with map pin preview).
    * 2. Schedule & Vehicle Section (Date picker, Service type dropdown).
    * 3. Cargo Description Section (Weight, Special instructions).
  * **Footer Action**: `[Submit Booking Request]` Primary Button.

### 6. Component Inventory
* Form Container, Autocomplete Inputs, Date Picker, Select Dropdowns, Textarea, Map Pin Preview, Submit Button.

### 7. Data Requirements
* **Required**: Pickup Address, Dropoff Address, Date, Service Type.

### 8. User Actions
* **Primary**: `Submit Booking Request`.
* **Secondary**: `Cancel & Return to Dashboard`.

### 9. Business Rules
* Customer booking requests enter status `PENDING` awaiting Dispatcher review and vehicle assignment.

### 10. States
* **Success State**: Redirects to Customer Dashboard with green toast (*"Booking request submitted successfully!"*).

### 11. Accessibility
* Accessible form field labels and focus styling.

### 12. Enterprise UX Enhancements
* Live address autocompletion with interactive Leaflet map preview.

### 13. Mobile Considerations
* Responsive single-column scrollable form layout.

### 14. Performance Considerations
* Address search debounced by 400ms.

### 15. UX Risks
* Vague address entry $\rightarrow$ Address autocomplete forces valid geocoded selection.

### 16. Stitch Generation Notes
* Clean customer booking form layout with dark slate background, clear form field borders, and high-contrast submit CTA.

---

## 25. Page: `/customer/invoices` — Customer Invoices & Receipts

### 1. Screen Overview
* **Purpose**: Customer financial hub for reviewing completed delivery invoices, downloading PDF receipts, and paying balances.
* **Primary User**: Customer.

### 2. User Intent
* **Goal**: Download a past delivery receipt or pay an outstanding delivery invoice.
* **Primary Information**: Invoice #, Reservation ID, Delivery Date, Amount ($), Payment Status Badge.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Invoices & Receipts.
* **Workflow**: Filter by Status (`UNPAID`) $\rightarrow$ Click `Download PDF` or `[Pay Online]`.

### 4. Information Architecture
* **Level 1**: Total Outstanding Balance ($), Invoice Table (Invoice #, Date, Amount, Status).
* **Level 2**: Order Reservation ID, Payment Method.
* **Level 3**: Itemized Freight Charges Breakdown.

### 5. Layout Blueprint
* **Header**: Page Title (*Invoices & Delivery Receipts*), Total Unpaid Counter Badge.
* **Filter Bar**: Status Tabs (*All, Unpaid, Paid*), Search Input.
* **Content**: Invoice Master Data Table with PDF Download & Pay Buttons.

### 6. Component Inventory
* Summary Card, Status Tabs, Data Table, Status Badges, PDF Download Icon Buttons, Pay Online Button.

### 7. Data Requirements
* **Required**: Invoices collection associated with customer ID.

### 8. User Actions
* **Primary**: `Download Invoice PDF`, `Pay Invoice Online`.
* **Secondary**: `Filter Invoices`.

### 9. Business Rules
* Invoices automatically generated upon dispatch reaching `COMPLETE` status.

### 10. States
* **Empty**: *"No invoices found."*

### 11. Accessibility
* Accessible table row structure and clear button action names.

### 12. Enterprise UX Enhancements
* Direct single-click PDF receipt download button in data table row.

### 13. Mobile Considerations
* Responsive table converts to invoice card list on mobile viewports.

### 14. Performance Considerations
* Server-side paginated invoice records.

### 15. UX Risks
* Overdue invoice confusion $\rightarrow$ Clear red badge tags for overdue balances.

### 16. Stitch Generation Notes
* Customer financial portal design with clean data table, dark cards, and status badge indicators.

---

# SECTION G: FINANCE OFFICER BLUEPRINTS

---

## 26. Page: `/finance/invoices` — Billing & Invoice Operations

### 1. Screen Overview
* **Purpose**: Finance control center for generating customer invoices, recording payments, and managing accounts receivable.
* **Business Objective**: Maintain company cash flow, ensure timely billing, and track unpaid delivery balances.
* **Primary User**: Finance Officer, Company Administrator.
* **Success Metrics**: Days Sales Outstanding (DSO) < 15 days, 100% accurate rate application.

### 2. User Intent
* **Goal**: Issue an invoice for a completed dispatch, record a received check/bank transfer, or review overdue accounts.
* **Primary Information**: Total Accounts Receivable, Overdue Amount, Unpaid Invoices List, Payment Status.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Finance $\rightarrow$ Billing & Invoices.
* **Workflow**: Review top financial metric cards $\rightarrow$ Filter by `UNPAID` $\rightarrow$ Click row to open Payment Modal $\rightarrow$ Record payment.

### 4. Information Architecture
* **Level 1**: Total Unpaid Balance ($), Overdue Balance ($), Paid This Month ($), Invoice Master Table.
* **Level 2**: Invoice #, Customer Name, Reservation ID, Due Date, Total Amount, Status Badge.
* **Level 3**: Itemized Charge Breakdown (Base fare, distance rate, surcharges).

### 5. Layout Blueprint
* **Header**: Page Title (*Billing & Invoices Operations*), Action (`+ Generate New Invoice`).
* **Top Metric Bar**: 3 Cards (Unpaid Total, Overdue Total, Paid This Month).
* **Filter Bar**: Status Tabs (*All Invoices, Unpaid, Overdue, Paid*), Date Picker, Customer Dropdown, Search Bar.
* **Content**: Master Invoice Data Table + Quick Payment Record Modal.

### 6. Component Inventory
* Financial Metric Cards, Filter Bar, Invoice Data Table, Status Badges, Payment Modal, Action Dropdowns.

### 7. Data Requirements
* **Calculated**: Accounts Receivable aggregates ($), Days Overdue.

### 8. User Actions
* **Primary**: `Record Payment`, `Generate Invoice`.
* **Secondary**: `Send Payment Reminder Email`, `Export Invoices CSV`.
* **Dangerous**: `Void Invoice` (Requires confirm dialog).

### 9. Business Rules
* Invoices past due date automatically update status to `OVERDUE`.

### 10. States
* **Overdue Highlight**: Red-highlighted data table rows for overdue invoices.

### 11. Accessibility
* Accessible monetary form inputs and table structures.

### 12. Enterprise UX Enhancements
* One-click payment recording drawer modal.

### 13. Mobile Considerations
* Responsive table converts to invoice card list on small viewports.

### 14. Performance Considerations
* Server-side paginated database queries with indexed invoice status.

### 15. UX Risks
* Unrecorded payments $\rightarrow$ Prominent `[Record Payment]` action on invoice row.

### 16. Stitch Generation Notes
* Financial management design with high-contrast monetary stat cards, dark table container, and color-coded payment badges.

---

## 27. Page: `/finance/reports` — Revenue & Cost Analysis Reports

### 1. Screen Overview
* **Purpose**: Business intelligence reporting analyzing company revenue, vehicle profitability, fuel expenses, and cost per kilometer.
* **Business Objective**: Evaluate fleet profitability, optimize transport margins, and support executive financial planning.
* **Primary User**: Finance Officer, Executive Management.
* **Success Metrics**: Accurate margin analysis per vehicle model, clear cost-per-kilometer visibility.

### 2. User Intent
* **Goal**: Analyze monthly transport revenue, compare fuel costs against trip earnings, or calculate average cost per kilometer.
* **Primary Information**: Total Revenue, Total Operating Expenses, Net Margin %, Revenue vs Expense Graph, Profitability Table.

### 3. User Journey
* **Entry Points**: Sidebar $\rightarrow$ Finance $\rightarrow$ Financial Reports.
* **Workflow**: Select Date Range $\rightarrow$ Choose Report Type (*Vehicle Profitability*) $\rightarrow$ Inspect charts $\rightarrow$ Export CSV/PDF report.

### 4. Information Architecture
* **Level 1**: Net Revenue ($), Total Expenses ($), Net Margin %, Revenue vs Expense Bar/Line Graph.
* **Level 2**: Profitability per Vehicle Table (Plate, Trips, Revenue, Fuel Cost, Maintenance Cost, Net Profit).
* **Level 3**: Top Revenue Customers List, Cost per Kilometer Metric.

### 5. Layout Blueprint
* **Header**: Page Title (*Financial & Cost Analytics*), Date Range Selector, Action (`Export Report PDF`).
* **Top Metric Bar**: 4 KPI Cards (Gross Revenue, Total Expenses, Net Margin %, Cost/KM).
* **Main Section (2 Columns)**:
  * Left Column (2/3 width): Monthly Revenue vs Fuel & Maintenance Expenses Combo Chart.
  * Right Column (1/3 width): Top Revenue Customers Ranking List.
* **Bottom Section**: Vehicle Profitability Master Table.

### 6. Component Inventory
* Metric Cards (4), Date Range Picker, Combo Chart, Customer Ranking List, Data Table, PDF Export Button.

### 7. Data Requirements
* **Calculated**: `Net Profit = Trip Revenue - (Fuel Cost + Maintenance Cost + Driver Pay)`.

### 8. User Actions
* **Primary**: `Export PDF Report`, `Export Raw CSV Data`.
* **Secondary**: `Change Report Date Range`, `Filter by Vehicle`.

### 9. Business Rules
* Report calculations include all completed dispatches and logged maintenance/fuel records in date range.

### 10. States
* **Loading**: Chart shimmer animation while computing aggregate metrics.

### 11. Accessibility
* Screen-reader data table alternatives for all BI chart graphics.

### 12. Enterprise UX Enhancements
* Multi-metric drill-down table linked directly to individual vehicle detail pages.

### 13. Mobile Considerations
* Charts scale responsively; tables scroll horizontally on mobile.

### 14. Performance Considerations
* Heavy report aggregations cached in Redis and computed asynchronously via queued jobs if date range exceeds 1 year.

### 15. UX Risks
* Misinterpreting gross vs net revenue $\rightarrow$ Clearly distinguished top KPI cards.

### 16. Stitch Generation Notes
* Executive financial BI design featuring dark background canvas, vibrant combo charts (`Sky` for revenue, `Rose` for expense), and clear data tables.
