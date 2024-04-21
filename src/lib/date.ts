export function calcDate(date: Date) {
  const now = new Date();
  const diff = Math.round((now.getTime() - date.getTime()) / 1000);
  console.log(date);
  console.log(diff);
  if (diff <= 60 * 60 * 24) {
    return `${Math.round(diff / 60)}m`;
  } else if (diff < 60 * 60 * 24) {
    return `${Math.round(diff / (60 * 60))}h`;
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
