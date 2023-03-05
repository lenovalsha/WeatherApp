const { json } = require("express");
const express = require("express");
const app = express();
const https = require("https"); //no need to install anything
const bodyParser = require("body-parser");
const { rmSync } = require("fs");
const { builtinModules } = require("module");
const { TIMEOUT } = require("dns");
const moment = require("moment"); //npm install moment
const { url } = require("inspector");
require('dotenv').config();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {

    let query = req.body.cityName;
    if (query === "") {
        query = "medicine hat";
    }
    const url = "https://api.openweathermap.org/data/2.5/weather?appid="+process.env.TOKEN+"=" + query + "&units=metric";
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
            const d = new Date((weatherData.sys.sunrise + weatherData.timezone) * 1000);
            //Local Time
            const timezoneOFFset = weatherData.timezone / 3600;//convert seconds to hours
            const currentTime = moment().utcOffset(timezoneOFFset).format("h:mm A");



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
                          height:auto;
                          color: #34495E;
                        }
                        h1{
                         color:#9D6254;

                        }
                        p{
                            font-size:20px;
                        }
                        .city{
                            font-size:100px;
                        }
                        div{
                            text-align:center;
                        }
                        .container{
                            display:flex;
                            align-items:center;
                            margin:0 auto;
                            width:100%;
                            
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
                            font-size: 100px;
                        }
                        .container2{
                            // background-Color:yellow;
                            display:flex;
                            justify-content:space-around;
                            align-items:center;
                            margin:5% auto 15%;
                            width:100%;
                        }
                        input{
                            border-radius:25px;
                            width:75%;
                            height:50px;
                            border: 2px solid #9D6254;
                            font-size:20px;
                            color:#9D6254;
                            text-align:center;
                        }
                        button{
                            border-radius:25px;
                            width:25%;
                            height:50px;
                            border: 2px solid #9D6254;
                            font-size:30px;
                            color:#9D6254;
                        }
                        button:hover {
                            background-color: #9D6254;
                            color: white;
                        }
                        
                        </style>`);
            res.write(' <html>' +
                '<body><form action="/" method="post">' +
                '<div class="container widthSearch"> <input type="text" name="cityName" placeholder="City Name"><button type="submit">Go</button></div>' +
                '<div class="container2"><div><h1>' + currentTime + '</h1><h1 class="city">' + query.toUpperCase() + '</h1><h1><i class="fa-solid fa-temperature-quarter"></i> ' + " " + temp + ' Celcius</h1></div><div><img src=" ' + imgUrl + '" /><p>' + desc.toUpperCase() + '</p></div></div>' +
                '<div class="container widthInfo"><div><h1>FEELS LIKE</h1><i class="fa-solid fa-face-grimace"></i><h1>' + feelsLike + ' Celcius</h1></div><div><h1>HUMIDITY</h1><i class="fa-solid fa-droplet"></i><h1>' + humidity + '%</h1></div><div><h1>WINDSPEED</h1><i class="fa-solid fa-wind"></i><h1>' + windSpeed + ' m/s</h1></div></div>' +
                '</form><script src="https://kit.fontawesome.com/a7c4c42cb0.js" crossorigin="anonymous"></script></body></html > ')

            res.send();
        });
    });
})

app.listen(3000, function () {
    console.log("App is running on 3000");

})