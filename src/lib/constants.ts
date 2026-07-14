export const SPECIALTIES = [
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Dermatology",
  "Cardiology",
  "Orthopedic Surgery",
  "Psychiatry",
  "Psychology",
  "Dentistry",
  "Ophthalmology",
  "Neurology",
  "Gastroenterology",
  "Endocrinology",
  "Urology",
  "ENT (Otolaryngology)",
  "Physical Therapy",
  "Podiatry",
  "Allergy & Immunology",
  "Pulmonology",
];

export const FALLBACK_INSURANCE_CARRIERS = [
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "Blue Cross",
  "Medicare",
];

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export const PLACEHOLDER_PHOTO =
  "https://api.dicebear.com/7.x/initials/svg?seed=Doctor&backgroundType=gradientLinear";

export function providerDisplayName(p: { firstName: string; lastName: string; credentials?: string | null }) {
  const creds = p.credentials ? `, ${p.credentials}` : "";
  return `${p.firstName} ${p.lastName}${creds}`;
}

export function providerPhoto(p: { photoUrl?: string | null; firstName: string; lastName: string }) {
  if (p.photoUrl) return p.photoUrl;
  const seed = encodeURIComponent(`${p.firstName} ${p.lastName}`);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=0f766e,2f9e7e,cfe9e7`;
}
