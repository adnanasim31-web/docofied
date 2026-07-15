"use client";

import { useEffect, useRef, useState } from "react";

type RevealState = "plain" | "hidden" | "visible";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "plain" (no animation classes) is the state used for server rendering and
  // whenever JS never runs — content is always fully visible without it.
  const [state, setState] = useState<RevealState>("plain");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    // If it's already on screen by the time we can check, just show it as-is
    // rather than hiding and re-revealing it (avoids a visible flash/flicker).
    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);

    // Fail-safe: never leave content permanently hidden if the observer
    // doesn't fire for any reason.
    const fallback = setTimeout(() => setState("visible"), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const revealClass = state === "plain" ? "" : state === "visible" ? "reveal reveal-visible" : "reveal";

  return (
    <div
      ref={ref}
      className={`${revealClass} ${className}`}
      style={state === "hidden" ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
