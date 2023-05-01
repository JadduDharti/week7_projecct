const form = document.querySelector('form');
const locationInput = document.querySelector('#location');
const high = document.querySelector('#high');
const low = document.querySelector('#low');
const now = document.querySelector('#now');
const feels = document.querySelector('#feels');
const forecast = document.querySelector('#forecast');
const humidity = document.querySelector('#humidity');

const apiKey = "261359517efee5cceac08d5fd3a8c3c3"

const spotifyClientId = "0e38e990ceb94732ba9d3fe687c9e3d9";
const spotifyClientSecret = "a39fb8a3eaa74f43a5ab354eb1351091";

let song;
let playsong;


const getToken = async () => {
    const result = await fetch(`https://accounts.spotify.com/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(spotifyClientId + ':' + spotifyClientSecret)
        },
        body: 'grant_type=client_credentials'

    });

    // Access the given data by the fetch response
    const data = await result.json()
    console.log(data.access_token)
    return data.access_token
}



/**
 * 
 * 
 * 
 * @param {string} temperature_s
 * @param {number} item_index
 */


const songToPlay = async (temperature_s, itemIndex=0) => {

    // Get track name from the alt text in img element
    
    let token = await getToken()

    let headers = new Headers([
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
        ['Authorization', `Bearer ${token}`]
    ]);

    let request = new Request(`https://api.spotify.com/v1/search?q=${temperature_s}&type=track&limit=15`, {
        method: 'GET',
        headers: headers
    });

    let result = await fetch(request);
    let response = await result.json()
    console.log(response)

    song = response.tracks.items[itemIndex].preview_url

    console.log(song)

    while (song == null) {
        itemIndex++;
        song = response.tracks.items[itemIndex].preview_url
    }


    if (playsong) {
        stopSnippet();
    }

    songSnippet(song)
    
}



/**
 * 
 * @param url
 * 
 */

const songSnippet = (url) => {
    playsong = new Audio(url)
    playsong.volume = 0.3
    return playsong.play()
}

const stopSnippet = () => {
    return playsong.pause()
}


form.addEventListener('submit', e => {

    e.preventDefault();
    
    const location = locationInput.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(1);
            
            let s = Number(kelvinToFahrenheit(data.main.temp))

            now.textContent = kelvinToFahrenheit(data.main.temp) + '°F';
            feels.textContent = kelvinToFahrenheit(data.main.feels_like) + '°F';
            high.textContent = kelvinToFahrenheit(data.main.temp_max) + '°F';
            low.textContent = kelvinToFahrenheit(data.main.temp_min) + '°F';
            forecast.textContent = data.weather[0].description;
            humidity.textContent = data.main.humidity + '%';


            if (s >= 70) {
                e.stopPropagation()
                songToPlay("vaction is on summer", 0)
                setTimeout(() => { stopSnippet() }, 5000)
            }
            else if (s >= 45 && s < 70) {
                e.stopPropagation()
                songToPlay("cloud Raining", 0)
                setTimeout(() => { stopSnippet() }, 5000)
            }
            else {
                e.stopPropagation()
                songToPlay("Winter snow", 0)
                setTimeout(() => { stopSnippet() }, 5000)
            }
        })
        .catch(error => console.log(error));




    const unsplashAccessKey = 'yUT_i9uqI_tHRszW_8i0-PHx_yC7F5e7MOSPVxr1DpM';
    const query = locationInput.value;

    fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashAccessKey}`)
        .then(response => response.json())
        .then(data => {
            const imageUrl = data.urls.regular; // get the URL of the image
            console.log(imageUrl)
            document.body.style.backgroundImage = `url(${imageUrl})`; // set the background image of the body
        })
        .catch(error => console.error(error));

});

