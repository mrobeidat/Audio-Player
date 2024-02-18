import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import UserAction from "../../../../models/userActions";

// Create a new document in DB
export async function POST(req: any) {
  try {
    const { userAction, songTitle } = await req.json();
    await connectMongoDB();
    await UserAction.create({ userAction, songTitle });
    return NextResponse.json({ message: "userAction logged" });
  } catch (error) {
    console.log("Error logging userAction:", error);
  }
}

// Fetch user actions from the server
export async function GET() {
  await connectMongoDB();
  const actions = await UserAction.find();
  return NextResponse.json({ actions });
}
