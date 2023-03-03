export default function formatAddress(address: String) {
  const formattedAddress = address.split(',').join('\n');

  return formattedAddress;
}
