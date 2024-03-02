var latLng = [];
var countryName = [];
var totalCases_global = [];
var totalDeath_global = [];
var totalRecovered_global = [];
var topCountryName = [];
var topCountryCases = [];

//Get data about top 5 most cases
fetch('http://localhost:5000/data/top5').then(function (res) {
    return res.json();
}).then(obj => {
    //retireve data from server
    topCountryName.push(obj[0]);
    topCountryCases.push(obj[1]);
    
    // Display on the page (name and cases)
    document.getElementById("1").innerHTML = topCountryName[0][0];
    document.getElementById("CaseNo1").innerHTML = topCountryCases[0][0];
    document.getElementById("2").innerHTML = topCountryName[0][1];
    document.getElementById("CaseNo2").innerHTML = topCountryCases[0][1];
    document.getElementById("3").innerHTML = topCountryName[0][2];
    document.getElementById("CaseNo3").innerHTML = topCountryCases[0][2];
    document.getElementById("4").innerHTML = topCountryName[0][3];
    document.getElementById("CaseNo4").innerHTML = topCountryCases[0][3];
    document.getElementById("5").innerHTML = topCountryName[0][4];
    document.getElementById("CaseNo5").innerHTML = topCountryCases[0][4];
})



fetch('http://localhost:5000/data/global').then(function (res) {
    return res.json();
}).then(obj => {
    //retireve data from server
    countryName.push(obj.countryName);
    latLng.push(obj.lngLat);
    totalCases_global.push(obj.totalCases);
    totalDeath_global.push(obj.totalDeath);
    totalRecovered_global.push(obj.totalRecovered);
})
const xhttp_global = new XMLHttpRequest();

xhttp_global.onload = function () {
    var totalCases = 0;
    var totalDeath = 0;
    var totalRecovered = 0;
    //Find total cases
    for(let i=0; i< totalCases_global[0].length;i++){
        totalCases += totalCases_global[0][i];
    }
    document.getElementById("totalCases").innerHTML = totalCases;
    //Find total Death
    for(let i=0; i< totalDeath_global[0].length;i++){
        totalDeath += totalDeath_global[0][i];
    }
    document.getElementById("totalDeath").innerHTML = totalDeath;
    //Find total Recovered 
    for(let i=0; i< totalRecovered_global[0].length;i++){
        totalRecovered += totalRecovered_global[0][i];
    }
    document.getElementById("totalRecovered").innerHTML = totalRecovered;
    //Displaying the map
    mapboxgl.accessToken = 'pk.eyJ1IjoiemhlbmthbmciLCJhIjoiY2t0cHl0ZjNxMDFlZDJ2cWVpNnJxazQ1ayJ9.h8H59MFmJSyp5korzRDUtQ';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-77.04, 38.907],
        zoom: 0
    });
    // Add markers
    for (let i = 0; i < latLng[0].length; i++) {
        const marker = new mapboxgl.Marker({

        })
            .setLngLat(latLng[0][i])
            .setPopup(new mapboxgl.Popup().setHTML(`<div>Name : ${countryName[0][i]}<br>Total Cases : ${totalCases_global[0][i]}<br>Total Deaths : ${totalDeath_global[0][i]}<br>Total Recovered : ${totalRecovered_global[0][i]}<div>`)) // add popup
            .addTo(map);
    }

    // can delete later
    
    // option ="";
    // for(let i =0; i < countryName[0].length;i++){
    //     option +=`<a class="dropdown-item" value="${countryName[0][i]}" onclick="getCountry('${countryName[0][i]}')">${countryName[0][i]}</a>`;
    // }
    // document.getElementById('countryList').innerHTML = option;

}
xhttp_global.open('GET', 'http://localhost:5000/data/global');
xhttp_global.send();