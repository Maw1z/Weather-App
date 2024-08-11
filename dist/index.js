let input = document.getElementById("place_search");

input.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    fetchLatAndLon();
  }
});

async function fetchLatAndLon() {
  const apiKey = "505b9f7c972bfae070f0eefbc9241b02";

  document.getElementById("banner").style.display = "none";
  document.getElementById("weather-details").style.visibility = "visible";

  try {
    const city = document.getElementById("place_search").value;

    // Geocoding
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
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
    weather: [{ id }],
    timezone: timezone,
    wind: { speed },
    rain,
  } = data;

  const rain1h = rain ? rain["1h"] : 0;

  // Displaying place
  document.getElementById("place").innerHTML = country + " &middot; " + name;

  // Displaying temp in celcius for now
  document.getElementById("temp_current").innerHTML = formatTemp(temp) + " C";
  document.getElementById("temp_max_min").innerHTML =
    "H: " + formatTemp(temp_max) + " L: " + formatTemp(temp_min);

  // Displaying suitable images in bg based on weather
  let img_src = "";
  if (id >= 200 && id <= 232) {
    img_src = "./Images/Temperature images/thunderstorm.png";
  } else if (id >= 300 && id <= 531) {
    img_src = "./Images/Temperature images/rain.png";
  } else if (id >= 600 && id <= 622) {
    img_src = "./Images/Temperature images/snow.png";
  } else if (id == 781) {
    img_src = "./Images/Temperature images/tornado.png";
  } else if (id == 800) {
    img_src = "./Images/Temperature images/clear.png";
  } else if (id >= 800) {
    img_src = "./Images/Temperature images/clouds.png";
  }

  document.getElementById(
    "temp_image"
  ).innerHTML = `        <img src="${img_src}" class="w-60">`;

  // Displaying weather now details
  document.getElementById("feels_like").innerHTML =
    formatTemp(feels_like) + " C";
  document.getElementById("rain_percentage").innerHTML = rain1h + " mm";
  document.getElementById("wind_speed").innerHTML = speed + " m/s";
  document.getElementById("humidity_percentage").innerHTML = humidity + "%";
  document.getElementById("sunrise").innerHTML = formatTime(sunrise, timezone);
  document.getElementById("sunset").innerHTML = formatTime(sunset, timezone);
}

function displayHourlyData(data) {
  let timezone = data.timezone_offset;
  let hourlyData = data.hourly;

  let hr_HTML = `
    <div class="mb-3">
    <h3 class="lg:inline sm:hidden text-4xl font-bold">
      Hourly
    </h3>
    </div>
    <div id="hr-temp-box" class="grid grid-flow-col gap-3 overflow-x-auto overscroll-x-contain auto-cols-auto">
  `;

  for (let i = 1; i < 24; i++) {
    let hr_temp = hourlyData[i].temp;
    let id = hourlyData[i].weather[0].id;
    let time = hourlyData[i].dt;

    let img_src = "";
    if (id >= 200 && id <= 232) {
      img_src = "./Images/Weather Icons/thunderstorm.svg";
    } else if (id >= 300 && id <= 531) {
      img_src = "./Images/Weather Icons/rain.svg";
    } else if (id >= 600 && id <= 622) {
      img_src = "./Images/Weather Icons/snow.svg";
    } else if (id == 800) {
      img_src = "./Images/Weather Icons/clear.svg";
    } else if (id >= 800) {
      img_src = "./Images/Weather Icons/clouds.svg";
    }

    hr_HTML += `      
    <div class="rounded-sm flex flex-col justify-center items-center py-2 bg-grey1 sm:w-[70px] lg:w-[110px] lg:h-[130px]">
      <div id="hr-time" class="mb-1 lg:mb-2">
        <p>
          ${getFirstTwoDigit(formatTime(time, timezone))}
        </p>
      </div>
      <div id="hr-icon" class="mb-1 lg:mb-2">
        <img src="${img_src}" class="w-6"
          style="filter: invert(32%) sepia(0%) saturate(0%) hue-rotate(210deg) brightness(97%) contrast(88%);">
      </div>
      <div id="hr-temp">
        <p class="font-bold text-lg">
          ${getFirstTwoDigit(formatTemp(hr_temp))}
        </p>
      </div>
    </div>`;
  }
  hr_HTML += `</div>`;
  document.getElementById("hr_temp_JS").innerHTML = hr_HTML;
}

function displayDailyData(data) {
  let timezone = data.timezone_offset;
  let dailyData = data.daily;
  let daily_HTML = "";

  for (let i = 1; i < 8; i++) {
    let time_date = formatDate(dailyData[i].dt, timezone);
    let temp_desc = dailyData[i].weather[0].main;
    let daily_temp_max = formatTemp(dailyData[i].temp.max);
    let daily_temp_min = formatTemp(dailyData[i].temp.min);

    daily_HTML += `        
    <div class="flex justify-center">
      <div class="w-11/12 mb-2 flex justify-between sm:text-xl lg:text-2xl">
        <div>
          <p>
            ${time_date}
          </p>
        </div>
        <div>
          <p class="text-center">
            ${temp_desc}
          </p>
        </div>
        <div>
          <p>
            H: ${getFirstTwoDigit(daily_temp_max)} L: ${getFirstTwoDigit(
      daily_temp_min
    )}
          </p>
        </div>
      </div>
    </div>
    `;
  }
  document.getElementById("daily_temp_predictions_JS").innerHTML = daily_HTML;
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

function toggleWeatherDetails() {
  const weatherDetails = document.getElementById("weather-details");
  const arrowIcon = document.getElementById("arrow-icon");

  if (weatherDetails.classList.contains("expanded")) {
    weatherDetails.style.height = "30vh";
    weatherDetails.classList.remove("expanded");
    arrowIcon.style.transform = "rotate(0deg)";
  } else {
    weatherDetails.style.height = "90vh";
    weatherDetails.classList.add("expanded");
    arrowIcon.style.transform = "rotate(180deg)";
  }
}
