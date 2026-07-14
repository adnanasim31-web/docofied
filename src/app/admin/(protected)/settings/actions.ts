"use server";

import { revalidatePath } from "next/cache";
import { setSetting, SETTING_KEYS } from "@/lib/settings";

export async function saveIntegrationSettingsAction(formData: FormData) {
  const gaId = String(formData.get("gaId") ?? "").trim();
  const mapsKey = String(formData.get("mapsKey") ?? "").trim();

  await setSetting(SETTING_KEYS.GA_MEASUREMENT_ID, gaId);
  await setSetting(SETTING_KEYS.GOOGLE_MAPS_API_KEY, mapsKey);

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
