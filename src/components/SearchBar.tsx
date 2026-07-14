"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  insuranceOptions,
  defaultValues,
}: {
  insuranceOptions: string[];
  defaultValues?: { q?: string; location?: string; insurance?: string };
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValues?.q ?? "");
  const [location, setLocation] = useState(defaultValues?.location ?? "");
  const [insurance, setInsurance] = useState(defaultValues?.insurance ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    if (insurance.trim()) params.set("insurance", insurance.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-card-lg border border-line bg-white p-2 shadow-lift sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-full sm:p-2"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:border-r sm:border-line">
        <SearchIcon className="h-5 w-5 shrink-0 text-brand-500" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Specialty or doctor name"
          className="w-full border-none bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:border-r sm:border-line">
        <PinIcon className="h-5 w-5 shrink-0 text-brand-500" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or ZIP code"
          className="w-full border-none bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
        <ShieldIcon className="h-5 w-5 shrink-0 text-brand-500" />
        <select
          value={insurance}
          onChange={(e) => setInsurance(e.target.value)}
          className="w-full cursor-pointer border-none bg-transparent text-sm text-ink focus:outline-none"
        >
          <option value="">Any insurance</option>
          {insuranceOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary shrink-0 px-6 py-3 sm:ml-1">
        Find care
      </button>
    </form>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
    </svg>
  );
}
