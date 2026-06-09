export function formatRelativeDate(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Пишем из будущего";
  if (diffDays === 0) return "Сегодня";

  const lastDigit = diffDays % 10;
  const lastTwoDigits = diffDays % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${diffDays} дней назад`;
  }

  if (lastDigit === 1) {
    return `${diffDays} день назад`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${diffDays} дня назад`;
  }

  return `${diffDays} дней назад`;
}