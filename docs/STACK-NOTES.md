# Rosen Experts Marketing App - Stack & Architecture Notes

## Stack Overview

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.0 | React framework with App Router |
| React | 19.2.3 | UI library |
| Tailwind CSS | 4.0 | Utility-first CSS framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Stripe | 8.6.1 | Payment processing |

## Directory Structure

```
apps/marketing/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Home (/)
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Design system + Tailwind
│   │   ├── c/                   # Client Center routes
│   │   │   ├── status/         # Case status
│   │   │   ├── verify/         # Email verification
│   │   │   ├── upload/         # Document upload
│   │   │   ├── letter/         # Letter delivery
│   │   │   ├── payment/        # Payment flow
│   │   │   ├── card/           # Card collection
│   │   │   └── statement/      # Statement view
│   │   ├── contact/            # Contact page
│   │   ├── faq/                # FAQ page
│   │   ├── how-it-works/       # Process explanation
│   │   ├── pay/                # Payment pages
│   │   ├── pricing/            # Pricing page
│   │   ├── privacy/            # Privacy policy
│   │   ├── samples/            # Sample letters
│   │   ├── services/           # Service pages
│   │   │   ├── va-disability/
│   │   │   ├── ssdi/
│   │   │   ├── insurance-denial/
│   │   │   ├── medical-malpractice/
│   │   │   └── second-opinion/
│   │   ├── start/              # Intake start
│   │   └── terms/              # Terms of service
│   ├── components/             # Shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustStrip.tsx
│   │   ├── ProcessSteps.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── AccessibilityPanel.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── JsonLd.tsx
│   │   ├── Alert.tsx
│   │   └── FileCard.tsx
│   └── i18n/                   # Internationalization
│       ├── index.ts
│       ├── LanguageContext.tsx
│       └── translations.ts
└── public/
    ├── brand/
    │   └── logo.png
    ├── robots.txt
    └── sitemap.xml
```

## Styling Architecture

### CSS Variables (globals.css)

The design system uses CSS custom properties for theming:

```css
:root {
  /* Primary Colors - Calm Teal */
  --color-primary: #1a5f7a;
  --color-primary-dark: #134a5f;
  --color-primary-light: #e8f4f8;

  /* Accent - Sage Green for Trust */
  --color-accent: #2c8a6e;
  --color-accent-dark: #1e6b55;
  --color-accent-light: #e8f5f0;

  /* Neutrals */
  --color-text: #1a1a2e;
  --color-text-secondary: #4a5568;
  --color-text-muted: #718096;

  /* Shadows, focus rings, animations... */
}
```

### Existing CSS Classes

| Class | Purpose |
|-------|---------|
| `.gradient-hero` | Dark gradient for hero sections |
| `.gradient-hero-elevated` | Enhanced hero with texture |
| `.btn-primary` | Primary CTA button |
| `.btn-secondary` | Secondary button |
| `.btn-ghost` | Ghost/text button |
| `.btn-white` | White button for dark backgrounds |
| `.btn-outline-white` | Outlined white button |
| `.card` | Standard card container |
| `.card-hover` | Card with hover effects |
| `.card-determination` | Emphasized determination card |
| `.service-card` | Service listing card |
| `.step-number` | Numbered step indicator |
| `.icon-box` | Icon container |
| `.badge` | Small badge/tag |
| `.section-padding` | Consistent section spacing |
| `.container` | Max-width container |

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page - main landing |
| `/start?service=TYPE` | Intake flow entry |
| `/how-it-works/` | Process explanation |
| `/pricing/` | Pricing information |
| `/services/` | Services overview |
| `/services/va-disability/` | VA nexus letters |
| `/services/ssdi/` | SSDI claims |
| `/services/insurance-denial/` | Insurance appeals |
| `/services/medical-malpractice/` | Malpractice review |
| `/services/second-opinion/` | Second opinions |
| `/samples/` | Sample letters |
| `/faq/` | Frequently asked questions |
| `/contact/` | Contact information |
| `/c/*` | Client Center (authenticated) |

## Development Commands

```bash
# Development server (port 3005)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Notes for Implementation

1. **App Router**: Uses Next.js 16 App Router, not Pages Router
2. **Server Components**: Default, use "use client" for interactive components
3. **Tailwind v4**: Uses new `@import "tailwindcss"` syntax
4. **No framer-motion yet**: Needs to be installed for animations
5. **No icon library yet**: Uses inline SVG, consider lucide-react
6. **Existing i18n**: Has language toggle infrastructure

## Guardrails

- Do not break existing routes
- Keep performance high (no heavy assets)
- Maintain accessibility standards (WCAG 2.1 AA)
- Preserve existing copy constraints
