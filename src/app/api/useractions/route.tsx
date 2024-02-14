import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import UserAction from "../../../../models/userActions";


// Create a new document in DB
export async function POST(req: any) {
  const { userAction } = await req.json();
  await connectMongoDB();
  await UserAction.create({ userAction });
  return NextResponse.json({ message: "userAction logged" });
}

// Fetch user actions from the server
export async function GET() {
  await connectMongoDB();
  const actions = await UserAction.find();
  return NextResponse.json({ actions });
}
