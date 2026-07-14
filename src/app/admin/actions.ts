"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { setAdminSessionCookie, clearAdminSessionCookie, verifyPassword } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  const valid = admin ? await verifyPassword(password, admin.passwordHash) : false;

  if (!admin || !valid) {
    redirect("/admin/login?error=1");
  }

  await setAdminSessionCookie(admin.id);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  clearAdminSessionCookie();
  redirect("/admin/login");
}
