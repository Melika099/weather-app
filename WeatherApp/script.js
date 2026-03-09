// ─── WEATHER APP — script.js ──────────────────────────────────────
// Fetches live weather data from wttr.in and updates the UI.

// Quick search shortcut used by the city pill buttons
function quickSearch(city) {
  document.getElementById('cityInput').value = city;
  getWeather(city);
}

// Returns a weather emoji based on the description text
function getWeatherEmoji(desc) {
  desc = desc.toLowerCase();
  if (desc.includes('sun') || desc.includes('clear'))        return '☀️';
  if (desc.includes('partly cloudy'))                        return '⛅';
  if (desc.includes('cloud') || desc.includes('overcast'))   return '☁️';
  if (desc.includes('drizzle'))                              return '🌦️';
  if (desc.includes('rain') || desc.includes('shower'))      return '🌧️';
  if (desc.includes('snow') || desc.includes('blizzard'))    return '❄️';
  if (desc.includes('storm') || desc.includes('thunder'))    return '⛈️';
  if (desc.includes('fog') || desc.includes('mist'))         return '🌫️';
  if (desc.includes('wind'))                                 return '💨';
  return '🌤️';
}

// Returns a friendly UV index label
function getUVLabel(uv) {
  const n = parseInt(uv);
  if (n <= 2)  return `${uv} Low`;
  if (n <= 5)  return `${uv} Mod`;
  if (n <= 7)  return `${uv} High`;
  if (n <= 10) return `${uv} V.High`;
  return `${uv} Extreme`;
}

// Returns a formatted date string e.g. "Monday, 8 March 2025"
function getFormattedDate() {
  return new Date().toLocaleDateString('en-ZA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// Shows or hides UI sections
function showSection(section) {
  document.getElementById('loading').style.display    = section === 'loading'  ? 'flex'  : 'none';
  document.getElementById('errorBox').style.display   = section === 'error'    ? 'flex'  : 'none';
  document.getElementById('weatherCard').style.display = section === 'card'   ? 'block' : 'none';
}

// Main function — fetches and displays weather
async function getWeather(city) {
  if (!city) city = document.getElementById('cityInput').value.trim();
  if (!city) {
    showError('Please enter a city name.');
    return;
  }

  showSection('loading');

  try {
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
    if (!response.ok) throw new Error('City not found. Please check the spelling and try again.');

    const data    = await response.json();
    const current = data.current_condition[0];

    // Get description and clean it up
    let description = current.weatherDesc[0].value;
    if (description.toLowerCase().includes('coffee')) description = 'Clear sky';

    // Populate the card
    document.getElementById('cityName').textContent    = city;
    document.getElementById('dateTime').textContent    = getFormattedDate();
    document.getElementById('description').textContent = description;
    document.getElementById('weatherEmoji').textContent = getWeatherEmoji(description);
    document.getElementById('temperature').textContent  = current.temp_C + '°C';
    document.getElementById('feelsLike').textContent    = `Feels like ${current.FeelsLikeC}°C`;
    document.getElementById('humidity').textContent     = current.humidity + '%';
    document.getElementById('wind').textContent         = current.windspeedKmph + ' km/h';
    document.getElementById('visibility').textContent   = current.visibility + ' km';
    document.getElementById('uvIndex').textContent      = getUVLabel(current.uvIndex);

    showSection('card');

  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  }
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  showSection('error');
}

// Allow pressing Enter to search
document.addEventListener('DOMContentLoaded', () => {
  showSection('none');
  document.getElementById('cityInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') getWeather();
  });
});
