function getWeatherDescription(code) {
    if (code === 0) {
        return "Clear sky ☀️";
    } else if (code === 1) {
        return "Mainly clear 🌤️";
    } else if (code === 2) {
        return "Partly cloudy ⛅";
    } else if (code === 3) {
        return "Overcast ☁️";
    } else if (code >= 51 && code <= 67) {
        return "Rain 🌧️";
    } else if (code >= 71 && code <= 77) {
        return "Snow ❄️";
    } else if (code >= 80 && code <= 82) {
        return "Rain showers 🌦️";
    } else if (code >= 95) {
        return "Thunderstorm ⛈️";
    } else {
        return "Unknown weather";
    }
}

const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#Condition");
const wind = document.querySelector("#wind");
const form = document.querySelector("#weatherform");
const cityInput = document.querySelector("#cityInput");
const message = document.querySelector("#message");
const searchButton = document.querySelector("#searchButton");

async function getLocation(city) {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
        throw new Error("Unable to search the city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found.");
    }

    return data.results[0];
}

async function getWeather(latitude, longitude) {
    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`
    );

    if (!weatherResponse.ok) {
        throw new Error("Unable to load the weather.");
    }

    return await weatherResponse.json();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a City.";
        return;
    }

    message.textContent = "Searching...";

    cityName.textContent = "City";
    temperature.textContent = "--°C";
    condition.textContent = "Weather Condition";
    wind.textContent = "💨 Wind: -- km/h";

    searchButton.disabled = true;

    try {
        const location = await getLocation(city);

        const weatherData = await getWeather(
            location.latitude,
            location.longitude
        );

        const weatherDescription = getWeatherDescription(
            weatherData.current.weather_code
        );

        cityName.textContent = location.name;

        temperature.textContent =
            `${weatherData.current.temperature_2m}°C`;

        condition.textContent = weatherDescription;

        wind.textContent =
            `💨 Wind: ${weatherData.current.wind_speed_10m} km/h`;

        message.textContent = "";
    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
});