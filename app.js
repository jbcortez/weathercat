
var userLocation = '';
var measurement = 'imperial';
var currentTemp = document.getElementById('currentTemp');
var currentLocation = document.getElementById('currentLocation'); 
var currentWeatherDescription = document.getElementById('currentWeatherDescription');

function getWeather(location, measurement){
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=${measurement}&appid=886705b4c1182eb1c69f28eb8c520e20`)
    .then(response => response.json())
    .then((data) => {
        currentLocation.textContent = data.name;
        currentTemp.textContent = Math.round(data.main.temp) + '\u00B0';
        currentWeatherDescription.textContent = data.weather[0].description;
    })
    .catch((err) => console.log(err));
}

var locationInput = document.getElementById('locationInput');

var searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', function(){
    userLocation = locationInput.value;
    getWeather(userLocation, measurement);
});



   

    
