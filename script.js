const CONFIG = {
  API_KEY: '6a6ca236f452e8c499bc7589e80c3114',
  API_URL: 'https://api.openweathermap.org/data/2.5/weather',
  UNITS: 'metric'
};

const elements = {
  cityInput: document.getElementById('cityInput'),
  weatherResult: document.getElementById('weatherResult'),
  errorMessage: document.getElementById('errorMessage')
};

async function getWeather() {
  const city = elements.cityInput.value.trim();

  if (!city) {
    showError('Please enter a city name');
    return;
  }

  try {
    const url = `${CONFIG.API_URL}?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || 'City not found');
    }

    displayWeather(data);
  } catch (error) {
    showError(error.message);
    console.error('Weather fetch error:', error);
  }
}

function displayWeather(data) {
  elements.errorMessage.style.display = 'none';
  elements.weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country || ''}</h2>
    <p>🌡️ Temperature: ${Math.round(data.main.temp)}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    <p>🌥️ ${capitalizeFirstLetter(data.weather[0].description)}</p>
  `;
  elements.weatherResult.style.display = 'block';
}

function showError(message) {
  elements.weatherResult.style.display = 'none';
  elements.errorMessage.textContent = `❌ ${message}`;
  elements.errorMessage.style.display = 'block';
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

elements.cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeather();
  }
});
