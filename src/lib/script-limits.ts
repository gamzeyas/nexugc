import { creditsForSeconds, MAX_VIDEO_SECONDS } from "./pricing";

/**
 * Script length limits. Turkish speech is roughly 2.5 words per second, so 12–75 words keeps a
 * video between 5 and 30 seconds. The estimated length sets the credit price, so the price shown
 * before a video starts is exactly what is charged.
 */
export const MIN_WORDS = 12;
export const MAX_WORDS = 75;
export const MAX_CHARS = 600;
export const WORDS_PER_SECOND = 2.5;

/** The spoken part of a script, without TTS tags such as [pause] or [excited]. */
function spokenText(text: string) {
  return text.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
}

export function countWords(text: string) {
  return spokenText(text).split(" ").filter(Boolean).length;
}

export function estimateSeconds(words: number) {
  return Math.ceil(words / WORDS_PER_SECOND);
}

export type ScriptCheck = { ok: boolean; words: number; seconds: number; credits: number | null; error?: string };

export function checkScript(text: string): ScriptCheck {
  const words = countWords(text);
  const seconds = estimateSeconds(words);
  const credits = creditsForSeconds(seconds);
  if (words < MIN_WORDS) {
    return { ok: false, words, seconds, credits: null, error: `Senaryo çok kısa: en az ${MIN_WORDS} kelime (~5 sn) yazın.` };
  }
  if (words > MAX_WORDS || spokenText(text).length > MAX_CHARS || seconds > MAX_VIDEO_SECONDS) {
    return {
      ok: false,
      words,
      seconds,
      credits: null,
      error: `Senaryo çok uzun: en fazla ${MAX_WORDS} kelime (~${MAX_VIDEO_SECONDS} sn) ve ${MAX_CHARS} karakter olabilir.`,
    };
  }
  return { ok: true, words, seconds, credits };
}
