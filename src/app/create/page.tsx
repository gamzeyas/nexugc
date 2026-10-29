"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import { Box, Check, ChevronDown, Hand, ImageIcon, Loader2, RefreshCw, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge, Card, Chip, Eyebrow, Field, PhoneFrame, primaryBtn, secondaryBtn, textareaClass } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { INFLUENCER_PRESETS } from "@/lib/presets";
import { creditsForSeconds } from "@/lib/pricing";
import { buildCameraDirection, buildProductDetails, buildSceneType, ENERGY_DIRECTIONS } from "@/lib/prompt-builder";
import { checkScript, MAX_CHARS, MAX_WORDS, MIN_WORDS } from "@/lib/script-limits";
import { authedFetch, supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  { value: "ev", label: "Ev" },
  { value: "ofis", label: "Ofis" },
  { value: "cafe", label: "Kafe" },
  { value: "sokak", label: "Sokak" },
  { value: "doğa", label: "Doğa" },
  { value: "spor_salonu", label: "Spor salonu" },
  { value: "plaj", label: "Plaj" },
  { value: "stüdyo", label: "Stüdyo" },
];

const LIGHTING = [
  { value: "doğal", label: "Doğal" },
  { value: "altın_saat", label: "Altın saat" },
  { value: "stüdyo", label: "Stüdyo" },
  { value: "dramatik", label: "Dramatik" },
  { value: "neon", label: "Neon" },
];

const INTERACTIONS = [
  { value: "hand_hold", label: "Elinde tutuyor", icon: Hand },
  { value: "table_stand", label: "Masada duruyor", icon: Box },
  { value: "shoulder", label: "Omzunda", icon: User },
  { value: "background", label: "Arka planda", icon: ImageIcon },
];

const ENERGIES = [
  { value: "friendly", label: "Samimi" },
  { value: "excited", label: "Heyecanlı" },
  { value: "calm", label: "Sakin" },
  { value: "confident", label: "Kendinden emin" },
  { value: "serious", label: "Ciddi" },
];

const ENERGY_LABEL = { low: "Sakin", medium: "Dengeli", high: "Enerjik" };

const STAGES = [
  { label: "Sahne hazırlanıyor", percent: 8 },
  { label: "Görsel oluşturuluyor", percent: 22 },
  { label: "Ürün sahneye yerleştiriliyor", percent: 40 },
  { label: "Ses kaydediliyor", percent: 58 },
  { label: "Dudak senkronu yapılıyor", percent: 78 },
  { label: "Son kontroller", percent: 94 },
];

type Status =
  | { step: "idle" }
  | { step: "submitting" }
  | { step: "processing"; requestId: string; videoId: string; stageIdx: number }
  | { step: "completed"; videoUrl?: string }
  | { step: "failed"; error: string };

function Step({ n, title, lead, children }: { n: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <div className="space-y-1">
        <Eyebrow>{n}</Eyebrow>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {lead && <p className="text-sm text-muted">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

/** Collapsible block for the optional free-text overrides, so the main flow stays short. */
function Advanced({ children }: { children: ReactNode }) {
  return (
    <details className="group rounded-lg border border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-[13px] font-medium text-muted hover:text-paper [&::-webkit-details-marker]:hidden">
        Daha fazla kontrol
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-line p-3.5">{children}</div>
    </details>
  );
}

function CreateVideo() {
  const { user } = useAuth();
  const router = useRouter();
  const [presetId, setPresetId] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [lighting, setLighting] = useState<string | null>(null);
  const [interaction, setInteraction] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [script, setScript] = useState("");
  const scriptCheck = checkScript(script);
  const cost = scriptCheck.ok ? scriptCheck.credits : null;
  const queryClient = useQueryClient();
  // Same query as the header badge, so both update together after a video starts or fails.
  const { data: credits } = useQuery({
    queryKey: ["user-credits"],
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
  const balance = credits?.balance ?? null;
  const shortBy = cost !== null && balance !== null && balance < cost ? cost - balance : 0;
  const [voiceDetail, setVoiceDetail] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [customAvatar, setCustomAvatar] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [customProduct, setCustomProduct] = useState("");
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ step: "idle" });
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const presets = useMemo(
    () => [...INFLUENCER_PRESETS].sort((a, b) => a.name.localeCompare(b.name, "tr")),
    [],
  );
  const preset = presets.find((p) => p.id === presetId);

  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Görsel 10MB'dan büyük olamaz.");
      return;
    }
    setProductFile(file);
    setProductPreview(URL.createObjectURL(file));
  };

  const uploadProduct = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
  };

  const startPolling = (requestId: string, videoId: string) => {
    let stage = 0;
    pollRef.current = setInterval(async () => {
      try {
        const res = await authedFetch(`/api/fal-status?request_id=${requestId}&video_id=${videoId}`);
        const json = await res.json();
        if (json.status === "completed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setStatus({ step: "completed", videoUrl: json.video_url });
          queryClient.invalidateQueries({ queryKey: ["user-credits"] });
          toast.success("Video başarıyla oluşturuldu!");
        } else if (json.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setStatus({ step: "failed", error: json.error || "Video üretimi başarısız oldu." });
          queryClient.invalidateQueries({ queryKey: ["user-credits"] });
          toast.error("Video üretimi başarısız.");
        } else {
          stage = Math.min(stage + 1, STAGES.length - 1);
          setStatus({ step: "processing", requestId, videoId, stageIdx: stage });
        }
      } catch {}
    }, 5000);
  };

  const onCreate = async () => {
    if (!preset || !script.trim() || !productFile) {
      toast.error("Lütfen bir influencer seçin, ürün görseli yükleyin ve senaryo yazın.");
      return;
    }
    if (!scriptCheck.ok || !cost) {
      toast.error(scriptCheck.error);
      return;
    }
    // A quick check for a clear message; the server reserves the credits atomically anyway.
    const { data: fresh } = await supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (!fresh || fresh.balance < cost) {
      toast.error(`Bu video ${cost} kredi tutuyor, bakiyen ${fresh?.balance ?? 0} kredi.`, {
        action: { label: "Kredi al", onClick: () => router.push("/credits") },
      });
      return;
    }
    setStatus({ step: "submitting" });
    try {
      const productUrl = await uploadProduct(productFile);

      let voice = {
        voice_name: preset.voiceName,
        style: preset.stylePrompt,
        speed: preset.speed,
        output_text: script,
      };
      try {
        const res = await authedFetch("/api/voice-director", {
          method: "POST",
          body: JSON.stringify({
            script,
            forced_preset: {
              name: preset.name,
              voice_name: preset.voiceName,
              style_prompt: preset.stylePrompt,
              base_speed: preset.speed,
            },
            extra_detail:
              [energy ? `Energy: ${ENERGY_DIRECTIONS[energy]}.` : "", voiceDetail].filter(Boolean).join(" ") || null,
          }),
        });
        if (res.ok) voice = await res.json();
      } catch (err) {
        console.warn("voice-director failed, using preset defaults:", err);
      }

      let enhanced = { enhancedAvatar: "", enhancedLocation: "", enhancedProduct: "", enhancedVideo: "" };
      try {
        const res = await authedFetch("/api/enhance-prompt", {
          method: "POST",
          body: JSON.stringify({
            customAvatarPrompt: customAvatar.trim(),
            customLocationPrompt: customLocation.trim(),
            customProductPrompt: customProduct.trim(),
            customVideoPrompt: videoPrompt.trim(),
            scriptText: voice.output_text || script,
            hasProduct: true,
          }),
        });
        if (res.ok) enhanced = await res.json();
      } catch (err) {
        console.warn("Prompt enhancement failed:", err);
      }

      const productDetails = buildProductDetails({
        enhancedProduct: enhanced.enhancedProduct,
        customProduct: customProduct,
      });
      const cameraDirection = buildCameraDirection({
        locationChip: location,
        lightingChip: lighting,
        enhancedLocation: enhanced.enhancedLocation,
        customLocation,
        enhancedAvatar: enhanced.enhancedAvatar,
        customAvatar,
        enhancedVideo: enhanced.enhancedVideo,
        customVideo: videoPrompt,
      });

      const { data: row, error } = await supabase
        .from("ugc_videos")
        .insert({
          user_id: user!.id,
          preset_name: preset.name,
          voice_name: preset.voiceName,
          script_text: script,
          input_image_url: productUrl,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;

      const res = await authedFetch("/api/fal-workflow", {
        method: "POST",
        body: JSON.stringify({
          video_id: row.id,
          preset_id: preset.id,
          product_url: productUrl,
          scene_type: buildSceneType(interaction),
          product_prompt: productDetails,
          camera_direction_prompt: cameraDirection,
          script: voice.output_text || script,
          expected_credits: cost,
          location,
          voice: voice.voice_name,
          style_instructions: `${voice.style} Speaking rate: ${voice.speed}x.`,
        }),
      });
      const json = await res.json();
      queryClient.invalidateQueries({ queryKey: ["user-credits"] });
      if (!res.ok || !json.success) throw new Error(json.error || "Workflow başlatılamadı");

      setStatus({ step: "processing", requestId: json.request_id, videoId: row.id, stageIdx: 0 });
      startPolling(json.request_id, row.id);
      toast.info("Video üretimi başlatıldı!");
    } catch (err) {
      console.error("Create error:", err);
      setStatus({ step: "failed", error: (err as Error).message });
      toast.error((err as Error).message);
    }
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus({ step: "idle" });
    setScript("");
    setProductFile(null);
    setProductPreview(null);
    setPresetId(null);
    setVoiceDetail("");
    setVideoPrompt("");
    setCustomAvatar("");
    setCustomLocation("");
    setCustomProduct("");
    setLocation(null);
    setLighting(null);
    setInteraction(null);
    setEnergy(null);
  };

  const busy = status.step === "submitting" || status.step === "processing";

  // Keep product, character and scene; only the status resets, so the next take is one edit away.
  const newVariation = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus({ step: "idle" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const counterTone = !scriptCheck.words
    ? "text-faint"
    : !scriptCheck.ok
      ? "text-danger"
      : scriptCheck.words >= MAX_WORDS - 10
        ? "text-accent"
        : "text-ok";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Eyebrow>Yeni kreatif</Eyebrow>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Bir video, bir açı</h1>
        <p className="max-w-2xl text-sm text-muted">
          Test için aynı ürünle birkaç video çıkar: farklı sunucu, farklı mekan ya da farklı ilk cümle. Kredi video
          süresine göre harcanır: 5 sn {creditsForSeconds(5)} kredi, 15 sn {creditsForSeconds(15)} kredi, 30 sn{" "}
          {creditsForSeconds(30)} kredi.
        </p>
      </div>

      {busy && (
        <Card className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
            <span className="font-display text-lg font-semibold">
              {status.step === "submitting" ? "Gönderiliyor" : STAGES[status.stageIdx]?.label || "Üretiliyor"}…
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-1000"
              style={{ width: `${status.step === "submitting" ? 3 : STAGES[status.stageIdx]?.percent || 10}%` }}
            />
          </div>
          <p className="text-sm text-muted">
            Genelde 1–3 dakika sürer. Sayfadan çıkabilirsin; video{" "}
            <Link href="/dashboard" className="text-paper underline underline-offset-2">
              Kreatifler
            </Link>{" "}
            sayfasına düşer.
          </p>
        </Card>
      )}

      {status.step === "completed" && (
        <Card className="grid gap-8 p-6 sm:grid-cols-[220px_1fr] sm:items-start">
          {status.videoUrl && (
            <PhoneFrame>
              <video src={status.videoUrl} controls autoPlay playsInline className="h-full w-full object-cover" />
            </PhoneFrame>
          )}
          <div className="space-y-4">
            <Badge tone="ok">
              <Check className="h-3 w-3" /> Hazır
            </Badge>
            <h2 className="font-display text-2xl font-semibold">Video hazır. Bir tane daha?</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Tek videoyla test olmaz. Aynı ürün ve ayarlarla yeni bir varyasyon aç; sadece ilk cümleyi ya da sunucuyu
              değiştir, sonra hepsini aynı reklam setine koy.
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={newVariation} className={primaryBtn}>
                <RefreshCw className="h-4 w-4" />
                Aynı ürünle yeni varyasyon
              </button>
              <button onClick={reset} className={secondaryBtn}>
                Baştan başla
              </button>
              <Link href="/dashboard" className={secondaryBtn}>
                Kreatiflere git
              </Link>
            </div>
          </div>
        </Card>
      )}

      {status.step === "failed" && (
        <Card className="space-y-4 border-danger/40 p-6">
          <p className="font-semibold text-danger">Video oluşturulamadı</p>
          <p className="text-sm text-muted">{status.error}</p>
          <p className="text-[13px] text-faint">Üretim için ayrılan kredi bakiyene geri döndü.</p>
          <button onClick={newVariation} className={secondaryBtn}>
            Ayarları koruyup tekrar dene
          </button>
        </Card>
      )}

      {!busy && status.step !== "completed" && (
        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="space-y-8">
            <Step n="01 · Sunucu" title="Kim anlatsın?" lead="Her karakterin kendi sesi ve konuşma tarzı var.">
              <div className="grid max-h-[460px] grid-cols-3 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5">
                {presets.map((p) => {
                  const selected = presetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPresetId(p.id)}
                      aria-pressed={selected}
                      className={cn(
                        "group rounded-lg border p-1.5 text-left transition-colors",
                        selected ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        loading="lazy"
                        className="aspect-square w-full rounded-md object-cover"
                      />
                      <div className="px-0.5 pb-0.5 pt-1.5">
                        <p className="text-[13px] font-semibold leading-tight">{p.name}</p>
                        <p className="text-[11px] text-faint">
                          {p.gender === "female" ? "Kadın" : "Erkek"} · {ENERGY_LABEL[p.baseEnergy] ?? "Dengeli"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {preset && <p className="text-[13px] text-muted">{preset.description}</p>}
              <Advanced>
                <Field label="Görünümü değiştir" optional hint="Yazdığın özellikler karakterin varsayılan görünümünün önüne geçer.">
                  <textarea
                    placeholder="Örn: kısa kıvırcık saç, gözlüklü, bej kazak"
                    value={customAvatar}
                    onChange={(e) => setCustomAvatar(e.target.value)}
                    rows={2}
                    className={cn(textareaClass, "p-3")}
                  />
                </Field>
              </Advanced>
            </Step>

            <Step n="02 · Ürün" title="Ürünün fotoğrafı" lead="Telefonla çekilmiş net bir fotoğraf yeterli. Arka planın önemi yok.">
              <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                <label
                  htmlFor="product-upload"
                  className={cn(
                    "flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed text-center transition-colors",
                    productPreview ? "border-accent" : "border-line-strong hover:border-paper/40",
                  )}
                >
                  {productPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={productPreview} alt="Ürün önizleme" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted" />
                      <span className="px-4 text-[13px] text-muted">Fotoğraf yükle</span>
                      <span className="text-[11px] text-faint">PNG veya JPG, en fazla 10 MB</span>
                    </>
                  )}
                  <input id="product-upload" type="file" accept="image/*" className="hidden" onChange={onFile} />
                </label>
                <Field label="Ürün sahnede nasıl dursun?">
                  <div className="grid grid-cols-2 gap-2">
                    {INTERACTIONS.map((o) => {
                      const selected = interaction === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => setInteraction(selected ? null : o.value)}
                          aria-pressed={selected}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] font-medium transition-colors",
                            selected ? "border-accent bg-accent-soft text-accent" : "border-line text-muted hover:border-line-strong hover:text-paper",
                          )}
                        >
                          <o.icon className="h-4 w-4" />
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                  <Advanced>
                    <Field label="Ürünle ilgili not" optional>
                      <textarea
                        placeholder="Örn: etiketi kameraya dönük tutsun, kapağını açıp göstersin"
                        value={customProduct}
                        onChange={(e) => setCustomProduct(e.target.value)}
                        rows={2}
                        className={cn(textareaClass, "p-3")}
                      />
                    </Field>
                  </Advanced>
                </Field>
              </div>
            </Step>

            <Step n="03 · Sahne" title="Nerede çekilmiş gibi olsun?" lead="Boş bırakırsan sade, doğal bir ortam seçilir.">
              <Field label="Mekan">
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((o) => (
                    <Chip key={o.value} selected={location === o.value} onClick={() => setLocation(location === o.value ? null : o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Işık">
                <div className="flex flex-wrap gap-2">
                  {LIGHTING.map((o) => (
                    <Chip key={o.value} selected={lighting === o.value} onClick={() => setLighting(lighting === o.value ? null : o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Advanced>
                <Field label="Mekanı kendin tarif et" optional>
                  <textarea
                    placeholder="Örn: küçük bir stüdyo daire, pencere kenarında çalışma masası"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    rows={2}
                    className={cn(textareaClass, "p-3")}
                  />
                </Field>
                <Field label="Kadraj ve hareket" optional hint="Poz ve kamera yönlendirmesi olarak sahneye eklenir.">
                  <textarea
                    placeholder="Örn: ürünü kameraya yaklaştırsın, hafifçe gülümseyip başını yana eğsin"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={2}
                    className={cn(textareaClass, "p-3")}
                  />
                </Field>
              </Advanced>
            </Step>

            <Step n="04 · Senaryo" title="Ne söylesin?" lead="Reklamın kaderini çoğu zaman ilk cümle belirler. Varyasyonlarda önce onu değiştir.">
              <Field label="Ton">
                <div className="flex flex-wrap gap-2">
                  {ENERGIES.map((o) => (
                    <Chip key={o.value} selected={energy === o.value} onClick={() => setEnergy(energy === o.value ? null : o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field label="Senaryo">
                <textarea
                  placeholder="Örn: Kargo dün geldi, sabah ilk denediğim bu oldu. Üç gündür kullanıyorum ve cildim gerçekten daha parlak görünüyor."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  maxLength={MAX_CHARS}
                  rows={5}
                  className={cn(textareaClass, "p-3.5")}
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[12px]">
                  <span className="text-faint">
                    {MIN_WORDS}–{MAX_WORDS} kelime (5–30 sn). Tek kişi konuşur; diyalog desteklenmez.
                  </span>
                  <span className={cn("font-mono tabular-nums", counterTone)}>
                    {scriptCheck.words} / {MAX_WORDS} · ~{scriptCheck.seconds} sn{cost !== null && ` · ${cost} kredi`}
                    {scriptCheck.words > 0 && scriptCheck.words < MIN_WORDS && ` · en az ${MIN_WORDS}`}
                  </span>
                </div>
              </Field>
              <Advanced>
                <Field label="Ses tarzı" optional hint="Sadece seslendirmeyi etkiler, görüntüye karışmaz.">
                  <textarea
                    placeholder="Örn: arkadaşına tavsiye verir gibi, rahat ve biraz şaşkın"
                    value={voiceDetail}
                    onChange={(e) => setVoiceDetail(e.target.value)}
                    rows={2}
                    className={cn(textareaClass, "p-3")}
                  />
                </Field>
              </Advanced>
            </Step>
          </div>

          {/* Summary: what you're about to spend a credit on */}
          <aside className="lg:sticky lg:top-20">
            <Card className="space-y-4 p-5">
              <Eyebrow>Özet</Eyebrow>
              <div className="flex gap-3">
                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-ink">
                  {preset && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preset.avatarUrl} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-ink">
                  {productPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={productPreview} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              </div>
              <ul className="space-y-2 text-[13px]">
                {[
                  { ok: !!preset, text: preset ? `${preset.name} anlatıyor` : "Sunucu seç" },
                  { ok: !!productFile, text: productFile ? "Ürün fotoğrafı yüklendi" : "Ürün fotoğrafı yükle" },
                  {
                    ok: scriptCheck.ok,
                    text: scriptCheck.ok ? `Senaryo hazır · ~${scriptCheck.seconds} sn` : `Senaryo (${MIN_WORDS}–${MAX_WORDS} kelime)`,
                  },
                ].map((row) => (
                  <li key={row.text} className={cn("flex items-center gap-2", row.ok ? "text-paper" : "text-faint")}>
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full border",
                        row.ok ? "border-ok bg-ok text-ink" : "border-line-strong",
                      )}
                    >
                      {row.ok && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    </span>
                    {row.text}
                  </li>
                ))}
              </ul>
              <div className="space-y-1.5 border-t border-line pt-4 text-[13px] tabular-nums">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Maliyet</span>
                  <span className="font-semibold">
                    {cost !== null ? `${scriptCheck.seconds} saniye · ${cost} kredi` : "Senaryoya göre"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Bakiyen</span>
                  <span className={cn(shortBy ? "text-danger" : "text-paper")}>{balance ?? "–"} kredi</span>
                </div>
              </div>
              {shortBy > 0 ? (
                <Link href="/credits" className={cn(primaryBtn, "h-11 w-full justify-center")}>
                  {shortBy} kredi eksik · Kredi al
                </Link>
              ) : (
                <button
                  onClick={onCreate}
                  disabled={!presetId || !scriptCheck.ok || !productFile}
                  className={cn(primaryBtn, "h-11 w-full justify-center")}
                >
                  {cost !== null ? `Videoyu oluştur · ${cost} kredi` : "Videoyu oluştur"}
                </button>
              )}
              <p className="text-[11px] leading-snug text-faint">
                Süre senaryonun uzunluğundan hesaplanır ve kredi bu süreye göre ayrılır; video bir iki saniye farklı
                çıkarsa ek kredi düşmez. Üretim teknik bir hatayla tamamlanmazsa ayrılan kredi geri döner.
              </p>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <AppShell>
      <CreateVideo />
    </AppShell>
  );
}
