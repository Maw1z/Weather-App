async function fetchLatAndLon() {
  const apiKey = "505b9f7c972bfae070f0eefbc9241b02";

  try {
    const city = document.getElementById("place_search").value;

    // Geocoding
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      console.error("Error fetching weather: " + response.statusText);
    } else {
      const data = await response.json();
      // Fetching latitude and longitude of input city
      const city_lat = data[0].lat;
      const city_lon = data[0].lon;
      fetchCurrentWeather(city_lat, city_lon);
      fetchOtherWeather(city_lat, city_lon);
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchCurrentWeather(lat, lon) {
  const apiKey = "505b9f7c972bfae070f0eefbc9241b02";

  try {
    // Current
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      console.error("Error fetching weather: " + response.statusText);
    } else {
      const data = await response.json();
      displayCurrentWeather(data);
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchOtherWeather(lat, lon) {
  const apiKey = "505b9f7c972bfae070f0eefbc9241b02";

  try {
    // One call
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}`
    );
    if (!response.ok) {
      console.error("Error fetching weather: " + response.statusText);
    } else {
      const data = await response.json();
      displayHourlyData(data);
      displayDailyData(data);
    }
  } catch (error) {
    console.error(error);
  }
}

function displayCurrentWeather(data) {
  const {
    name: name,
    sys: { country, sunrise, sunset },
    main: { feels_like, temp, temp_max, temp_min, humidity },
    weather: [{ main, id }],
    timezone: timezone,
    wind: { speed },
    rain,
  } = data;

  const rain1h = rain ? rain["1h"] : 0;

  // Displaying place name
  document.getElementById("place_code").innerHTML = country;
  document.getElementById("place_name").innerHTML = name;

  // Displaying temp in celcius for now
  document.getElementById("temp_current").innerHTML = formatTemp(temp);
  // document.getElementById("temp_text").innerHTML = main;
  document.getElementById("temp_max").innerHTML = formatTemp(temp_max);
  document.getElementById("temp_min").innerHTML = formatTemp(temp_min);

  // TO DO: Use id to display suitable images in bg

  // Displaying weather now details
  document.getElementById("feels_like").innerHTML = formatTemp(feels_like);
  document.getElementById("rain_percentage").innerHTML = rain1h;
  document.getElementById("wind_speed").innerHTML = speed;
  document.getElementById("humidity_percentage").innerHTML = humidity;
  document.getElementById("sunrise").innerHTML = formatTime(sunrise, timezone);
  document.getElementById("sunset").innerHTML = formatTime(sunset, timezone);
}

function displayHourlyData(data) {
  let timezone = data.timezone_offset;
  let hourlyData = data.hourly;

  let hr_HTML = "";

  for (let i = 1; i < 24; i++) {
    let hr_temp = hourlyData[i].temp;
    let id = hourlyData[i].weather.id;
    let time = hourlyData[i].dt;

    hr_HTML += `      
    <div class="w-[70px] border-solid border-2 flex flex-col justify-center items-center py-2 bg-grey1">
      <div id="hr-time" class="mb-1">
        <p>
          ${getFirstTwoDigit(formatTime(time, timezone))}
        </p>
      </div>
      <div id="hr-icon" class="mb-1">
        <img src="./Images/Weather Icons/MaterialSymbolsClearDayRounded.svg" class="w-6"
          style="filter: invert(32%) sepia(0%) saturate(0%) hue-rotate(210deg) brightness(97%) contrast(88%);">
      </div>
      <div id="hr-temp">
        <p class="font-bold text-lg">
          ${getFirstTwoDigit(formatTemp(hr_temp))}
        </p>
      </div>
    </div>`;
  }
  document.getElementById("hr-temp-box").innerHTML = hr_HTML;
}

function displayDailyData(data) {
  let timezone = data.timezone_offset;
  let dailyData = data.daily;
  let daily_HTML = "";

  for (let i = 0; i < 8; i++) {
    let time_date = formatDate(dailyData[i].dt, timezone);
    let temp_desc = dailyData[i].weather[0].main;
    let daily_temp_max = formatTemp(dailyData[i].temp.max);
    let daily_temp_min = formatTemp(dailyData[i].temp.min);

    daily_HTML += `        
    <div class="flex justify-center">
      <div class="w-11/12 mb-1 flex justify-between text-xl">
        <p>
          ${time_date}
        </p>
        <p class="text-center">
          ${temp_desc}
        </p>
        <p>
          H: ${getFirstTwoDigit(daily_temp_max)} L: ${getFirstTwoDigit(
      daily_temp_min
    )}
        </p>
      </div>
    </div>
    `;
  }
  document.getElementById("daily_temp_predictions").innerHTML = daily_HTML;
}

function formatTemp(temp) {
  const formattedTemp = (temp - 273.15).toFixed(1) + "°";

  return formattedTemp;
}

function formatTime(inputTime, timezone) {
  const options = { hour: "2-digit", minute: "2-digit", timeZone: "UTC" };

  const utcTime = new Date(inputTime * 1000);
  const formattedDate = new Date(
    utcTime.getTime() + timezone * 1000
  ).toLocaleTimeString("en-GB", options);

  return formattedDate;
}

function formatDate(inputTime, timezone) {
  const utcTime = new Date(inputTime * 1000);

  const localTime = new Date(utcTime.getTime() + timezone * 1000);

  let day = localTime.getUTCDate();
  let month = localTime.getUTCMonth() + 1;

  const dayStr = day < 10 ? "0" + day : day;
  const monthStr = month < 10 ? "0" + month : month;

  return `${dayStr}/${monthStr}`;
}

function getFirstTwoDigit(number) {
  return ("" + number).slice(0, 2);
}
