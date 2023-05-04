const apiKey = 'bb192436ca1e0e01600ac8e60bedeab6';
const searchHistory = [];

const displayWeather = (city) => {
    $('#current-weather').empty();
    console.log(city);
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then((response)  => {

        console.log(response);
        let iconCode = response.weather[0].icon;
        let iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        let date = moment().format('MM/DD/YYYY');

        let currentWeatherRender = $(`
            <h2 id="currentCity">
                ${response.name} (${date}) <img src="${iconURL}" alt="${response.weather[0].description}" />
            </h2>
            <p>Temperature: ${response.main.temp} °F</p>
            <p>Wind: ${response.wind.speed} MPH</p>
            <p>Humidity: ${response.main.humidity}\%</p>
        `)

        $("#current-weather").append(currentWeatherRender);

        let lat = response.coord.lat;
        let lon = response.coord.lon;

        displayUVI(lat, lon);

        displayForecast(lat, lon);

    })
}

const displayUVI = (lat, lon) => {
    let queryURL =  `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then((response)  => {
        let uvi = response.value;
        let uviRender = $(`
                <p>UV Index: 
                    <span id="uvi-color" class="px-2 py-2 rounded">${uvi}</span>
                </p>
            `);
        
        $("#current-weather").append(uviRender);

        switch (true) {
            case (uvi >= 0 && uvi <= 2):
              $("#uvi-color").css("background-color", "#3EA72D").css("color", "white");
              break;
            case (uvi >= 3 && uvi <= 5):
              $("#uvi-color").css("background-color", "#FFF300");
              break;
            case (uvi >= 6 && uvi <= 7):
              $("#uvi-color").css("background-color", "#F18B00");
              break;
            case (uvi >= 8 && uvi <= 10):
              $("#uvi-color").css("background-color", "#E53210").css("color", "white");
              break;
            default:
              $("#uvi-color").css("background-color", "#B567A4").css("color", "white");
              break;
        }
    })
}

const displayForecast = (lat, lon) => {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then((response)  => {
        console.log(response);
        $('#five-day-forecast').empty();

        for (let i = 3; i < 43; i += 8) {
            let date = response.list[i].dt;
            let temp = response.list[i].main.temp;
            let wind = response.list[i].wind.speed;
            let humidity = response.list[i].main.humidity;
            let iconAlt = response.list[i].weather[0].description;
            let iconCode = response.list[i].weather[0].icon;
            let iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

            let forecastRender = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <h5>${moment.unix(date).format('MM/DD/YYYY')} <img src=${iconURL} alt=${iconAlt}></h5>
                            <p>Temp: ${temp} °F</p>
                            <p>Wind: ${wind} MPH</p>
                            <p>Humidity: ${humidity}\%</p>
                        </div>
                    </div>
                <div>
            `)

            $('#five-day-forecast').append(forecastRender);
        }
    })
}

const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

$('#search-button').on('click', (event) => {
    event.preventDefault();

    let city = $('#search-city').val();
    city = capitalizeFirstLetter(city);

    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        let renderSearch = $(`<li class="list-group-item">${city}</li>`);
        $('#search-history').append($(renderSearch));
    }

    displayWeather(city);

    localStorage.setItem("city", JSON.stringify(searchHistory));
})

$(document).on("click", ".list-group-item", function() {
    var pastCity = $(this).text();
    displayWeather(pastCity);
});

$(document).ready(function() {
    var storedHistory = JSON.parse(localStorage.getItem("city"));

    if (storedHistory !== null) {
        let index = storedHistory.length - 1;
        var lastSearchedCity = storedHistory[index];
        displayWeather(lastSearchedCity);
    }
});

