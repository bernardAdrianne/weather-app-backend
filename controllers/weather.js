import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const searchWeather = async (req, res, next) => {
  const { city } = req.params;

  if (!city) {
    return next(errorHandler(400, "City is required"));
  }

  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // Get coordinates of city
    const geoRes = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );

    if (!geoRes.data.length) {
      return next(errorHandler(404, "City not found"));
    }

    const { lat, lon } = geoRes.data[0];

    // Current weather
    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    // 5-day / 3-hour forecast
    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    // Build response
    const response = {
      city,
      coordinates: { lat, lon },
      current: {
        temp: currentRes.data.main.temp,
        humidity: currentRes.data.main.humidity,
        wind_kmh: (currentRes.data.wind.speed * 3.6).toFixed(1),
        rainfall: currentRes.data.rain ? currentRes.data.rain["1h"] || 0 : 0,
        description: currentRes.data.weather[0].description,
      },
      hourly: forecastRes.data.list.map((h) => ({
        time: h.dt_txt,
        temp: h.main.temp,
        humidity: h.main.humidity,
        wind_kmh: (h.wind.speed * 3.6).toFixed(1),
        rainfall: h.rain ? h.rain["3h"] || 0 : 0,
        description: h.weather[0].description,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
    next(error);
  }
};
