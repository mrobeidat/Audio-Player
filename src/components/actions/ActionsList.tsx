"use client";

import { useMemo, useState } from "react";
import { ACTION_KINDS, type ActionKind, type UserAction } from "@/lib/actions";
import { ACTION_ICONS } from "@/lib/icons";
import { timeAgo } from "@/lib/format";

type Filter = ActionKind | "All";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`glass flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-gradient-to-br from-pink-500 to-red-800" : "hover:bg-black/40"}`}
    >
      {children}
    </button>
  );
}

export function ActionsList({ actions }: { actions: UserAction[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const counts = useMemo(() => {
    const c = Object.fromEntries(ACTION_KINDS.map((k) => [k, 0])) as Record<ActionKind, number>;
    for (const a of actions) if (a.userAction in c) c[a.userAction]++;
    return c;
  }, [actions]);

  const visible = filter === "All" ? actions : actions.filter((a) => a.userAction === filter);

  if (!actions.length) return <p className="grid min-h-[50dvh] place-items-center text-white/80">No user actions yet. Play something.</p>;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-3" role="group" aria-label="Filter actions">
        <Chip active={filter === "All"} onClick={() => setFilter("All")}>All ({actions.length})</Chip>
        {ACTION_KINDS.filter((k) => counts[k] > 0).map((k) => {
          const Icon = ACTION_ICONS[k];
          return (
            <Chip key={k} active={filter === k} onClick={() => setFilter(k)}>
              <Icon className="size-4" />{k} ({counts[k]})
            </Chip>
          );
        })}
      </div>

      <ul className="grid gap-2">
        {visible.map((a) => {
          const Icon = ACTION_ICONS[a.userAction];
          return (
            <li key={a.id} className="glass flex items-center gap-3 rounded-full px-4 py-2 transition hover:bg-gradient-to-r hover:from-[rgb(201,37,107)] hover:to-[rgb(116,16,124)]">
              <Icon className="size-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{a.userAction}</span>
                <span className="text-white/70"> · {a.songTitle}</span>
              </span>
              <time dateTime={a.createdAt} className="shrink-0 text-xs text-white/70">{timeAgo(a.createdAt)}</time>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
