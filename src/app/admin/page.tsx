import { redirect } from "next/navigation";
import { getAdminIdFromCookies } from "@/lib/auth";

export default function AdminIndexPage() {
  redirect(getAdminIdFromCookies() ? "/admin/dashboard" : "/admin/login");
}
