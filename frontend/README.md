# Missions frontend

React 19 + Vite + React Router + Tailwind CSS. Deploys to Vercel; talks to the
Django backend in [../backend](../backend) over the API documented there.

## Local setup

```bash
cd frontend
npm install
cp .env.example .env      # defaults to http://localhost:8000, the Django dev server
npm run dev
```

Runs at http://localhost:5173 by default. Run the Django backend alongside it
(`cd ../backend && python manage.py runserver`) — its `.env` already allows
`http://localhost:5173` as a CORS origin in `DEBUG` mode.

`npm run build` produces a production bundle in `dist/`; `npm run lint` runs
oxlint.

## Architecture

### Design tokens

[src/theme/tokens.js](src/theme/tokens.js) holds every color, font, spacing,
and radius value from the design exports (`DESIGN.md`) as one source of
truth. [tailwind.config.js](tailwind.config.js) imports it straight into
`theme.extend`, so components use utility classes like `bg-primary-container`
or `text-headline-lg` rather than hardcoded hex values or pixel sizes. When a
later page's zip brings its own `DESIGN.md`, merge its tokens into this file
rather than adding a second source.

### Routing

[src/App.jsx](src/App.jsx) defines the public routes (`/`, `/about`,
`/mission-mondays`, `/mission-mondays/:id`, `/gallery`, `/contact`,
`/get-involved`) plus a catch-all 404, all nested under
[Layout](src/components/layout/Layout.jsx) (persistent Navbar/Footer around
an `<Outlet />`). `/missions` still resolves — it redirects to
`/mission-mondays` for anyone with the old link bookmarked/indexed.
[PagePlaceholder](src/pages/PagePlaceholder.jsx) is no longer used by any
route but is kept around as the starting point for new pages.

"Mission Mondays" is a display-only rename of the `missions` feature: the
page file (`pages/Missions.jsx`), its component names, and the backend's
`missions` app/`Mission` model/`/api/missions/` path are all unchanged —
only the route path, nav labels, and on-page copy changed. See the comment
in `App.jsx` above the `Missions` import.

Outside `Layout` entirely, `/admin/login` and everything under `/admin`
(behind [ProtectedRoute](src/admin/ProtectedRoute.jsx)) make up the admin
portal — see below.

### Admin portal

`src/admin/` is a self-contained authenticated section for the client to
manage Gallery and Mission Monday content, kept deliberately separate from
`src/pages/` (no public Navbar/Footer, different data-mutation concerns).

| File | Purpose |
| --- | --- |
| [AuthContext.jsx](src/admin/AuthContext.jsx) | Holds the admin token/user in `sessionStorage` + React context; revalidates a stored token against `GET /api/auth/me/` on load |
| [ProtectedRoute.jsx](src/admin/ProtectedRoute.jsx) | Redirects to `/admin/login` when not authenticated |
| [AdminLayout.jsx](src/admin/AdminLayout.jsx) | Sidebar chrome for the whole `/admin/*` section |
| [components/PhotoUploader.jsx](src/admin/components/PhotoUploader.jsx) | Add/remove/reorder photos; uploads one file at a time so a slow request can't block the rest |
| [components/RichTextEditor.jsx](src/admin/components/RichTextEditor.jsx) | Tiptap, deliberately constrained to the tag set `core/sanitize.py` allow-lists on the backend — widen both together or not at all |
| [components/VideoUrlField.jsx](src/admin/components/VideoUrlField.jsx) | YouTube/Vimeo URL input with an inline embed preview (`utils/video.js`) |

A gallery entry or Mission Monday post is created with its text fields
first; the form then redirects into its own edit page, where the Photos
section (which needs a real id to attach photos to) appears. Rich text is
sanitized server-side before storage, then sanitized again client-side with
`dompurify` immediately before `dangerouslySetInnerHTML` on the public
detail page ([MissionMondayDetail.jsx](src/pages/MissionMondayDetail.jsx)) —
defense-in-depth, since that's the one field where admin input becomes live
HTML on a public page.

The admin token is stored in `sessionStorage`, not a cookie: it's sent as an
`Authorization: Token <token>` header (see `api/client.js`'s `apiUpload`/
`token` support), which needs no change to the backend's
`CORS_ALLOW_CREDENTIALS = False`. Cleared on tab close; still readable by
any script on the page if the admin bundle ever had an XSS bug, which is
why the rich text editor's allowed tags stay small.

### Shared components

| Component | Purpose |
| --- | --- |
| [Navbar](src/components/layout/Navbar.jsx) | Site header, active-link highlighting via `NavLink`, mobile drawer |
| [Footer](src/components/layout/Footer.jsx) | Site footer. Social icons are inert placeholders — no newsletter signup (out of v1 scope, no backend endpoint), real social URLs land in the Get Involved page's follow-up |
| [HeroSection](src/components/HeroSection.jsx) | Generic page hero: `eyebrow`, `title`, `subtitle`, `background`, `primaryCta`/`secondaryCta` (`{label, to, icon}`), and a `children` slot for page-specific content below the CTAs (e.g. a stats strip) |
| [ContactForm](src/components/ContactForm.jsx) | Name/email/message form. Takes an `onSubmit` function as a prop — pass `submitContact` or `submitGetInvolved` from `api/endpoints.js` to point it at either backend route. Renders field-level validation errors, a rate-limit message, and a success state itself. Field labels/placeholders and `successMessage` are all optional overrides (Get Involved uses these; Contact relies on the defaults) |
| [SafeImage](src/components/SafeImage.jsx) | Renders an `<img>`, or a layout-preserving placeholder box when `src` is `null` (every image until Cloudinary is configured on the backend — see backend/README.md) |
| [Icon](src/components/Icon.jsx) | Material Symbols Outlined wrapper — `<Icon name="volunteer_activism" />` |
| [Logo](src/components/Logo.jsx) | Text-badge wordmark. The reference design links to the design tool's own temporary preview CDN, which isn't safe to hotlink into a real app — swap this for an `<img>` once the client provides real brand assets |
| [CountyFilterPills](src/components/CountyFilterPills.jsx) | "All" + one pill per county, with counts. Pair with the `useCountyFilter` hook below. Used by Missions only (Gallery has no county field) |

Per-page-only components (e.g. `Missions/MissionCard`, `Gallery/GalleryCard`,
`GetInvolved/Pillars`) live under their page's own folder in `src/pages/`
rather than here — reserve `src/components/` for things genuinely shared
across multiple pages.

### County filtering (Missions, Gallery)

Both `Mission` and `GalleryImage` carry a free-text `county` field on the
backend (not a fixed enum — see backend/README.md). The frontend never
hardcodes a list of counties: [useCountyFilter](src/hooks/useCountyFilter.js)
derives the filter pills from whatever counties actually appear in the
fetched rows, so publishing a mission or photo in a new county just makes a
new pill appear, no code change on either side.

```js
const { data } = useFetch(() => getMissions());
const { items, counties, countyCounts, selectedCounty, setSelectedCounty, filteredItems } =
  useCountyFilter(data);
```

Render `<CountyFilterPills counties={counties} countyCounts={countyCounts} totalCount={items.length} selectedCounty={selectedCounty} onSelect={setSelectedCounty} />`
and map over `filteredItems` instead of the raw list.

### API client

[src/api/client.js](src/api/client.js) wraps `fetch` and classifies every
failure into an `ApiError` with a `kind`:

| `kind` | When | Relevant fields |
| --- | --- | --- |
| `not_found` | 404 | — |
| `rate_limited` | 429 | `retryAfter` (seconds, from the `Retry-After` header, or `null`) |
| `validation` | 400 | `fieldErrors` — DRF's `{field: ["message"]}` shape |
| `server` | any other non-2xx | `status` |
| `network` | `fetch` itself threw (offline, DNS, CORS) | — |

[src/api/endpoints.js](src/api/endpoints.js) exposes one function per public
route (`getSiteContent`, `getMissions`, `getMission`, `getGalleryImages`,
`getInvolvedLinks`, `submitContact`, `submitGetInvolved`) plus the admin
portal's auth (`login`, `logout`, `getMe`) and CRUD functions (`getAdminMissions`,
`createMission`, `updateMission`, `deleteMission`, `toggleMissionPublish`,
`addMissionPhoto`/`reorderMissionPhoto`/`deleteMissionPhoto`, and the
equivalent `*GalleryEntry`/`*GalleryPhoto` set) — pages should call these,
not `fetch` or `client.js` directly. Admin functions take a `token` as their
last argument (from `useAuth()`), sent as an `Authorization` header via
`client.js`'s `apiPatch`/`apiDelete`/`apiUpload` helpers.

[src/hooks/useFetch.js](src/hooks/useFetch.js) is a small hook for GET
endpoints: `const { data, error, loading, reload } = useFetch(() =>
getMissions())`. Render on `error.kind` to reuse the same not-found /
rate-limited / server / network handling on every page — used throughout
Home, About, Missions, Gallery, and Get Involved.

`ContactForm` doesn't use `useFetch` (that hook is GET-oriented); it manages
its own submit/loading/error state and expects an async `onSubmit` prop.

### Environment variables

| Variable | Default | Notes |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | No trailing slash. Set to the Render URL in Vercel's project settings for deployed environments |

## Known gaps

- **All 6 pages are now built.** Home, About, Missions, Gallery, Contact, and
  Get Involved all have real content.
- **Contact page's office phone, public email, and hours are still TBC.**
  [RegionalInfo](src/pages/Contact/RegionalInfo.jsx) shows the confirmed real
  address (Glorious Photography Pictures, Buruburu, Nairobi) and an honest
  "on the way" note for the rest, rather than the reference design's invented
  phone/email/named regional contacts. Fill in `PHONE`/`EMAIL`/`HOURS` in that
  file once the org has them.
- **Get Involved's hero treatment needs a decision.** [GetInvolved/Hero.jsx](src/pages/GetInvolved/Hero.jsx)
  currently keeps the reference's distinct solid-green diagonal-polygon
  band — deliberately different from every other page's hero (photo+scrim on
  Home, plain gradient elsewhere). Flagged for review, not decided silently;
  say the word to simplify it to match the other pages instead.
- Footer's social icons are still static placeholders (not wired to
  `GetInvolvedLink`'s `social` rows, even though the Get Involved page's own
  Community Channels section now is) — a separate follow-up, not done
  automatically by building the page. No newsletter signup exists on the
  site at all — out of v1 scope, and there's no backend endpoint for it.
- No CAPTCHA on `ContactForm`/the Get Involved form (flagged as a backend
  gap; not a frontend task yet).
- No real logo or hero photography anywhere on the site — `Logo` renders a
  text badge, and every photo is a `SafeImage` placeholder (`src={null}`)
  until Cloudinary is configured and the client uploads real images. Add
  brand assets under `src/assets/` once provided.
