import type { Metadata } from "next";
import { fetchActions } from "@/lib/actions";
import { ActionsList } from "@/components/actions/ActionsList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "User actions · Audio Player" };

export default async function ActionsPage() {
  const actions = await fetchActions().catch(() => null);
  if (actions === null) return <p className="grid min-h-[50dvh] place-items-center text-white/80">Could not load actions. Try again in a moment.</p>;
  return <ActionsList actions={actions} />;
}
