import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Priya", "Wei",
  "Fatima", "Hiroshi", "Carlos", "Sofia", "Amara", "Deepak", "Yuki", "Ahmed",
  "Elena", "Kwame", "Nadia", "Raj", "Mei", "Omar", "Ingrid", "Diego", "Aisha", "Lars",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Patel",
  "Kim", "Chen", "Nguyen", "Khan", "Singh", "Kumar", "Okafor", "Mensah", "Haddad",
  "Ivanov", "Rossi", "Muller", "Andersson", "Larsen", "Fischer", "Novak", "Silva",
];

const CREDENTIALS_BY_TYPE: Record<string, string[]> = {
  physician: ["MD", "DO"],
  dental: ["DDS", "DMD"],
  vision: ["OD"],
  mental: ["PsyD", "LCSW", "MD"],
  therapy: ["DPT", "PT"],
};

const SPECIALTY_CONFIG: { name: string; type: keyof typeof CREDENTIALS_BY_TYPE }[] = [
  { name: "Family Medicine", type: "physician" },
  { name: "Internal Medicine", type: "physician" },
  { name: "Pediatrics", type: "physician" },
  { name: "Obstetrics & Gynecology", type: "physician" },
  { name: "Dermatology", type: "physician" },
  { name: "Cardiology", type: "physician" },
  { name: "Orthopedic Surgery", type: "physician" },
  { name: "Psychiatry", type: "mental" },
  { name: "Psychology", type: "mental" },
  { name: "Dentistry", type: "dental" },
  { name: "Ophthalmology", type: "vision" },
  { name: "Neurology", type: "physician" },
  { name: "Gastroenterology", type: "physician" },
  { name: "Endocrinology", type: "physician" },
  { name: "Urology", type: "physician" },
  { name: "ENT (Otolaryngology)", type: "physician" },
  { name: "Physical Therapy", type: "therapy" },
  { name: "Podiatry", type: "physician" },
  { name: "Allergy & Immunology", type: "physician" },
  { name: "Pulmonology", type: "physician" },
];

const CITIES: { city: string; state: string; zip: string }[] = [
  { city: "New York", state: "NY", zip: "10001" },
  { city: "Brooklyn", state: "NY", zip: "11201" },
  { city: "Los Angeles", state: "CA", zip: "90012" },
  { city: "San Francisco", state: "CA", zip: "94102" },
  { city: "San Diego", state: "CA", zip: "92101" },
  { city: "Chicago", state: "IL", zip: "60601" },
  { city: "Houston", state: "TX", zip: "77002" },
  { city: "Austin", state: "TX", zip: "78701" },
  { city: "Dallas", state: "TX", zip: "75201" },
  { city: "Miami", state: "FL", zip: "33101" },
  { city: "Orlando", state: "FL", zip: "32801" },
  { city: "Seattle", state: "WA", zip: "98101" },
  { city: "Boston", state: "MA", zip: "02108" },
  { city: "Atlanta", state: "GA", zip: "30301" },
  { city: "Philadelphia", state: "PA", zip: "19102" },
  { city: "Phoenix", state: "AZ", zip: "85001" },
  { city: "Denver", state: "CO", zip: "80202" },
  { city: "Portland", state: "OR", zip: "97201" },
  { city: "Minneapolis", state: "MN", zip: "55401" },
  { city: "Nashville", state: "TN", zip: "37201" },
];

const STREETS = [
  "Main St", "Oak Ave", "Maple Dr", "Elm St", "Park Blvd", "Broadway",
  "Sunset Blvd", "Riverside Dr", "Market St", "5th Ave", "Highland Ave",
  "Washington St", "Lincoln Ave", "Medical Center Dr", "Health Plaza",
];

const LANGUAGE_POOL = ["English", "Spanish", "Mandarin", "Vietnamese", "Tagalog", "Arabic", "French", "Korean", "Hindi", "Portuguese"];

const BIO_TEMPLATES = [
  "Dr. {name} is dedicated to providing compassionate, evidence-based care to patients of all ages. With a focus on preventive medicine, {he_she} takes time to listen and build lasting relationships with every patient.",
  "{name} brings years of clinical experience and a patient-first approach to every visit. {He_She} believes in treating the whole person, not just the symptoms.",
  "Known for a warm bedside manner, {name} specializes in helping patients navigate complex health decisions with clarity and confidence.",
  "{name} completed advanced training and stays current with the latest research to deliver modern, effective treatment plans tailored to each patient.",
  "Patients appreciate {name}'s clear communication style and thorough approach to diagnosis and treatment planning.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNpi(index: number): string {
  return `1${String(1000000000 + index * 7919 + 123).slice(0, 9)}`;
}

function slugPhone(seed: number): string {
  const area = 200 + (seed % 700);
  const mid = 100 + ((seed * 13) % 900);
  const last = 1000 + ((seed * 37) % 9000);
  return `(${area}) ${mid}-${last}`;
}

async function main() {
  console.log("Seeding DocoFied database...");

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@docofied.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminPasswordHash },
    create: { email: adminEmail, passwordHash: adminPasswordHash },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  // --- Insurance carriers & plans ---
  const carrierData: Record<string, string[]> = {
    Aetna: ["Aetna PPO", "Aetna HMO", "Aetna Medicare Advantage"],
    Cigna: ["Cigna Open Access Plus", "Cigna HMO", "Cigna LocalPlus"],
    UnitedHealthcare: ["UHC Choice Plus", "UHC Navigate HMO", "UHC Medicare Advantage"],
    "Blue Cross Blue Shield": ["BCBS PPO", "BCBS HMO", "BCBS Blue Care"],
    Medicare: ["Medicare Part B", "Medicare Advantage"],
    Humana: ["Humana Gold Plus", "Humana PPO"],
  };

  const allPlans: { id: string; name: string }[] = [];
  for (const [carrierName, planNames] of Object.entries(carrierData)) {
    const carrier = await prisma.insuranceCarrier.upsert({
      where: { name: carrierName },
      update: {},
      create: { name: carrierName },
    });
    for (const planName of planNames) {
      const existing = await prisma.insurancePlan.findFirst({
        where: { carrierId: carrier.id, name: planName },
      });
      const plan =
        existing ??
        (await prisma.insurancePlan.create({
          data: { carrierId: carrier.id, name: planName },
        }));
      allPlans.push(plan);
    }
  }
  console.log(`Seeded ${Object.keys(carrierData).length} carriers, ${allPlans.length} plans`);

  // --- Providers ---
  const existingCount = await prisma.provider.count();
  if (existingCount > 0) {
    console.log(`Providers already exist (${existingCount}), skipping provider seed.`);
  } else {
    const TOTAL_PROVIDERS = 100;
    const createdProviders: { id: string; ratingCount: number }[] = [];

    for (let i = 0; i < TOTAL_PROVIDERS; i++) {
      const firstName = pick(FIRST_NAMES, i * 3 + 1);
      const lastName = pick(LAST_NAMES, i * 5 + 2);
      const specConfig = pick(SPECIALTY_CONFIG, i);
      const credentials = pick(CREDENTIALS_BY_TYPE[specConfig.type], i * 2);
      const location = pick(CITIES, i * 7 + 3);
      const isFemaleName = i % 2 === 0;
      const gender = isFemaleName ? "female" : "male";
      const heShe = isFemaleName ? "she" : "he";
      const heShePronoun = isFemaleName ? "She" : "He";
      const numLanguages = randInt(1, 3);
      const languages = Array.from(
        new Set([
          "English",
          ...Array.from({ length: numLanguages }, (_, k) => pick(LANGUAGE_POOL, i + k * 11)),
        ])
      ).join(", ");

      const hasReviews = i % 5 !== 0; // ~80% have reviews, rest are "New"
      const ratingCount = hasReviews ? randInt(3, 240) : 0;
      const ratingAvg = hasReviews ? Math.round((3.5 + Math.random() * 1.5) * 10) / 10 : 0;

      const bioTemplate = pick(BIO_TEMPLATES, i);
      const bio = bioTemplate
        .replaceAll("{name}", `${firstName} ${lastName}`)
        .replaceAll("{he_she}", heShe)
        .replaceAll("{He_She}", heShePronoun);

      const provider = await prisma.provider.create({
        data: {
          npi: randomNpi(i),
          firstName,
          lastName,
          credentials,
          specialty: specConfig.name,
          phone: slugPhone(i),
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@docofied-demo.com`,
          website: null,
          addressLine1: `${100 + i * 3} ${pick(STREETS, i)}`,
          city: location.city,
          state: location.state,
          zip: location.zip,
          gender,
          languages,
          acceptingNewPatients: i % 6 !== 0,
          bio,
          photoUrl: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
          ratingAvg,
          ratingCount,
          active: true,
        },
      });
      createdProviders.push({ id: provider.id, ratingCount });

      // Assign 2-4 random insurance plans
      const shuffled = [...allPlans].sort(() => Math.random() - 0.5);
      const planCount = randInt(2, 4);
      for (const plan of shuffled.slice(0, planCount)) {
        await prisma.providerInsurance.create({
          data: { providerId: provider.id, planId: plan.id },
        });
      }

      // A few upcoming availability slots
      for (let s = 0; s < 3; s++) {
        const startsAt = new Date();
        startsAt.setDate(startsAt.getDate() + randInt(1, 14));
        startsAt.setHours(9 + randInt(0, 8), pick([0, 15, 30, 45], s), 0, 0);
        await prisma.availabilitySlot.create({
          data: {
            providerId: provider.id,
            startsAt,
            durationMin: 30,
            visitType: s % 2 === 0 ? "inPerson" : "video",
          },
        });
      }
    }
    console.log(`Created ${TOTAL_PROVIDERS} providers`);

    // --- Sample approved reviews for a subset of rated providers ---
    const reviewSamples = [
      { name: "Alex M.", comment: "Great experience, very thorough and explained everything clearly." },
      { name: "Jordan T.", comment: "Short wait time and the staff was friendly. Would recommend." },
      { name: "Casey R.", comment: "Answered all my questions and made me feel comfortable." },
      { name: "Morgan L.", comment: "Professional and knowledgeable. Booking was easy too." },
      { name: "Taylor S.", comment: "Best doctor I've seen in years. Highly recommend to anyone nearby." },
      { name: "Sam P.", comment: "Very attentive and took the time to listen to my concerns." },
      { name: "Riley K.", comment: "Efficient visit, clean office, and a caring provider." },
      { name: "Drew H.", comment: "Helped me understand my treatment options without rushing." },
    ];

    const ratedProviders = createdProviders.filter((p) => p.ratingCount > 0);
    const providersToReview = ratedProviders.slice(0, Math.min(30, ratedProviders.length));
    let reviewIdx = 0;
    for (const p of providersToReview) {
      const numReviews = randInt(1, 4);
      for (let r = 0; r < numReviews; r++) {
        const sample = pick(reviewSamples, reviewIdx);
        reviewIdx++;
        await prisma.review.create({
          data: {
            providerId: p.id,
            patientName: sample.name,
            rating: randInt(3, 5),
            comment: sample.comment,
            verified: reviewIdx % 2 === 0,
            status: "approved",
          },
        });
      }
    }
    console.log(`Created sample approved reviews for ${providersToReview.length} providers`);

    // A couple of pending reviews awaiting moderation
    for (const p of createdProviders.slice(0, 3)) {
      await prisma.review.create({
        data: {
          providerId: p.id,
          patientName: "New Patient",
          rating: randInt(2, 5),
          comment: "Leaving this review after my recent visit.",
          verified: false,
          status: "pending",
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
