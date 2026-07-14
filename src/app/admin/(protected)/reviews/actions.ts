"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

async function recomputeProviderRating(providerId: string) {
  const approved = await prisma.review.findMany({
    where: { providerId, status: "approved" },
    select: { rating: true },
  });
  const ratingCount = approved.length;
  const ratingAvg =
    ratingCount > 0
      ? Math.round((approved.reduce((sum, r) => sum + r.rating, 0) / ratingCount) * 10) / 10
      : 0;

  await prisma.provider.update({
    where: { id: providerId },
    data: { ratingAvg, ratingCount },
  });
}

export async function setReviewStatusAction(reviewId: string, status: "approved" | "rejected") {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });
  await recomputeProviderRating(review.providerId);
  revalidatePath("/admin/reviews");
  revalidatePath(`/provider/${review.providerId}`);
}
