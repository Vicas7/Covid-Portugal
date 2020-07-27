export async function getStats() {
  const data = await fetch('https://disease.sh/v3/covid-19/countries');
  return data.json();
}

export async function getYesterdayStats() {
  const data = await fetch('https://disease.sh/v3/covid-19/countries?yesterday=true');
  return data.json();
}
