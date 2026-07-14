import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteProviderAction } from "@/app/admin/(protected)/providers/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const where = q
    ? {
        OR: [
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { specialty: { contains: q } },
          { city: { contains: q } },
          { npi: { contains: q } },
        ],
      }
    : {};

  const [total, providers] = await Promise.all([
    prisma.provider.count({ where }),
    prisma.provider.findMany({
      where,
      orderBy: { lastName: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Providers</h1>
          <p className="mt-1 text-sm text-ink-muted">{total.toLocaleString()} total</p>
        </div>
        <Link href="/admin/providers/new" className="btn-primary">
          + Add provider
        </Link>
      </div>

      <form method="get" className="mt-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name, specialty, city, or NPI..."
          className="input-field max-w-md"
        />
      </form>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Specialty</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Accepting</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-ink-faint">
                  No providers found.
                </td>
              </tr>
            )}
            {providers.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">
                  {p.firstName} {p.lastName}
                  {p.credentials ? `, ${p.credentials}` : ""}
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.specialty}</td>
                <td className="px-4 py-3 text-ink-muted">
                  {p.city}, {p.state}
                </td>
                <td className="px-4 py-3 text-ink-muted">
                  {p.ratingCount > 0 ? `${p.ratingAvg.toFixed(1)} (${p.ratingCount})` : "New"}
                </td>
                <td className="px-4 py-3">
                  {p.acceptingNewPatients ? (
                    <span className="badge">Yes</span>
                  ) : (
                    <span className="text-ink-faint">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.active ? <span className="badge">Active</span> : <span className="text-ink-faint">Hidden</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/providers/${p.id}/edit`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteProviderAction.bind(null, p.id)}
                      confirmMessage={`Delete ${p.firstName} ${p.lastName}? This cannot be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href={`/admin/providers?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}
            className={`btn-secondary ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            Previous
          </Link>
          <span className="px-4 text-sm text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/providers?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}
            className={`btn-secondary ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
