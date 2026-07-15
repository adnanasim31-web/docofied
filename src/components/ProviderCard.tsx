import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, BadgeCheck } from "lucide-react";
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

const TRUST_BADGES = [
  { label: "Verified", icon: BadgeCheck },
  { label: "Insurance accepted", icon: ShieldCheck },
];

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  return (
    <div className="card card-hover flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
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
            <p className="text-sm font-medium text-accent-600">{provider.specialty}</p>
          </div>
          {provider.acceptingNewPatients && (
            <span className="badge">Accepting new patients</span>
          )}
        </div>

        <div className="mt-2">
          <StarRating rating={provider.ratingAvg} count={provider.ratingCount} />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-4 w-4 text-ink-faint" />
          <span>
            {provider.city}, {provider.state}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {TRUST_BADGES.map(({ label, icon: Icon }) => (
            <span key={label} className="badge">
              <Icon className="h-3.5 w-3.5" />
              {label}
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
