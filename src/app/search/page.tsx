import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { logPageView, logSearch } from "@/lib/analytics";
import { ProviderCard } from "@/components/ProviderCard";
import { SearchFilters } from "@/components/SearchFilters";
import { FALLBACK_INSURANCE_CARRIERS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

async function getInsuranceOptions(): Promise<string[]> {
  const carriers = await prisma.insuranceCarrier.findMany({ select: { name: true } });
  if (carriers.length === 0) return FALLBACK_INSURANCE_CARRIERS;
  return carriers.map((c) => c.name);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  await logPageView("/search");

  const q = searchParams.q?.trim() || "";
  const specialty = searchParams.specialty?.trim() || "";
  const state = searchParams.state?.trim() || "";
  const city = searchParams.city?.trim() || "";
  const insurance = searchParams.insurance?.trim() || "";
  const visitType = searchParams.visitType?.trim() || "";
  const sort = searchParams.sort?.trim() || "rating";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const where: Prisma.ProviderWhereInput = { active: true };
  const and: Prisma.ProviderWhereInput[] = [];

  if (q) {
    and.push({
      OR: [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { specialty: { contains: q } },
        { orgName: { contains: q } },
      ],
    });
  }
  if (specialty) and.push({ specialty });
  if (state) and.push({ state });
  if (city) {
    and.push({
      OR: [{ city: { contains: city } }, { zip: { contains: city } }],
    });
  }
  if (insurance) {
    and.push({
      insurancePlans: {
        some: { plan: { carrier: { name: insurance } } },
      },
    });
  }
  if (visitType) {
    and.push({
      availabilitySlots: {
        some: { visitType, booked: false },
      },
    });
  }
  if (and.length > 0) where.AND = and;

  const orderBy: Prisma.ProviderOrderByWithRelationInput[] =
    sort === "name"
      ? [{ lastName: "asc" }, { firstName: "asc" }]
      : [{ ratingAvg: "desc" }, { ratingCount: "desc" }];

  const [totalCount, providers, insuranceOptions] = await Promise.all([
    prisma.provider.count({ where }),
    prisma.provider.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
    }),
    getInsuranceOptions(),
  ]);

  await logSearch({
    query: q || null,
    specialty: specialty || null,
    state: state || null,
    city: city || null,
    insurance: insurance || null,
    resultsCount: totalCount,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (specialty) params.set("specialty", specialty);
    if (state) params.set("state", state);
    if (city) params.set("city", city);
    if (insurance) params.set("insurance", insurance);
    if (visitType) params.set("visitType", visitType);
    if (sort) params.set("sort", sort);
    params.set("page", String(targetPage));
    return `/search?${params.toString()}`;
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Find a doctor</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {totalCount.toLocaleString()} provider{totalCount === 1 ? "" : "s"} found
        {specialty ? ` for ${specialty}` : ""}
        {city ? ` near ${city}` : ""}
        {state ? `, ${state}` : ""}
      </p>

      <div className="mt-6">
        <SearchFilters
          params={{ q, specialty, state, city, insurance, visitType, sort }}
          insuranceOptions={insuranceOptions}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4">
        {providers.length === 0 && (
          <div className="card p-10 text-center text-ink-muted">
            No providers match your search. Try adjusting your filters.
          </div>
        )}
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`btn-secondary ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            Previous
          </Link>
          <span className="px-4 text-sm text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`btn-secondary ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
