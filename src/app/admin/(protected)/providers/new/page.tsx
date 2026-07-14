import { ProviderForm } from "@/components/admin/ProviderForm";
import { createProviderAction } from "@/app/admin/(protected)/providers/actions";

export default function NewProviderPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Add provider</h1>
      <p className="mt-1 text-sm text-ink-muted">Create a new provider listing.</p>
      <div className="mt-6 max-w-3xl">
        <ProviderForm action={createProviderAction} submitLabel="Create provider" />
      </div>
    </div>
  );
}
