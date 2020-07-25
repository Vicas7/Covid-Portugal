import * as API from "./api.js";

mapboxgl.accessToken = 'pk.eyJ1IjoidmljYXM3IiwiYSI6ImNrZDFvc2xnNjE1bjcycnA0cnUzbmd5azEifQ.dXMsyDHqbBBor9mZPQugtw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 1,
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

async function getData() {
  const data = await API.getStats();
  console.log(data);
  data.forEach(country => {
    const countryName = country.country;
    const cases = country.cases;
    const actives =  country.active;
    const deaths = country.deaths;
    const recovered = country.recovered;
    
    const countryInfo = country.countryInfo;
    const coords = [countryInfo.long, countryInfo.lat];
    createMarker({countryName, cases, actives, deaths, recovered, coords});
  });
}


function createMarker(data) {
  let html = `<h3>${data.countryName}</h3>`;
  html += `<div>Cases: <span>${data.cases}</span></div>`;
  html += `<div>Active: <span>${data.actives}</span></div>`;
  html += `<div>Recovered: <span style="color: green">${data.recovered}</span></div>`;
  html += `<div>Deaths: <span style="color: red"  >${data.deaths}</span></div>`;

  const popup = new mapboxgl.Popup({offset:25, className: 'popup'})
  .setHTML(html);

  const el = document.createElement('div');
  el.class = 'marker';


  new mapboxgl.Marker({color: '#c41616', className: 'marker'})
  .setLngLat(data.coords)
  .setPopup(popup)
  .addTo(map);
}

getData();