import Link from "next/link";
import { prisma } from "@/lib/db";
import { StarRating } from "@/components/StarRating";
import { setReviewStatusAction } from "@/app/admin/(protected)/reviews/actions";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status ?? "pending";
  const where = status === "all" ? {} : { status };

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { provider: { select: { id: true, firstName: true, lastName: true, specialty: true } } },
  });

  async function approve(reviewId: string) {
    "use server";
    await setReviewStatusAction(reviewId, "approved");
  }
  async function reject(reviewId: string) {
    "use server";
    await setReviewStatusAction(reviewId, "rejected");
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Reviews moderation</h1>
      <p className="mt-1 text-sm text-ink-muted">Approve or reject patient reviews.</p>

      <div className="mt-6 flex gap-2 border-b border-line">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/reviews?status=${tab.key}`}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
              status === tab.key
                ? "border-b-2 border-brand-500 text-brand-600"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 && (
          <div className="card p-8 text-center text-ink-muted">No reviews in this category.</div>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{review.patientName}</p>
                <Link
                  href={`/provider/${review.provider.id}`}
                  className="text-xs text-brand-600 hover:text-brand-700"
                  target="_blank"
                >
                  {review.provider.firstName} {review.provider.lastName} &middot; {review.provider.specialty}
                </Link>
                <div className="mt-1">
                  <StarRating rating={review.rating} count={1} />
                </div>
              </div>
              <span
                className={`badge ${
                  review.status === "approved"
                    ? ""
                    : review.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
                {review.status}
              </span>
            </div>
            {review.comment && <p className="mt-3 text-sm text-ink-muted">{review.comment}</p>}
            <p className="mt-2 text-xs text-ink-faint">{review.createdAt.toLocaleString()}</p>

            <div className="mt-4 flex gap-3">
              <form action={approve.bind(null, review.id)}>
                <button
                  type="submit"
                  disabled={review.status === "approved"}
                  className="btn-secondary disabled:opacity-40"
                >
                  Approve
                </button>
              </form>
              <form action={reject.bind(null, review.id)}>
                <button
                  type="submit"
                  disabled={review.status === "rejected"}
                  className="btn-secondary disabled:opacity-40"
                >
                  Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
