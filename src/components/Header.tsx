import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
            D
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Doco<span className="text-brand-500">Fied</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted sm:flex">
          <Link href="/search" className="hover:text-brand-600">
            Find care
          </Link>
          <Link href="/#specialties" className="hover:text-brand-600">
            Specialties
          </Link>
          <Link href="/#top-rated" className="hover:text-brand-600">
            Top rated
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="btn-primary">
            Find a doctor
          </Link>
        </div>
      </div>
    </header>
  );
}
