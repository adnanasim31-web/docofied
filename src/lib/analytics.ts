import { prisma } from "@/lib/db";

export async function logPageView(path: string, providerId?: string | null, referrer?: string | null) {
  try {
    await prisma.pageView.create({
      data: { path, providerId: providerId ?? null, referrer: referrer ?? null },
    });
  } catch {
    // Best-effort logging; never block rendering on analytics failures.
  }
}

export async function logSearch(params: {
  query?: string | null;
  specialty?: string | null;
  state?: string | null;
  city?: string | null;
  insurance?: string | null;
  resultsCount: number;
}) {
  try {
    await prisma.searchLog.create({
      data: {
        query: params.query ?? null,
        specialty: params.specialty ?? null,
        state: params.state ?? null,
        city: params.city ?? null,
        insurance: params.insurance ?? null,
        resultsCount: params.resultsCount,
      },
    });
  } catch {
    // Best-effort logging.
  }
}
