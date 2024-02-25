import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import UserAction from "../../../../models/userActions";

// Establish MongoDB connection
connectMongoDB();

// Create a new document in DB
export async function POST(req: any) {
  try {
    const { userAction, songTitle } = await req.json();
    await UserAction.create({ userAction, songTitle });
    return NextResponse.json({ message: "userAction logged" });
  } catch (error) {
    console.log("Error logging userAction:", error);
  }
}

// Fetch user actions from the server
export async function GET() {
  try {
    const actions = await UserAction.find().sort({ createdAt: "desc" }).exec();
    return NextResponse.json({ actions });
  } catch (error) {
    console.error("Error fetching user actions:", error);
  }
}
