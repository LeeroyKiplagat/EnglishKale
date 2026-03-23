"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchWebProfile, getCurrentUserId, hasSubmittedConsent, signOut } from "@/lib/mobile-flow-api";
import { supabase } from "@/lib/supabase-browser";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("EK");
  const [hasConsented, setHasConsented] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsLoggedIn(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setIsLoggedIn(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setHasConsented(false);
      return;
    }

    let active = true;
    void (async () => {
      const [profile, userId] = await Promise.all([fetchWebProfile(), getCurrentUserId()]);
      if (!active) return;
      if (profile?.initials) setUserInitials(profile.initials);
      if (!userId) {
        setHasConsented(false);
        return;
      }
      try {
        const consented = await hasSubmittedConsent(userId);
        if (active) setHasConsented(consented);
      } catch {
        if (active) setHasConsented(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  const navItems = useMemo(
    () =>
      isLoggedIn
        ? [
            { href: "/", label: "Home" },
            { href: "/lessons", label: "Lessons" },
            { href: "/translation", label: "Translation" },
            ...(hasConsented ? [] : [{ href: "/consent", label: "Consent" }]),
          ]
        : [
            { href: "/", label: "Home" },
            { href: "/lessons", label: "Lessons" },
            { href: "/translation", label: "Translation" },
            { href: "/login", label: "Login" },
            { href: "/signup", label: "Register" },
          ],
    [hasConsented, isLoggedIn],
  );

  async function onLogout() {
    await signOut();
    setIsLoggedIn(false);
    setMobileOpen(false);
    router.push("/login");
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04120d]/90 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" onClick={closeMobileMenu} className="text-sm font-bold tracking-wide text-emerald-200">
            EnglishKale
        </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex h-8 items-center rounded-full border border-white/20 bg-white/10 px-3 text-xs font-semibold text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>

          <div className="hidden items-center justify-end gap-2 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active ? "bg-emerald-300 text-zinc-950" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  aria-label="Open profile"
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition ${
                    pathname.startsWith("/profile")
                      ? "border-emerald-200 bg-emerald-300 text-zinc-950"
                      : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {userInitials}
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 md:hidden">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    active ? "bg-emerald-300 text-zinc-950" : "bg-white/10 text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {isLoggedIn ? (
              <div className="mt-1 grid gap-2">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    pathname.startsWith("/profile") ? "bg-emerald-300 text-zinc-950" : "bg-white/10 text-white"
                  }`}
                >
                  Profile ({userInitials})
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-xl bg-white/10 px-3 py-2 text-left text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
