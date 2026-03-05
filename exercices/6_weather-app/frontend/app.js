/**
 * Weather App - Frontend for Docker Schulung
 * Fetches weather data from the backend API proxy.
 */

// WMO weather code to German description (simplified)
const WEATHER_CODES = {
  0: 'Klar',
  1: 'Überwiegend klar',
  2: 'Teilweise bewölkt',
  3: 'Bewölkt',
  45: 'Nebel',
  48: 'Gefrierender Nebel',
  51: 'Leichter Nieselregen',
  53: 'Nieselregen',
  55: 'Starker Nieselregen',
  61: 'Leichter Regen',
  63: 'Regen',
  65: 'Starker Regen',
  71: 'Leichter Schneefall',
  73: 'Schneefall',
  75: 'Starker Schneefall',
  77: 'Schneekörner',
  80: 'Leichte Regenschauer',
  81: 'Regenschauer',
  82: 'Starke Regenschauer',
  85: 'Leichte Schneeschauer',
  86: 'Schneeschauer',
  95: 'Gewitter',
  96: 'Gewitter mit Hagel',
  99: 'Gewitter mit starkem Hagel',
};

function getWeatherDescription(code) {
  return WEATHER_CODES[code] ?? `Code ${code}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  // Reset UI
  errorEl.classList.add('hidden');
  resultEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');
  form.querySelector('button').disabled = true;

  try {
    const apiUrl = '/api/weather?city=' + encodeURIComponent(city);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Fehler ${response.status}`);
    }

    const data = await response.json();
    renderWeather(data);
    resultEl.classList.remove('hidden');
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.classList.remove('hidden');
  } finally {
    loadingEl.classList.add('hidden');
    form.querySelector('button').disabled = false;
  }
});

function renderWeather(data) {
  const { location, current, forecast } = data;

  document.getElementById('location-name').textContent = location.name;
  document.getElementById('location-country').textContent = location.country;

  document.getElementById('current-temp').textContent =
    current.temperature != null ? `${Math.round(current.temperature)} °C` : '–';
  document.getElementById('current-humidity').textContent =
    current.humidity != null ? `${current.humidity} %` : '–';
  document.getElementById('current-wind').textContent =
    current.wind_speed != null ? `${current.wind_speed} km/h` : '–';
  document.getElementById('current-condition').textContent =
    getWeatherDescription(current.weather_code);

  const forecastList = document.getElementById('forecast-list');
  forecastList.innerHTML = forecast
    .map(
      (day) => `
    <div class="forecast-day">
      <span class="date">${formatDate(day.date)}</span>
      <span class="temps">
        ${day.temp_max != null ? Math.round(day.temp_max) : '–'}° /
        ${day.temp_min != null ? Math.round(day.temp_min) : '–'}°
        · ${getWeatherDescription(day.weather_code)}
      </span>
    </div>
  `
    )
    .join('');
}
