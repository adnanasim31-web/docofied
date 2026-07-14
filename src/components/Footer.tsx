import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              D
            </span>
            <span className="font-display text-lg font-bold text-ink">
              Doco<span className="text-brand-500">Fied</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Find and book trusted healthcare providers near you.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">For Patients</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/search" className="hover:text-brand-600">
                Find a doctor
              </Link>
            </li>
            <li>
              <Link href="/#specialties" className="hover:text-brand-600">
                Browse specialties
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/admin/login" className="hover:text-brand-600">
                Admin login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6">
        <p className="container-page text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} DocoFied. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
