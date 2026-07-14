import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";
import { providerPhoto } from "@/lib/constants";

export type ProviderCardData = {
  id: string;
  firstName: string;
  lastName: string;
  credentials: string | null;
  specialty: string;
  city: string;
  state: string;
  photoUrl: string | null;
  ratingAvg: number;
  ratingCount: number;
  acceptingNewPatients: boolean;
};

const TRUST_BADGES = ["Verified", "Insurance accepted"];

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  return (
    <div className="card flex flex-col gap-4 p-5 transition hover:shadow-card sm:flex-row sm:items-start">
      <div className="flex shrink-0 justify-center sm:justify-start">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-line bg-surface-sunk">
          <Image
            src={providerPhoto(provider)}
            alt={`${provider.firstName} ${provider.lastName}`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              {provider.firstName} {provider.lastName}
              {provider.credentials ? `, ${provider.credentials}` : ""}
            </h3>
            <p className="text-sm font-medium text-brand-600">{provider.specialty}</p>
          </div>
          {provider.acceptingNewPatients && (
            <span className="badge">Accepting new patients</span>
          )}
        </div>

        <div className="mt-2">
          <StarRating rating={provider.ratingAvg} count={provider.ratingCount} />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          <PinIcon className="h-4 w-4 text-ink-faint" />
          <span>
            {provider.city}, {provider.state}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center sm:self-center">
        <Link href={`/provider/${provider.id}`} className="btn-primary w-full sm:w-auto">
          Book online
        </Link>
      </div>
    </div>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 21s-7-6.5-7-11.5a7 7 0 1 1 14 0C19 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
