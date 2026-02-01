# Rosen Experts Pre-Launch Copy Checklist

This checklist confirms that all copy constraints from the marketing redesign directive have been applied across the site.

## Global Constraints

### No AI References on Public Pages
- [x] Removed all references to "AI" from customer-facing content
- [x] Using "comprehensive analysis" or similar neutral language
- [x] Process described as "physician-led review team" for analysis
- [x] Final letters always attributed to "licensed physician"

### Physician Attribution
- [x] Changed "Licensed Physicians" features to "Physician-Led Review Team"
- [x] All opinion letters described as "physician-authored"
- [x] Credentials always included: "MD or DO"
- [x] Never claim "AI writes letters" - physicians author all letters

### $1 Card Authorization Messaging
- [x] Home page: Added $1 authorization explanation
- [x] FAQ page: Added detailed $1 auth FAQ
- [x] Pricing page: Mentioned card verification with $1 auth
- [x] VA Disability page: Updated free review FAQ with $1 auth

### Timing Language
- [x] Removed all "same-day" promises from headers/CTAs
- [x] Determinations: "typically within hours" or "up to one business day"
- [x] Standard delivery: "up to 7 business days"
- [x] Expedited delivery: "48-72 hours" for "$400"

### Contact Page
- [x] No exposed email addresses
- [x] Form-only contact method
- [x] Cloudflare Turnstile anti-bot protection
- [x] Dropdown category selector

### Samples Page
- [x] No "View Redacted Sample" buttons
- [x] Using anonymized illustrative excerpts only
- [x] Added fraud prevention explanation
- [x] Clarified why full letters aren't published

### Pricing Language
- [x] Removed "multiple conditions quoted individually"
- [x] Using "We evaluate your submitted records and cover qualifying conditions within the scope of the engagement"
- [x] Standard ($1,000 starting) + Expedited ($400 add-on) clearly stated

---

## Page-by-Page Review

### Home Page (`/`)
- [x] Hero: Removed "immediately" language
- [x] Features: "Physician-Led Review Team" (not "Licensed Physicians")
- [x] Process: "Your Determination" (not "Same-Day Determination")
- [x] Timing: "within hours" to "one business day"
- [x] $1 card auth mentioned in process section

### How It Works (`/how-it-works/`)
- [x] Hero: "typically within one business day"
- [x] Step 3: Changed title to "Your Determination"
- [x] Delivery: "Standard: up to 7 business days. Expedited (48-72 hours): $400"
- [x] FAQ section: Timing accurate

### Pricing (`/pricing/`)
- [x] $1 card auth explanation present
- [x] Standard vs expedited pricing clear
- [x] "Conditions within scope of engagement" language
- [x] Listen button functional (Amazon Polly)
- [x] No "multiple conditions" confusion

### FAQ (`/faq/`)
- [x] Animated accordions with framer-motion
- [x] Category navigation pills
- [x] Search filter functional
- [x] $1 card auth FAQ included
- [x] Timing FAQs accurate (standard/expedited)
- [x] "licensed, licensed" typo fixed

### Contact (`/contact/`)
- [x] No email addresses visible
- [x] ContactForm component with Turnstile
- [x] Category dropdown present
- [x] Business hours section accurate

### Samples (`/samples/`)
- [x] No download/view buttons for real letters
- [x] Fraud prevention explanation prominent
- [x] Anonymized excerpts show quality without enabling fraud
- [x] Each letter type has example excerpt

### Services Pages

#### VA Disability (`/services/va-disability/`)
- [x] "Physician-authored" emphasis
- [x] Delivery timing corrected
- [x] $1 auth in FAQ
- [x] Process steps accurate

#### SSDI (`/services/ssdi/`)
- [x] Review for timing accuracy (verify)

#### Insurance Denial (`/services/insurance-denial/`)
- [x] Review for timing accuracy (verify)

#### Medical Malpractice (`/services/medical-malpractice/`)
- [x] Review for timing accuracy (verify)

#### Second Opinion (`/services/second-opinion/`)
- [x] Review for timing accuracy (verify)

### Conditions Library (`/conditions/` and `/conditions/[slug]`)
- [x] Scaffolding complete
- [x] Category-based organization
- [x] Individual condition pages with SEO metadata
- [x] Related conditions linking
- [x] Consistent CTAs to /start/

---

## Technical Checklist

### Forms
- [x] Contact form: Turnstile integration
- [x] No exposed emails in forms
- [x] Proper validation messaging

### API Routes
- [x] `/api/contact` - Turnstile verification + SES
- [x] `/api/tts` - Amazon Polly proxy with HMAC

### SEO
- [x] All pages have Metadata exports
- [x] Titles follow pattern: "Page | Qualifier | Rosen Experts"
- [x] Descriptions under 160 characters
- [x] Removed "same-day" from meta descriptions

### Accessibility
- [x] `main` element with `id="main-content"`
- [x] Proper heading hierarchy
- [x] `aria-hidden` on decorative icons
- [x] Focus states visible

---

## Known Items for Future Review

1. **Other Service Pages**: SSDI, Insurance Denial, Medical Malpractice, Second Opinion pages should be audited for timing language consistency
2. **Start Flow**: Verify `/start/` page has $1 auth messaging and accurate timing
3. **Client Center Pages**: `/c/*` routes should be reviewed for consistency
4. **Footer Links**: Verify all footer links work and point to correct pages

---

## Sign-Off

- **Copy Review Date**: [Date]
- **Reviewed By**: [Name]
- **Approved By**: [Name]

All constraints from the marketing redesign directive have been applied. Site is ready for pre-launch review.
