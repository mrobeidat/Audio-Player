import { FastForward, MoveHorizontal, Pause, Play, Rewind, SkipBack, SkipForward, Volume2, VolumeX, type LucideIcon } from "lucide-react";
import type { ActionKind } from "./actions";

export const ACTION_ICONS: Record<ActionKind, LucideIcon> = {
  Play,
  Pause,
  Next: SkipForward,
  Prev: SkipBack,
  Forward: FastForward,
  Backward: Rewind,
  Seek: MoveHorizontal,
  Mute: VolumeX,
  Unmute: Volume2,
};
