# Kirana Two Office Tower — Premium Commercial Real Estate Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-v1.3-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-v4-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-Object_Storage-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/r2/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare_D1-Serverless_SQL-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)

A modern, high-performance commercial real estate web application for **Kirana Two Office Tower (Intijaya Property)**, designed for searching, filtering, managing, and inquiring about Grade-A office suites and commercial spaces in Kelapa Gading, North Jakarta.

---

## 🌟 Key Features

- 🏢 **Grade-A Property Catalog**: Comprehensive directory of High Zone, Mid Zone, Low Zone, Penthouse, and Commercial Executive Suites.
- 🔍 **Advanced Property Search & Filter**: Real-time filtering by office zone (`Low Zone`, `Mid Zone`, `High Zone`, `Penthouse`), space condition (`Bare Shell`, `Semi-Fitted`, `Fully Fitted`, `Serviced Office`), size range, and sorting options (price & size).
- 📐 **Detailed Property View**: Unit-level specifications (NLA area, rental rate per m², service charge, ceiling height, electrical capacity, parking ratio, view orientation) with image galleries and floor plan blueprints.
- 📝 **Full CRUD Management**: Create, read, update, and delete property listings stored dynamically in Cloudflare D1 (or local Bun SQLite fallback).
- 🖼️ **Cloudflare R2 Image & Media Uploads**: High-performance image upload and media serving backed by Cloudflare R2 bucket storage.
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
| **Database** | [Cloudflare D1](https://developers.cloudflare.com/d1/) (Production) / Bun SQLite (Local Development) |
| **Media Storage** | [Cloudflare R2 Object Storage](https://developers.cloudflare.com/r2/) (Production) / Local Disk (Local Development) |
| **Type Definitions** | [TypeScript 5](https://www.typescriptlang.org/), `@cloudflare/workers-types`, `@types/react` |
| **Infrastructure / Host** | [Cloudflare Workers with Assets](https://workers.cloudflare.com/), Wrangler CLI v4 (`v4.114.0`) |

---

## 📂 Project Structure

```
kiranatwoofficetower/
├── src/
│   ├── api/                # Shared Web API routes logic
│   │   ├── db.ts           # D1 & SQLite database access layer
│   │   ├── media.ts        # R2 Bucket & local media storage layer
│   │   └── routes.ts       # Endpoint router (/api/properties, /api/upload)
│   ├── components/         # Atomic Design Architecture
│   │   ├── atoms/          # Badges, Buttons, Inputs, Labels, Modals
│   │   ├── molecules/      # Property Cards, Search Inputs, Stat Items, Form Inputs
│   │   ├── organisms/      # Header, Footer, Hero, FeaturedListings, PropertyListings, PropertyFormModal
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
├── schema.sql              # Cloudflare D1 SQL table schema
├── wrangler.jsonc          # Cloudflare Workers, Assets, D1 & R2 configuration
├── tsconfig.json           # TypeScript configuration with @cloudflare/workers-types
├── package.json            # Scripts & dependencies
└── README.md               # Project documentation
```

---

## 🔌 API Documentation

The server exposes RESTful API endpoints used by the frontend:

### 1. Property Management Endpoints

- **`GET /api/properties`**: Fetch filtered and sorted property listings.
  - **Query Parameters**:
    - `search` *(string)*: Text search matching title, unit code, location, or description.
    - `zone` *(string)*: `Low Zone` | `Mid Zone` | `High Zone` | `Penthouse` | `all`
    - `condition` *(string)*: `Bare Shell` | `Semi-Fitted` | `Fully Fitted` | `Serviced Office` | `all`
    - `type` *(string)*: `For Rent` | `For Sale` | `all`
    - `sizeRange` *(string)*: `small` (<150m²) | `medium` (150-300m²) | `large` (300-600m²) | `whole` (>600m²) | `all`
    - `sortBy` *(string)*: `price-asc` | `price-desc` | `size-asc` | `size-desc` | `floor-desc` | `default`
- **`GET /api/properties/:id`**: Fetch single property details by ID.
- **`POST /api/properties`**: Create a new property listing.
- **`PUT /api/properties/:id`**: Update an existing property listing.
- **`DELETE /api/properties/:id`**: Delete a property listing.
- **`POST /api/properties/seed`**: Re-seed database with default Kirana Two property listings.

### 2. Media & Upload Endpoints

- **`POST /api/upload`**: Upload a file (`multipart/form-data` with field `file`) to Cloudflare R2 storage (or local disk in dev mode). Returns `{ "url": "/api/media/..." }`.
- **`GET /api/media/:key`**: Serve uploaded media file from Cloudflare R2 bucket.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+) or Node.js (v18+)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm install -g wrangler` or `bun add -d wrangler`)

### Local Development

```bash
# 1. Install dependencies
bun install

# 2. Run local development server (with hot module replacement)
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type Checking & Building

```bash
# Static TypeScript type check
bun run typecheck

# Production build for frontend assets
bun run build
```

---

## ☁️ Cloudflare Deployment Guide

To deploy this application to **Cloudflare Workers** with full **D1 Database** and **Cloudflare R2 Object Storage** support:

### 1. Log in to Cloudflare

```bash
npx wrangler login
```

### 2. Enable Cloudflare R2 Storage (Required for Media Uploads)

Create an R2 Bucket for storing property photos, floor plans, and media uploads:

```bash
# Create the R2 bucket in your Cloudflare account
npx wrangler r2 bucket create kirana-property-media
```

Verify `wrangler.jsonc` contains the binding for `MEDIA_BUCKET`:

```jsonc
"r2_buckets": [
  {
    "binding": "MEDIA_BUCKET",
    "bucket_name": "kirana-property-media"
  }
]
```

### 3. Setup Cloudflare D1 Database (Required for Property Listings)

Create a serverless D1 SQLite database in Cloudflare:

```bash
# Create D1 database
npx wrangler d1 create kirana_properties_db
```

Copy the returned `database_id` into your `wrangler.jsonc`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "kirana_properties_db",
    "database_id": "<YOUR_D1_DATABASE_ID>"
  }
]
```

Initialize the database schema:

```bash
# Run schema migration on production D1 database
npx wrangler d1 execute kirana_properties_db --remote --file=schema.sql
```

### 4. Wrangler Configuration Summary (`wrangler.jsonc`)

Ensure `wrangler.jsonc` includes Node compatibility flags and bindings:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "kirana2officetower",
  "main": "src/worker.ts",
  "compatibility_date": "2026-07-01",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "kirana_properties_db",
      "database_id": "<YOUR_D1_DATABASE_ID>"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA_BUCKET",
      "bucket_name": "kirana-property-media"
    }
  ]
}
```

### 5. Deploy to Production

```bash
# Build frontend assets and deploy worker to Cloudflare
bun run deploy
```

---

## 📄 License

Private repository. All rights reserved by **Intijaya Property / Kirana Two Office Tower**.
