import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
            D
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Doco<span className="text-accent-600">Fied</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-muted sm:flex">
          <Link href="/search" className="hover:text-accent-600">
            Find care
          </Link>
          <Link href="/#specialties" className="hover:text-accent-600">
            Specialties
          </Link>
          <Link href="/#top-rated" className="hover:text-accent-600">
            Top rated
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="btn-primary">
            Find a doctor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
