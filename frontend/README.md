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

[src/App.jsx](src/App.jsx) defines the six routes (`/`, `/about`,
`/missions`, `/gallery`, `/contact`, `/get-involved`) plus a catch-all 404,
all nested under [Layout](src/components/layout/Layout.jsx) (persistent
Navbar/Footer around an `<Outlet />`). All six now have real content;
[PagePlaceholder](src/pages/PagePlaceholder.jsx) is no longer used by any
route but is kept around as the starting point for new pages.

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
| [CountyFilterPills](src/components/CountyFilterPills.jsx) | "All" + one pill per county, with counts. Pair with the `useCountyFilter` hook below. Used by Missions and Gallery |

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

[src/api/endpoints.js](src/api/endpoints.js) exposes one function per route
(`getSiteContent`, `getMissions`, `getGalleryImages`, `getInvolvedLinks`,
`submitContact`, `submitGetInvolved`) — pages should call these, not `fetch`
or `client.js` directly.

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
