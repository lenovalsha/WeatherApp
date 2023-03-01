const { json } = require("express");
const express = require("express");
const app = express();
const https = require("https"); //no need to install anything
const bodyParser = require("body-parser");
const { rmSync } = require("fs");
const { builtinModules } = require("module");
const { TIMEOUT } = require("dns");
// const { urlencoded } = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.get("/",function(req,res){
    
    res.sendFile(__dirname +"/index.html" );
});
app.post("/",function(req,res){
   
    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=b80569182e7018d858eb08834fd721b8&q=" +query+"&units=metric";
    // res.send("Server is up and running");
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const weather = weatherData.weather[0].main;
            const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            console.log(weatherData);
            
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(`<style type="text/css">
            body {
              color: blue;
            }
            h1{
                color:black;
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
            .container2{
                // background-Color:yellow;
                display:flex;
                justify-content:center;
                align-items:center;
                margin:15% 10%;
                width:25%;
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
            res.write('<form action="/" method="post">'+
            '<div class="container widthSearch"> <input class="border" type="text"name="cityName" placeholder="City Name"><button class="borderbtn" type="submit">Go</button></div>'+
            '<div class="container2"><div><h1>'+query+'</h1><h1>' + temp + '</h1></div></div>'+
            '<div class="container widthInfo"><h1>Feels like</h1><h1>Humidity</h1><h1>Windspeed</h1></div>'+
            '</form>')
            res.write("<p>"+weather+"</p>")
            res.write("<img src="+ imgUrl+">");
            res.send();
        });
    });
})
app.listen(3000, function(){
    console.log("App is running on 3000");
    
})