require('dotenv').config();

(function () {
  const apiKey = API_KEY;
  const unsplashApi = UNSPLASH_API_KEY;

  // USER INPUT VARIABLES
  let userLocation = 'san francisco,us';
  const measurement = 'imperial';

  // MAIN WEATHER CARD VARIABLES
  let currentTemp = document.getElementById('currentTemp');
  let currentLocation = document.getElementById('currentLocation');
  let currentWeatherDescription = document.getElementById('weatherDescription');
  let weatherIcon = document.getElementById('weatherIcon');
  let weatherIconId = '';
  let currentAirQuality = document.getElementById('currentAirQuality');
  let currentWindDirection = document.getElementById('currentWindDirection');
  let currentWindSpeed = document.getElementById('currentWindSpeed');
  let mainPrecipitationProbability = document.getElementById(
    'mainPrecipitationProbability'
  );
  let mainFeelsLike = document.getElementById('mainFeelsLike');

  // WEATHER DETAILS VARIABLES
  let feelsLike = document.getElementById('feelsLike');
  let sunrise = document.getElementById('sunrise');
  let sunset = document.getElementById('sunset');
  let humidity = document.getElementById('humidity');
  let pressure = document.getElementById('pressure');
  let currentWindDirectionDetail = document.getElementById(
    'currentWindDirectionDetail'
  );
  let currentWindSpeedDetail = document.getElementById(
    'currentWindSpeedDetail'
  );
  let UVIndex = document.getElementById('UVIndex');
  let precipitationProbability = document.getElementById(
    'precipitationProbability'
  );

  // RANDOM CAT PHOTO
  let randomCatPhoto = document.getElementById('randomCatPhoto');

  // GET LOCATION FROM SEARCH BAR

  let locationInput = document.getElementById('locationInput');
  let searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', function () {
    if (locationInput.value.match(/([A-Z])\w+|,/gi)) {
      userLocation = locationInput.value;
      getWeather(userLocation, measurement);
      getAQI(userLocation);
      getLocalizedTime();
      getUVIndex();
      getPrecipitationProbability();
    }
  });

  // GET GEOCODE OF userLocation TO BE USED FOR AQI
  const getGeocode = async (userLocation) => {
    let geocode = [];

    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&limit=1&appid=${apiKey}`
    );
    const data = await response.json();

    geocode[0] = data[0].lat;
    geocode[1] = data[0].lon;
    return geocode;
  };

  // GET WEATHER INFORMATION AND DISPLAY IT

  const getWeather = async (userLocation, measurement) => {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=${measurement}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    const json = await response.json();
    currentLocation.textContent = `${json.name}, ${json.sys.country}`;
    currentTemp.textContent = Math.round(json.main.temp) + '\u00B0';
    currentWeatherDescription.textContent = json.weather[0].description;
    weatherIconId = json.weather[0].icon;
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherIconId}.png`;

    let windDirection = json.wind.deg;
    let windSpeed = json.wind.speed;
    getWindInformation(windDirection, windSpeed);

    // POPULATE WEATHER DETAILS CARD
    feelsLike.textContent = Math.round(json.main.feels_like) + '\u00B0';

    // CONVERT SUNRISE AND SUNSET UNIX TIMESTAMP
    let sunriseDate = convertTimestamp(json.sys.sunrise);
    let sunsetDate = convertTimestamp(json.sys.sunset);

    let sunriseString = formatTime(sunriseDate);
    let sunsetString = formatTime(sunsetDate);

    sunrise.textContent = sunriseString;
    sunset.textContent = sunsetString;

    humidity.textContent = Math.round(json.main.humidity) + '%';
    // CALCULATE PRESSURE TO INCHES OF MERCURY
    let currentPressure = Math.round(json.main.pressure * 0.02953 * 100) / 100;
    pressure.textContent = currentPressure + ' in';
  };

  // GET AQI
  const getAQI = async (userLocation) => {
    let geocode = await getGeocode(userLocation);

    let lat = geocode[0];
    let lon = geocode[1];

    // GET AQI JSON
    let apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    let response = await fetch(apiUrl);
    let json = await response.json();
    let aqi = json.list[0].main.aqi;

    switch (aqi) {
      case 1:
        currentAirQuality.textContent = 'Good';
        currentAirQuality.style.color = '#00d41c';
        break;
      case 2:
        currentAirQuality.textContent = 'Fair';
        currentAirQuality.style.color = 'yellow';
        break;
      case 3:
        currentAirQuality.textContent = 'Moderate';
        currentAirQuality.style.color = '#ff7000';
        break;
      case 4:
        currentAirQuality.textContent = 'Poor';
        currentAirQuality.style.color = 'pink';
        break;
      case 5:
        currentAirQuality.textContent = 'Very Poor';
        currentAirQuality.style.color = '#ff0000';
        break;
    }
  };

  // GET WIND CONDITIONS

  const getWindInformation = (windDirection, windSpeed) => {
    // CONVERT WIND HEADING TO DIRECTION
    if (windDirection > 348.75 || windDirection < 11.25) {
      windDirection = 'N';
    } else if (windDirection > 11.25 || windDirection < 33.75) {
      windDirection = 'NNE';
    } else if (windDirection > 33.75 || windDirection < 56.25) {
      windDirection = 'NE';
    } else if (windDirection > 56.25 || windDirection < 78.75) {
      windDirection = 'ENE';
    } else if (windDirection > 78.75 || windDirection < 101.25) {
      windDirection = 'E';
    } else if (windDirection > 101.25 || windDirection < 123.75) {
      windDirection = 'ESE';
    } else if (windDirection > 123.75 || windDirection < 146.25) {
      windDirection = 'SE';
    } else if (windDirection > 146.25 || windDirection < 168.75) {
      windDirection = 'SSE';
    } else if (windDirection > 168.75 || windDirection < 191.25) {
      windDirection = 'S';
    } else if (windDirection > 191.25 || windDirection < 213.75) {
      windDirection = 'SSW';
    } else if (windDirection > 213.75 || windDirection < 236.25) {
      windDirection = 'SW';
    } else if (windDirection > 236.25 || windDirection < 258.75) {
      windDirection = 'WSW';
    } else if (windDirection > 258.75 || windDirection < 281.25) {
      windDirection = 'W';
    } else if (windDirection > 281.25 || windDirection < 303.75) {
      windDirection = 'WNW';
    } else if (windDirection > 303.76 || windDirection < 326.25) {
      windDirection = 'NW';
    } else {
      windDirection = 'NNW';
    }

    currentWindDirection.textContent = windDirection + ' ';
    currentWindSpeed.textContent = Math.round(windSpeed) + ' MPH';
    // WEATHER DETAILS CARD WIND INFORMATION
    currentWindDirectionDetail.textContent = windDirection + ' ';
    currentWindSpeedDetail.textContent = Math.round(windSpeed) + ' MPH';
  };

  // GET PRECIPITATION PROBABILITY
  const getPrecipitationProbability = async () => {
    const geocode = await getGeocode(userLocation);
    const lat = geocode[0];
    const lon = geocode[1];

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const json = await response.json();

    precipitationProbability.textContent = json.hourly[0].pop + '%';
    mainPrecipitationProbability.textContent = json.hourly[0].pop + '%';
  };

  // GET UV INDEX
  const getUVIndex = async () => {
    const geocode = await getGeocode(userLocation);
    const lat = geocode[0];
    const lon = geocode[1];

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const json = await response.json();
    UVIndex.textContent = json.current.uvi + ' of 10';
  };

  // GET RANDOM CAT PHOTO
  const getCatPhoto = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${unsplashApi}&query=cats&count=1`
    );
    const data = await response.json();

    randomCatPhoto.style.backgroundImage = `url(${data[0].urls.thumb})`;
  };

  // CONVERT UNIX TIMESTAMP TO DATE

  const convertTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date;
  };

  // GET TIME IN UTC
  const getLocalizedTime = async () => {
    const geocode = await getGeocode(userLocation);
    const lat = geocode[0];
    const lon = geocode[1];

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const json = await response.json();
    const timezone = json.timezone;

    // MOMENT.JS ==================
    const time = moment.tz(timezone).format('h:mm A');

    const timeElement = document.getElementById('currentTime');
    timeElement.textContent = time;
  };

  //  FORMAT TIME
  const formatTime = (date) => {
    var date = date;

    let hour = date.getHours();
    let min = date.getMinutes();
    let amPm = '';

    if (hour < 12) {
      amPm = 'AM';
    } else {
      amPm = 'PM';
    }

    hour = hour % 12 || 12;

    if (min < 10) {
      min = '0' + min;
    }

    var timeString = `${hour}:${min} ${amPm}`;
    return timeString;
  };

  getWeather(userLocation, measurement);
  getAQI(userLocation);
  getLocalizedTime();
  getCatPhoto();
  getUVIndex();
  getPrecipitationProbability();
})();
