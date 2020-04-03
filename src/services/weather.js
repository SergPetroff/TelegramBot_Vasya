const axios = require("axios");
let weatherService = {};

weatherService.getByCity = (params) => {
    return  axios.get('http://api.weatherstack.com/current', {params}).then(responseapi => {
        return responseapi.data 
    })
}


module.exports = weatherService;