const apiFunction = "forecast";
const apiKey = "7816d9f235c88adc096427a68ca872f2";
const units = "metric";

const cityNameElement = document.getElementById("city-name");
const currImageElement = document.getElementById("curr-img");
const headlineElement = document.getElementById("headline-condition");
const subheadlineElement = document.getElementById("sub-condition");
const currentTempElement = document.getElementById("curr-temp");
const currentHumidityElement = document.getElementById("curr-humidity");
const currentWindSpeedElement = document.getElementById("curr-wind-speed");
const currentWindDirection = document.getElementById("curr-wind-direction");
const currentCloudCover = document.getElementById("curr-cloud-cover");
const inputElement = document.getElementById("city-input");
const buttonElement = document.getElementById("submit");
const forecastElement = document.getElementById("forecast-area");

buttonElement.addEventListener('click', handleInput);

function handleInput() {
    forecastElement.innerHTML = "";

    const userInput = inputElement.value;
    const url = `https://api.openweathermap.org/data/2.5/${apiFunction}?q=${userInput}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (object) {
            cityNameElement.innerText = object.city.name;
            const imgIcon = object.list[0].weather[0].icon;
            const imgURL = `https://openweathermap.org/img/wn/${imgIcon}@2x.png`;
            currImageElement.src = imgURL;
            headlineElement.innerText = object.list[0].weather[0].main;
            subheadlineElement.innerText = object.list[0].weather[0].description;
            currentTempElement.innerText = object.list[0].main.temp;
            currentHumidityElement.innerText = object.list[0].main.humidity;
            currentWindSpeedElement.innerText = object.list[0].wind.speed;
            currentWindDirection.innerText = getCardinalDirection(object.list[0].wind.deg);
            currentCloudCover.innerHTML = object.list[0].clouds.all;

            for (let i = 7; i < object.list.length; i+=8) {
                const imgIcon = object.list[i].weather[0].icon;
                const imgURL = `https://openweathermap.org/img/wn/${imgIcon}@2x.png`;
                const headline = object.list[i].weather[0].main;
                const subheadline = object.list[i].weather[0].description;
                const temperature = object.list[i].main.temp;
                const humidity = object.list[i].main.humidity;
                const windSpeed = object.list[i].wind.speed;
                const windDirection = getCardinalDirection(object.list[i].wind.deg);
                const cloudCover = object.list[i].clouds.all;

                const timeStamp = object.list[i].dt;
                const dateTime = new Date(timeStamp * 1000);
                const dayOfWeek = dateTime.toLocaleDateString("en-GB", { weekday: 'long' });

                const htmlToInsert = `
                <div class="col">
                    <h3>${dayOfWeek}</h3>
                    <img src="${imgURL}">
                    <h3><span>${headline}</span> (<span>${subheadline}</span>)</h3>
                    <h4>Temperature: <span>${temperature}</span>°C</h4>
                    <h5>Humidity: <span>${humidity}</span>%</h5>
                    <h5>Wind: <span>${windSpeed}</span>m/s <span>${windDirection}</span></h5>
                    <h5>Cloud Coverage: <span>${cloudCover}</span>%</h5>
                </div>
                `;
                forecastElement.innerHTML += htmlToInsert;
            }


        });
}


function getCardinalDirection(degree) {
    if (degree < 0 || degree > 359) {
        return 'Invalid degree';
    }

    const directions = [
        'N', 'NE', 'E', 'SE',
        'S', 'SW', 'W', 'NW',
    ];

    const index = Math.round(degree / 45) % 8;
    return directions[index];
}