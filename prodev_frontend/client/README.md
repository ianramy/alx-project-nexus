# CarbonJar Client README

CarbonJar is a full-stack web application that helps users track and reduce their carbon footprint through challenges, actions, and community features.

This is the **frontend client**, built with:

- [Next.js](https://nextjs.org/) (Pages Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Modular folder structure with clean API integration
- Dynamic Routing with `pages/[id].tsx`

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ianramy/alx-project-nexus.git
cd carbonjar/prodev_frontend/client
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Set Up Environment Variables

Create a .env.local file in the client/ directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at:
> `http://localhost:3000`

---

## Folder Structure

```bash
prodev_frontend/
└── client/
    ├── public/                 # Static assets
    ├── src/
    │   ├── components/         # UI components (grouped by domain)
    │   ├── interfaces/         # TypeScript interfaces
    │   ├── pages/              # Next.js Pages Router
    │   │   ├── actions/
    │   │   ├── challenges/
    │   │   ├── location/
    │   │   ├── notifications/
    │   │   ├── users/
    │   │   ├── leaderboard/
    │   ├── styles/             # Tailwind global styles
    │   └── utils/              # API fetchers (e.g., fetchActions, fetchUsers)
    ├── tailwind.config.js
    ├── postcss.config.js
    └── tsconfig.json
```

### API Communication

All API calls use `@/utils/*.ts` to fetch data from your Django backend.

---

## Features

- View and complete eco-friendly Actions
- Join exciting Challenges
- Explore global Locations
- Stay updated with Notifications
- Climb the Leaderboard
- Manage User profiles
- Mobile-responsive layout

---

## Production Build

```bash
npm run build
npm start
```

---

## Customization Tips

- Customize colors in :root (via global.css)
- Add new endpoints in utils/ and types in interfaces/
- Create new component cards in components/ for reuse
- Use SWR/React Query if needed for advanced data caching

---

## License

MIT License

---
