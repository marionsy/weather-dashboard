var apiKey = "b6182655a0eb457214526577dea3c502";
var searchButton = $("#search");

var currWeather = $("#currentWeather");
var weatherFore = $("#weatherForecast");

var savedCities = JSON.parse(localStorage.getItem('cities'));

if (savedCities) {
    getLocation(savedCities[savedCities.length - 1]);
}

function getLocation(city) {
    var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
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
        .then(function (json) {
            var title = json.name + " (" + getDate(json.dt) + ")";
            var icon = getIcon(json.weather[0].icon, json.weather[0].description);
            var temp = getTemp(json.main.temp);
            var wind = getWind(json.wind.speed);
            var humidity = getHumidity(json.main.humidity);

            currWeather.children('.title').text(title);
            currWeather.children('.title').append(icon);
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
        .then(function (json) {
            var uvValue = json.value;
            var uvSpan = $("<span>");

            if (uvValue < 3) {
                uvSpan.attr('class', 'badge badge-success');
            } else if (uvValue >= 3 && uvValue < 8) {
                uvSpan.attr('class', 'badge badge-warning');
            } else {
                uvSpan.attr('class', 'badge badge-danger');
            }
            uvSpan.text(uvValue);

            currWeather.children('.uv').text("UV Index: ");
            currWeather.children('.uv').append(uvSpan);

            $(".currentWeatherCard").removeClass("d-none");
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
        .then(function (json) {
            var j = 1;
            for (var i = 4; i < 40; i += 8) {
                var date = getDate(json.list[i].dt);
                var icon = getIcon(json.list[i].weather[0].icon, json.list[i].weather[0].description);
                var temp = getTemp(json.list[i].main.temp);
                var wind = getWind(json.list[i].wind.speed);
                var humidity = getHumidity(json.list[i].main.humidity);

                var forecastDay = $('#forecast-' + j);
                forecastDay.children('.date').text(date);
                forecastDay.children('.icon').empty();
                forecastDay.children('.icon').append(icon);
                forecastDay.children('.temp').text(temp);
                forecastDay.children('.wind').text(wind);
                forecastDay.children('.humidity').text(humidity);
                j++;
            }

            $(".weatherCard").removeClass("d-none");
        });
}


$("#search").on("click", function (event) {
    event.preventDefault();

    var city = $('#enterCity').val();

    getLocation(city);

    saveCity(city);
})

function getDate(timestamp) {
    var date = new Date(timestamp * 1000);

    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();

    return month + "/" + day + "/" + year;
}

function getIcon(iconValue, iconDescription) {
    var iconEl = $("<img>");
    var iconSrc = "https://openweathermap.org/img/w/" + iconValue + ".png";
    iconEl.attr('src', iconSrc);
    iconEl.attr('alt', iconDescription)

    return iconEl;
}

function getTemp(tempValue) {
    return "Temp: " + tempValue + "°F";
}

function getWind(windValue) {
    return "Wind: " + windValue + " MPH";
}

function getHumidity(humidityValue) {
    return "Humidity: " + humidityValue + " %";
}

function saveCity(city) {
    var savedCities = JSON.parse(localStorage.getItem('cities'));

    if (!savedCities) {
        savedCities = [];
    }

    savedCities.push(city);

    localStorage.setItem('cities', JSON.stringify(savedCities));

    var citybutton = $("<button>");
    citybutton.attr('class', 'btn btn-secondary btn-lg btn-block');
    citybutton.text(city);

    citybutton.on("click", function (event) {
        event.preventDefault();
        getLocation(city);
    })

    $('#searchHistory').append(citybutton);
}
