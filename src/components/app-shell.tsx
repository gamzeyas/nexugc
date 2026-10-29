"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Coins, LayoutGrid, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { LangSwitch, Logo } from "./ui";

/** Authenticated layout: redirects to /auth when signed out, like the original ProtectedRoute. */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => {
    if (!loading && !user) {
      // Come back here after signing in (e.g. /credits?plan=intro from the landing page).
      router.replace(`/auth?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [loading, user, router]);

  // Same query key as the credits page, so buying credits updates the badge too.
  const { data: credits } = useQuery({
    queryKey: ["user-credits"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("balance, intro_used")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? { balance: 0, intro_used: false };
    },
  });

  if (loading || !user) return null;

  const nav = [
    { to: "/dashboard", label: t("Kreatifler", "Creatives"), icon: LayoutGrid },
    { to: "/create", label: t("Yeni kreatif", "New creative"), icon: Plus },
  ];

  return (
    <div className="grain relative min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-5">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" aria-label="NexUGC">
              <Logo size="sm" />
            </Link>
            <nav className="flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                    pathname === item.to ? "bg-paper/[0.07] text-paper" : "text-muted hover:text-paper",
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/credits"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[13px] font-semibold tabular-nums transition-colors",
                pathname === "/credits" ? "border-accent text-accent" : "border-line text-paper hover:border-line-strong",
              )}
            >
              <Coins className="h-3.5 w-3.5 text-accent" />
              {credits?.balance ?? "–"}
              <span className="hidden font-normal text-muted sm:inline">{t("kredi", "credits")}</span>
            </Link>
            <div className="hidden sm:block">
              <LangSwitch />
            </div>
            <button
              onClick={signOut}
              title={t("Çıkış", "Sign out")}
              className="rounded-md p-2 text-faint transition-colors hover:bg-paper/[0.05] hover:text-paper"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
