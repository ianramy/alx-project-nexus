# CarbonJar – Track Your Micro-Impact

Welcome to **CarbonJar**, a full-stack progressive web app built as part of the **ALX ProDev Frontend & Backend Engineering Program**. This project is the culmination of hands-on learning, showcasing practical integration of frontend technologies with a RESTful Django backend.

---

## Overview of the ProDev Frontend Engineering Program

 The ProDev Frontend Engineering Program is an intensive, hands-on experience designed to shape full-stack-capable frontend developers. It focuses on mastering modern web development tools, building production-ready applications, and collaborating across the stack.

Key Modules Covered:

>├── Web Development Foundations
│   └── HTML, CSS, JavaScript (ES6+)
├── Frameworks & Libraries
│   ├── React (with Hooks)
│   ├── Next.js (SSR, SSG, Routing)
│   └── TailwindCSS (Utility-first CSS)
├── TypeScript Mastery
│   ├── Type-safe components
│   ├── Generics, Enums, Interfaces
│   └── Integration with APIs and libraries
├── Progressive Web Apps (PWA)
│   ├── Service Workers
│   ├── Offline Caching
│   └── Add to Home Screen (A2HS) support
├── API Integration
│   ├── REST APIs with Axios & React Query
│   └── GraphQL (experimental module)
├── System Design & Architecture
│   ├── Component-driven development
│   ├── Folder structuring and scalability
│   └── Performance optimization
Soft Skills & Professional Dev:
├── Git & GitHub Proficiency
├── Pair Programming
├── Agile Workflow with Trello & GitHub Projects
└── Collaboration via Discord & Standups

### Outcome

- Build scalable, performant, and accessible web apps with confidence.
- Collaborate effectively with backend teams using clean, documented APIs.
- Ship full-stack applications with real-world impact.

## Overview of the ProDev Backend Engineering Program

The **ProDev Backend Engineering** program provides learners with a solid foundation in designing, developing, and deploying scalable backend systems. Key areas include:

- Building RESTful APIs with Django and Django REST Framework
- Database modeling and optimization (PostgreSQL)
- Authentication and authorization systems (JWT)
- Testing and documentation of APIs
- Asynchronous tasks with Celery & Redis
- API security and rate limiting

Backend learners built robust endpoints for CarbonJar to support real-time carbon tracking and gamified eco-habit challenges.

---

## Project Objective

**CarbonJar** helps users track and gamify their carbon-reducing micro-actions like using public transport, skipping plastic, or reducing meat intake. Users can:

- Log eco-friendly actions
- Compete in green challenges
- Track progress on a live dashboard
- Use the app offline with full PWA support

---

## Key Technologies Covered

### Backend (ProDev Backend Learners)

- Django REST Framework
- JWT Authentication
- PostgreSQL
- WebSockets (for live challenge updates)
- Redis + Celery (for background leaderboard updates)

### Frontend (ProDev Frontend Learners)

- **Next.js** (React framework for SSR and SEO)
- **TypeScript** (type-safe and scalable)
- **TailwindCSS** (utility-first styling)
- **PWA Support** with `next-pwa` and `Workbox`
- **React Query (TanStack)** for fetching and caching
- **Chart.js** for visualizing carbon footprint data
- **System Design** principles for scalability and modularity
- **GraphQL (Experimental)** - Used in a side module for user stats aggregation (fallback to REST enabled)

---

## Important Frontend Concepts Applied

- **Progressive Web App Design**: Offline-first support with background sync
- **Component Reusability**: Design system using atomic UI components
- **Dynamic Routing**: Next.js file-based routing for scalable nav
- **API Integration**: Smooth REST interaction with React Query and error boundaries
- **State Management**: Global state with React Context + local IndexedDB fallback
- **Mobile Responsiveness**: TailwindCSS breakpoints for a fluid mobile-first experience

---

## Challenges Faced & Solutions Implemented

| Challenge | Solution |
|----------|----------|
| Integrating REST and offline-first logic | Used `service workers` to cache API responses and `IndexedDB` for storing logs offline |
| Handling real-time leaderboard updates | Integrated WebSockets on the frontend using `socket.io-client` to listen for backend pushes |
| PWA compatibility with Next.js | Leveraged `next-pwa` plugin and `Workbox` to cache assets and handle push notifications |
| UX design for eco-challenges | Created a minimalistic but interactive challenge board with celebratory feedback using Lottie animations |

---

## Best Practices and Takeaways

- **Design for Offline First**: The PWA architecture forced us to think about edge cases where the network is unreliable.
- **Frontend–Backend Alignment is Crucial**: Schema agreements and clear API documentation via Swagger accelerated integration.
- **Less is More in UI**: Simple interfaces increased usability and reduced support queries.
- **Reusable Code Saves Time**: Atomic design and component modularity made feature expansion easy.
- **Open Communication Rocks**: Collaborating over Discord (#ProDevProjectNexus) with backend learners was key to success.

---

### Project Repository

GitHub Repository: [`alx-project-nexus`](https://github.com/ianramy/alx-project-nexus)

---
