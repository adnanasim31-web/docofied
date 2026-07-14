import { prisma } from "@/lib/db";
import { TrafficChart, SpecialtyChart } from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

function formatDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(key: string) {
  const [, m, d] = key.split("-");
  return `${m}/${d}`;
}

async function getDashboardData() {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const [
    providerCount,
    acceptingCount,
    pageViewCount,
    searchCount,
    recentPageViews,
    specialtyGroups,
    recentSearches,
  ] = await Promise.all([
    prisma.provider.count({ where: { active: true } }),
    prisma.provider.count({ where: { active: true, acceptingNewPatients: true } }),
    prisma.pageView.count(),
    prisma.searchLog.count(),
    prisma.pageView.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.provider.groupBy({
      by: ["specialty"],
      where: { active: true },
      _count: { _all: true },
    }),
    prisma.searchLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const dayBuckets = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(fourteenDaysAgo);
    d.setDate(d.getDate() + i);
    dayBuckets.set(formatDateKey(d), 0);
  }
  for (const pv of recentPageViews) {
    const key = formatDateKey(pv.createdAt);
    if (dayBuckets.has(key)) {
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
    }
  }
  const trafficData = Array.from(dayBuckets.entries()).map(([key, views]) => ({
    date: formatDateLabel(key),
    views,
  }));

  const specialtyData = specialtyGroups
    .map((g) => ({ specialty: g.specialty, count: g._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    providerCount,
    acceptingCount,
    pageViewCount,
    searchCount,
    trafficData,
    specialtyData,
    recentSearches,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Overview of your DocoFied directory.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total providers" value={data.providerCount.toLocaleString()} />
        <StatCard label="Accepting new patients" value={data.acceptingCount.toLocaleString()} />
        <StatCard label="Total page views" value={data.pageViewCount.toLocaleString()} />
        <StatCard label="Total searches" value={data.searchCount.toLocaleString()} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-ink">Traffic (last 14 days)</h2>
          <div className="mt-4">
            <TrafficChart data={data.trafficData} />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-ink">Providers by specialty</h2>
          <div className="mt-4">
            <SpecialtyChart data={data.specialtyData} />
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display text-lg font-bold text-ink">Recent searches</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-2 pr-4 font-medium">Query</th>
                <th className="py-2 pr-4 font-medium">Specialty</th>
                <th className="py-2 pr-4 font-medium">Location</th>
                <th className="py-2 pr-4 font-medium">Insurance</th>
                <th className="py-2 pr-4 font-medium">Results</th>
                <th className="py-2 pr-4 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSearches.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-ink-faint">
                    No searches logged yet.
                  </td>
                </tr>
              )}
              {data.recentSearches.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="py-2 pr-4 text-ink">{s.query ?? "—"}</td>
                  <td className="py-2 pr-4 text-ink-muted">{s.specialty ?? "—"}</td>
                  <td className="py-2 pr-4 text-ink-muted">
                    {[s.city, s.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="py-2 pr-4 text-ink-muted">{s.insurance ?? "—"}</td>
                  <td className="py-2 pr-4 text-ink-muted">{s.resultsCount}</td>
                  <td className="py-2 pr-4 text-ink-faint">
                    {s.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
