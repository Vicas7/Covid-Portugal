import * as API from "./api.js";

const mapDiv = document.getElementById('map');
const searchBar = document.querySelector('.search-bar');

mapboxgl.accessToken = 'pk.eyJ1IjoidmljYXM3IiwiYSI6ImNrZDFvc2xnNjE1bjcycnA0cnUzbmd5azEifQ.dXMsyDHqbBBor9mZPQugtw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 1,
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.on('click', closeAllSuggestions);
map.on('touchstart',closeAllSuggestions);
map.on('zoom',closeAllSuggestions);
map.on('drag',closeAllSuggestions);

async function getData() {
  const data = await API.getStats();
  const yesterday = await API.getYesterdayStats();
  let i = 0;
  data.forEach(country => {
    const countryName = country.country;
    const cases = country.cases;
    const actives =  country.active;
    const deaths = country.deaths;
    const recovered = country.recovered;
    
    const countryInfo = country.countryInfo;
    const coords = [countryInfo.long, countryInfo.lat];

    let yesterdayCases, yesterdayActives, yesterdayDeaths, yesterdayRecovered;

    if (i <= yesterday.length){
      yesterdayCases = cases - yesterday[i].cases >= 0 ? cases - yesterday[i].cases : yesterday[i].cases - cases;
      yesterdayActives = actives - yesterday[i].active >= 0 ? actives - yesterday[i].active : yesterday[i].active - actives;;
      yesterdayDeaths = deaths - yesterday[i].deaths >= 0 ? deaths - yesterday[i].deaths : yesterday[i].deaths - deaths;
      yesterdayRecovered = recovered - yesterday[i].recovered >= 0 ? recovered - yesterday[i].recovered : yesterday[i].recovered - recovered;
    } else {
      yesterdayCases, yesterdayActives = 0;
      yesterdayDeaths, yesterdayRecovered = 0;
    }
    i++;

    createMarker({
      countryName,
      cases,
      actives,
      deaths,
      recovered,
      coords,
      yesterdayCases,
      yesterdayActives,
      yesterdayDeaths,
      yesterdayRecovered
    });
  });
}


function createMarker(data) {
  let html = `<h3 style="text-align: center;">${data.countryName}</h3>`;
  html += `<div class="info-wrapper""><div style="grid-area: one;">Cases: <span>${data.cases}</span></div><div class="second" style="grid-area: two;">(${data.yesterdayCases})</div>`;
  html += `<div style="grid-area: three;">Active: <span>${data.actives}</span></div><div class="second" style="grid-area: four;">(${data.yesterdayActives})</div>`;
  html += `<div style="grid-area: five;">Recovered: <span style="color: green">${data.recovered}</span></div><div class="second" style="grid-area: six;">(${data.yesterdayRecovered})</div>`;
  html += `<div style="grid-area: seven;">Deaths: <span style="color: red">${data.deaths}</span></div><div class="second" style="grid-area: eight;">(${data.yesterdayDeaths})</div></div>`;

  const popup = new mapboxgl.Popup({offset:25, className: 'popup'})
  .setHTML(html);

  const el = document.createElement('div');
  el.class = 'marker';


  new mapboxgl.Marker({color: '#c41616', className: 'marker'})
  .setLngLat(data.coords)
  .setPopup(popup)
  .addTo(map);
}

const countries = [];
const form = document.querySelector('.search-bar form');
const input = document.querySelector('.search-bar input[type=text]');

input.addEventListener('input', autoComplete)

async function getCountriesData() {
  countries.length = 0;
  const data = await API.getStats();
  data.forEach((country) => {
    const countryName = country.country;
    const countryInfo = country.countryInfo;
    const coords = [countryInfo.long, countryInfo.lat];
    
    const c = {countryName, coords}
    countries.push(c) 
  })

}

function autoComplete(event) {
  closeAllSuggestions();
  const value = input.value.toLowerCase();

  if (value.length !== 0){

    let a = document.createElement('div');
    a.id = 'autocomplete-list';
    a.setAttribute('class' , 'autocomplete-list');
    this.parentElement.appendChild(a);
    countries.forEach((country) => {
      const countryName = country.countryName;
      if (value === countryName.toLowerCase().substr(0,value.length)){
        let b = document.createElement('div');
        b.innerHTML = `<strong>${countryName.substr(0, value.length)}</strong>`;
        b.innerHTML += countryName.substr(value.length);
        b.addEventListener('click', (event) => {
          closeAllSuggestions();
          input.value = b.textContent;
          const e = new Event('submit');
          form.dispatchEvent(e);
        });
        a.appendChild(b);
      }
    })
  }
}

function closeAllSuggestions() {
  const autocompletes = document.querySelectorAll('.autocomplete-list');
  autocompletes.forEach((element) => {
    element.parentElement.removeChild(element);
  });
}

function flyTo(coords) {
  map.flyTo({
    center: coords,
    zoom: 5.5,
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  closeAllSuggestions();
  const value = input.value;
  for(let i = 0; i != countries.length; i++){
    if (countries[i].countryName.toLowerCase() === value.toLowerCase() ){
        flyTo(countries[i].coords);
        break;
    }

  }
});


setInterval(() => {
  getCountriesData();
  getData();
}, 10000);

getCountriesData();
getData();