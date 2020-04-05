const axios = require("axios");

const  weatherservice_key = "8802edb4386b2aa0cb701ee80caaf778"


const getByCity = (params) => {
    return  axios.get('http://api.weatherstack.com/current', {params}).then(responseapi => {
        return responseapi.data 
    })
}


const showWeatherInfo = async (ctx) =>{
    try {
      console.log(ctx.message.text)
      var resptext = ctx.message.text
      var text=resptext.split("/").length===2?resptext.split("/")[1]:resptext
      if(text.length>2){
        const params = {
          access_key: weatherservice_key,
          query:text
        }
        const weatherdata = await getByCity(params);
        if(weatherdata && weatherdata.current){
  
          return ctx.replyWithMarkdown(
            `Температура в *${params.query}*: *${weatherdata.current.temperature}* ºC
             Скорость ветра: *${weatherdata.current.wind_speed}* км/ч,`);
        }else{
          return ctx.replyWithMarkdown(`Я не нашел города  *${params.query}* 😢` )
        }
      }else{
        return ctx.reply(`Введите город`)
      }
  }catch(e){
    console.log(`Error! ${e}`)
  }
  }

module.exports = showWeatherInfo;