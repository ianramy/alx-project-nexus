# ProDev CarbonJar Backend

Welcome to the backend of the **CarbonJar** app — a Django + DRF-powered API for tracking eco-friendly actions, user impact, leaderboard scores, and more.

---

## Project Features

- **CustomUser** model with extended profile and location data
- Track eco-friendly **actions** and earn points
- Scoreboards per **challenge**
- User **notifications**
- Location hierarchy: **Continents → Countries → Cities**
- Auto-generated **Swagger UI** with [drf-spectacular](https://drf-spectacular.readthedocs.io/)
- Modular seeders for quick local setup

---

## Folder Structure

```bash
server/
├── apps/
│   ├── users/          # Custom user model & auth views
│   ├── actions/        # Eco actions per user
│   ├── challenges/     # Weekly/monthly challenges
│   ├── leaderboard/    # User scores per challenge
│   ├── notifications/  # System notifications
│   ├── location/       # Continent → Country → City models & APIs
│   ├── location/       # Continent → Country → City models & APIs
│   ├── location/       # Continent → Country → City models & APIs
│   ├── location/       # Continent → Country → City models & APIs
│   ├── location/       # Continent → Country → City models & APIs
│   ├── location/       # Continent → Country → City models & APIs
│   ├── location/       # Continent → Country → City models & APIs
│
├── management/               # Seeder scripts (run individually or in bulk)
├── seed/               # Seeder scripts (run individually or in bulk)
├── settings/               # Seeder scripts (run individually or in bulk)
│
├── __init__.py             # API routing
├── asgi.py             # API routing
├── urls.py             # API routing
└── wsgi.py             # API routing
```
