import Link from "next/link";

export function Footer() {
  return (
    <div className="px-4 pb-8 pt-2 sm:px-6 sm:pb-8 lg:px-8">
      <footer className="panel bg-brand-dark">
        <div className="p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient text-sm font-bold text-white">
                  D
                </span>
                <span className="font-display text-lg font-bold text-white">
                  Doco<span className="text-accent-400">Fied</span>
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Find the right doctor.{" "}
                <span className="text-accent-400">Book with confidence.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-6 lg:justify-end">
              <div>
                <h4 className="text-sm font-semibold text-white">For Patients</h4>
                <ul className="mt-3 space-y-2 text-sm text-mint">
                  <li>
                    <Link href="/search" className="hover:text-accent-400">
                      Find a doctor
                    </Link>
                  </li>
                  <li>
                    <Link href="/#specialties" className="hover:text-accent-400">
                      Browse specialties
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Company</h4>
                <ul className="mt-3 space-y-2 text-sm text-mint">
                  <li>
                    <Link href="/admin/login" className="hover:text-accent-400">
                      Admin login
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Legal</h4>
                <ul className="mt-3 space-y-2 text-sm text-mint">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="pt-6 text-xs text-mint/70">
            &copy; {new Date().getFullYear()} DocoFied. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
