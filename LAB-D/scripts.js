document.getElementById('weatherBtn').addEventListener('click', function() {
    const address = document.getElementById('address').value;

    function getWeatherIcon(description) {
        switch (description.toLowerCase()) {
            case 'bezchmurnie':
                return '☀️'; // Słońce
            case 'kilka chmur':
                return '🌤️'; // Słońce z chmurami
            case 'rozproszone chmury':
                return '⛅'; // Rozproszone chmury
            case 'zachmurzenie umiarkowane':
                return '☁️'; // Chmury
            case 'zachmurzenie duże':
                return '☁️'; // Duże chmury
            case 'przelotny deszcz':
                return '🌦️'; // Deszcz z słońcem
            case 'deszcz':
                return '🌧️'; // Deszcz
            case 'burza':
                return '⛈️'; // Burza
            case 'śnieg':
                return '❄️'; // Śnieg
            case 'mgła':
                return '🌫️'; // Mgła
            case 'lekki deszcz':
                return '🌦️'; // Lekki deszcz
            case 'umiarkowany deszcz':
                return '🌧️'; // Umiarkowany deszcz
            case 'silny deszcz':
                return '🌧️'; // Silny deszcz
            case 'śnieg z deszczem':
                return '🌨️'; // Śnieg z deszczem
            default:
                return '🌤️'; // Domyślna ikonka dla nieznanych opisów
        }
    }


    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&lang=pl&appid=2a0d23c90f6487ed9a2ec5842663378a`);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            let weatherData = JSON.parse(xhr.responseText);
            console.log(weatherData);
            let WeatherCard = document.createElement('div');
            WeatherCard.classList.add('weather-card');
            let icon = getWeatherIcon(weatherData.weather[0].description);
            WeatherCard.innerHTML = `
                <h2>${weatherData.name} ${icon}</h2>
                <p>Temperatura: ${weatherData.main.temp} °C</p>
                <p>Pogoda: ${weatherData.weather[0].description}</p>
            `;
            document.getElementById('weatherResult').appendChild(WeatherCard);
        }
    };


    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${address}&units=metric&lang=pl&appid=2a0d23c90f6487ed9a2ec5842663378a`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // wyświetl 5 ostatnich z api
            for (let i = 0; i < 5; i++) {
                let forecastCard = document.createElement('div');
                forecastCard.classList.add('forecast-card');
                let icon = getWeatherIcon(data.list[i].weather[0].description);
                forecastCard.innerHTML = `
                    <h3>${data.list[i].dt_txt} ${icon}</h3>
                    <p>Temperatura: ${data.list[i].main.temp} °C</p>
                    <p>Pogoda: ${data.list[i].weather[0].description}</p>
                `;
                document.getElementById('forecastResult').appendChild(forecastCard);
            }
        });
});
