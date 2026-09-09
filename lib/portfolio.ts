// Keep verified profile details and replaceable showcase content separate from UI.
export const profile = {
  name: "Usama Irshad",
  role: "Senior Brand & Motion Designer",
  location: "Lahore, Pakistan",
  years: 8,
  brands: 40,
  email: "",
  linkedin: "",
};

export const projects = [
  {
    id: "aura",
    title: "AURA",
    category: "Brand identity & packaging",
    image: "/images/aura-concept.png",
    alt: "AURA perfume concept: a lavender glass bottle and embossed packaging on a dark studio set",
    description: "A quiet, expressive identity explored through lavender glass, tactile paper, and considered typography.",
    disciplines: ["Art direction", "Identity", "Packaging"],
  },
  {
    id: "form",
    title: "FORM",
    category: "Editorial & art direction",
    image: "/images/form-concept.png",
    alt: "FORM editorial concept: an architecture publication with oversized serif type and lavender details",
    description: "An editorial exploration of space and form. Architectural imagery meets bold typography and a restrained visual system.",
    disciplines: ["Editorial", "Typography", "Visual system"],
  },
] as const;

export const services = [
  { title: "Brand identity", number: "01", description: "Distinctive identities with a clear point of view. From the first mark to the complete visual language that makes a brand recognisable.", tags: ["Logo design", "Visual systems", "Brand guidelines"] },
  { title: "Packaging design", number: "02", description: "Packaging that communicates what matters at first glance. Thoughtful structure, typography, and shelf presence, working together.", tags: ["Packaging", "Label design", "Print design"] },
  { title: "Motion design", number: "03", description: "Giving an identity a sense of rhythm and personality. Bringing brand stories to life through purposeful movement.", tags: ["Brand animation", "Motion graphics", "Social content"] },
  { title: "Creative direction", number: "04", description: "A consistent creative thread across every touchpoint. Connecting the idea, the visual language, and the way a brand shows up.", tags: ["Art direction", "Campaigns", "Adobe CC + AI"] },
];
