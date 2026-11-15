# Sweety — Blood Glucose Tracker

A small, mobile-friendly blood glucose tracker. Log up to four readings a day and see daily,
month-to-date, and previous-month summaries plus a month-to-date trend chart.

> Sweety stores and summarises your readings. It does not give medical advice or insulin doses.

## Features

- Register and log in with a JWT-based session
- Add, edit, and delete readings for any date up to today
- Four time slots: Morning (fasting), After breakfast, After lunch, After dinner
- Daily, month-to-date, and previous-month reports
- Highest, lowest, average (1 decimal), and count for each period
- Month-to-date line chart with one line per time slot
- Friendly empty states and visible API validation errors
- Responsive layout: two columns on desktop, one column on mobile
- Keyboard-friendly forms with real labels and `role="alert"` errors

## Tech stack

- React 18.3.1 + Vite
- react-router-dom 6.30.1
- axios
- Recharts for the trend chart
- Plain CSS (no UI library)
- Express API on `http://localhost:5000/api`

## Getting started

Start the backend first, then the frontend.

```bash
# 1. Backend
cd "D:\builds\Sweety\Sweety backend"
npm install
npm run dev

# 2. Frontend (this repository)
cd "D:\builds\Sweety\Sweety frontend"
npm install

# 3. Environment
copy .env.example .env

# 4. Dev server
npm run dev
```

Open **http://localhost:5173**.

`.env.example`:

```text
VITE_API_URL=http://localhost:5000/api
```

Only `sweety_token` and `sweety_user` are kept in `localStorage`. Readings live in the backend
database.

### Run with Docker

The backend must be running on the host at `http://localhost:5000`.

```bash
docker compose up --build
```

Open **http://localhost:8080**. The container serves the production build with nginx, and
`/api` requests are proxied to `host.docker.internal:5000`.

Nginx serves the static build, adds caching/gzip, sends unknown paths to `index.html` so React
Router refreshes work, and proxies `/api` so the browser only talks to one origin. Vite is only
the development server; `vite preview` is fine for a quick check but is not a production server.

To run PostgreSQL, the API, and the web client together, use the Compose file in the repository
root (`D:\builds\Sweety\docker-compose.yml`). If local services are already using ports `5432`,
`5000`, and `5173`, stop them first or override the ports in the root `.env` and keep
`VITE_API_URL`/`CLIENT_URL` in sync.

Without Compose:

```bash
docker build -t sweety-web .
docker run --rm -p 8080:80 --add-host=host.docker.internal:host-gateway sweety-web
```

The image builds with `VITE_API_URL=/api`. If your backend is not on the Docker host, change the
`proxy_pass` target in `nginx.conf`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on port 5173 |
| `npm run build` | Production build in `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |
| `docker compose up --build` | Production container on port 8080 |

## How a reading is saved

The client checks these first:

| Case | Message |
| --- | --- |
| Empty value | `Please enter a glucose value.` |
| Not a whole number from 40 to 600 | `Value must be between 40 and 600 mg/dl.` |
| Future date | `Date cannot be in the future.` |

The server owns the remaining rules:

- One reading per time slot per date
- Maximum four readings per date

Those server messages are displayed in the same red error box, for example:

- `You already have an After lunch reading for this date.`
- `You can add only 4 readings per day.`

After a successful save the form clears, the red box disappears, and the list, all three
reports, and the chart refetch. Values such as 60, 90, and 120 are all valid; 60 is not special.

## How it works

1. `main.jsx` mounts `BrowserRouter` and `App`.
2. `AuthProvider` loads the saved token and user, then refreshes the user with `GET /auth/me`.
3. `axiosInstance` adds `Authorization: Bearer <token>` to every request. A `401` clears the
   session and redirects to `/login`.
4. `ProtectedRoute` sends signed-out visitors to `/login`; signed-in users opening `/login` or
   `/register` are sent to `/`.
5. `DashboardPage` holds the selected date and a refresh key. Changing either refetches the
   readings list, all three reports, and the chart range.
6. `useReadings`, `useReport`, and `useReadingsRange` ignore stale responses so a slow request
   cannot overwrite newer data.
7. `useReadingsRange` loads the selected month from the 1st through the selected date.
   `buildChartData` turns that into one row per day, with missing slots left as `null`.
8. Editing reuses `ReadingForm` with the selected reading as `initial`.
9. Deleting asks for confirmation with `window.confirm` before calling the API.
10. Dates are formatted manually from `YYYY-MM-DD` using `split('-')`, never
    `new Date('YYYY-MM-DD')`, so timezones cannot shift the day.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create an account (no token returned) |
| `POST` | `/auth/login` | Log in and receive a token |
| `GET` | `/auth/me` | Current user |
| `GET` | `/readings?date=YYYY-MM-DD` | Readings for a date |
| `GET` | `/readings/range?from=&to=` | Readings for the chart range |
| `POST` | `/readings` | Add a reading |
| `PUT` | `/readings/:id` | Update a reading |
| `DELETE` | `/readings/:id` | Delete a reading |
| `GET` | `/reports/daily?date=` | Daily report and readings |
| `GET` | `/reports/month-to-date?date=` | Month-to-date report |
| `GET` | `/reports/monthly?date=` | Previous month report |

The client sends lowercase slot keys: `morning_fasting`, `after_breakfast`, `after_lunch`,
`after_dinner`.

## Folder structure

```text
src/
  api/          axios instance + one function per endpoint
  components/   small UI pieces (protected route, form, list, cards, chart, feedback)
  context/      AuthContext (token, user, login, register, logout)
  hooks/        useAuth, useReadings, useReport, useReadingsRange
  pages/        LoginPage, RegisterPage, DashboardPage
  styles/       global.css
  utils/        errors, dates, slots, validation, chart data
  App.jsx
  main.jsx
Dockerfile
docker-compose.yml
nginx.conf
```

## Manual test checklist

- [ ] Register with a short name, bad email, and short password; each error appears
- [ ] Register successfully; `/login` shows “Account created, please log in”
- [ ] Log in with a wrong password; error box appears
- [ ] Log in successfully; the dashboard shows “Hi, <name>”
- [ ] Add a reading; the list, all three reports, and the chart update
- [ ] Submit an empty value
- [ ] Submit 700, 12.5, and 39
- [ ] Pick a future date
- [ ] Add the same slot twice for one date
- [ ] Add a fifth reading for one date
- [ ] Edit a reading; fields are prefilled, Cancel works, saving updates the list
- [ ] Delete a reading; confirmation appears, then the item disappears
- [ ] Change the date; readings, reports, and chart refetch
- [ ] Pick a date with no data; empty states appear
- [ ] A month with readings shows the trend chart with the matching slot lines
- [ ] A month with no readings shows the chart empty state
- [ ] Log out; `/login` appears and localStorage is cleared
- [ ] Open `/` while logged out; redirected to `/login`

## Troubleshooting

- **Blank page or network errors:** confirm the backend is running on port 5000 and `.env`
  contains `VITE_API_URL=http://localhost:5000/api`.
- **Immediately sent back to login:** the token expired or is invalid. Log in again.
- **A reading will not save:** check the red box. It is usually a duplicate slot or the
  four-readings-per-day limit.
- **The chart is empty:** it only plots the selected month up to the selected date. Add readings
  in that range or pick a different date.
- **Changes not visible:** restart `npm run dev`; Vite reads `.env` at startup.
