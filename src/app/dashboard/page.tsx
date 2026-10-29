"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, Play, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge, Eyebrow, PhoneFrame, primaryBtn } from "@/components/ui";
import { useLang } from "@/lib/i18n";
import { getPreset } from "@/lib/presets";
import { authedFetch, supabase, type UgcVideo } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const STATUS = {
  pending: { tr: "Sırada", en: "Queued", tone: "neutral" },
  processing: { tr: "Üretiliyor", en: "Rendering", tone: "accent" },
  completed: { tr: "Hazır", en: "Ready", tone: "ok" },
  failed: { tr: "Başarısız · kredi iade", en: "Failed · refunded", tone: "danger" },
} as const;

async function downloadVideo(url: string, name: string) {
  try {
    const blob = await (await fetch(url)).blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, "_blank");
  }
}

function Dashboard() {
  const queryClient = useQueryClient();
  const { t } = useLang();
  const [player, setPlayer] = useState<{ url: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["ugc-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ugc_videos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as UgcVideo[];
    },
  });

  // Poll fal for any in-flight videos every 10s until they settle.
  useEffect(() => {
    const active = videos.filter(
      (v) => (v.status === "processing" || v.status === "pending") && v.fal_request_id,
    );
    if (active.length === 0) return;
    let cancelled = false;
    const poll = async () => {
      await Promise.all(
        active.map(async (v) => {
          try {
            const res = await authedFetch(`/api/fal-status?request_id=${v.fal_request_id}&video_id=${v.id}`);
            const json = await res.json();
            if (json.status === "completed" || json.status === "failed") {
              queryClient.invalidateQueries({ queryKey: ["ugc-videos"] });
              queryClient.invalidateQueries({ queryKey: ["user-credits"] });
            }
          } catch (err) {
            console.warn("fal-status poll failed", err);
          }
        }),
      );
    };
    poll();
    const id = setInterval(() => {
      if (!cancelled) poll();
    }, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [videos, queryClient]);

  const onDelete = async (e: MouseEvent, id: string) => {
    e.stopPropagation();
    if (deleting) return;
    setDeleting(id);
    const { error } = await supabase.from("ugc_videos").delete().eq("id", id);
    if (error) toast.error(t("Video silinemedi", "Couldn't delete the video"));
    else {
      toast.success(t("Video silindi", "Video deleted"));
      queryClient.invalidateQueries({ queryKey: ["ugc-videos"] });
    }
    setDeleting(null);
  };

  const ready = videos.filter((v) => v.status === "completed").length;
  const inFlight = videos.filter((v) => v.status === "processing" || v.status === "pending").length;

  return (
    <div className="space-y-10">
      {player && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 px-4"
          onClick={() => setPlayer(null)}
        >
          <div className="w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{player.name}</span>
              <button
                onClick={() => setPlayer(null)}
                className="rounded-md p-1.5 text-muted hover:bg-paper/[0.06] hover:text-paper"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <PhoneFrame>
              <video src={player.url} controls autoPlay playsInline className="h-full w-full object-cover" />
            </PhoneFrame>
            <button
              onClick={() => downloadVideo(player.url, player.name)}
              className={cn(primaryBtn, "w-full justify-center")}
            >
              <Download className="h-4 w-4" />
              {t("MP4 olarak indir", "Download MP4")}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Eyebrow>{t("Kreatif kütüphanesi", "Creative library")}</Eyebrow>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{t("Kreatiflerin", "Your creatives")}</h1>
          <p className="text-sm text-muted">
            {videos.length === 0
              ? t("Ürettiğin her video burada durur.", "Every video you make lives here.")
              : t(
                  `${videos.length} video · ${ready} hazır${inFlight ? ` · ${inFlight} üretiliyor` : ""}`,
                  `${videos.length} videos · ${ready} ready${inFlight ? ` · ${inFlight} rendering` : ""}`,
                )}
          </p>
        </div>
        <Link href="/create" className={primaryBtn}>
          <Plus className="h-4 w-4" />
          {t("Yeni kreatif", "New creative")}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("Yükleniyor…", "Loading…")}
        </div>
      ) : videos.length === 0 ? (
        <div className="grid gap-8 rounded-[var(--radius-card)] border border-dashed border-line-strong p-8 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
          <div className="max-w-lg space-y-3">
            <h2 className="font-display text-2xl font-semibold">{t("İlk testini hazırla", "Set up your first test")}</h2>
            <p className="text-sm leading-relaxed text-muted">
              {t(
                "Test etmek istediğin ürünü seç ve aynı ürün için 3 farklı video çıkar: farklı yüz, farklı mekan, farklı ilk cümle. Sonra üçünü aynı reklam setine koy.",
                "Pick a product you want to test and make 3 different videos for it: different face, setting and opening line. Then put all three in the same ad set.",
              )}
            </p>
            <Link href="/create" className={cn(primaryBtn, "mt-2")}>
              <Plus className="h-4 w-4" />
              {t("İlk kreatifini oluştur", "Make your first creative")}
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/showcase/ugc-coffee-kitchen.jpg"
            alt=""
            className="hidden aspect-[9/16] w-32 rounded-lg border border-line object-cover opacity-80 sm:block"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => {
            const st = STATUS[v.status] ?? STATUS.pending;
            const playable = v.status === "completed" && v.final_video_url;
            const preset = getPreset(v.voice_name?.toLowerCase());
            const name = v.preset_name || preset?.name || "Video";
            return (
              <article key={v.id} className="group space-y-3">
                <button
                  type="button"
                  disabled={!playable}
                  onClick={() => playable && setPlayer({ url: v.final_video_url!, name })}
                  className="block w-full text-left disabled:cursor-default"
                >
                  <PhoneFrame className="transition-colors group-hover:border-paper/30">
                    {playable ? (
                      <>
                        <video src={v.final_video_url!} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                        <span className="absolute inset-0 grid place-items-center bg-ink/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink">
                            <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                          </span>
                        </span>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
                        {v.input_image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.input_image_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
                        )}
                        {v.status === "failed" ? null : <Loader2 className="relative h-5 w-5 animate-spin text-accent" />}
                        <p className="relative text-[12px] text-muted">
                          {v.status === "failed"
                            ? t("Bu video üretilemedi", "This video couldn't be made")
                            : t("Genelde 1–3 dakika sürer", "Usually takes 1–3 minutes")}
                        </p>
                      </div>
                    )}
                    <Badge tone={st.tone} className="absolute left-2 top-2">
                      {t(st.tr, st.en)}
                    </Badge>
                  </PhoneFrame>
                </button>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{name}</p>
                    <p className="shrink-0 text-[11px] text-faint">{new Date(v.created_at).toLocaleDateString("tr-TR")}</p>
                  </div>
                  {v.script_text && <p className="line-clamp-2 text-[12px] leading-snug text-muted">{v.script_text}</p>}
                  {v.status === "failed" && v.error && (
                    <p className="line-clamp-2 text-[11px] text-danger/80" title={v.error}>
                      {v.error}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {playable && (
                    <button
                      onClick={() => downloadVideo(v.final_video_url!, name)}
                      className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] font-medium text-muted hover:border-line-strong hover:text-paper"
                    >
                      <Download className="h-3 w-3" />
                      {t("İndir", "Download")}
                    </button>
                  )}
                  <button
                    onClick={(e) => onDelete(e, v.id)}
                    disabled={deleting === v.id}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-faint hover:bg-danger/10 hover:text-danger"
                  >
                    {deleting === v.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    {t("Sil", "Delete")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}
