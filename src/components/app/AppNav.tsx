"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchWebProfile, signOut } from "@/lib/mobile-flow-api";
import { supabase } from "@/lib/supabase-browser";

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState("EK");

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
    if (!isLoggedIn) return;
    fetchWebProfile().then((profile) => {
      if (profile?.initials) setUserInitials(profile.initials);
    });
  }, [isLoggedIn]);

  const navItems = useMemo(
    () =>
      isLoggedIn
        ? [
            { href: "/", label: "Home" },
            { href: "/lessons", label: "Lessons" },
            { href: "/translation", label: "Translation" },
            { href: "/consent", label: "Consent" },
          ]
        : [
            { href: "/", label: "Home" },
            { href: "/lessons", label: "Lessons" },
            { href: "/translation", label: "Translation" },
            { href: "/login", label: "Login" },
            { href: "/signup", label: "Register" },
          ],
    [isLoggedIn],
  );

  async function onLogout() {
    await signOut();
    setIsLoggedIn(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04120d]/85 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-bold tracking-wide text-emerald-200">
          EnglishKale
        </Link>

        <div className="flex flex-wrap justify-end gap-2">
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
      </nav>
    </header>
  );
}
