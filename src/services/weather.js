const axios = require("axios");
const countryEmoji = require("country-emoji");
const  weatherservice_key = "8802edb4386b2aa0cb701ee80caaf778"


const getByCity = (params) => {
    return  axios.get('http://api.weatherstack.com/current', {params}).then(responseapi => {
        return responseapi.data 
    })
}


const showWeatherInfo = async (cityname) =>{
    try {
      
      // var resptext = ctx.message.text
      // var text=resptext.split("/").length===2?resptext.split("/")[1]:resptext
      if(cityname.length>2){
        const params = {
          access_key: weatherservice_key,
          query:cityname
        }
        const weatherdata = await getByCity(params);
        if(weatherdata.current){
          const wSpeadMS = weatherdata.current.wind_speed*1000/3600
          return `
          Погода в *${params.query}, ${weatherdata.location.country} ${countryEmoji.flag(weatherdata.location.country)} * 
          Температура: *${weatherdata.current.temperature}* ºC,
          Ощущается как: *${weatherdata.current.feelslike}* ºC,
          Скорость ветра: *${Math.round(wSpeadMS)}* м/с,
          Влажность воздуха: *${weatherdata.current.humidity} %*
               `
        }else if(weatherdata.error){
          return `Ошибка:  *${weatherdata.error.info}* 😢`
        }else{
          return `Не нашел города:  *${params.query}* 😢`
        }
      }else{
        return `Введите город`
      }
  }catch(e){
    console.log(`Error! ${e}`)
  }
  }

module.exports = showWeatherInfo;

