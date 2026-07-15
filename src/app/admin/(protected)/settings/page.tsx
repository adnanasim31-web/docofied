import { redirect } from "next/navigation";
import { getAllSettings, SETTING_KEYS } from "@/lib/settings";
import { saveIntegrationSettingsAction } from "@/app/admin/(protected)/settings/actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const settings = await getAllSettings();

  async function save(formData: FormData) {
    "use server";
    await saveIntegrationSettingsAction(formData);
    redirect("/admin/settings?saved=1");
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Integrations</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Connect analytics and mapping services for your public site.
      </p>

      {searchParams.saved && (
        <div className="mt-4 max-w-xl rounded-xl border border-accent-100 bg-accent-tint px-4 py-2 text-sm text-brand">
          Settings saved.
        </div>
      )}

      <form action={save} className="card mt-6 max-w-xl space-y-5 p-6">
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-muted">
            Google Analytics 4 measurement ID
          </label>
          <input
            type="text"
            name="gaId"
            defaultValue={settings[SETTING_KEYS.GA_MEASUREMENT_ID] ?? ""}
            placeholder="G-XXXXXXXXXX"
            className="input-field"
          />
          <p className="mt-1 text-xs text-ink-faint">
            When set, the GA4 tag automatically loads on all public pages.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-muted">
            Google Maps API key
          </label>
          <input
            type="text"
            name="mapsKey"
            defaultValue={settings[SETTING_KEYS.GOOGLE_MAPS_API_KEY] ?? ""}
            placeholder="AIza..."
            className="input-field"
          />
          <p className="mt-1 text-xs text-ink-faint">
            Used for embedded maps and directions on provider profiles.
          </p>
        </div>

        <button type="submit" className="btn-primary">
          Save settings
        </button>
      </form>
    </div>
  );
}
