import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminIdFromCookies } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/providers", label: "Providers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/import", label: "Bulk import" },
  { href: "/admin/settings", label: "Integrations" },
];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const adminId = getAdminIdFromCookies();
  if (!adminId) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-surface-sunk">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-white sm:block">
        <div className="flex h-16 items-center gap-2 border-b border-line px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            D
          </span>
          <span className="font-display text-base font-bold text-ink">
            Doco<span className="text-brand-500">Fied</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <form action={logoutAction}>
            <button type="submit" className="btn-secondary w-full">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6 sm:hidden">
          <span className="font-display text-base font-bold text-ink">DocoFied Admin</span>
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-semibold text-brand-600">
              Sign out
            </button>
          </form>
        </header>
        <main className="p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
