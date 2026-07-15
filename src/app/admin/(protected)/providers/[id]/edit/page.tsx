import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProviderForm } from "@/components/admin/ProviderForm";
import { updateProviderAction } from "@/app/admin/(protected)/providers/actions";

export default async function EditProviderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { created?: string; saved?: string };
}) {
  const provider = await prisma.provider.findUnique({ where: { id: params.id } });
  if (!provider) notFound();

  const boundAction = updateProviderAction.bind(null, provider.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Edit provider</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {provider.firstName} {provider.lastName}
      </p>

      {(searchParams.created || searchParams.saved) && (
        <div className="mt-4 max-w-3xl rounded-xl border border-accent-100 bg-accent-tint px-4 py-2 text-sm text-brand">
          {searchParams.created ? "Provider created successfully." : "Changes saved."}
        </div>
      )}

      <div className="mt-6 max-w-3xl">
        <ProviderForm action={boundAction} initial={provider} submitLabel="Save changes" />
      </div>
    </div>
  );
}
