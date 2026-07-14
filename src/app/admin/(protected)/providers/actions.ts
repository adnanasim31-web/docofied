"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  const s = typeof v === "string" ? v.trim() : "";
  return s.length > 0 ? s : null;
}

function providerDataFromForm(formData: FormData) {
  return {
    npi: str(formData, "npi"),
    firstName: str(formData, "firstName") ?? "",
    lastName: str(formData, "lastName") ?? "",
    orgName: str(formData, "orgName"),
    credentials: str(formData, "credentials"),
    specialty: str(formData, "specialty") ?? "",
    subSpecialty: str(formData, "subSpecialty"),
    phone: str(formData, "phone"),
    email: str(formData, "email"),
    website: str(formData, "website"),
    addressLine1: str(formData, "addressLine1"),
    addressLine2: str(formData, "addressLine2"),
    city: str(formData, "city") ?? "",
    state: (str(formData, "state") ?? "").toUpperCase(),
    zip: str(formData, "zip"),
    gender: str(formData, "gender"),
    languages: str(formData, "languages"),
    acceptingNewPatients: formData.get("acceptingNewPatients") === "on",
    active: formData.get("active") === "on",
    bio: str(formData, "bio"),
    photoUrl: str(formData, "photoUrl"),
  };
}

export async function createProviderAction(formData: FormData) {
  const data = providerDataFromForm(formData);
  const provider = await prisma.provider.create({ data });
  revalidatePath("/admin/providers");
  redirect(`/admin/providers/${provider.id}/edit?created=1`);
}

export async function updateProviderAction(id: string, formData: FormData) {
  const data = providerDataFromForm(formData);
  await prisma.provider.update({ where: { id }, data });
  revalidatePath("/admin/providers");
  redirect(`/admin/providers/${id}/edit?saved=1`);
}

export async function deleteProviderAction(id: string) {
  await prisma.provider.delete({ where: { id } });
  revalidatePath("/admin/providers");
  redirect("/admin/providers?deleted=1");
}
