import React, { useState } from "react";
import { FaSearch, FaSun, FaMoon } from "react-icons/fa";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [cityName, setCityName] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("01d");
  const [recentCities, setRecentCities] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [forecast, setForecast] = useState([]);

  const API_KEY = "19e7d81e21f4d90e72e5b5ca47462452";

  const fetchWeather = async (city = search) => {
    if (!city) return;
    setLoading(true);
    try {
      
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (data.cod === 200) {
        setTemperature(data.main.temp);
        setHumidity(data.main.humidity);
        setWindSpeed(data.wind.speed);
        setCityName(data.name);
        setWeatherIcon(data.weather[0].icon);

        setRecentCities((prevCities) =>
          prevCities.includes(data.name)
            ? prevCities
            : [data.name, ...prevCities].slice(0, 5)
        );

        fetchForecast(data.name);
      }
    } catch (error) {
      console.log(error);
      setCityName("City not found");
      setTemperature(null);
      setHumidity(null);
      setWindSpeed(null);
      setWeatherIcon("01d");
      setForecast([]);
    }
    setLoading(false);
  };

  const fetchForecast = async (city) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      const dailyForecast = {};
      data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0]; 
        if (!dailyForecast[date]) {
          dailyForecast[date] = {
            temp: entry.main.temp,
            icon: entry.weather[0].icon,
            date,
          };
        }
      });

      setForecast(Object.values(dailyForecast).slice(0, 5)); 
    } catch (error) {
      console.log("Error fetching forecast:", error);
      setForecast([]);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
      } transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-5 right-5 bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600 transition"
      >
        {isDarkMode ? <FaSun className="text-yellow-300" /> : <FaMoon />}
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1 className="my-6 font-semibold">Weather App</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full px-4 py-2 mb-4 w-80 shadow-lg">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-black outline-none px-2"
        />
        <FaSearch
          onClick={() => fetchWeather()}
          className="text-gray-500 cursor-pointer"
        />
      </div>

      {/* Recently Searched Cities last  */}
      {recentCities.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {recentCities.map((city, index) => (
            <button
              key={index}
              onClick={() => fetchWeather(city)}
              className={`px-3 py-1 rounded-md text-sm transition ${
                isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-500 text-black hover:bg-gray-400"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
        alt=""
        className="w-20 h-20 mb-4"
      />

      {/* Temperature & City Name */}
      <h1 className="text-4xl font-bold mb-1">
        {loading ? "Loading..." : temperature !== null ? `${temperature}°C` : "--"}
      </h1>
      <h2 className="text-2xl mt-2 font-semibold">{cityName || "Type to check temperature"}</h2>

      {/* Humidity & Wind Speed */}
      <div className="w-full max-w-md mt-7 flex flex-col md:flex-row items-center justify-between md:items-start">
        <div className="flex flex-col items-center">
          <WiHumidity className="text-3xl" />
          <span className="text-lg font-medium">{humidity !== null ? `${humidity}%` : "--"}</span>
          <p className="text-sm">Humidity</p>
        </div>
        <div className="flex flex-col items-center">
          <WiStrongWind className="text-3xl" />
          <span className="text-lg font-medium">{windSpeed !== null ? `${windSpeed}km/h` : "--"}</span>
          <p className="text-sm">Wind Speed</p>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
          <div className="flex gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-lg text-center ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-gray-400 text-black"
                }`}
              >
                <p className="text-sm font-medium">{day.date}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt=""
                  className="w-14 mx-auto"
                />
                <p className="text-lg font-bold">{Math.round(day.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
