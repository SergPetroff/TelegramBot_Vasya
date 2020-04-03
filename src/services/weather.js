const axios = require("axios");
let weatherService = {};

weatherService.getByCity = (params) => {
    return  axios.get('http://api.weatherstack.com/current', {params})
}


module.exports = weatherService;