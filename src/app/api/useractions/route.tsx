import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import UserAction from "../../../../models/userActions";

export const dynamic = "force-dynamic";

// Create a new document in DB
export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { userAction, songTitle } = await req.json();
    await UserAction.create({ userAction, songTitle });
    return NextResponse.json({ message: "userAction logged" });
  } catch (error) {
    console.error("Error logging userAction:", error);
    return NextResponse.json({ error: "Could not log action" }, { status: 500 });
  }
}

// Fetch user actions from the server
export async function GET() {
  try {
    await connectMongoDB();
    const actions = await UserAction.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ actions });
  } catch (error) {
    console.error("Error fetching user actions:", error);
    return NextResponse.json({ error: "Could not fetch actions" }, { status: 500 });
  }
}
