import {
  Stethoscope,
  HeartPulse,
  Baby,
  Sparkles,
  Bone,
  Brain,
  Smile,
  Eye,
  Activity,
  Ear,
  Dumbbell,
  Footprints,
  Syringe,
  Wind,
  type LucideIcon,
} from "lucide-react";

const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  "Family Medicine": Stethoscope,
  "Internal Medicine": HeartPulse,
  Pediatrics: Baby,
  "Obstetrics & Gynecology": HeartPulse,
  Dermatology: Sparkles,
  Cardiology: HeartPulse,
  "Orthopedic Surgery": Bone,
  Psychiatry: Brain,
  Psychology: Brain,
  Dentistry: Smile,
  Ophthalmology: Eye,
  Neurology: Brain,
  Gastroenterology: Activity,
  Endocrinology: Activity,
  Urology: Activity,
  "ENT (Otolaryngology)": Ear,
  "Physical Therapy": Dumbbell,
  Podiatry: Footprints,
  "Allergy & Immunology": Syringe,
  Pulmonology: Wind,
};

export function getSpecialtyIcon(specialty: string): LucideIcon {
  return SPECIALTY_ICONS[specialty] ?? Stethoscope;
}
