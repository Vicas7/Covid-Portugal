export async function getStats() {
  const data = await fetch('https://corona.lmao.ninja/v2/countries');
  return data.json();
}
