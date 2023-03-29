const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();
const ejs = require('ejs');

const app = express();
// express.static used to serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ urlencoded: true }))
app.set('view engine', 'ejs');

const apiKey = process.env.API_KEY;
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/', (req, res) => {
    const city = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    https.get(url, (response) => {
        console.log(response.statusCode);
        response.on('data', (weather) => {
            if (response.statusCode == 200) {
                const data = JSON.parse(weather);
                const temp = data.main.temp;
                const feels_like = data.main.feels_like;
                const temp_min = data.main.temp_min;
                const temp_max = data.main.temp_max;
                let description = data.weather[0].main;
                if (description == 'Clouds') {
                    description = 'cloudy';
                }
                const weatherData = {
                    city: data.name,
                    temp: temp,
                    feels_like: feels_like,
                    temp_min: temp_min,
                    temp_max: temp_max,
                    description: description
                }
                res.render('weather', { weatherData: weatherData });
            }
            else {
                res.render('404');
            }
        })
    })
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})