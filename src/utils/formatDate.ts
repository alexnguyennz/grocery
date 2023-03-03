export default function date(timestamp: string) {
  const date = new Date(timestamp);

  return date.toDateString();
}
