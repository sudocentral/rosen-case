export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Rosen Experts",
    "url": "https://rosenexperts.com",
    "logo": "https://rosenexperts.com/brand/logo.png",
    "description": "Medical records review and physician opinion letter services for VA disability, SSDI, insurance denials, and more.",
    "priceRange": "$$",
    "medicalSpecialty": "Medical Opinion Services",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@rosenexperts.com",
      "availableLanguage": ["English", "Spanish"]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Medical Opinion Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Medical Records Review",
            "description": "No-cost analysis of medical documentation to determine case qualification"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Physician-Authored Medical Opinions",
            "description": "Medical opinion letters for VA disability claims"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SSDI Support Letters",
            "description": "Medical opinion letters for Social Security disability claims"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Insurance Denial Appeals",
            "description": "Independent medical opinions for insurance claim appeals"
          }
        }
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rosen Experts",
    "url": "https://rosenexperts.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rosenexperts.com/faq/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
