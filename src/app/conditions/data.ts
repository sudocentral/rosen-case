// Conditions library data
// This file contains the condition definitions used for SEO landing pages
// Add new conditions here and they will automatically generate pages

export interface Condition {
  slug: string;
  name: string;
  category: "va" | "ssdi" | "insurance" | "general";
  shortDescription: string;
  longDescription: string;
  symptoms?: string[];
  howWeHelp: string[];
  relatedConditions?: string[]; // slugs of related conditions
  seoTitle?: string;
  seoDescription?: string;
}

export const conditions: Condition[] = [
  // VA Disability Conditions
  {
    slug: "ptsd",
    name: "PTSD (Post-Traumatic Stress Disorder)",
    category: "va",
    shortDescription: "Mental health condition triggered by traumatic events experienced during military service.",
    longDescription: "Post-Traumatic Stress Disorder (PTSD) is one of the most common conditions affecting veterans. It develops after experiencing or witnessing traumatic events such as combat, military sexual trauma, or other service-related incidents. A nexus letter can help establish that your current PTSD symptoms are connected to events that occurred during your military service.",
    symptoms: [
      "Intrusive memories or flashbacks",
      "Nightmares related to traumatic events",
      "Avoidance of trauma reminders",
      "Hypervigilance and exaggerated startle response",
      "Difficulty sleeping",
      "Mood changes and emotional numbness",
    ],
    howWeHelp: [
      "Review your service records for documented traumatic events",
      "Analyze current treatment records for PTSD diagnosis",
      "Establish the medical nexus between service events and current symptoms",
      "Document how your condition meets VA rating criteria",
    ],
    relatedConditions: ["anxiety", "depression", "tbi", "sleep-apnea"],
    seoTitle: "PTSD Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your PTSD VA disability claim. Free medical records review. Establish service connection for post-traumatic stress disorder.",
  },
  {
    slug: "tbi",
    name: "TBI (Traumatic Brain Injury)",
    category: "va",
    shortDescription: "Brain injury caused by impact or blast exposure during military service.",
    longDescription: "Traumatic Brain Injury (TBI) is common among veterans, particularly those exposed to IED blasts, combat situations, or training accidents. TBI can cause lasting cognitive, physical, and emotional symptoms. A nexus letter can help connect your current TBI-related symptoms to documented in-service events.",
    symptoms: [
      "Headaches and migraines",
      "Memory and concentration problems",
      "Dizziness and balance issues",
      "Sensitivity to light and noise",
      "Mood changes and irritability",
      "Sleep disturbances",
    ],
    howWeHelp: [
      "Review service records for documented head injuries or blast exposure",
      "Analyze neurological evaluations and imaging",
      "Connect current cognitive symptoms to service-related events",
      "Document residual effects for VA rating purposes",
    ],
    relatedConditions: ["ptsd", "migraines", "tinnitus"],
    seoTitle: "TBI Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your traumatic brain injury VA claim. Free medical records review. Establish service connection for TBI.",
  },
  {
    slug: "tinnitus",
    name: "Tinnitus",
    category: "va",
    shortDescription: "Ringing or buzzing in the ears often caused by noise exposure during service.",
    longDescription: "Tinnitus is one of the most frequently claimed VA disabilities. It commonly results from exposure to loud noises during military service, including weapons fire, explosions, aircraft, and heavy machinery. A nexus letter can help establish that your tinnitus is related to noise exposure during your military service.",
    symptoms: [
      "Persistent ringing in one or both ears",
      "Buzzing, hissing, or clicking sounds",
      "Difficulty concentrating",
      "Sleep interference",
      "Increased symptoms in quiet environments",
    ],
    howWeHelp: [
      "Document noise exposure during military service",
      "Review audiological evaluations",
      "Establish the timeline from service exposure to current symptoms",
      "Provide medical rationale for service connection",
    ],
    relatedConditions: ["hearing-loss", "tbi"],
    seoTitle: "Tinnitus Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your tinnitus VA disability claim. Free medical records review. Establish service connection for ringing in the ears.",
  },
  {
    slug: "hearing-loss",
    name: "Hearing Loss",
    category: "va",
    shortDescription: "Reduced hearing ability resulting from military noise exposure.",
    longDescription: "Hearing loss is extremely common among veterans due to exposure to loud noises during military service. Whether from weapons fire, explosions, aircraft engines, or heavy equipment, prolonged noise exposure can cause permanent hearing damage. A nexus letter can help establish the connection between your hearing loss and your military service.",
    symptoms: [
      "Difficulty understanding speech",
      "Need to increase volume on devices",
      "Trouble hearing in noisy environments",
      "Frequently asking others to repeat themselves",
      "Muffled perception of sounds",
    ],
    howWeHelp: [
      "Review military occupational specialty and noise exposure",
      "Analyze entrance and exit audiograms",
      "Document progression of hearing loss",
      "Establish service connection with medical rationale",
    ],
    relatedConditions: ["tinnitus"],
    seoTitle: "Hearing Loss Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your hearing loss VA disability claim. Free medical records review. Establish service connection for noise-induced hearing loss.",
  },
  {
    slug: "sleep-apnea",
    name: "Sleep Apnea",
    category: "va",
    shortDescription: "Sleep disorder causing breathing interruptions, often secondary to other service-connected conditions.",
    longDescription: "Sleep apnea is a common condition among veterans and is often claimed as secondary to other service-connected conditions like PTSD, weight gain from limited mobility, or nasal/sinus conditions. A nexus letter can help establish how your sleep apnea is connected to your military service or aggravated by service-connected conditions.",
    symptoms: [
      "Loud snoring",
      "Episodes of stopped breathing during sleep",
      "Gasping for air during sleep",
      "Morning headaches",
      "Excessive daytime sleepiness",
      "Difficulty staying asleep",
    ],
    howWeHelp: [
      "Review sleep study results and diagnosis",
      "Analyze connection to primary service-connected conditions",
      "Document medical literature supporting secondary service connection",
      "Establish timeline and aggravation factors",
    ],
    relatedConditions: ["ptsd", "weight-conditions"],
    seoTitle: "Sleep Apnea Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your sleep apnea VA disability claim. Free medical records review. Establish service connection for obstructive sleep apnea.",
  },
  {
    slug: "back-pain",
    name: "Back Conditions",
    category: "va",
    shortDescription: "Spine and back injuries from military service activities.",
    longDescription: "Back conditions are among the most common disabilities affecting veterans. Military service often involves heavy lifting, carrying equipment, jumping from vehicles, and other activities that can cause or aggravate spine conditions. A nexus letter can help connect your current back condition to events or activities during your military service.",
    symptoms: [
      "Chronic lower or upper back pain",
      "Limited range of motion",
      "Radiating pain to legs (sciatica)",
      "Muscle spasms",
      "Numbness or tingling in extremities",
      "Difficulty standing or sitting for long periods",
    ],
    howWeHelp: [
      "Review service records for injuries or physically demanding duties",
      "Analyze imaging studies and diagnostic records",
      "Document connection between service activities and current condition",
      "Establish chronicity and progression of symptoms",
    ],
    relatedConditions: ["radiculopathy", "knee-conditions"],
    seoTitle: "Back Condition Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your back condition VA disability claim. Free medical records review. Establish service connection for spine injuries.",
  },
  {
    slug: "knee-conditions",
    name: "Knee Conditions",
    category: "va",
    shortDescription: "Knee injuries and degenerative conditions from military service.",
    longDescription: "Knee conditions are prevalent among veterans due to the physical demands of military service. Running, marching, jumping, and carrying heavy loads can all contribute to knee injuries and accelerated degeneration. A nexus letter can help establish how your knee condition is connected to your military service.",
    symptoms: [
      "Chronic knee pain",
      "Swelling and stiffness",
      "Instability or giving way",
      "Limited range of motion",
      "Clicking or popping sounds",
      "Difficulty with stairs or prolonged standing",
    ],
    howWeHelp: [
      "Review service records for knee injuries or demanding physical activities",
      "Analyze surgical records and imaging studies",
      "Document connection between service duties and current condition",
      "Establish progression from service to current state",
    ],
    relatedConditions: ["back-pain"],
    seoTitle: "Knee Condition Nexus Letters for VA Claims | Rosen Experts",
    seoDescription: "Get a physician-authored nexus letter for your knee condition VA disability claim. Free medical records review. Establish service connection for knee injuries.",
  },

  // SSDI Conditions
  {
    slug: "fibromyalgia",
    name: "Fibromyalgia",
    category: "ssdi",
    shortDescription: "Chronic widespread pain condition affecting ability to work.",
    longDescription: "Fibromyalgia is a chronic condition characterized by widespread musculoskeletal pain, fatigue, and cognitive difficulties. It can significantly impair your ability to maintain employment. A medical opinion letter can document how your fibromyalgia limits your functional capacity and meets SSA disability criteria.",
    symptoms: [
      "Widespread chronic pain",
      "Fatigue and exhaustion",
      "Cognitive difficulties (fibro fog)",
      "Sleep disturbances",
      "Sensitivity to touch, light, and sound",
      "Headaches and migraines",
    ],
    howWeHelp: [
      "Document functional limitations in SSA-required format",
      "Detail how symptoms impact work capacity",
      "Provide RFC (Residual Functional Capacity) assessment",
      "Support duration and severity requirements",
    ],
    relatedConditions: ["chronic-fatigue"],
    seoTitle: "Fibromyalgia SSDI Medical Opinions | Rosen Experts",
    seoDescription: "Get a physician-authored medical opinion for your fibromyalgia SSDI claim. Free medical records review. Document functional limitations for Social Security disability.",
  },
  {
    slug: "chronic-fatigue",
    name: "Chronic Fatigue Syndrome",
    category: "ssdi",
    shortDescription: "Debilitating fatigue that limits daily activities and work capacity.",
    longDescription: "Chronic Fatigue Syndrome (CFS/ME) causes severe, persistent fatigue that doesn't improve with rest and worsens with physical or mental activity. This condition can make it impossible to maintain regular employment. A medical opinion letter can document how CFS affects your ability to work.",
    symptoms: [
      "Severe persistent fatigue",
      "Post-exertional malaise",
      "Unrefreshing sleep",
      "Cognitive impairment",
      "Muscle and joint pain",
      "Headaches of new type or severity",
    ],
    howWeHelp: [
      "Document the severity and persistence of symptoms",
      "Detail functional limitations for SSA evaluation",
      "Provide evidence supporting disability duration",
      "Address SSA criteria for chronic fatigue syndrome",
    ],
    relatedConditions: ["fibromyalgia"],
    seoTitle: "Chronic Fatigue Syndrome SSDI Medical Opinions | Rosen Experts",
    seoDescription: "Get a physician-authored medical opinion for your CFS/ME SSDI claim. Free medical records review. Document functional limitations for Social Security disability.",
  },

  // Insurance Denial Conditions
  {
    slug: "surgery-denial",
    name: "Surgery Denial Appeals",
    category: "insurance",
    shortDescription: "Insurance denials for medically necessary surgical procedures.",
    longDescription: "Insurance companies frequently deny coverage for surgical procedures, claiming they are not medically necessary or are experimental. An independent medical opinion can provide the evidence needed to overturn these denials by documenting why the surgery is medically necessary according to established standards of care.",
    howWeHelp: [
      "Review the denial letter and stated reasons",
      "Analyze medical records supporting necessity",
      "Cite relevant medical guidelines and standards",
      "Provide detailed rationale for medical necessity",
    ],
    seoTitle: "Surgery Denial Appeal Medical Opinions | Rosen Experts",
    seoDescription: "Get a physician-authored medical opinion for your surgery denial appeal. Free medical records review. Document medical necessity for insurance appeals.",
  },
  {
    slug: "medication-denial",
    name: "Medication Denial Appeals",
    category: "insurance",
    shortDescription: "Insurance denials for prescribed medications.",
    longDescription: "Insurance companies may deny coverage for medications, requiring step therapy, prior authorization, or claiming the medication isn't medically necessary. An independent medical opinion can support your appeal by documenting why the prescribed medication is appropriate for your condition.",
    howWeHelp: [
      "Review denial reasons and alternative requirements",
      "Document why prescribed medication is appropriate",
      "Address step therapy or formulary requirements",
      "Cite medical literature supporting treatment",
    ],
    seoTitle: "Medication Denial Appeal Medical Opinions | Rosen Experts",
    seoDescription: "Get a physician-authored medical opinion for your medication denial appeal. Free medical records review. Document medical necessity for prescription coverage.",
  },
];

// Helper functions
export function getConditionBySlug(slug: string): Condition | undefined {
  return conditions.find(c => c.slug === slug);
}

export function getConditionsByCategory(category: Condition["category"]): Condition[] {
  return conditions.filter(c => c.category === category);
}

export function getAllSlugs(): string[] {
  return conditions.map(c => c.slug);
}

export function getRelatedConditions(condition: Condition): Condition[] {
  if (!condition.relatedConditions) return [];
  return condition.relatedConditions
    .map(slug => getConditionBySlug(slug))
    .filter((c): c is Condition => c !== undefined);
}

// Category display names
export const categoryNames: Record<Condition["category"], string> = {
  va: "VA Disability",
  ssdi: "SSDI Claims",
  insurance: "Insurance Appeals",
  general: "General Medical Opinions",
};
