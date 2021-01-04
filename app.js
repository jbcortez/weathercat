
var userLocation = '';
var measurement = 'imperial';
var currentTemp = document.getElementById('currentTemp');
var currentLocation = document.getElementById('currentLocation'); 
var currentWeatherDescription = document.getElementById('weatherDescription');
var weatherIcon = document.getElementById('weatherIcon');
var weatherIconId = '';

// GET WEATHER INFORMATION AND DISPLAY IT
function getWeather(location, measurement){
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=${measurement}&appid=886705b4c1182eb1c69f28eb8c520e20`)
    .then(response => response.json())
    .then((data) => {
        currentLocation.textContent = data.name;
        currentTemp.textContent = Math.round(data.main.temp) + '\u00B0';
        currentWeatherDescription.textContent = data.weather[0].description;
        weatherIconId = data.weather[0].icon;
        weatherIcon.src = `http://openweathermap.org/img/wn/${weatherIconId}.png`;
    })
    .catch((err) => console.log(err));
}

// GET LOCATION FROM SEARCH BAR
var locationInput = document.getElementById('locationInput');

var searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', function(){
    userLocation = locationInput.value;
    getWeather(userLocation, measurement);
    getTime();
});

// GET CURRENT TIME
function getTime(){
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes();
    var amPm = '';

    if(hour < 12) {
        amPm = 'AM';
    } else {
        amPm = 'PM';
    }

    hour = hour % 12 || 12;

    var time = document.getElementById('currentTime');
    time.textContent = `${hour}:${min} ${amPm}`;
}




   

    
