"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Only one showcase video plays with sound at a time. */
const SOUND_EVENT = "showcase-sound";

/**
 * A looping, muted showcase video that only plays while on screen, and plays with sound while
 * hovered (desktop) or after a tap. Browsers only allow sound after the visitor has interacted
 * with the page, so before that the hover shows a "tap for sound" hint and a click turns sound on.
 */
export function ShowcaseVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const { t } = useLang();
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== src) mute();
    };
    window.addEventListener(SOUND_EVENT, onOther);
    return () => window.removeEventListener(SOUND_EVENT, onOther);
  }, [src]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void v.play().catch(() => {});
        } else {
          v.pause();
          mute();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  function mute() {
    const v = ref.current;
    if (v) v.muted = true;
    setSound(false);
  }

  async function unmute() {
    const v = ref.current;
    if (!v) return;
    window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: src }));
    v.currentTime = 0;
    v.muted = false;
    try {
      await v.play();
      setSound(true);
    } catch {
      // Blocked until the visitor interacts with the page: keep playing silently.
      v.muted = true;
      void v.play().catch(() => {});
      setSound(false);
    }
  }

  const canHoverSound = () =>
    typeof navigator !== "undefined" && (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive;

  return (
    <div
      className={cn("group relative h-full w-full cursor-pointer", className)}
      // Hover sound is for mice only; on touch screens a tap toggles sound instead.
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        setHovered(true);
        if (canHoverSound()) void unmute();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        setHovered(false);
        mute();
      }}
      onClick={() => (sound ? mute() : void unmute())}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-paper backdrop-blur-sm transition-opacity",
          sound || hovered ? "opacity-100" : "opacity-80",
        )}
      >
        {sound ? <Volume2 className="h-3.5 w-3.5 text-accent" /> : <VolumeX className="h-3.5 w-3.5" />}
        {sound ? t("Sesli", "Sound on") : hovered ? t("Sesi açmak için tıkla", "Click for sound") : t("Sesi aç", "Sound")}
      </span>
    </div>
  );
}
