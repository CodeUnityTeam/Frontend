/** Миллисекунд в сутках: 24 ч × 60 мин × 60 сек × 1000 мс. */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function formatLastSeen(iso: string | null): string | undefined {
  if (!iso) return undefined;

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;

  const now = new Date();
  const days = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / MS_PER_DAY,
  );

  if (days === 0) return "сегодня";
  if (days === 1) return "вчера";

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
  });
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
