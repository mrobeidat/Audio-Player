import { supabase } from "./supabase";

export const ACTION_KINDS = ["Play", "Pause", "Next", "Prev", "Forward", "Backward", "Seek", "Mute", "Unmute"] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export type UserAction = {
  id: number;
  userAction: ActionKind;
  songTitle: string;
  createdAt: string;
};

export const isActionKind = (v: unknown): v is ActionKind => typeof v === "string" && (ACTION_KINDS as readonly string[]).includes(v);

const TABLE = "audio_actions";
const COLUMNS = "id, userAction:user_action, songTitle:song_title, createdAt:created_at";
const LIMIT = 500;

export async function fetchActions(): Promise<UserAction[]> {
  const { data, error } = await supabase.from(TABLE).select(COLUMNS).order("created_at", { ascending: false }).limit(LIMIT);
  if (error) throw error;
  return (data ?? []) as unknown as UserAction[];
}

export async function insertAction(userAction: ActionKind, songTitle: string) {
  const { error } = await supabase.from(TABLE).insert({ user_action: userAction, song_title: songTitle });
  if (error) throw error;
}

export function logAction(userAction: ActionKind, songTitle: string) {
  void fetch("/api/useractions", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ userAction, songTitle }),
    keepalive: true,
  }).catch(() => undefined);
}
