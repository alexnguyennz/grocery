export default function capitalize(name: string) {
  const words = name.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );

  return words;
}
