var apiKey = "b6182655a0eb457214526577dea3c502";
var searchButton = $("#search");

// Current weather
var currentWeather = {
    cityName: null,
    date: null,
    icon: null,
    temp: null,
    humidity: null,
    wind: null,
    uv: null
}

// Forecast
var forecast = [];

function getLocation(city) {
    var requestUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

    fetch(requestUrl)
    .then(function (response) {
         return response.json();
    })
    .then(function(json) {
        var lat = json[0].lat;
        var lon = json[0].lon;

        // Get current weather
        getCurrentWeather(lat, lon);
        getUV(lat, lon); 

        // Get 5 day forecast
        getFiveDay(lat, lon);
    })
}

// city name > response.name
// date > response.dt
// icon for weather condition > response.weather.icon
// temperature = response.main.temp
// humidity = response.main.humidity
// wind speed = response.wind.speed
function getCurrentWeather(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function(json) {
        currentWeather.cityName = json.name;
        currentWeather.date = json.dt;
        currentWeather.icon = json.weather[0].icon;
        currentWeather.temp = json.main.temp;
        currentWeather.humidity = json.main.humidity;
        currentWeather.wind = json.wind.speed;
    });
}

// uv index > response.value
function getUV(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function(json) {
        currentWeather.uv = json.value;
    });
}

// date > response.list[day].dt
// temperature > response.list[day].main.temp
// wind speed > response.list[day].wind.speed
// humidity > response.list[day].main.humidity
// icon > response.list[day].weather.icon
function getFiveDay(lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

    fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function(json) {
        for (var i = 4; i < 40; i+=8) {
            var forecastDay = {
                date: json.list[i].dt,
                temp: json.list[i].main.temp,
                speed: json.list[i].wind.speed,
                humidity: json.list[i].main.humidity,
                icon: json.list[i].weather[0].icon,
            };
            forecast.push(forecastDay);
        }
    }); 
}


$("#search").on("click", function (event) {
    event.preventDefault();

    var city = $("#enterCity").val();

    // Clear out forecast
    forecast = [];
    getLocation(city);
})





