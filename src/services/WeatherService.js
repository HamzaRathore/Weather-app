import { DateTime } from "luxon";

const API_KEY = "889f67e86afb645e21e16fe3abf53c3c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Fetch data from the OpenWeather API
const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .catch((error) => {
      console.error("Failed to fetch weather data:", error);
      return null;
    });
};

// Format the current weather data
const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;
  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_max,
    temp_min,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

// Format the forecast weather data
const formatForecastWeather = (data) => {
  if (!data || !data.daily || !data.hourly) {
    console.error("Invalid forecast data format.");
    return { timezone: "", daily: [], hourly: [] };
  }

  const { timezone, daily, hourly } = data;
  const formattedDaily = daily.slice(1, 6).map((d) => ({
    title: formatToLocalTime(d.dt, timezone, "ccc"),
    temp: d.temp.day,
    icon: d.weather[0].icon,
  }));

  const formattedHourly = hourly.slice(1, 6).map((d) => ({
    title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
    temp: d.temp,
    icon: d.weather[0].icon,
  }));

  return { timezone, daily: formattedDaily, hourly: formattedHourly };
};

// Get both current and forecast weather data
const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData("weather", searchParams)
    .then((data) => data && formatCurrentWeather(data));

  if (!formattedCurrentWeather) return null;

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then((data) => data && formatForecastWeather(data));

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

// Format Unix timestamp to local time
const formatToLocalTime = (secs, zone, format = "cccc, dd LLL yyyy ' | Local time:' hh:mm a") =>
  DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

// Get icon URL from icon code
const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };
