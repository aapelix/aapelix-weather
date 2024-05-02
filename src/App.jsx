import axios from "axios";
import { useEffect, useState } from "react";
import arrow from "./assets/arrow2.png";

function convertTimestampToDateTime(timestamp) {
    // Convert timestamp from seconds to milliseconds
    const milliseconds = timestamp * 1000;
    
    // Create a new Date object
    const date = new Date(milliseconds);
    
    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Construct the formatted date string
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    return formattedDate;
}

console.log(convertTimestampToDateTime(1714996800))

function App() {
  const apiKey = "811fc4d5fa7137cd3def2acc3d399f7e";

  const [value, setValue] = useState("");
  const [firstSearch, setFirstSearch] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [hideSuggestions, setHideSuggestions] = useState(true);

  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});

  

  const setWeatherResult = async (suggestion) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${suggestion.lat}&lon=${suggestion.lon}&appid=${apiKey}&units=metric`
      );

      setWeatherData(data);

      console.log(data);

      setFirstSearch(true)
    } catch (error) {
      console.log(error);
    }

    try {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${suggestion.lat}&lon=${suggestion.lon}&appid=${apiKey}`
      );

      setForecastData(data);

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (value != "") {
        try {
          const { data } = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=10&appid=${apiKey}`
          );

          setSuggestions(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <div>
      <div className="flex items-center flex-col m-3 fixed left-1/2 -translate-x-1/2">
        <input
          type="text"
          className="bg-[#1a1a1a] p-2 rounded-md w-[60rem] text-center focus:text-left outline-none"
          placeholder="Search..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={() => setHideSuggestions(false)}
          onBlur={async () => {
            setTimeout(() => {
              setHideSuggestions(true);
            }, 200);
          }}
        />
        {!hideSuggestions ? (
          <div className="bg-[#1a1a1a] mt-1 w-[60rem] rounded-md max-h-[24.6rem] overflow-y-hidden">
            {suggestions.map((suggestion) => (
              <div
                className="mx-2 p-1 hover:cursor-pointer hover:bg-[#0a0a0a]"
                onClick={() => {
                  setWeatherResult(suggestion);
                }}
              >
                {suggestion["name"]}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      {weatherData && firstSearch ? (
        <div className="flex items-center justify-center flex-col flex-nowrap">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            className="w-96"
            alt=""
          />
          <h1 className="text-7xl -translate-y-10">
            {weatherData.name}, {weatherData.sys.country}
          </h1>
          <div className="flex flex-row">
            <div className="text-center bg-red-500 h-36 w-36 flex justify-center items-center rounded-full flex-col mx-2">
              <p className="font-nothing text-4xl">{Math.floor(weatherData.main.temp)}°C</p>
              <p className="absolute translate-y-8 font-nothing text-xs">H: {Math.floor(weatherData.main.temp_max)}°C | L: {Math.floor(weatherData.main.temp_min)}°C</p>
            </div>
            <div className="text-center bg-[#0a0a0a] h-36 w-36 flex justify-center items-center rounded-md flex-col mx-2">
              <p className="absolute -translate-y-[3.7rem] text-sm -translate-x-7 font-nothing">Humidity</p>
              <div className="h-20 w-20 border-white border-[1px] rounded-full flex justify-center items-center">
                <div className="h-20 w-20 bg-white rounded-full" style={{transform: `scale(${weatherData.main.humidity}%)`}} />
              </div>
              <p className="absolute translate-y-14 -translate-x-10 font-nothing">{weatherData.main.humidity}%</p>
            </div>
            <div className="text-center bg-red-500 h-36 w-36 flex justify-center items-center rounded-full flex-col mx-2">
              <p className="font-bold text-lg">Feels like</p>
              <p className="font-nothing">{weatherData.main.temp}°C</p>
            </div>
            <div className="text-center bg-blue-600 h-36 w-36 flex justify-center items-center rounded-full flex-col mx-2">
              
              <img
                src={arrow}
                style={{transform: `rotate(${360 - weatherData.wind.deg}deg)`}}
                alt=""
              />
              <p className="absolute -translate-y-14 font-nothing text-xs">N</p>
              <p className="absolute translate-x-14 font-nothing text-xs">E</p>
              <p className="absolute translate-y-14 font-nothing text-xs">S</p>
              <p className="absolute -translate-x-14 font-nothing text-xs">W</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
