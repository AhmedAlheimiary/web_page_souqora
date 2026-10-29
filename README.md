# Souqora Web Application Workspace

## Overview

This repository contains the web application codebase for the Souqora multi-vendor marketplace platform. Souqora is a comprehensive digital commerce system offering multi-category retail spanning consumer electronics, fashion, automotive vehicles, and residential and commercial real estate.

The primary web application is located within the `souqora` directory and is built using Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

---

## Workspace Structure

```text
web_page/
|-- README.md                   Workspace documentation and deployment guidelines
+-- souqora/                    Full-stack Next.js web application
    |-- prisma/                 Prisma ORM schema and database seeding scripts
    |-- public/                 Static icons, assets, and web manifest
    |-- scripts/                Data integrity and schema verification utilities
    |-- src/                    Application source code
    |   |-- app/                Next.js App Router pages and API routes
    |   |   +-- api/            API route handlers (including dynamic SVG placeholder generator)
    |   |-- components/         Reusable UI components, headers, footers, modals
    |   |-- lib/                Database clients, cart management, and auth services
    |   |-- messages/           Localization dictionary files (Arabic and English)
    |   |-- styles/             Tailwind CSS theme definitions
    |   +-- types/              TypeScript interfaces and database type definitions
    |-- package.json            Application dependencies and development scripts
    +-- tsconfig.json           TypeScript compiler configuration
```

---

## Technical Specifications

- Application Framework: Next.js 16 (App Router)
- UI Library: React 19
- Type System: TypeScript 5
- Styling Engine: Tailwind CSS v4
- Localization: next-intl (Full Arabic RTL and English LTR layouts)
- Session and Auth: NextAuth.js v5 (JWT sessions and Credentials provider)
- Data Modeling: Prisma ORM v6
- Asset Handling: Integrated dynamic SVG placeholder engine (`/api/placeholder`)

---

## Getting Started

### Prerequisites
- Node.js version 20.x or higher
- npm or pnpm package manager

### Setup Instructions

1. Navigate to the application directory:
   ```bash
   cd souqora
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Prisma client:
   ```bash
   npm run db:generate
   ```

4. Prepare database schema:
   ```bash
   npm run db:push
   ```

5. (Optional) Seed demo catalog data:
   ```bash
   npm run db:seed
   ```

---

## Running the Web Application

### Development Mode
To launch the development server with Turbopack:

```bash
cd souqora
npm run dev
```

Open `http://localhost:3000` in your web browser.

### Production Build
To create an optimized production build:

```bash
cd souqora
npm run build
```

To run the production build:

```bash
cd souqora
npm run start
```

---

## License

This software is maintained by the Souqora development team. All rights reserved.
