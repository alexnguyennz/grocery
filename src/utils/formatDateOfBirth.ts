export default function formatDateOfBirth(dateOfBirth: string) {
  const date = new Date(dateOfBirth);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return day + ' ' + month + ' ' + year;
}
