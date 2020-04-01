const axios = require("axios");
let service = {};

service.getByCountry = (country) => {
    return axios({
        "method": "GET",
        "url": "https://covid-193.p.rapidapi.com/statistics",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "90e013270emsh108a1289e8d917ep1f1e3fjsn3f72ee3b8e98"
        }, params: {
            country: country
        }
    })
}


module.exports = service;