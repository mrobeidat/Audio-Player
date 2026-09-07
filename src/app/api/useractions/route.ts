import { NextResponse } from "next/server";
import { fetchActions, insertAction, isActionKind } from "@/lib/actions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { userAction?: unknown; songTitle?: unknown } | null;
  if (!body || !isActionKind(body.userAction)) return NextResponse.json({ error: "userAction is required" }, { status: 400 });
  try {
    await insertAction(body.userAction, typeof body.songTitle === "string" ? body.songTitle.slice(0, 200) : "");
    return NextResponse.json({ message: "userAction logged" });
  } catch (error) {
    console.error("insertAction failed", error);
    return NextResponse.json({ error: "Could not log action" }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ actions: await fetchActions() });
  } catch (error) {
    console.error("fetchActions failed", error);
    return NextResponse.json({ error: "Could not fetch actions" }, { status: 500 });
  }
}
