const apiKey = 'bb192436ca1e0e01600ac8e60bedeab6';

const displayWeather = () => {
    let city = $('#search-city').val()
    console.log(city);
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then((response)  => {
        let iconCode = response.weather[0].icon;
        let iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        let currentWeatherRender = $(`
            <h2 id="currentCity">
                ${response.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${response.main.temp} °F</p>
            <p>Humidity: ${response.main.humidity}\%</p>
            <p>Wind Speed: ${response.wind.speed} MPH</p>
        `)

        $("#current-weather").append(currentWeatherRender);

        let lat = response.coord.lat;
        let lon = response.coord.lon;

        displayUVI(lat, lon);



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

const displayForecast = (lat, long) => {
    let queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then((response)  => {
        $('#five-day-forecast').empty
        
        for (let i = 1; i < 6; i++) {
            
            let forcastRender = $(``)
            $('#five-day-forecast').append();
        }
    })
}

