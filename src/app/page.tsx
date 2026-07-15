import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  Wallet,
  Star,
  Search as SearchIcon,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { logPageView } from "@/lib/analytics";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { Reveal } from "@/components/Reveal";
import { SPECIALTIES, FALLBACK_INSURANCE_CARRIERS } from "@/lib/constants";
import { getSpecialtyIcon } from "@/lib/specialtyIcons";

export const dynamic = "force-dynamic";

const HERO_FEATURES = [
  { label: "Verified providers", icon: ShieldCheck },
  { label: "Same-day availability", icon: Clock },
  { label: "Insurance accepted", icon: Wallet },
  { label: "5-star rated care", icon: Star },
];

const VALUE_PROPS: { label: string; description: string; icon: LucideIcon }[] = [
  {
    label: "Verified providers",
    description: "Every provider is licensed and credential-checked before being listed.",
    icon: ShieldCheck,
  },
  {
    label: "Insurance matching",
    description: "Filter by your plan and instantly see who accepts it near you.",
    icon: Wallet,
  },
  {
    label: "Real patient reviews",
    description: "Read verified reviews from real patients before you book a visit.",
    icon: Star,
  },
  {
    label: "Fast, simple search",
    description: "Find the right specialist in seconds by name, specialty, or location.",
    icon: SearchIcon,
  },
  {
    label: "Same-day availability",
    description: "See real-time openings and book the next available appointment.",
    icon: Clock,
  },
  {
    label: "Direct contact details",
    description: "Get phone, address, and directions to the office in one place.",
    icon: MapPin,
  },
];

async function getInsuranceOptions(): Promise<string[]> {
  const carriers = await prisma.insuranceCarrier.findMany({ select: { name: true } });
  if (carriers.length === 0) return FALLBACK_INSURANCE_CARRIERS;
  return carriers.map((c) => c.name);
}

async function getTopRatedProviders() {
  return prisma.provider.findMany({
    where: { active: true, ratingCount: { gt: 0 } },
    orderBy: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
    take: 6,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      credentials: true,
      specialty: true,
      city: true,
      state: true,
      photoUrl: true,
      ratingAvg: true,
      ratingCount: true,
      acceptingNewPatients: true,
    },
  });
}

export default async function HomePage() {
  await logPageView("/");
  const [insuranceOptions, topProviders] = await Promise.all([
    getInsuranceOptions(),
    getTopRatedProviders(),
  ]);

  return (
    <div className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
      {/* Hero panel */}
      <section className="panel bg-brand">
        <div className="px-6 py-16 text-center sm:px-12 sm:py-20">
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Find trusted care <span className="text-accent-400">near you</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-mint sm:text-lg">
            Search thousands of verified providers by specialty, location, and insurance.
          </p>
          <div className="mx-auto mt-8 w-full max-w-3xl">
            <SearchBar insuranceOptions={insuranceOptions} />
          </div>

          <div className="mx-auto mt-12 max-w-4xl border-t border-white/15 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {HERO_FEATURES.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="icon-outline">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium text-mint">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specialties panel */}
      <section id="specialties" className="panel bg-white">
        <div className="grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="eyebrow">Our popular specialties</span>
            <h2 className="mt-3 section-heading">
              Browse care by <span className="emphasis">specialty</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
              DocoFied covers over 20 specialties nationwide, so you can find the right kind of
              care no matter what you need.
            </p>
            <Link href="/search" className="btn-primary mt-6">
              Find a doctor
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SPECIALTIES.slice(0, 8).map((s, i) => {
              const Icon = getSpecialtyIcon(s);
              return (
                <Reveal key={s} delay={i * 40}>
                  <Link href={`/search?specialty=${encodeURIComponent(s)}`} className="pill-card">
                    <span className="icon-badge-gradient h-10 w-10 shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-ink">{s}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value props panel */}
      <section className="panel bg-brand-dark">
        <div className="grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <span className="eyebrow">Why DocoFied</span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              Built for <span className="text-accent-400">finding care fast</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mint">
              From search to booking, every step is designed to get you in front of the right
              provider with confidence.
            </p>
            <Link href="/search" className="btn-primary mt-6">
              Get started
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {VALUE_PROPS.map(({ label, description, icon: Icon }, i) => (
              <Reveal key={label} delay={i * 50}>
                <span className="icon-badge-gradient h-12 w-12">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mint">{description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Top-rated providers panel */}
      <section id="top-rated" className="panel bg-white">
        <div className="p-8 sm:p-12">
          <Reveal className="flex items-end justify-between">
            <div>
              <span className="eyebrow">Top rated</span>
              <h2 className="mt-3 section-heading">
                Top-rated <span className="emphasis">doctors</span>
              </h2>
            </div>
            <Link href="/search" className="hidden text-sm font-semibold text-accent-600 hover:text-accent-hover sm:block">
              View all &rarr;
            </Link>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {topProviders.map((provider, i) => (
              <Reveal key={provider.id} delay={i * 60}>
                <ProviderCard provider={provider} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats panel */}
      <section className="panel bg-surface-sunk">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 p-8 sm:grid-cols-3 sm:p-12">
            <Stat label="Verified providers" value="10,000+" />
            <Stat label="Patient reviews" value="500,000+" />
            <Stat label="Specialties covered" value="20+" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-accent-600">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  );
}
