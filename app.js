const { json } = require("express");
const express = require("express");
const app = express();
const https = require("https"); //no need to install anything
const bodyParser = require("body-parser");
const { rmSync } = require("fs");
const { builtinModules } = require("module");
const { TIMEOUT } = require("dns");



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {

    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=b80569182e7018d858eb08834fd721b8&q=" + query + "&units=metric";
    // res.send("Server is up and running");
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const weather = weatherData.weather[0].main;
            const feelsLike = weatherData.main.feels_like;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const timezone = weatherData.timeZone;
            const d= new Date((weatherData.sys.sunrise + weatherData.timezone)*1000);
            
            

            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            console.log(weatherData);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<style type="text/css">
            body {
              font-family: 'Garamond';
              background-image: url("/images/bg.jpg");
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              width:100%;
              height:100vh;
            }
            h1{
                color:black;
            }
            p{
                font-size:20px;
            }
            .city{
                font-size:60px;
            }
            div{
                text-align:center;
            }
            .container{
                display:flex;
                align-items:center;
                margin:0 auto;
                
            }
            .widthSearch{
                justify-content:center;
                width:25%;
                
            }
            .widthInfo{
                justify-content: space-between;

                width:50%;
            }
            .weather{
                font-size: 50px;
            }
            .container2{
                // background-Color:yellow;
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin:5% auto 15%;
                width:50%;
            }
            .border{
                border-radius:25px;
                width:75%;
                height:50px;
            }
            .borderbtn{
                border-radius:25px;
                width:25%;
                height:50px;
            }
          
            </style>`);
            res.write(' <html>' +
                '<body><form action="/" method="post">' +
                '<div class="container widthSearch"> <input class="border" type="text" name="cityName" placeholder="City Name"><button class="borderbtn" type="submit">Go</button></div>' +
                '<div class="container2"><div><i class="fas fa-coffee"></i><h1 class="city">' + query.toUpperCase() + '</h1><h1><i class="fa-solid fa-temperature-quarter"></i> ' + " " + temp + '</h1></div><div><img src=" ' + imgUrl + '" /><p class="weather">' + weather + '</p><p>' + desc.toUpperCase() + '</p></div></div>' +
                '<div class="container widthInfo"><div><h1>FEELS LIKE</h1><i class="fa-solid fa-face-grimace"></i><h1>' + feelsLike + ' Celcius</h1></div><div><h1>HUMIDITY</h1><i class="fa-solid fa-droplet"></i><h1>' + humidity + '%</h1></div><div><h1>WINDSPEED</h1><i class="fa-solid fa-wind"></i><h1>' + windSpeed + ' m/s</h1></div></div>' +
                '</form><script src="https://kit.fontawesome.com/a7c4c42cb0.js" crossorigin="anonymous"></script></body></html > ')

            res.send(
            );
        });
    });
})
app.listen(3000, function () {
    console.log("App is running on 3000");

})