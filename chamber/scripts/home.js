// ===========================================================
// Nairobi Chamber of Commerce — Home page behavior
// Handles: weather (OpenWeatherMap) + member spotlights.
// Shared header/nav/theme/footer behavior lives in site.js.
// ===========================================================

// ---- Configuration --------------------------------------------
// TODO: replace with your own free OpenWeatherMap API key.
// Sign up at https://openweathermap.org/api — the "Current Weather
// Data" and "5 Day / 3 Hour Forecast" endpoints used below are both
// included in the free tier.
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

// Nairobi, Kenya coordinates
const CHAMBER_LAT = -1.2921;
const CHAMBER_LON = 36.8219;

const weatherStatusEl = document.querySelector("#weatherStatus");
const weatherCurrentEl = document.querySelector("#weatherCurrent");
const forecastListEl = document.querySelector("#forecastList");
const spotlightsGridEl = document.querySelector("#spotlightsGrid");

const tierLabels = {
  1: { label: "Member", className: "tier-member" },
  2: { label: "Silver Member", className: "tier-silver" },
  3: { label: "Gold Member", className: "tier-gold" },
};

// ---------------------------------------------------------------
// Weather
// ---------------------------------------------------------------

/**
 * Fetches current conditions from OpenWeatherMap's free
 * "Current Weather Data" endpoint.
 * @returns {Promise<object|null>}
 */
async function getCurrentWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${CHAMBER_LAT}&lon=${CHAMBER_LON}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Current weather request failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not load current weather:", error);
    return null;
  }
}

/**
 * Fetches the free "5 Day / 3 Hour Forecast" endpoint. OpenWeatherMap's
 * daily forecast (One Call) requires a paid subscription, so a 3-day
 * outlook is built here instead by grouping the 3-hour entries by
 * calendar date and taking the high/low of each day.
 * @returns {Promise<object|null>}
 */
async function getForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${CHAMBER_LAT}&lon=${CHAMBER_LON}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast request failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not load forecast:", error);
    return null;
  }
}

/**
 * Groups the forecast API's 3-hour entries into per-day high/low
 * summaries, skipping today, and returns the next 3 calendar days.
 * @param {Array<object>} list - the `list` array from the forecast response
 * @returns {Array<{label: string, high: number, low: number}>}
 */
function buildThreeDayForecast(list) {
  const today = new Date().toDateString();
  const byDay = new Map();

  list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    const dayKey = date.toDateString();

    if (dayKey === today) return; // skip today; we show it as "current"

    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, {
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        high: entry.main.temp_max,
        low: entry.main.temp_min,
      });
    } else {
      const day = byDay.get(dayKey);
      day.high = Math.max(day.high, entry.main.temp_max);
      day.low = Math.min(day.low, entry.main.temp_min);
    }
  });

  return Array.from(byDay.values()).slice(0, 3);
}

/**
 * Renders current conditions + the 3-day forecast into the DOM.
 */
function renderWeather(current, forecastDays) {
  weatherCurrentEl.innerHTML = "";
  forecastListEl.innerHTML = "";

  const icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
  icon.alt = current.weather[0].description;
  icon.width = 56;
  icon.height = 56;

  const details = document.createElement("div");

  const temp = document.createElement("p");
  temp.className = "weather-temp";
  temp.textContent = `${Math.round(current.main.temp)}°C`;

  const desc = document.createElement("p");
  desc.className = "weather-desc";
  desc.textContent = current.weather[0].description;

  details.append(temp, desc);
  weatherCurrentEl.append(icon, details);

  forecastDays.forEach((day) => {
    const item = document.createElement("li");

    const label = document.createElement("p");
    label.className = "day-label";
    label.textContent = day.label;

    const range = document.createElement("p");
    range.className = "temp-range";
    range.textContent = `${Math.round(day.high)}° / ${Math.round(day.low)}°`;

    item.append(label, range);
    forecastListEl.appendChild(item);
  });

  weatherStatusEl.textContent = "";
}

/**
 * Coordinates both weather fetches and renders the result, or shows
 * a clear status message if the API key hasn't been set up yet or a
 * request fails.
 */
async function loadWeather() {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
    weatherStatusEl.textContent = "Weather unavailable: add your OpenWeatherMap API key in scripts/home.js.";
    return;
  }

  const [current, forecast] = await Promise.all([getCurrentWeather(), getForecast()]);

  if (!current || !forecast) {
    weatherStatusEl.textContent = "Sorry, weather data could not be loaded right now.";
    return;
  }

  const threeDayForecast = buildThreeDayForecast(forecast.list);
  renderWeather(current, threeDayForecast);
}

// ---------------------------------------------------------------
// Member spotlights
// ---------------------------------------------------------------

/**
 * Loads the chamber's member directory (same JSON source as the
 * directory page).
 * @returns {Promise<Array<object>>}
 */
async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }
    const data = await response.json();
    return data.members;
  } catch (error) {
    console.error("Could not load member directory:", error);
    return [];
  }
}

/**
 * Shuffles an array using the Fisher-Yates algorithm without
 * mutating the original array.
 * @param {Array} array
 * @returns {Array} a new, shuffled array
 */
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds a single spotlight card element for one member.
 */
function createSpotlightCard(member) {
  const card = document.createElement("article");
  card.className = "spotlight-card";

  const tier = tierLabels[member.membership] ?? tierLabels[1];

  const img = document.createElement("img");
  img.src = `images/${member.image}`;
  img.alt = `${member.name} logo`;
  img.width = 56;
  img.height = 56;
  img.loading = "lazy";

  const body = document.createElement("div");

  const badge = document.createElement("span");
  badge.className = `tier-badge ${tier.className}`;
  badge.textContent = tier.label;

  const heading = document.createElement("h3");
  heading.textContent = member.name;

  const address = document.createElement("address");
  address.textContent = member.address;

  const phone = document.createElement("p");
  phone.className = "card-meta";
  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${member.phone.replace(/\s+/g, "")}`;
  phoneLink.textContent = member.phone;
  phone.appendChild(phoneLink);

  const link = document.createElement("a");
  link.className = "card-link";
  link.href = member.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Visit website";

  body.append(badge, heading, address, phone, link);
  card.append(img, body);

  return card;
}

/**
 * Picks 2–3 silver/gold members at random and renders them.
 * Re-running this (e.g. on page reload) yields a different set,
 * satisfying the "randomly load spotlights each time" requirement.
 */
async function loadSpotlights() {
  const members = await getMembers();
  const eligible = members.filter((m) => m.membership === 2 || m.membership === 3);

  if (eligible.length === 0) {
    spotlightsGridEl.innerHTML = `<p role="alert">No spotlighted members are available right now.</p>`;
    return;
  }

  const count = Math.min(eligible.length, Math.random() < 0.5 ? 2 : 3);
  const chosen = shuffle(eligible).slice(0, count);

  spotlightsGridEl.innerHTML = "";
  chosen.forEach((member) => spotlightsGridEl.appendChild(createSpotlightCard(member)));
}

// ---- Init -------------------------------------------------------
loadWeather();
loadSpotlights();
