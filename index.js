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

const countries = [];
const form = document.querySelector('.search-bar form');
const input = document.querySelector('.search-bar input[type=text]');

input.addEventListener('input', autoComplete)

async function getCountriesData() {
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
  closeAllSugestions();
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
          closeAllSugestions();
          input.value = b.textContent;
          const e = new Event('submit');
          form.dispatchEvent(e);
        });
        a.appendChild(b);
      }
    })
  }
}

function closeAllSugestions() {
  const autocompletes = document.querySelectorAll('.autocomplete-list');
  autocompletes.forEach((element) => {
    console.log(element);
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
  console.log('SUBMIT');
  event.preventDefault();
  const value = input.value;
  for(let i = 0; i != countries.length; i++){
    if (countries[i].countryName.toLowerCase() === value.toLowerCase() ){
        flyTo(countries[i].coords);
        break;
    }

  }
});




getCountriesData();
getData();