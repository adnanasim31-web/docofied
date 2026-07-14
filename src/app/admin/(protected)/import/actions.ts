"use server";

import { revalidatePath } from "next/cache";
import { importProvidersFromCsv, type ImportResult } from "@/lib/csvImport";

export async function importProvidersAction(csvText: string): Promise<ImportResult> {
  const result = await importProvidersFromCsv(csvText);
  revalidatePath("/admin/providers");
  revalidatePath("/admin/dashboard");
  return result;
}
