var apiKey = "b6182655a0eb457214526577dea3c502";
var searchButton = $("#search");

var currWeather = $("#currentWeather");
var weatherFore = $("#weatherForecast");

function getLocation(city) {
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

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
        var title = json.name + " (" + getDate(json.dt) + ")";
        var icon = json.weather[0].icon;
        var temp = json.main.temp;
        var wind = json.wind.speed;
        var humidity = json.main.humidity;

        currWeather.children('.title').text(title);
        currWeather.children('.icon').text(icon);
        currWeather.children('.temp').text(temp);
        currWeather.children('.wind').text(wind);
        currWeather.children('.humidity').text(humidity);        
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
        currWeather.children('.uv').text(json.value);
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
        var j = 1;
        for (var i = 4; i < 40; i+=8) {
            var date = getDate(json.list[i].dt);
            var icon = json.list[i].weather[0].icon;
            var temp = json.list[i].main.temp;
            var wind = json.list[i].wind.speed;
            var humidity = json.list[i].main.humidity;

            var forecastDay = $('#forecast-' + j);
            forecastDay.children('.date').text(date);
            forecastDay.children('.icon').text(icon);
            forecastDay.children('.temp').text(temp);
            forecastDay.children('.wind').text(wind);
            forecastDay.children('.humidity').text(humidity);

            j++;
        }
    }); 
}


$("#search").on("click", function (event) {
    event.preventDefault();

    var city = $('#enterCity').val();

    // Clear out forecast
    forecast = [];
    getLocation(city);
})

function getDate(timestamp) {
    var date = new Date(timestamp * 1000);

    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();

    return month + "/" + day + "/" + year;
}



