const API_KEY = 'fd2b686517fd5181e6ba17eca0773f27';
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherDisplay = document.getElementById('weatherDisplay');

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    const city = cityInput.value.trim();

    if (city) {
        // Clear previous weather data while fetching
        weatherDisplay.innerHTML = '<p>Loading...</p>';
        try {
            // Construct the API URL with the city and API key
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

            // Use fetch to make the API call
            const response = await fetch(apiUrl);
            
            // Handle HTTP errors
            if (!response.ok) {
                // If response is not ok, throw an error with the status text
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            // Parse the JSON data from the response
            const weatherData = await response.json();

            // Display the weather information
            displayWeather(weatherData);

        } catch (error) {
            // Handle any errors that occurred during the fetch or data parsing
            console.error('There was a problem with the fetch operation:', error);
            weatherDisplay.innerHTML = `<p style="color: red;">Could not get weather for that city. Please try again.</p>`;
        }
    }
});

function displayWeather(data) {
    // Check if the data is valid and contains necessary information
    if (!data || data.cod !== 200) {
        weatherDisplay.innerHTML = `<p style="color: red;">City not found. Please check the spelling.</p>`;
        return;
    }

    // Expand upon basic usage: retrieve more data than just temperature
    const city = data.name;
    const country = data.sys.country;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const bodyElement = document.body;

    switch (description) {
        case 'clear sky':
            bodyElement.style.backgroundImage = 'url("./clear.webp")';
            bodyElement.style.color = '#000'; // For readability
            break;
        case 'few clouds':
        case 'scattered clouds':
        case 'broken clouds':
        case 'overcast clouds':
            bodyElement.style.backgroundImage = 'url("./cloudy.jpg")';
            bodyElement.style.color = '#fff';
            break;
        case 'shower rain':
        case 'rain':
        case 'light rain':
        case 'moderate rain':
        case 'heavy intensity rain':
            bodyElement.style.backgroundImage = 'url("./rain.jpg")';
            bodyElement.style.color = '#fff';
            break;

             case 'light snow':
    case 'snow':
    case 'heavy snow':
    case 'sleet':
        bodyElement.style.backgroundImage = 'url("./snow.jpg")';
        bodyElement.style.color = '#000';
        break;

    case 'thunderstorm':
    case 'light thunderstorm':
    case 'heavy thunderstorm':
        bodyElement.style.backgroundImage = 'url("./thunderstorm.webp")';
        bodyElement.style.color = '#fff';
        break;

    case 'mist':
    case 'smoke':
    case 'haze':
    case 'fog':
        bodyElement.style.backgroundImage = 'url("./mist.webp")';
        bodyElement.style.color = '#fff';
        break;

        default:
            bodyElement.style.backgroundImage = 'url("./clear.webp")'; 
            bodyElement.style.color = '#fff';
            break;
    }

    // Create the HTML to display the weather data, including the icon
    const html = `
        <h2>Weather in ${city}, ${country}</h2>
        <img src="${iconUrl}" alt="${description}">
        <p><strong>Temperature:</strong> ${temp}°C</p>
        <p><strong>Feels like:</strong> ${feelsLike}°C</p>
        <p><strong>Conditions:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;

    weatherDisplay.innerHTML = html;
}