const mongoose = require("mongoose");

let weather = mongoose.Schema({
    "city_name" : {
        type : String
    },
    "main" : {
        type : Object
    },
    "sys" : {
        type : Object
    },
})

const Weather = mongoose.model("weather", weather, "weather");

module.exports = Weather;