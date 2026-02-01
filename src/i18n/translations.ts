// Rosen Experts i18n - EN/ES (Puerto Rican Spanish)
// NOTE: This is the framework structure. Full translations should be added incrementally.

export type Locale = "en" | "es";

export interface TranslationStrings {
  // Common
  common: {
    learnMore: string;
    getStarted: string;
    contactUs: string;
    freeReview: string;
    startFreeReview: string;
    seeHowItWorks: string;
    viewAllServices: string;
    submitRecords: string;
  };
  // Header/Nav
  nav: {
    home: string;
    howItWorks: string;
    services: string;
    pricing: string;
    faq: string;
    contact: string;
    startReview: string;
  };
  // Hero Section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  // Process Steps
  steps: {
    heading: string;
    subheading: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Badge: string;
    step3Title: string;
    step3Desc: string;
    step4Badge: string;
    step4Title: string;
    step4Desc: string;
  };
  // Trust indicators
  trust: {
    casesReviewed: string;
    sameDayLabel: string;
    boardCertified: string;
    clientRating: string;
  };
  // Footer
  footer: {
    tagline: string;
    quickLinks: string;
    services: string;
    legal: string;
    privacyPolicy: string;
    termsOfService: string;
    hipaaNotice: string;
    copyright: string;
  };
}

export const translations: Record<Locale, TranslationStrings> = {
  en: {
    common: {
      learnMore: "Learn more",
      getStarted: "Get Started",
      contactUs: "Contact Us",
      freeReview: "Free Review",
      startFreeReview: "Start Free Medical Records Review",
      seeHowItWorks: "See How It Works",
      viewAllServices: "View All Services",
      submitRecords: "Submit Your Records",
    },
    nav: {
      home: "Home",
      howItWorks: "How It Works",
      services: "Services",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
      startReview: "Start Free Review",
    },
    hero: {
      badge: "2,500+ Cases Reviewed",
      title: "Free Medical Records Review. Same-Day Determination.",
      subtitle: "Our physician network reviews your medical records at no charge. If your case qualifies for a supporting medical opinion, we will tell you the same day, often within hours.",
      cta: "Start Free Medical Records Review",
      ctaSecondary: "See How It Works",
    },
    steps: {
      heading: "Four Steps. First Three Are Free.",
      subheading: "We review your records and tell you if you qualify before you pay anything.",
      step1Title: "Submit Records",
      step1Desc: "Upload your medical documentation securely. Takes 5 minutes.",
      step2Title: "Free Review",
      step2Desc: "Our team analyzes your case with physician oversight.",
      step3Badge: "KEY STEP",
      step3Title: "Determination",
      step3Desc: "We tell you if your case qualifies. Same day, no charge.",
      step4Badge: "IF QUALIFIED",
      step4Title: "Physician Letter",
      step4Desc: "If you qualify, a physician writes your opinion.",
    },
    trust: {
      casesReviewed: "Cases Reviewed",
      sameDayLabel: "Determinations",
      boardCertified: "Licensed Physicians",
      clientRating: "Client Rating",
    },
    footer: {
      tagline: "Free medical records review by licensed physicians. Same-day determinations.",
      quickLinks: "Quick Links",
      services: "Services",
      legal: "Legal",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      hipaaNotice: "HIPAA Notice",
      copyright: "All rights reserved.",
    },
  },
  es: {
    // Puerto Rican Spanish - formal, no slang
    common: {
      learnMore: "Mas informacion",
      getStarted: "Comenzar",
      contactUs: "Contactenos",
      freeReview: "Evaluacion Gratuita",
      startFreeReview: "Comenzar Evaluacion Gratuita de Expedientes Medicos",
      seeHowItWorks: "Ver Como Funciona",
      viewAllServices: "Ver Todos los Servicios",
      submitRecords: "Enviar Sus Documentos",
    },
    nav: {
      home: "Inicio",
      howItWorks: "Como Funciona",
      services: "Servicios",
      pricing: "Precios",
      faq: "Preguntas Frecuentes",
      contact: "Contacto",
      startReview: "Evaluacion Gratuita",
    },
    hero: {
      badge: "Mas de 2,500 Casos Evaluados",
      title: "Evaluacion Gratuita de Expedientes Medicos. Determinacion el Mismo Dia.",
      subtitle: "Nuestra red de medicos evalua sus expedientes medicos sin costo. Si su caso califica para una opinion medica de apoyo, se lo informaremos el mismo dia, frecuentemente en horas.",
      cta: "Comenzar Evaluacion Gratuita de Expedientes Medicos",
      ctaSecondary: "Ver Como Funciona",
    },
    steps: {
      heading: "Cuatro Pasos. Los Primeros Tres Son Gratis.",
      subheading: "Evaluamos sus documentos y le informamos si califica antes de que pague.",
      step1Title: "Enviar Documentos",
      step1Desc: "Suba su documentacion medica de forma segura. Toma 5 minutos.",
      step2Title: "Evaluacion Gratuita",
      step2Desc: "Nuestro equipo analiza su caso con supervision medica.",
      step3Badge: "PASO CLAVE",
      step3Title: "Determinacion",
      step3Desc: "Le informamos si su caso califica. El mismo dia, sin costo.",
      step4Badge: "SI CALIFICA",
      step4Title: "Carta Medica",
      step4Desc: "Si decide continuar, un medico redacta su opinion.",
    },
    trust: {
      casesReviewed: "Casos Evaluados",
      sameDayLabel: "Determinaciones",
      boardCertified: "Medicos Certificados",
      clientRating: "Calificacion",
    },
    footer: {
      tagline: "Evaluacion gratuita de expedientes medicos por medicos certificados. Determinaciones el mismo dia.",
      quickLinks: "Enlaces Rapidos",
      services: "Servicios",
      legal: "Legal",
      privacyPolicy: "Politica de Privacidad",
      termsOfService: "Terminos de Servicio",
      hipaaNotice: "Aviso HIPAA",
      copyright: "Todos los derechos reservados.",
    },
  },
};

export function getTranslation(locale: Locale): TranslationStrings {
  return translations[locale];
}
