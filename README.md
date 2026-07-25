# Kirana Two Office Tower — Premium Commercial Real Estate Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-v1.3-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-v4-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

A modern, high-performance commercial real estate web application for **Kirana Two Office Tower (Intijaya Property)**, designed for searching, filtering, and inquiring about Grade-A office suites and commercial spaces in Kelapa Gading, North Jakarta.

---

## 🌟 Key Features

- 🏢 **Grade-A Property Catalog**: Comprehensive directory of High Zone, Mid Zone, Low Zone, Penthouse, and Commercial Executive Suites.
- 🔍 **Advanced Property Search & Filter**: Real-time filtering by office zone (`Low Zone`, `Mid Zone`, `High Zone`, `Penthouse`), space condition (`Bare Shell`, `Semi-Fitted`, `Fully Fitted`, `Serviced Office`), size range, and sorting options (price & size).
- 📐 **Detailed Property View**: Unit-level specifications (NLA area, rental rate per m², service charge, ceiling height, electrical capacity, parking ratio, view orientation) with image galleries and floor plan blueprints.
- ⚛️ **Atomic Design Component System**: Built modularly following Atomic Design principles (`atoms`, `molecules`, `organisms`, `templates`).
- ⚡ **Unified API & Edge Deployment**: Shared Web-standard Request/Response router powering local Bun server and serverless **Cloudflare Workers**.
- 🛡️ **Strict Type Safety**: Fully typed with TypeScript 5, `@cloudflare/workers-types`, and strict `verbatimModuleSyntax` compliance.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Bundler** | [Bun](https://bun.sh/) |
| **Frontend Framework** | [React 19](https://react.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query) |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), Google Fonts (*Playfair Display*, *Hanken Grotesk*), Material Symbols Outlined |
| **Type Definitions** | [TypeScript 5](https://www.typescriptlang.org/), `@cloudflare/workers-types`, `@types/react` |
| **Infrastructure / Host** | [Cloudflare Workers with Static Assets](https://workers.cloudflare.com/), [Cloudflare Pages](https://pages.cloudflare.com/), Wrangler CLI v4 (`v4.114.0`) |

---

## 📂 Project Structure

```
kiranatwoofficetower/
├── src/
│   ├── api/                # Shared Web API routes logic
│   │   └── routes.ts       # Endpoint router (/api/properties)
│   ├── components/         # Atomic Design Architecture
│   │   ├── atoms/          # Badges, Buttons, Inputs, Labels
│   │   ├── molecules/      # Property Cards, Search Inputs, Stat Items
│   │   ├── organisms/      # Header, Footer, Hero, FeaturedListings, PropertyListings
│   │   └── templates/      # MainLayout, PropertyLayout
│   ├── data/               # Mock property database & navigation config
│   │   └── mockData.ts
│   ├── hooks/              # Custom React hooks (useProperties, useDebounce)
│   ├── pages/              # Page routes (HomePage, PropertyListingPage, PropertyDetailPage)
│   ├── services/           # Frontend API client service (propertyService.ts)
│   ├── types/              # TypeScript interfaces & domain models
│   ├── App.tsx             # React Router setup & QueryClientProvider
│   ├── frontend.tsx        # React client entry point
│   ├── index.ts            # Bun local server entry point
│   └── worker.ts           # Cloudflare Worker entry point
├── functions/              # Cloudflare Pages Functions middleware
│   └── _middleware.ts
├── dist/                   # Production build output
├── wrangler.jsonc          # Cloudflare Workers & Assets configuration
├── tsconfig.json           # TypeScript configuration with @cloudflare/workers-types
├── package.json            # Scripts & dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── README-CLOUDFLARE.md    # Dedicated Cloudflare deployment guide
```

---

## 🔌 API Documentation

The server exposes RESTful API endpoints used by the frontend:

### 1. `GET /api/properties`
Fetch filtered and sorted property listings.

**Query Parameters:**
- `search` *(string)*: Text search matching title, unit code, location, or floor.
- `zone` *(string)*: `Low Zone` | `Mid Zone` | `High Zone` | `Penthouse` | `all`
- `condition` *(string)*: `Bare Shell` | `Semi-Fitted` | `Fully Fitted` | `Serviced Office` | `all`
- `type` *(string)*: `For Rent` | `For Sale` | `all`
- `sizeRange` *(string)*: `small` (<150m²) | `medium` (150-300m²) | `large` (300-600m²) | `whole` (>600m²) | `all`
- `sortBy` *(string)*: `price-asc` | `price-desc` | `size-asc` | `size-desc` | `floor-desc` | `default`

### 2. `GET /api/properties/:id`
Fetch single property details by ID (e.g. `/api/properties/p-101`).

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+) or Node.js (v18+)

### Installation

```bash
# Clone repository
git clone https://github.com/marquelzikri/kirana2officetower.git
cd kiranatwoofficetower

# Install dependencies
bun install
```

### Running Locally

```bash
# Development server (Hot Module Reloading enabled)
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking

```bash
# Run TypeScript static type check across the entire project
bun run typecheck
```

---

## 📦 Building for Production

```bash
# Compile Tailwind CSS and bundle JS/HTML output into ./dist
bun run build

# Run local production server with Bun
bun start
```

---

## ☁️ Deployment to Cloudflare Infrastructure

This project is optimized for deployment on Cloudflare using **Wrangler v4**.

### Quick Deployment via Wrangler CLI

1. **Log in to Cloudflare**:
   ```bash
   npx wrangler login
   ```

2. **Deploy to Cloudflare Workers with Assets**:
   ```bash
   bun run deploy
   ```

3. **Deploy to Cloudflare Pages**:
   ```bash
   bun run deploy:pages
   ```

4. **Local Cloudflare Emulation**:
   ```bash
   bun run preview
   ```

For detailed Cloudflare CI/CD setup and environment settings, see [README-CLOUDFLARE.md](file:///Users/cirrus/IdeaProjects/kiranatwoofficetower/README-CLOUDFLARE.md).

---

## 📄 License

Private repository. All rights reserved by **Intijaya Property / Kirana Two Office Tower**.
