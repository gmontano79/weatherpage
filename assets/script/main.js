var cities = [];


var cityInputEl = document.querySelector("#cityInput");

var dailyForecast = document.querySelector("#dailyForecast");
var weatherContainerEl = document.querySelector("#currentWeatherContainer");
var citySearchInputEl = document.querySelector("#searchedCity");
var fiveDayForecastContainerEl = document.querySelector(
  "#fiveDayForecastContainer"
);
var savedCitiesButtonEl = document.querySelector("#savedCitiesBtn");

var addCity = document.querySelector("#search-city");


var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityWeather(cityName);
    fiveDayForecast(cityName);
    cities.unshift({ cityName });

    cityInputEl.value = "";
  } else {
    alert("Please enter a valid city name");
  }
  saveSearchedCities();
  saveSearch(cityName);
};

var getCityWeather = function (cityName) {
  var apiKey = "5df86586c8eb69555c2eb842b001b126";
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, cityName);
    });
  });
};

var displayWeather = function (weather, searchCity) {

  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;
  citySearchInputEl.classList = "text-uppercase font-weight-bold";

 

  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MM/D/YYYY") + ")";
  currentDate.classList = "font-weight-bold";
  citySearchInputEl.appendChild(currentDate);

 
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInputEl.appendChild(weatherIcon);

 
  var windEl = document.createElement("span");
  windEl.textContent = "Wind: " + weather.wind.speed + " MPH";
  windEl.classList = "list-group-item";


  var tempEl = document.createElement("span");
  tempEl.textContent = "Temp: " + weather.main.temp + " °F";
  tempEl.classList = "list-group-item";


  var humidityEl = document.createElement("span");
  humidityEl.classList = "list-group-item";
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";



  weatherContainerEl.appendChild(tempEl);
  weatherContainerEl.appendChild(windEl);
  weatherContainerEl.appendChild(humidityEl);



  var lat = weather.coord.lat;
  var lon = weather.coord.lon;


  pullUVI(lat, lon);
};



var pullUVI = function (lat, lon) {
  var apiKey = "5df86586c8eb69555c2eb842b001b126";
  var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;


  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayUVI(data);
    });
  });
};



var displayUVI = function (index) {
  var uviEl = document.createElement("div");
  uviEl.textContent = "UV Index: ";
  uviEl.classList = "list-group-item";

  uvi = document.createElement("span");
  uvi.textContent = index.value;

 

  if (index.value < 3 || index.value === 3) {
    uvi.classList = "green";
  } else if (index.value > 3 && index.value < 7) {
    uvi.classList = "yellow";
  } else {
    uvi.classList = "red";
  }



  uviEl.appendChild(uvi);
  weatherContainerEl.appendChild(uviEl);
};

var saveSearchedCities = function () {

  localStorage.setItem("cities", JSON.stringify(cities));
};

var loadSearchedCities = function () {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
  console.log(cities);
  var citiesFiltered = cities.filter(function (value, index, self) {
    return (
      self.findIndex(function (m) {
        return m.cityName === value.cityName;
      }) === index
    );
  });
  console.log(citiesFiltered);
  citiesFiltered.forEach(function (city) {
    saveSearch(city.cityName);
  });
};


var fiveDayForecast = function (cityName) {
  var apiKey = "844421298d794574c100e3409cee0499";
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${cityName}&units=imperial&appid=${apiKey}`;
  console.log(apiUrl);


  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayFiveDayForecast(data);
    
    });
  });
};



var displayFiveDayForecast = function (weather) {

  fiveDayForecastContainerEl.textContent = "";

  var forecast = weather.list;

  

  for (var i = 0; i < 40; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");

    forecastEl.classList = "card  text-light";

    

    var forecastDate = document.createElement("h4");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

  
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "cardBody";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    forecastEl.appendChild(weatherIcon);

 

    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "cardBody";
    forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
    console.log(dailyForecast);

    forecastEl.appendChild(forecastTempEl);



    var forecastHumidityEl = document.createElement("span");
    forecastHumidityEl.classList = "cardBody";
    forecastHumidityEl.textContent =
      "Humidity: " + dailyForecast.main.humidity + "  %";

    forecastEl.appendChild(forecastHumidityEl);

    

    var forecastWindSpeedEl = document.createElement("span");
    forecastWindSpeedEl.classList = "cardBody";
    forecastWindSpeedEl.textContent =
      "Wind Speed: " + dailyForecast.wind.speed + "  MPH";

    forecastEl.appendChild(forecastWindSpeedEl);

   

    fiveDayForecastContainerEl.appendChild(forecastEl);
  }
};

var savedCities = [];

var saveSearch = function (saveSearch) {
  savedCitiesEl = document.createElement("button");
  savedCitiesEl.textContent = saveSearch;
  savedCitiesEl.classList = "d-flex w-100 gradient-custom2 border p-2";
  savedCitiesEl.setAttribute("searched-city", saveSearch);
  savedCitiesEl.setAttribute("type", "submit");

  savedCitiesButtonEl.prepend(savedCitiesEl);
};

var savedCitiesHandler = function (event) {
  var city = event.target.getAttribute("searched-city");
  console.log(city);
  if (city) {
    getCityWeather(city);
    fiveDayForecast(city);
  }
};



document
  .getElementById("searchCity")
  .addEventListener("click", formSubmitHandler);

savedCitiesButtonEl.addEventListener("click", savedCitiesHandler);

loadSearchedCities();