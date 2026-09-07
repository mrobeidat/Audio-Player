const pad = (n: number) => String(n).padStart(2, "0");

export const clock = (secs: number) => {
  if (!Number.isFinite(secs) || secs < 0) return "00:00";
  const s = Math.floor(secs);
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export const timeAgo = (iso: string, now = Date.now()) => {
  const diff = Math.round((new Date(iso).getTime() - now) / 1000);
  for (const [unit, size] of UNITS) if (Math.abs(diff) >= size) return rtf.format(Math.round(diff / size), unit);
  return "just now";
};
