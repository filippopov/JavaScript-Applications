function attachEvents() {
    const BASE_URL = 'https://judgetests.firebaseio.com/';
    const LOCATION_INPUT = $('#location');
    const SUBMIT_INPUT = $('#submit');
    const FORECAST_SECTION = $('#forecast');
    const CURRENT_SECTION = $('#current');
    const UPCOMING_SECTION = $('#upcoming');
    const WEATHER_SYMBOLS = {
        'Sunny': '&#x2600;',
        'Partly sunny': '&#x26C5;',
        'Overcast': '&#x2601;',
        'Rain': '&#x2614;',
        'Degrees': '&#176;'
    };

    SUBMIT_INPUT.on('click', getLocations);

    function getData(ulrInfo) {
        return $.ajax({
            method: 'GET',
            url: BASE_URL + ulrInfo
        });
    }

    function getLocations() {
        getData('locations.json').then(getAllCities).catch(handelError);
    }

    function getAllCities(data) {
        let location = LOCATION_INPUT.val();
        let code = data.filter(a => a['name'] === location).map(a => a['code'])[0];
        if (!code) {
            handelError();
        }

        let todayWeatherPromise = getTodayWeather(code);
        let upcomingWeatherPromise = getUpcomingWeather(code);

        Promise.all([todayWeatherPromise, upcomingWeatherPromise]).then(appendEllements).catch(handelError);
    }

    function appendEllements([todayWeather, upcomingWeather]) {
        CURRENT_SECTION.empty();
        UPCOMING_SECTION.empty();

        FORECAST_SECTION.css('display', 'block');
        let conditionSymbol = '';

        if (WEATHER_SYMBOLS.hasOwnProperty(todayWeather['forecast']['condition'])) {
            conditionSymbol = WEATHER_SYMBOLS[todayWeather['forecast']['condition']];
        }

        let spanConditionSymbol = $('<span>').addClass('condition symbol').html(conditionSymbol);
        let spanCondition = $('<span>').addClass('condition')
            .append($('<span>').addClass('forecast-data').text(todayWeather['name']))
            .append($('<span>').addClass('forecast-data').html(`${todayWeather['forecast']['low']}${WEATHER_SYMBOLS['Degrees']}/${todayWeather['forecast']['high']}${WEATHER_SYMBOLS['Degrees']}`))
            .append($('<span>').addClass('forecast-data').text(todayWeather['forecast']['condition']));

        CURRENT_SECTION.append($('<div class="label">Current conditions</div>'));
        CURRENT_SECTION.append(spanConditionSymbol);
        CURRENT_SECTION.append(spanCondition);

        UPCOMING_SECTION.append($('<div class="label">Three-day forecast</div>'));

        for (let dayIndex in upcomingWeather['forecast']) {
            let symbolNext = '';

            if (WEATHER_SYMBOLS.hasOwnProperty(upcomingWeather['forecast'][dayIndex]['condition'])) {
                symbolNext = WEATHER_SYMBOLS[upcomingWeather['forecast'][dayIndex]['condition']];
            }

            let spanUpcoming = $('<span>').addClass('upcoming')
                .append($('<span>').addClass('symbol').html(symbolNext))
                .append($('<span>').addClass('forecast-data').html(`${upcomingWeather['forecast'][dayIndex]['low']}${WEATHER_SYMBOLS['Degrees']}/${upcomingWeather['forecast'][dayIndex]['high']}${WEATHER_SYMBOLS['Degrees']}`))
                .append($('<span>').addClass('forecast-data').text(upcomingWeather['forecast'][dayIndex]['condition']));


            UPCOMING_SECTION.append(spanUpcoming);
        }

        LOCATION_INPUT.val('');
    }

    function getTodayWeather(code) {
        let url = `forecast/today/${code}.json`;
        return getData(url);
    }

    function getUpcomingWeather(code) {
        let url = `forecast/upcoming/${code}.json`;
        return getData(url);
    }

    function handelError() {
        FORECAST_SECTION.css('display', 'block');
        FORECAST_SECTION.text('Error');
    }
}