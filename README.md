# Sweety — Frontend

A small blood glucose tracker built with React 18 + Vite, react-router-dom v6, axios, and plain CSS.

## Run it

The backend must be running on port 5000.

```bash
# 1. Frontend folder (this repo)
cd "D:\builds\Sweety\Sweety frontend"

# 2. Install (React 18 + Router 6 are pinned)
npm install

# 3. Environment (already created, shown for a fresh clone)
copy .env.example .env

# 4. Start Vite
npm run dev
```

Open http://localhost:5173.

`.env` contains:

```text
VITE_API_URL=http://localhost:5000/api
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on port 5173 |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

## Structure

```text
src/
  api/          axios client + one function per endpoint
  components/   small presentational pieces (under ~80 lines)
  context/      AuthContext (token + user session)
  hooks/        useAuth, useReadings, useReport
  pages/        LoginPage, RegisterPage, DashboardPage
  styles/       global.css
  utils/        dates, slots, error parsing, form validation
```

Session storage uses only two localStorage keys: `sweety_token` and `sweety_user`.

## Integration notes

The UI follows the documented API contract: slot keys such as `after_lunch`, and reading ids
passed through as strings. Current integration testing found two backend-side mismatches:

1. `ReadingSlot` in Prisma is uppercase (`AFTER_LUNCH`), while the request validator accepts
   lowercase keys. `POST/PUT /readings` therefore fails Prisma validation with a 500.
2. Reading ids are UUIDs in Prisma, but the controller parses `req.params.id` with `Number()`.
   `PUT/DELETE /readings/:id` return `400 Invalid reading id.` for every real reading.

Fix those in the backend (map slot keys to the enum, and stop coercing ids to numbers) and the
frontend works without changes.
