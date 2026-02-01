# F4 Content Audit - Rosen Experts Marketing Site
**Audit Date:** 2026-01-10
**Auditor:** Claude (Assistant Developer)

---

## Page Inventory

### 1. Homepage (/)
- **Title:** "Free Medical Records Review | Same-Day Determination | Rosen Experts"
- **H1:** "Get a Real Answer About Your Case Before You Spend a Dime."
- **Primary CTA:** "Start Your Free Review"
- **Claims:** 2,500+ cases, Same Day, $0 to qualify, 48-72 hours
- **Status:** ✅ COMPLIANT (F3 rebuild complete)

### 2. Start Form (/start)
- **Title:** "Free Medical Records Review | Same-Day Determination | Rosen Experts"
- **H1:** "Start Your Nexus Letter Request"
- **Primary CTA:** "Start Free Review"
- **Claims:** None numerical
- **Status:** ✅ COMPLIANT

### 3. Nexus Letters (/services/nexus-letters)
- **Title:** Same as homepage (needs unique title)
- **H1:** "Get a Real Answer About Your Case Before You Spend a Dime."
- **Primary CTA:** "Start Your Free Review"
- **Claims:** 2,500+, Same Day, $0, 48-72 hours
- **Status:** ⚠️ REDIRECT to homepage - needs dedicated page

### 4. VA Disability (/services/va-disability)
- **Title:** Unique (✅)
- **H1:** "VA Nexus Letters from Board-Certified Physicians"
- **Primary CTA:** "Start Free Medical Records Review"
- **Status:** 🔴 VIOLATION - "board-certified" in H1 and body text

### 5. SSDI Support (/services/ssdi)
- **Title:** Unique (✅)
- **Primary CTA:** "Start Free Medical Records Review"
- **Status:** 🔴 VIOLATION - "board-certified" in description and body

### 6. Insurance Denial (/services/insurance-denial)
- **Title:** "Insurance Denial Appeals | Independent Medical Opinions | Rosen Experts"
- **H1:** "Your Insurance Claim Was Denied. Now What?"
- **Primary CTA:** "Start Free Medical Records Review"
- **Claims:** None numerical
- **Status:** 🔴 VIOLATION - "board-certified" in body text

### 7. Medical Malpractice (/services/medical-malpractice)
- **Title:** Unique
- **Status:** 🔴 VIOLATION - "board-certified" in multiple places

### 8. Second Opinion (/services/second-opinion)
- **Title:** Unique
- **H1:** "Get a Second Opinion from a Board-Certified Physician"
- **Status:** 🔴 VIOLATION - "board-certified" in H1 and body

### 9. Services Index (/services)
- **Status:** 🔴 VIOLATION - "Board-Certified Physicians" feature card

### 10. How It Works (/how-it-works)
- **Title:** "How It Works | Free Medical Records Review Process | Rosen Experts"
- **H1:** "How Your Free Medical Review Works"
- **Primary CTA:** "Start Free Medical Records Review"
- **Claims:** 5-10 minutes, Same-day, 48-72 hours, $0
- **Status:** ✅ COMPLIANT

### 11. FAQ (/faq)
- **Title:** "FAQ | Free Medical Review & Physician Opinions | Rosen Experts"
- **H1:** "Frequently Asked Questions"
- **Primary CTA:** "Start Free Medical Records Review"
- **Claims:** $1,000 starting price, Same Day, 48-72 hours
- **Status:** ✅ COMPLIANT (price verified)

### 12. Pricing (/pricing)
- **Title:** "Pricing | Free Medical Review + Physician Opinion Letters | Rosen Experts"
- **H1:** "Free Review First. Pay Only If You Proceed."
- **Primary CTA:** "Start Free Medical Records Review"
- **Claims:** $0 review, $1,000 starting price
- **Status:** ✅ COMPLIANT

### 13. Contact (/contact)
- **Title:** "Contact Us | Rosen Experts | Medical Opinion Letters"
- **H1:** "Questions? We're Here to Help."
- **Primary CTA:** "Start Free Medical Records Review"
- **Status:** ✅ COMPLIANT

### 14. About (/about)
- **Status:** ⚠️ REDIRECT to homepage - no dedicated about page

### 15. Blog (/blog)
- **Status:** ⚠️ REDIRECT to homepage - no dedicated blog page

---

## Banned Phrase Scan Results

| Phrase | Found | Location | Action |
|--------|-------|----------|--------|
| Em dash (—) | ❌ No | - | None |
| "board-certified" | 🔴 20+ | /services/* pages | **MUST FIX** |
| "100%" claims | ❌ No | CSS only | None |
| "4.9" rating | ❌ No | - | None |
| "$595" | ❌ No | - | None |
| "guarantee" (unqualified) | ❌ No | All correctly disclaim | None |

---

## Violations Summary

### Critical (Must Fix in F4-0B):
1. Replace all "board-certified" with "Licensed physicians (MD and DO)"
   - /services/page.tsx
   - /services/va-disability/page.tsx
   - /services/ssdi/page.tsx
   - /services/insurance-denial/page.tsx
   - /services/medical-malpractice/page.tsx
   - /services/second-opinion/page.tsx

### Medium Priority:
1. /services/nexus-letters redirects to homepage - needs dedicated page OR proper routing
2. /about redirects to homepage - consider adding about page
3. Some pages share identical meta titles

### Low Priority:
1. Footer disclaimer could be more prominent

---

## Compliant Claims (Verified OK)

- "2,500+ cases reviewed" - Appears on homepage, verifiable
- "$0 to learn if you qualify" - Accurate
- "Same Day" determination - Qualified as "most"
- "48-72 hours" letter delivery - Qualified as "typical"
- "$1,000 starting price" - Accurate per pricing page

---

## Next Steps

F4-0B: Fix all "board-certified" violations before proceeding
