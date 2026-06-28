# Tikify 🎫

A comprehensive, full-stack Online Ticket Booking Platform built using the MERN stack. **Tikify** provides a seamless, secure ecosystem where passengers can search, filter, and book travel tickets (Bus, Train, Launch, Flight) across a network of approved transit options. The system defines three distinctive roles—User, Vendor, and Admin—each with dedicated access privileges and interactive management interfaces.

<div align="center">
  <br />
  <a href="https://tikify-client.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Deployment-🚀-00ADB5?style=for-the-badge&logoColor=white" alt="Live Deployment" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Syed-Shabok/tikify-server">
    <img src="https://img.shields.io/badge/Server_Repository-📦-124170?style=for-the-badge&logoColor=white" alt="Server Repository" />
  </a>
</div>

---

## 🚀 Tech Stack & Core Libraries

### Frontend

- **Framework:** Next.js (App Router Architecture)
- **UI Component Toolkit:** HeroUI (formerly NextUI)
- **Styling Palette:** Tailwind CSS
- **Animations:** Framer Motion
- **Smooth Scrolling:** Lenis Smooth Scroll
- **Form Management:** React Hook Form
- **Notifications:** React Hot Toast
- **Icons:** React Icons

### Backend & Database

- **Runtime Environment:** Node.js + Express
- **Database Ledger:** MongoDB (Native NodeJS Driver Integration)
- **Authentication Platform:** Better-Auth (Credentials & Google Sign-In providers)
- **Payment Processing:** Stripe Node SDK

---

## 📸 Application Preview & Mockups

<details>
  <summary>🌐 Click to expand Public View Previews</summary>
  <br />

### Homepage & Advertisement Section

_Showcases exactly 6 high-priority featured routes curated dynamically by the platform administration._
![Homepage Ads Placeholder](https://placehold.co/1200x600/091624/00ADB5?text=Tikify+Homepage+Featured+Ads+Preview)

### Advanced Ticket Discovery Interface

_Interactive view featuring real-time multi-variable parameter search, category filtering, price sorting, and dynamic server-side pagination._
![All Tickets Page Placeholder](https://placehold.co/1200x600/091624/00ADB5?text=All+Tickets+Search+and+Pagination+Interface)

</details>

<details>
  <summary>📊 Click to expand Role-Segregated Dashboards Preview</summary>
  <br />

### Passenger Hub

_Track incoming reservation statuses, view interactive departure countdown clocks, and execute instant billing checkout using the Stripe interface._
![Passenger Hub Placeholder](https://placehold.co/1200x600/091624/00ADB5?text=Passenger+Dashboard+and+Stripe+Checkout)

### Vendor Control Center

_Streamlined asset forms integrated with ImgBB storage APIs, custom perk selection checklists, and chart-visualized business metrics mapping net revenues._
![Vendor Suite Placeholder](https://placehold.co/1200x600/091624/00ADB5?text=Vendor+Inventory+and+Revenue+Charts)

### Admin Surveillance Panel

_Global route verification management, user role promotion panels, homepage ad slot curators, and absolute operator restriction switches._
![Admin Dashboard Placeholder](https://placehold.co/1200x600/091624/00ADB5?text=Admin+Security+and+Marketing+Management)

</details>

---

## 💎 Key Features

### 🌗 Global Features & Aesthetics

- **Theme Toggle:** Fully dynamic Dark/Light mode toggle that seamlessly adapts system-wide variables.
- **Modern UI/UX:** Clean spacing, careful color contrast, glassmorphism enhancements, and fully responsive layouts optimized across mobile, tablet, and desktop views.
- **Lenis Smooth Scroll:** Inertial mouse wheel and touch gesture overrides for fluid document navigation.

### 🌐 Public & Authentication Experiences

- **Consistent Shell:** Fixed/Sticky top navigation bar featuring modular dropdown controls alongside responsive hamburger alternatives for mobile layouts, balanced by an informational 4-column footer layout.
- **Secure Onboarding:** Input-validated user registration and standard credential-based logging, backed up by a prominent single-click "Continue with Google" OAuth gateway using Better-Auth.
- **Homepage Advertising Display:** Dedicated banner slot displaying exactly 6 curated, approved routes picked strictly by the platform's administrators.
- **Latest Additions Stream:** Dynamic feed showing the 6–8 most recently added transport paths available.

### 🎫 Route Discovery & Booking Lifecycle

- **Advanced Route Finder:** Comprehensive search filters operating across "From" and "To" geographic variables, paired with type filtering (Bus, Train, Flight, Launch) and price sorting (Low to High / High to Low).
- **Server-Side Pagination:** Optimized delivery of data splitting records into clean chunks of 6 listings per page to limit network overhead.
- **Ticket Countdown Mechanics:** Implements live client-side countdown clocks calculating remaining durations relative to scheduled departures.
- **Conditional Ordering Protections:** Automatically blocks checkout modals and disables actions if routes have expired, if inventories drop to 0, or if requested booking numbers exceed remaining batch supplies.

### 📊 Dashboard Interfaces (Role-Segregated)

#### 👤 1. Passenger Hub

- **User Profile:** Real-time visibility into account specifics, profiling user imagery, contact emails, and system roles.
- **My Booked Tickets Grid:** A clear 3-column structural layout presenting pending, accepted, rejected, or paid itineraries. When vendors accept a request, a Stripe integration dynamically triggers calculating `unit price × quantity` for checkout processing.
- **Transaction Table Ledger:** Complete transparency rendering historic purchase lines mapping Stripe Transaction IDs, absolute amounts paid, ticket titles, and accurate execution dates.

#### 🏪 2. Vendor Management Suite

- **Route Formulation Engine:** Interactive item submission interface featuring file uploads handled securely through ImgBB APIs, customized perk multi-checkbox arrays, and readonly identification strings.
- **Inventory Control Grid:** Displays individual route structures along with real-time approval flags. Features update and deletion constraints that automatically lock if an administrator blacklists an operator.
- **Requested Bookings Table:** Clear administrative panel enabling route operators to individually accept or reject passenger seat reservations.
- **Revenue Overview Analytics:** Built-in charts summarizing metrics for total listings uploaded, real-time ticket quantities sold, and absolute revenue lines.

#### 🛡️ 3. Admin Surveillance Center

- **Global Approval Interface:** Central control table for managing newly introduced paths across the platform, with absolute authority to accept or reject routes globally.
- **User Authority Controller:** Tabular ledger listing active names, emails, and platform roles with tools to promote users to Vendor or Administrator status instantly.
- **Fraud Eradication:** A robust control system that permanently flags fraudulent operators, immediately hides all their public listings, and strips away their future creation permissions.
- **Marketing Curators:** Isolated row toggles allowing admins to swap out homepage advertisements while enforcing a strict limit of exactly 6 slots.

---

## 🔐 Security Framework & Data Ownership

Tikify operates under a strict Zero-Trust context across asymmetric client/server environments:

- **Token Interception Middlewares:** Intercepts `better-auth` JWT strings directly via custom server utilities (`protectedFetch`, `serverMutation`), injecting them into backend Bearer wrappers seamlessly.
- **Strict Identity Matching:** Every backend route evaluates incoming parameters against the `req.user` configuration decoded securely out of the server session collection. Users can exclusively access or edit data elements matching their cryptographic credentials.
