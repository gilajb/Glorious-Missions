# Glorious Missions

Monorepo for the Missions website.

```
.
├── backend/          Django + DRF API (deployed to Render)
├── frontend/         React + Vite + Tailwind client (deploys to Vercel)
├── render.yaml       Render Blueprint; builds from backend/ via `rootDir`
└── .gitignore        Covers both Python and Node
```

## Backend

Django 5.2 + Django REST Framework, PostgreSQL, Cloudinary for media.
See [backend/README.md](backend/README.md) for setup, environment variables
and deployment.

Quick start:

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate          # Windows;  source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Frontend

React 19 + Vite + React Router + Tailwind CSS. Routing, shared layout
(Navbar/Footer), a design-token theme, and a shared API client with 404/429/400
error handling are in place; per-page content is built page by page. See
[frontend/README.md](frontend/README.md) for architecture and setup.

Quick start:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs at http://localhost:5173. The backend's local `.env` already allows that
origin via `CORS_ALLOWED_ORIGINS`'s `DEBUG` fallback; when deploying the
frontend to Vercel, add its real origin to that variable on Render.
