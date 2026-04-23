const API_KEY = "2a0d23c90f6487ed9a2ec5842663378a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const addressInput = document.getElementById("address");
const weatherBtn = document.getElementById("weatherBtn");
const weatherResult = document.getElementById("weatherResult");
const forecastResult = document.getElementById("forecastResult");
const suggestionsList = document.getElementById("suggestions");
const recentSection = document.getElementById("recentSection");

function getIconUrl(code) {
  return "https://openweathermap.org/img/wn/" + code + "@2x.png";
}

function formatForecastDate(text) {
  const date = new Date(text);

  return date.toLocaleDateString("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  }) + " " + date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function clearResults() {
  weatherResult.innerHTML = "";
  forecastResult.innerHTML = "";
}

function showError(text) {
  weatherResult.innerHTML = '<div class="error-msg">' + text + "</div>";
  forecastResult.innerHTML = "";
}

function showLoading() {
  weatherResult.innerHTML = '<div class="status-msg">Pobieranie danych...</div>';
  forecastResult.innerHTML = "";
}

function createWeatherCard(data) {
  const card = document.createElement("div");
  card.className = "weather-card";

  card.innerHTML = `
    <div class="weather-icon-wrap">
      <img src="${getIconUrl(data.weather[0].icon)}" alt="Ikona pogody">
    </div>
    <div class="card-info">
      <h2 class="city-name">${data.name}</h2>
      <div class="temp-main">${Math.round(data.main.temp)}°C</div>
      <p class="desc-text">${data.weather[0].description}</p>
      <div class="details-row">
        <span class="detail-item">Wilgotność: ${data.main.humidity}%</span>
        <span class="detail-item">Wiatr: ${data.wind.speed} m/s</span>
        <span class="detail-item">Odczuwalna: ${Math.round(data.main.feels_like)}°C</span>
      </div>
    </div>
  `;

  return card;
}

function createForecastCard(item) {
  const row = document.createElement("div");
  row.className = "forecast-row";

  const date = new Date(item.dt_txt);
  var dayName = date.toLocaleDateString("pl-PL", { weekday: "short" });

  row.innerHTML =
    '<img src="' + getIconUrl(item.weather[0].icon) + '" alt="Ikona pogody">' +
    '<div class="fc-day">' + dayName + '</div>' +
    '<div class="fc-desc">' + item.weather[0].description + '</div>' +
    '<div class="fc-temp">' + Math.round(item.main.temp) + '°C</div>';

  return row;
}

function loadCurrentWeather(city) {
  const xhr = new XMLHttpRequest();
  const url = BASE_URL + "/weather?q=" + encodeURIComponent(city) + "&units=metric&lang=pl&appid=" + API_KEY;

  xhr.open("GET", url);
  xhr.onload = function () {
    if (xhr.status !== 200) {
      showError("Nie udało się pobrać bieżącej pogody.");
      return;
    }

    const data = JSON.parse(xhr.responseText);
    console.log(data);
    weatherResult.innerHTML = "";
    weatherResult.appendChild(createWeatherCard(data));
  };

  xhr.onerror = function () {
    showError("Błąd połączenia z pogodą bieżącą.");
  };

  xhr.send();
}

function loadForecast(city) {
  const url = BASE_URL + "/forecast?q=" + encodeURIComponent(city) + "&units=metric&lang=pl&appid=" + API_KEY;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Nie udało się pobrać prognozy.");
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      forecastResult.innerHTML = "";

      for (let i = 0; i < 5 && i < data.list.length; i += 1) {
        forecastResult.appendChild(createForecastCard(data.list[i]));
      }
    })
    .catch(function () {
      forecastResult.innerHTML = '<div class="error-msg">Nie udało się pobrać prognozy.</div>';
    });
}

function getWeather() {
  const city = addressInput.value.trim();

  if (city.length === 0) {
    showError("Wpisz nazwę miasta.");
    return;
  }

  showLoading();
  loadCurrentWeather(city);
  loadForecast(city);
}

weatherBtn.addEventListener("click", getWeather);

addressInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

if (suggestionsList) {
  suggestionsList.innerHTML = "";
}

if (recentSection) {
  recentSection.style.display = "none";
}
