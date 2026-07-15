import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { logPageView } from "@/lib/analytics";
import { StarRating } from "@/components/StarRating";
import { providerPhoto } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getProvider(id: string) {
  return prisma.provider.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      insurancePlans: {
        include: { plan: { include: { carrier: true } } },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const provider = await getProvider(params.id);
  if (!provider) return { title: "Provider not found" };

  const name = `${provider.firstName} ${provider.lastName}${provider.credentials ? `, ${provider.credentials}` : ""}`;
  const title = `${name} — ${provider.specialty} in ${provider.city}, ${provider.state}`;
  const description =
    provider.bio?.slice(0, 155) ??
    `Book an appointment with ${name}, a ${provider.specialty} provider in ${provider.city}, ${provider.state} on DocoFied.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: provider.photoUrl ? [provider.photoUrl] : undefined,
    },
  };
}

export default async function ProviderProfilePage({ params }: { params: { id: string } }) {
  const provider = await getProvider(params.id);
  if (!provider || !provider.active) notFound();

  await logPageView(`/provider/${provider.id}`, provider.id);

  const fullAddress = [provider.addressLine1, provider.addressLine2, `${provider.city}, ${provider.state} ${provider.zip ?? ""}`]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const carrierNames = Array.from(
    new Set(provider.insurancePlans.map((pi) => pi.plan.carrier.name))
  );

  return (
    <div className="py-6 sm:py-10">
    <div className="container-page">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-line bg-surface-sunk">
                <Image
                  src={providerPhoto(provider)}
                  alt={`${provider.firstName} ${provider.lastName}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {provider.firstName} {provider.lastName}
                  {provider.credentials ? `, ${provider.credentials}` : ""}
                </h1>
                <p className="mt-1 text-base font-medium text-accent-600">{provider.specialty}</p>
                <div className="mt-2">
                  <StarRating rating={provider.ratingAvg} count={provider.ratingCount} size="md" />
                </div>
                {provider.acceptingNewPatients && (
                  <span className="badge mt-3">Accepting new patients</span>
                )}
              </div>
            </div>

            {provider.bio && (
              <div className="mt-6 border-t border-line pt-6">
                <h2 className="font-display text-lg font-bold text-ink">About</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{provider.bio}</p>
              </div>
            )}

            {provider.languages && (
              <div className="mt-4 text-sm text-ink-muted">
                <span className="font-semibold text-ink">Languages spoken: </span>
                {provider.languages}
              </div>
            )}
          </div>

          <div className="card mt-6 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-ink">
              Patient reviews ({provider.reviews.length})
            </h2>
            <div className="mt-4 space-y-5">
              {provider.reviews.length === 0 && (
                <p className="text-sm text-ink-muted">
                  No reviews yet. Be the first to leave feedback after your visit.
                </p>
              )}
              {provider.reviews.map((review) => (
                <div key={review.id} className="border-b border-line pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{review.patientName}</p>
                    {review.verified && <span className="badge">Verified visit</span>}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={review.rating} count={1} />
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <Link href={`/provider/${provider.id}#book`} className="btn-primary w-full">
              Book online
            </Link>
            <p className="mt-2 text-center text-xs text-ink-faint">
              Online booking is coming soon — contact the office directly for now.
            </p>

            <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
              <div>
                <p className="font-semibold text-ink">Address</p>
                <p className="text-ink-muted">{fullAddress}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-accent-600 hover:text-accent-hover"
                >
                  Get directions &rarr;
                </a>
              </div>
              {provider.phone && (
                <div>
                  <p className="font-semibold text-ink">Phone</p>
                  <p className="text-ink-muted">{provider.phone}</p>
                </div>
              )}
              {provider.website && (
                <div>
                  <p className="font-semibold text-ink">Website</p>
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-600 hover:text-accent-hover"
                  >
                    {provider.website}
                  </a>
                </div>
              )}
            </div>

            {carrierNames.length > 0 && (
              <div className="mt-6 border-t border-line pt-6">
                <p className="text-sm font-semibold text-ink">Accepted insurance</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {carrierNames.map((name) => (
                    <span key={name} className="badge">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
