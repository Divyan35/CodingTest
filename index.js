const express = require('express');
const bodyParser = require('body-parser');
var app = express();
const request = require('request');
var path = require('path');
var mongoose = require('mongoose');
const config = require('./config/database');

//const mongoDB = require('./database');
//mongoDB.connect();

let Weather = require('./Model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

//connect to database
mongoose.connect(config.database);

//On connection
mongoose.connection.on('connected',()=>{
    console.log('connected to database\n' + config.database);
});

mongoose.connection.on('error',(err)=>{
    console.log('database error' + err);
});


app.get("/", (req, res) => {
     res.send("App Started!!!!")
 })

function CheckIsPrime(number) {
    if (number <= 1) {
        return false;
    }
    for (var i = 2; i < number; i++)
        if (number % i === 0)
            return false;
    return true;
}

app.post('/Weather', (req, res) => {
    //Current day
    let currentDay = new Date().getDate();
    console.log("Current Day \n", currentDay);

    //Checking if Number is Prime or Not
    let Prime = CheckIsPrime(currentDay);
    console.log("Whether number is prime or not \n", Prime);

    if (Prime) {
        let cityName = 'Pune';
        console.log("City Name \n", cityName);

        let WeatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=01df8b82850cba7763a9bcfb5ead33c6`

        //Getting Weather Data using OpenWeatherAPI
        request(WeatherApiUrl, (err, response, data) => {
            if (err) {
                console.log("Error :\n", err)

                res.status(500).send({ code: 500, data: null, message: "Internal Server Error", error: err })
                return;
            }
            console.log("City : \t", cityName, "\n", "Weather Data of City: \t", data);
            data = JSON.parse(data);

            let weatherData = new Weather({
                city_name: data.name,
                main: data.main,
                sys:data.sys
            })

            if (data.cod === 200) {
                //Insert data
                weatherData.save((err, item)=> {
                    if (err) {
                        console.log("Error \n", err);
                        res.status(500).send({ code: 500, data: null, message: "Internal Server Error", error: err })
                        return;
                    }
                    else{
                    console.log("data Added Successfully in Database : \n", item)
                    return res.status(200).send({ code: 200, data: weatherData , message: "Successfully Added Weather Data", error: null });
                    }
                })
            } else {
                res.status(404).send({code : 404, data : data.name , message : "Error while retreiving weather data", error : null});
            }
        })
    }
    else {
        res.status(200).send({ code: 200, message : "Date is not prime so no date"});
        console.log("Date is not prime so no date");
    }
})

app.listen(3000, () => {
    console.log("started web process at Port 3000");
});