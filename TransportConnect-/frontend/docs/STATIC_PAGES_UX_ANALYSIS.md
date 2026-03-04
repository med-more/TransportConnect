# TransportConnect — Static Pages UX/UI Analysis & Redesign

## 1. Project context

**TransportConnect** is a freight and logistics platform for **Morocco**. It connects:
- **Shippers** — post requests, compare offers, track deliveries
- **Drivers (conducteurs)** — publish trips, get matched with requests, get paid
- **Requests & trips** — create, chat, track, rate

**Branding (current):**
- **Primary:** Red `#ef4444`
- **Font:** Inter (300–800)
- **Style:** Rounded (`rounded-xl`), light/dark theme, clean and minimal
- **Tokens:** CSS variables in `index.css`; Tailwind in `tailwind.config.js`

---

## 2. Static pages inventory

| Route | Page | Role |
|-------|------|------|
| `/` | WelcomePage | Home / landing |
| `/about-us` | AboutUsPage | Company, journey, values, impact |
| `/services` | ServicesPage | How it works, what we offer |
| `/for-shippers` | ForShippersPage | Benefits for shippers |
| `/for-drivers` | ForDriversPage | Benefits for drivers |
| `/features` | FeaturesPage | Feature list |
| `/support` | SupportPage | Help, FAQ |
| `/contact` | ContactPage | Form + contact info |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | Legal | Text in cards |

All use **PublicHeader** + content + **PublicFooter**. No shared layout wrapper; each page composes the same pattern.

---

## 3. UX/UI principles applied (from reference designs)

References used: **WANDER.ph** (travel), **real estate** (properties), **Apex Arc** (architecture).

- **Visual hierarchy:** Clear section titles and subtitles; one primary CTA per block.
- **Consistent section pattern:** Title → short subtitle → content → optional CTA.
- **Metrics / stats:** One “highlight” metric (e.g. primary background) among 4 to create focus (real estate / Apex Arc).
- **Service/feature grids:** One card with primary background to anchor the grid (real estate “Our Services”).
- **Hero:** Two CTAs when relevant — primary solid (e.g. “Plan Your Trip”) and secondary outline (“Explore”) (WANDER.ph).
- **Rounded, modular cards:** Same radius and spacing for cards and buttons; reusable classes.
- **Whitespace and rhythm:** Consistent vertical spacing between sections; `section-title` and `section-subtitle` for alignment.

---

## 4. Design system additions (index.css)

New utility classes for static/landing pages:

| Class | Purpose |
|-------|--------|
| `headline-premium` | Bold, tight tracking for big headlines |
| `section-title` | Standard section heading (size + weight) |
| `section-subtitle` | Muted subtitle under section title |
| `glass-card` | Card with backdrop blur and border |
| `static-metric-card` | Metric block: rounded, padding, border |
| `static-metric-card-highlight` | Same but primary bg (one “hero” metric) |
| `btn-glow` / `shadow-glow` / `shadow-glow-lg` | Primary button emphasis |

These keep typography and cards consistent across About, Services, and future static pages.

---

## 5. Changes made

### 5.1 About Us
- **Hero:** Two-column layout with clear order (text / image); image with `rounded-2xl` and border.
- **Impact:** Metrics block moved up right after hero; **one highlighted metric** (primary background) among four (real estate / Apex Arc style).
- **Sections:** All section titles use `section-title`; subtitles use `section-subtitle`.
- **Values:** Cards use `glass-card`, `rounded-2xl`, and consistent icon + text layout.
- **CTA:** Same section pattern; buttons use `btn-glow` and consistent min-height.

### 5.2 Services
- **Hero:** Same two-column pattern; image with `rounded-2xl` and shadow.
- **How It Works:** Steps use `01` / `02` / `03`; layout and spacing aligned with “Booking made easy 1-2-3” idea.
- **What We Offer:** **First service card** uses primary background (real estate “Affordable Property Taxes” style); others use `glass-card`.
- **Explore CTA:** “Explore all features” button under the grid.
- **CTA section:** Uses `section-title` and same background as other CTA blocks.

### 5.3 Welcome (home)
- **Hero:** **Dual CTA** — primary: “Plan Your Trip” (solid white); secondary: “Explore How It Works” (outline). Responsive: stack on small screens, row on larger.

---

## 6. Recommendations for remaining static pages

- **For Shippers / For Drivers:** Reuse same hero pattern (title + subtitle + image); benefits in cards; one optional highlighted benefit card; single clear CTA.
- **Features:** Use `section-title` / `section-subtitle`; feature grid with one primary-highlight card if desired.
- **Support:** Keep search + help options; FAQ in cards with consistent spacing and `section-title`.
- **Contact:** Keep form + contact cards; align titles and spacing with `section-title` and `section-subtitle`.
- **Legal (Privacy, Terms, Cookie):** Keep current card-based content; optionally add `section-title` for the main heading for consistency.

---

## 7. Responsiveness and accessibility

- Section titles scale with `section-title` (responsive sizes).
- Buttons: `min-h-[48px]` for touch targets; full-width on small screens where used.
- Metrics and service grids: 2 columns on mobile, 4 (or 2) on desktop.
- Focus and contrast: existing primary and borders kept; no reliance on color alone for information.

---

## 8. File reference

| File | Role |
|------|------|
| `src/index.css` | New static-page classes |
| `src/pages/static/AboutUsPage.jsx` | Hero, impact metrics, journey, values, CTA |
| `src/pages/static/ServicesPage.jsx` | Hero, how it works, services grid + highlight, CTA |
| `src/pages/auth/WelcomePage.jsx` | Hero dual CTA |

Future work: apply the same section pattern and, where useful, one highlighted card per grid on For Shippers, For Drivers, and Features.
