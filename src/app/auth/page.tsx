"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Field, Logo, inputClass, primaryBtn, secondaryBtn } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { findPlan, formatTry } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const intro = findPlan("intro")!;

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLang();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Set when sign-in fails because the email isn't confirmed (or the confirm link was bad),
  // so we can offer to resend the confirmation email.
  const [needsConfirm, setNeedsConfirm] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("confirm_error"),
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const next = new URLSearchParams(window.location.search).get("next");
      // Only same-site paths, so the param can't bounce users to another domain.
      router.replace(next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error?.code === "email_not_confirmed") {
          setNeedsConfirm(true);
          throw new Error(t("E-postanız henüz onaylanmamış. Onay mailini tekrar gönderebilirsiniz.", "Your email isn't confirmed yet. You can resend the confirmation email."));
        }
        if (error) throw error;
        toast.success(t("Giriş başarılı!", "Signed in!"));
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        setNeedsConfirm(true);
        toast.success(t("Kayıt başarılı! E-postanızı kontrol edin.", "Signed up! Check your email."));
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email) {
      toast.error(t("Önce e-posta adresinizi yazın.", "Enter your email first."));
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success(t("Onay maili gönderildi. Gelen kutunuzu (ve spam klasörünü) kontrol edin.", "Confirmation email sent. Check your inbox and spam."));
  };

  return (
    <div className="grain relative grid min-h-screen bg-ink text-paper lg:grid-cols-[1fr_minmax(0,560px)]">
      <div className="relative z-10 flex flex-col">
        <nav className="flex h-16 items-center px-6 sm:px-10">
          <Link href="/" className="group flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 text-faint transition-colors group-hover:text-paper" />
            <Logo size="sm" />
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold">
                {isLogin ? t("Tekrar hoş geldin", "Welcome back") : t("Hesabını oluştur", "Create your account")}
              </h1>
              <p className="text-sm text-muted">
                {isLogin
                  ? t("Kreatiflerine kaldığın yerden devam et.", "Pick up where you left off.")
                  : t(
                      `Tanışma paketiyle ${intro.credits} kredi ${formatTry(intro.priceTry)}: 3 adet 15 saniyelik video.`,
                      `The Intro pack: ${intro.credits} credits for ${formatTry(intro.priceTry)}, three 15 s videos.`,
                    )}
              </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <Field label={t("E-posta", "Email")}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={cn(inputClass, "pl-9")}
                  />
                </div>
              </Field>
              <Field label={t("Şifre", "Password")} hint={!isLogin ? t("En az 6 karakter", "At least 6 characters") : undefined}>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={cn(inputClass, "pl-9")}
                  />
                </div>
              </Field>
              <button type="submit" disabled={submitting} className={cn(primaryBtn, "h-11 w-full justify-center")}>
                {submitting ? t("Bekleyin…", "Please wait…") : isLogin ? t("Giriş yap", "Sign in") : t("Hesap oluştur", "Create account")}
              </button>
            </form>
            {needsConfirm && (
              <div className="space-y-3 rounded-lg border border-accent/40 bg-accent-soft p-4 text-sm">
                <p className="leading-relaxed text-paper/85">
                  {t(
                    "Onay linkinin süresi dolduysa ya da açılmadıysa, e-postanı yukarıya yazıp yeni bir onay maili iste. Link 24 saat geçerlidir.",
                    "If your confirmation link expired or didn't open, enter your email above and request a new one. Links are valid for 24 hours.",
                  )}
                </p>
                <button type="button" onClick={onResend} disabled={resending} className={cn(secondaryBtn, "w-full justify-center")}>
                  {resending ? t("Gönderiliyor…", "Sending…") : t("Onay mailini tekrar gönder", "Resend confirmation email")}
                </button>
              </div>
            )}
            <p className="border-t border-line pt-5 text-sm text-muted">
              {isLogin ? t("Hesabın yok mu?", "No account?") : t("Zaten hesabın var mı?", "Already have an account?")}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-accent hover:underline">
                {isLogin ? t("Kayıt ol", "Sign up") : t("Giriş yap", "Sign in")}
              </button>
            </p>
          </div>
        </div>
      </div>
      <aside className="relative hidden overflow-hidden border-l border-line lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/showcase/ugc-coffee-car.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-ink via-ink/80 to-transparent p-10 pt-32">
          <p className="font-serif text-2xl italic leading-snug text-paper">
            {t("“Kargo dün geldi, sabah ilk demlediğim bu oldu.”", "“The package came yesterday, this was the first thing I brewed.”")}
          </p>
          <p className="text-[13px] text-muted">
            {t("NexUGC çıktısı · ürün ve marka örnek amaçlı", "NexUGC output · product and brand are made up")}
          </p>
        </div>
      </aside>
    </div>
  );
}
