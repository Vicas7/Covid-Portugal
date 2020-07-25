export async function getCountryStats(country) {
  const data = await fetch(`https://api.covid19api.com/dayone/country/${country}/status/confirmed`);
  return data.json();
}

export async function getCountries() {
  const data = await fetch('https://api.covid19api.com/countries');
  return data.json();
}

export async function getStats() {
  const data = await fetch('https://corona.lmao.ninja/v2/countries');
  return data.json();
}