# Rosen Experts Design System

## Overview

This document describes the design system for the Rosen Experts marketing website. The system is built on Tailwind CSS v4 with custom components in `src/ui/` and global styles in `globals.css`.

## Tech Stack

- **Framework**: Next.js 16.1.0 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **TTS**: Amazon Polly (Matthew Neural) via API server

## Brand Colors

```css
/* Primary - Deep Teal */
--color-primary: #1a5f7a;

/* Secondary - Trust Green */
--color-secondary: #2c8a6e;

/* Backgrounds */
--color-bg-light: #f9fafb;     /* gray-50 */
--color-bg-accent: #e8f5f0;    /* light green tint */

/* Text */
--color-text-primary: #111827;  /* gray-900 */
--color-text-secondary: #4b5563; /* gray-600 */
```

## Typography

- **Headings**: System font stack (Inter fallback), Bold weight
- **Body**: System font stack, Regular weight
- **Scale**:
  - H1: `text-4xl md:text-5xl` (36px / 48px)
  - H2: `text-3xl md:text-4xl` (30px / 36px)
  - H3: `text-xl` or `text-2xl`
  - Body: `text-base` or `text-lg`
  - Small: `text-sm`

## Global CSS Classes

Located in `src/app/globals.css`:

### Layout
- `.container` - Max-width responsive container with auto margins
- `.section-padding` - Consistent vertical padding for sections (`py-16 lg:py-24`)

### Buttons
- `.btn-primary` - Primary CTA button (white on teal)
- `.btn-secondary` - Secondary button (teal on white border)
- `.btn-white` - White button for dark backgrounds
- `.btn-outline-white` - White outline for dark backgrounds

### Cards
- `.card` - Standard content card (white, rounded, shadow, border, padding)

### Badges
- `.badge` - Small pill-style badge

### Step Numbers
- `.step-number` - Circular numbered step indicator

### Hero
- `.gradient-hero` - Gradient background for hero sections

## UI Components (`src/ui/`)

### Layout Components

#### Container
```tsx
import { Container } from "@/ui";
<Container>Content here</Container>
<Container size="sm">Narrow content</Container>
```

#### Section
```tsx
import { Section } from "@/ui";
<Section>Default section</Section>
<Section variant="gray">Gray background</Section>
<Section variant="hero">Gradient hero</Section>
```

### Interactive Components

#### Accordion
```tsx
import { Accordion, AccordionItem, AccordionGroup } from "@/ui";

// Individual items
<Accordion>
  <AccordionItem title="Question 1">Answer 1</AccordionItem>
  <AccordionItem title="Question 2">Answer 2</AccordionItem>
</Accordion>

// Grouped with title
<AccordionGroup
  title="FAQ Category"
  items={[
    { question: "Q1", answer: "A1" },
    { question: "Q2", answer: "A2" },
  ]}
/>
```

#### Button
```tsx
import { Button } from "@/ui";
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button href="/page">Link Button</Button>
```

### Content Components

#### Card
```tsx
import { Card } from "@/ui";
<Card>Default card</Card>
<Card variant="highlight">Highlighted card</Card>
<Card variant="interactive" href="/page">Clickable card</Card>
```

#### Badge
```tsx
import { Badge } from "@/ui";
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="info">Info</Badge>
```

#### Stat
```tsx
import { Stat } from "@/ui";
<Stat value="1,000+" label="Happy Clients" />
```

#### Stepper
```tsx
import { Stepper, Step } from "@/ui";
<Stepper>
  <Step number={1} title="Submit" description="Upload records" />
  <Step number={2} title="Review" description="Free analysis" />
  <Step number={3} title="Receive" description="Get your letter" />
</Stepper>
```

#### Callout
```tsx
import { Callout } from "@/ui";
<Callout variant="info">Important information</Callout>
<Callout variant="success">Success message</Callout>
<Callout variant="warning">Warning message</Callout>
```

#### FeatureList
```tsx
import { FeatureList } from "@/ui";
<FeatureList
  items={[
    "Feature one",
    "Feature two",
    "Feature three",
  ]}
/>
```

#### PricingCard
```tsx
import { PricingCard } from "@/ui";
<PricingCard
  title="Standard Letter"
  price="$1,000"
  priceNote="starting at"
  features={["Feature 1", "Feature 2"]}
  ctaText="Get Started"
  ctaHref="/start/"
/>
```

### Utility Components

#### ListenButton
```tsx
import { PageListenButton } from "@/ui/ListenButton";
<PageListenButton pageText="Text to read aloud" />
```
Uses Amazon Polly (Matthew Neural) via `/api/tts` endpoint.

#### TurnstileWidget
```tsx
import TurnstileWidget from "@/ui/TurnstileWidget";
<TurnstileWidget onVerify={(token) => setToken(token)} />
```
Cloudflare Turnstile anti-bot protection.

## Page Structure

Standard page layout:
```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero section */}
        <section className="gradient-hero pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="container mx-auto">
            {/* Hero content */}
          </div>
        </section>

        {/* Content sections */}
        <section className="section-padding">
          <div className="container mx-auto">
            {/* Section content */}
          </div>
        </section>

        {/* Alternating background */}
        <section className="section-padding bg-gray-50">
          {/* ... */}
        </section>

        {/* Bottom CTA */}
        <section className="gradient-hero section-padding">
          {/* CTA content */}
        </section>
      </main>
      <Footer />
    </>
  );
}
```

## Accessibility

- All interactive elements have visible focus states
- Icons include `aria-hidden="true"` when decorative
- Buttons and links have descriptive text
- Color contrast meets WCAG 2.1 AA standards
- Accordion components use proper `aria-expanded` attributes
- Skip link available: `#main-content`

## Animation Guidelines

- Use Framer Motion for complex animations
- Keep transitions subtle: 200-300ms duration
- Prefer `ease-out` or `ease-in-out` easing
- Accordion animations: height + opacity with 200ms duration
- Avoid animations that trigger motion sickness

## Responsive Breakpoints

Tailwind default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Common patterns:
- Mobile-first approach
- Stack to grid: `flex flex-col md:flex-row`
- Typography scaling: `text-3xl md:text-4xl`
- Spacing scaling: `py-16 lg:py-24`

## File Organization

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── [pages]/             # Route pages
├── components/
│   ├── Header.tsx           # Site header
│   ├── Footer.tsx           # Site footer
│   └── [other]/             # Page-specific components
└── ui/
    ├── index.ts             # Component exports
    ├── Accordion.tsx
    ├── Badge.tsx
    ├── Button.tsx
    ├── Callout.tsx
    ├── Card.tsx
    ├── Container.tsx
    ├── FeatureList.tsx
    ├── ListenButton.tsx
    ├── PricingCard.tsx
    ├── Section.tsx
    ├── Stat.tsx
    ├── Stepper.tsx
    └── TurnstileWidget.tsx
```

## Adding New Components

1. Create component file in `src/ui/ComponentName.tsx`
2. Add `"use client"` directive if component uses hooks/browser APIs
3. Export from `src/ui/index.ts`
4. Document usage in this file

## Copy Guidelines

When writing content:
- Use "physician-led review team" not "AI" or "licensed physicians review"
- Final letters are always "physician-authored"
- Include $1 card authorization messaging where relevant
- Standard delivery: "up to 7 business days"
- Expedited delivery: "48-72 hours" for "$400"
- Determinations: "typically within hours" or "up to one business day"
- Never promise "same-day" anything
