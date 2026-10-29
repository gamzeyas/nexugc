import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type UgcVideo = {
  id: string;
  user_id: string;
  preset_name: string | null;
  voice_name: string | null;
  script_text: string | null;
  input_image_url: string | null;
  fal_request_id: string | null;
  final_video_url: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  error: string | null;
  created_at: string;
};

/** Calls one of our own API routes with the current user's access token. */
export async function authedFetch(path: string, init: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
  });
}
