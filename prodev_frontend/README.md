# CarbonJar – Frontend

This is the **Next.js + Tailwind + TypeScript** web app for **CarbonJar**, the frontend half of your full‑stack project.

> Backend lives in `prodev_backend/`. Together they form the CarbonJar.

---

## Project Structure

```bash
prodev_frontend/
├── client/         # Next.js (Pages Router) + Tailwind + TypeScript
└── README.md       # This README file
```

---

## Tech Stack

- **Next.js (Pages Router)** – classic `/pages` directory approach
- **React**
- **TypeScript**
- **Tailwind CSS**

---

## Prerequisites

- **Node.js**
- A package manager: **npm**, or **yarn**
- Backend API running locally, e.g. `http://localhost:8000`

---

## Quick Start

```bash
# 1) install deps
cd prodev_frontend
cd client
npm install    # or yarn

# 2) boot dev server
npm run dev        # or yarn dev

# 3) open the app
Visit http://localhost:3000
```

---

### Environment Variables

Create client/.env.local with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Use in code (examples in client/src/utils/api.ts).

---

#### Backend Integration

Calls should be made to
> ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/...

Example endpoints: `/api/users/`, `/api/challenges/`, `/api/location/`

---

#### Common Commands

From prodev_frontend/client:

```bash
npm run dev       # start dev server
npm build         # production build
npm start         # run production server
```

---

#### Deployment

Vercel is the easiest path (first‑class Next.js support).

---
