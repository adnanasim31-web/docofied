import Link from "next/link";
import { prisma } from "@/lib/db";
import { logPageView } from "@/lib/analytics";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { SPECIALTIES, FALLBACK_INSURANCE_CARRIERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

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
    <>
      <section className="bg-gradient-to-b from-brand-50 to-surface-sunk">
        <div className="container-page flex flex-col items-center py-16 text-center sm:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Find the right doctor.{" "}
            <span className="text-brand-500">Book with confidence.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-muted sm:text-lg">
            Search thousands of verified providers by specialty, location, and insurance.
          </p>
          <div className="mt-8 w-full max-w-3xl">
            <SearchBar insuranceOptions={insuranceOptions} />
          </div>
        </div>
      </section>

      <section id="specialties" className="container-page py-14">
        <h2 className="font-display text-2xl font-bold text-ink">Browse by specialty</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {SPECIALTIES.map((s) => (
            <Link
              key={s}
              href={`/search?specialty=${encodeURIComponent(s)}`}
              className="card flex items-center justify-center px-4 py-4 text-center text-sm font-medium text-ink transition hover:border-brand-300 hover:text-brand-600"
            >
              {s}
            </Link>
          ))}
        </div>
      </section>

      <section id="top-rated" className="bg-white py-14">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink">Top-rated doctors</h2>
            <Link href="/search" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {topProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="card grid grid-cols-1 gap-6 p-8 sm:grid-cols-3 sm:p-10">
          <Stat label="Verified providers" value="10,000+" />
          <Stat label="Patient reviews" value="500,000+" />
          <Stat label="Specialties covered" value="20+" />
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-brand-600">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  );
}
