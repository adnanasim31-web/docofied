import { SPECIALTIES, US_STATES } from "@/lib/constants";

export function SearchFilters({
  params,
  insuranceOptions,
}: {
  params: Record<string, string | undefined>;
  insuranceOptions: string[];
}) {
  return (
    <form method="get" action="/search" className="card grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6">
      <input type="hidden" name="q" value={params.q ?? ""} />

      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-ink-muted">Specialty</label>
        <select name="specialty" defaultValue={params.specialty ?? ""} className="input-field">
          <option value="">All specialties</option>
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-ink-muted">State</label>
        <select name="state" defaultValue={params.state ?? ""} className="input-field">
          <option value="">All states</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-ink-muted">City or ZIP</label>
        <input
          type="text"
          name="city"
          defaultValue={params.city ?? ""}
          placeholder="e.g. Austin or 78701"
          className="input-field"
        />
      </div>

      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-ink-muted">Insurance</label>
        <select name="insurance" defaultValue={params.insurance ?? ""} className="input-field">
          <option value="">Any insurance</option>
          {insuranceOptions.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-ink-muted">Visit type</label>
        <select name="visitType" defaultValue={params.visitType ?? ""} className="input-field">
          <option value="">In-person or video</option>
          <option value="inPerson">In-person</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="lg:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-ink-muted">Sort by</label>
        <select name="sort" defaultValue={params.sort ?? "rating"} className="input-field">
          <option value="rating">Highest rated</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      <div className="flex items-end lg:col-span-6">
        <button type="submit" className="btn-primary">
          Apply filters
        </button>
      </div>
    </form>
  );
}
