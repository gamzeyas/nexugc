"use client";

/**
 * Whether the signed-in user can no longer buy the Intro pack. The real check reads the payment
 * records, which are not part of this public copy, so here it is always unknown.
 */
export function useIntroUsed(): boolean | undefined {
  return undefined;
}
