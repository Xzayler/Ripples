export function calcDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 1000 * 60 * 60) {
    return `${diff % (1000 * 60)}m`;
  } else if (diff < 1000 * 60 * 60 * 24) {
    return `${diff % (1000 * 60 * 60)}h`;
  } else if (now.getFullYear() - date.getFullYear() == 0) {
    return `${date.toLocaleDateString("default", {
      month: "short",
    })} ${date.getDate()}`;
  } else {
    return `${date.toLocaleDateString("default", {
      month: "short",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  }
}
