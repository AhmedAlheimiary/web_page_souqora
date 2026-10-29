# Souqora Web Application

## Overview

Souqora Web Application is a full-stack, enterprise-grade multi-vendor e-commerce and marketplace platform. It is engineered with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4, providing an extensive commerce portal supporting retail merchandise, consumer technology, vehicles, and real estate listings.

The application features complete Right-to-Left (RTL) language architecture, dynamic bilingual switching (Arabic and English), role-based identity management, an integrated SVG placeholder engine, and high-performance server-rendered routing.

---

## Technical Stack

### Core Frameworks and Runtime
- Framework: Next.js 16 (App Router architecture with Turbopack support)
- Frontend Library: React 19
- Programming Language: TypeScript 5
- Runtime: Node.js (v20.x or higher)

### Styling and User Interface
- CSS Framework: Tailwind CSS v4
- Theme System: next-themes (Light and Dark mode support)
- Icons: Lucide React
- CSS Utilities: clsx, tailwind-merge, class-variance-authority
- URL State Management: Nuqs (Type-safe query parameter sync)

### Identity and Data Layers
- Authentication: NextAuth.js v5 (JWT sessions, credentials provider, password hashing with bcryptjs)
- Database ORM: Prisma ORM v6
- Form Validation: Zod v3
- Localization: next-intl (Full Arabic RTL and English LTR layouts)

---

## Directory Layout

```text
souqora/
|-- prisma/
|   |-- schema.prisma             Database definitions (User, Store, Product, Vehicle, Property, Order)
|   +-- seed.ts                   Initial seed script for categories, demo merchants, and catalogs
|-- public/                       Static assets, brand marks, and Web App manifest
|-- scripts/
|   +-- verify-integrity.ts       Data integrity and model validation script
|-- src/
|   |-- app/                      Next.js App Router root
|   |   |-- api/                  API routes (including SVG placeholder image generator)
|   |   |   +-- placeholder/      Route generating themed SVG placeholders for missing imagery
|   |   |-- layout.tsx            Root layout (HTML structure, RTL/LTR setup, font injection, providers)
|   |   |-- page.tsx              Storefront homepage (Hero carousels, category grid, top sellers)
|   |   |-- account/              Customer profile and security preferences
|   |   |-- admin/                Administrative management console
|   |   |-- auth/                 Sign in, registration, and credential recovery
|   |   |-- cart/                 Shopping cart state review and price calculations
|   |   |-- checkout/             Delivery address selection and checkout completion
|   |   |-- compare/              Side-by-side product specification comparison
|   |   |-- favorites/            Customer wishlist and saved listings
|   |   |-- portal/               Unified portal switcher for customers, sellers, and admins
|   |   |-- product/[slug]/       Detailed product page with image galleries and reviews
|   |   |-- property/[slug]/      Real estate listing details with broker inquiry modal
|   |   |-- real-estate/          Property marketplace directory with specialized filters
|   |   |-- sell/                 Merchant application and vendor onboarding flow
|   |   |-- seller/               Seller dashboard (Orders, Products, Listings, Analytics)
|   |   |-- stores/               Directory of verified marketplace merchants
|   |   |-- vehicle/[slug]/       Automotive vehicle specifications and contact actions
|   |   +-- vehicles/             Vehicle showroom with filtering by make, year, and fuel type
|   |-- components/
|   |   |-- common/               Reusable components (ProductCard, InquiryModal, layouts)
|   |   |-- layout/               Header, Footer, Navigation, and Locale switcher
|   |   +-- providers/            React Context providers (Cart, Favorites, Auth, Theme)
|   |-- lib/
|   |   |-- auth/                 NextAuth configuration and credential handlers
|   |   |-- cart/                 Cart persistence hooks and calculation formulas
|   |   |-- data/                 Demo catalog, initial collections, and mock services
|   |   |-- db/                   Prisma client instance initialization
|   |   |-- favorites/            Wishlist context implementation
|   |   |-- i18n/                 Locale routing, messages, and direction helpers
|   |   +-- utils.ts              Currency formatting, date utilities, and class helpers
|   |-- messages/                 Bilingual dictionary definitions (ar.json, en.json)
|   |-- styles/                   Global CSS and theme variables (globals.css)
|   +-- types/                    TypeScript domain interfaces and NextAuth extensions
|-- next.config.ts                Next.js configuration file
|-- package.json                  Project manifest, scripts, and dependencies
+-- tsconfig.json                 TypeScript compiler configuration
```

---

## Functional Capabilities

### 1. Unified Multi-Category Commerce
- Products: Electronics, apparel, home accessories, personal care.
- Automotive: Vehicle specifications including mileage, fuel type, transmission, model year, and seller contact.
- Real Estate: Property listings with spatial metrics, licensing information, and direct inquiry dialogs.

### 2. Built-in Image Fallback System
- Includes a dedicated route handler at `/api/placeholder` that creates responsive, themed SVG badges for catalog items when external imagery is unavailable or offline.

### 3. Shopping Cart and Checkout Pipeline
- Client-side persistent cart with automatic calculation of item totals, discounts, and delivery fees.
- Multi-step checkout with address selection and payment simulation.

### 4. Portals and Access Levels
- Customer: Order tracking, favorites wishlist, profile management.
- Merchant: Product inventory management, order fulfillment, store branding.
- Administrator: Platform verification, merchant accreditation, listings audit.

---

## Configuration and Environment Variables

Create `.env` inside the `souqora` directory:

```env
# Authentication Secrets
AUTH_SECRET="your-generated-secret-key-32-chars-or-longer"
NEXTAUTH_SECRET="your-generated-secret-key-32-chars-or-longer"
NEXTAUTH_URL="http://localhost:3000"

# Application Metadata
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Souqora"
NEXT_PUBLIC_APP_NAME_EN="SOUQORA"
NEXT_PUBLIC_DEFAULT_LOCALE="ar"
NEXT_PUBLIC_DEFAULT_CURRENCY="SAR"
```

---

## Installation and Execution

### Installation
```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

### Development
```bash
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Production
```bash
npm run build
npm run start
```

---

## License

This software is maintained by the Souqora development team. All rights reserved.
