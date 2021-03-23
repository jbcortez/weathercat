// USER INPUT VARIABLES
var userLocation = "san francisco,us"
var measurement = "imperial"

// MAIN WEATHER CARD VARIABLES
var currentTemp = document.getElementById("currentTemp")
var currentLocation = document.getElementById("currentLocation")
var currentWeatherDescription = document.getElementById("weatherDescription")
var weatherIcon = document.getElementById("weatherIcon")
var weatherIconId = ""
var currentAirQuality = document.getElementById("currentAirQuality")
var currentWindDirection = document.getElementById("currentWindDirection")
var currentWindSpeed = document.getElementById("currentWindSpeed")
var mainPrecipitationProbability = document.getElementById(
  "mainPrecipitationProbability"
)
var mainFeelsLike = document.getElementById("mainFeelsLike")

// WEATHER DETAILS VARIABLES
var feelsLike = document.getElementById("feelsLike")
var sunrise = document.getElementById("sunrise")
var sunset = document.getElementById("sunset")
var humidity = document.getElementById("humidity")
var pressure = document.getElementById("pressure")
var currentWindDirectionDetail = document.getElementById(
  "currentWindDirectionDetail"
)
var currentWindSpeedDetail = document.getElementById("currentWindSpeedDetail")
var UVIndex = document.getElementById("UVIndex")
var precipitationProbability = document.getElementById(
  "precipitationProbability"
)

// RANDOM CAT PHOTO
var randomCatPhoto = document.getElementById("randomCatPhoto")

// GET LOCATION FROM SEARCH BAR

var locationInput = document.getElementById("locationInput")
var searchButton = document.getElementById("searchButton")

searchButton.addEventListener("click", function () {
  userLocation = locationInput.value
  getWeather(userLocation, measurement)
  getAQI(userLocation)
  getLocalizedTime()
  getUVIndex()
  getPrecipitationProbability()
})

// GET GEOCODE OF userLocation TO BE USED FOR AQI
async function getGeocode(userLocation) {
  let geocode = []

  let response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userLocation}&limit=1&appid=886705b4c1182eb1c69f28eb8c520e20`
  )
  let json = await response.json()

  geocode[0] = json[0].lat
  geocode[1] = json[0].lon

  return geocode
}

// openweather API key
// 886705b4c1182eb1c69f28eb8c520e20

// GET WEATHER INFORMATION AND DISPLAY IT

async function getWeather(userLocation, measurement) {
  const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=${measurement}&appid=886705b4c1182eb1c69f28eb8c520e20`
  const response = await fetch(apiUrl)
  const json = await response.json()

  currentLocation.textContent = json.name
  currentTemp.textContent = Math.round(json.main.temp) + "\u00B0"
  currentWeatherDescription.textContent = json.weather[0].description
  weatherIconId = json.weather[0].icon
  weatherIcon.src = `http://openweathermap.org/img/wn/${weatherIconId}.png`

  let windDirection = json.wind.deg
  let windSpeed = json.wind.speed
  getWindInformation(windDirection, windSpeed)

  // POPULATE WEATHER DETAILS CARD
  feelsLike.textContent = Math.round(json.main.feels_like) + "\u00B0"

  // CONVERT SUNRISE AND SUNSET UNIX TIMESTAMP
  let sunriseDate = convertTimestamp(json.sys.sunrise)
  let sunsetDate = convertTimestamp(json.sys.sunset)

  let sunriseString = formatTime(sunriseDate)
  let sunsetString = formatTime(sunsetDate)

  sunrise.textContent = sunriseString
  sunset.textContent = sunsetString

  humidity.textContent = Math.round(json.main.humidity) + "%"
  // CALCULATE PRESSURE TO INCHES OF MERCURY
  let currentPressure = Math.round(json.main.pressure * 0.02953 * 100) / 100
  pressure.textContent = currentPressure + " in"
}

// GET AQI
async function getAQI(userLocation) {
  let geocode = await getGeocode(userLocation)

  let lat = geocode[0]
  let lon = geocode[1]

  // GET AQI JSON
  let apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=886705b4c1182eb1c69f28eb8c520e20`
  let response = await fetch(apiUrl)
  let json = await response.json()
  let aqi = json.list[0].main.aqi

  console.log("AQI is: " + aqi)

  switch (aqi) {
    case 1:
      currentAirQuality.textContent = "Good"
      currentAirQuality.style.color = "#00d41c"
      break
    case 2:
      currentAirQuality.textContent = "Fair"
      currentAirQuality.style.color = "yellow"
      break
    case 3:
      currentAirQuality.textContent = "Moderate"
      currentAirQuality.style.color = "#ff7000"
      break
    case 4:
      currentAirQuality.textContent = "Poor"
      currentAirQuality.style.color = "pink"
      break
    case 5:
      currentAirQuality.textContent = "Very Poor"
      currentAirQuality.style.color = "#ff0000"
      break
  }
}

// GET WIND CONDITIONS

function getWindInformation(windDirection, windSpeed) {
  // CONVERT WIND HEADING TO DIRECTION
  if (windDirection > 348.75 || windDirection < 11.25) {
    windDirection = "N"
  } else if (windDirection > 11.25 || windDirection < 33.75) {
    windDirection = "NNE"
  } else if (windDirection > 33.75 || windDirection < 56.25) {
    windDirection = "NE"
  } else if (windDirection > 56.25 || windDirection < 78.75) {
    windDirection = "ENE"
  } else if (windDirection > 78.75 || windDirection < 101.25) {
    windDirection = "E"
  } else if (windDirection > 101.25 || windDirection < 123.75) {
    windDirection = "ESE"
  } else if (windDirection > 123.75 || windDirection < 146.25) {
    windDirection = "SE"
  } else if (windDirection > 146.25 || windDirection < 168.75) {
    windDirection = "SSE"
  } else if (windDirection > 168.75 || windDirection < 191.25) {
    windDirection = "S"
  } else if (windDirection > 191.25 || windDirection < 213.75) {
    windDirection = "SSW"
  } else if (windDirection > 213.75 || windDirection < 236.25) {
    windDirection = "SW"
  } else if (windDirection > 236.25 || windDirection < 258.75) {
    windDirection = "WSW"
  } else if (windDirection > 258.75 || windDirection < 281.25) {
    windDirection = "W"
  } else if (windDirection > 281.25 || windDirection < 303.75) {
    windDirection = "WNW"
  } else if (windDirection > 303.76 || windDirection < 326.25) {
    windDirection = "NW"
  } else {
    windDirection = "NNW"
  }

  currentWindDirection.textContent = windDirection + " "
  currentWindSpeed.textContent = Math.round(windSpeed) + " MPH"
  // WEATHER DETAILS CARD WIND INFORMATION
  currentWindDirectionDetail.textContent = windDirection + " "
  currentWindSpeedDetail.textContent = Math.round(windSpeed) + " MPH"
}

// GET PRECIPITATION PROBABILITY
async function getPrecipitationProbability() {
  const geocode = await getGeocode(userLocation)
  const lat = geocode[0]
  const lon = geocode[1]

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=886705b4c1182eb1c69f28eb8c520e20`
  )
  const json = await response.json()
  console.log(json.daily[0].pop)
  precipitationProbability.textContent = json.hourly[0].pop + "%"
  mainPrecipitationProbability.textContent = json.hourly[0].pop + "%"
}

// GET UV INDEX
async function getUVIndex() {
  const geocode = await getGeocode(userLocation)
  const lat = geocode[0]
  const lon = geocode[1]

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=886705b4c1182eb1c69f28eb8c520e20`
  )
  const json = await response.json()
  UVIndex.textContent = json.current.uvi + " of 10"
}

// GET RANDOM CAT PHOTO
function getCatPhoto() {
  fetch(
    "https://api.unsplash.com/photos/random?client_id=SaRKYFXA7mqoMKDo7ep6gLgkKUOUSCBni98sOy5kT9I&query=cats&count=1"
  )
    .then((response) => response.json())
    .then((data) => {
      randomCatPhoto.style.backgroundImage = "url(" + data[0].urls.thumb + ")"
    })
    .catch((err) => {
      console.log(err)
    })
}

// CONVERT UNIX TIMESTAMP TO DATE

function convertTimestamp(timestamp) {
  const date = new Date(timestamp * 1000)
  return date
}

// GET TIME IN UTC
async function getLocalizedTime() {
  const geocode = await getGeocode(userLocation)
  const lat = geocode[0]
  const lon = geocode[1]

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=886705b4c1182eb1c69f28eb8c520e20`
  )
  const json = await response.json()
  const timezone = json.timezone

  // MOMENT.JS ==================
  const time = moment.tz(timezone).format("h:mm A")
  console.log(time)

  const timeElement = document.getElementById("currentTime")
  timeElement.textContent = time
}

//  FORMAT TIME
function formatTime(date) {
  var date = date

  let hour = date.getHours()
  let min = date.getMinutes()
  let amPm = ""

  if (hour < 12) {
    amPm = "AM"
  } else {
    amPm = "PM"
  }

  hour = hour % 12 || 12

  if (min < 10) {
    min = "0" + min
  }

  var timeString = `${hour}:${min} ${amPm}`
  return timeString
}

getWeather(userLocation, measurement)
getAQI(userLocation)
getLocalizedTime()
getCatPhoto()
getUVIndex()
getPrecipitationProbability()
