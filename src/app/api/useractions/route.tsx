import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import UserAction from "../../../../models/userActions";

export async function POST(req: any) {
  const { userAction } = await req.json();
  await connectMongoDB();
  await UserAction.create({ userAction });
  return NextResponse.json({ message: "userAction logged" });
}

export async function GET() {
  await connectMongoDB();
  const actions = await UserAction.find();
  return NextResponse.json({ actions });
}
