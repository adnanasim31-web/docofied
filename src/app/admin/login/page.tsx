import { redirect } from "next/navigation";
import { getAdminIdFromCookies } from "@/lib/auth";
import { loginAction } from "@/app/admin/actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (getAdminIdFromCookies()) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface-sunk px-4 py-16">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
            D
          </span>
          <h1 className="mt-3 font-display text-xl font-bold text-ink">DocoFied Admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Sign in to manage your directory</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            Invalid email or password.
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-muted">Email</label>
            <input type="email" name="email" required className="input-field" placeholder="admin@docofied.com" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-muted">Password</label>
            <input type="password" name="password" required className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
