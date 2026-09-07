import { NextResponse } from "next/server";
import { supabase } from "../../../../libs/supabase";

export const dynamic = "force-dynamic";

// column aliases keep the JSON shape the actions page already expects
const COLS = "userAction:user_action, songTitle:song_title, createdAt:created_at";

// Create a new document in DB
export async function POST(req: Request) {
  const { userAction, songTitle } = await req.json().catch(() => ({}));
  if (typeof userAction !== "string" || !userAction) {
    return NextResponse.json({ error: "userAction is required" }, { status: 400 });
  }
  const { error } = await supabase.from("audio_actions").insert({ user_action: userAction, song_title: String(songTitle ?? "") });
  if (error) {
    console.error("Error logging userAction:", error);
    return NextResponse.json({ error: "Could not log action" }, { status: 500 });
  }
  return NextResponse.json({ message: "userAction logged" });
}

// Fetch user actions from the server, newest first
export async function GET() {
  const { data, error } = await supabase.from("audio_actions").select(COLS).order("created_at", { ascending: false }).limit(1000);
  if (error) {
    console.error("Error fetching user actions:", error);
    return NextResponse.json({ error: "Could not fetch actions" }, { status: 500 });
  }
  return NextResponse.json({ actions: data });
}
