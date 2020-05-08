const axios = require("axios");
const formatCountryMsg = require("../messages/country");
const {RAPIDAPI_KEY} = require('../keys/keys')
const covidService ={}



const getCovidInfo = (country) => {
    const params = country?{"country": country}:{}
    return axios({
        "method": "GET",
        "url": "https://covid-193.p.rapidapi.com/statistics",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": RAPIDAPI_KEY
        }, params: params
    })
}


covidService.InfoOnCountry = async (country)=>{
    try {
      if(country.length>2){
        const {data} = await getCovidInfo(country);
        if(data && data.results===0){
            return ctx.replyWithMarkdown(`Я не нашел страны  *${text}* 😢` )
            
        }
        return formatCountryMsg(data.response[0])
  
  
      }else{
        return ctx.reply(`Введите страну`)
      }
  
      
        
    }catch(e) { 
        console.log(`Error! ${e}`)
      }
  }

  covidService.Statistic = async(ctx)=>{
    const {data} = await getCovidInfo()
    if(data && data.results===0){
        return []
        
    }else {
      const excludecountry =['All', 'Europe','Asia','South-America','North-America']
        return data.response.filter(flt => flt.cases.total>100000 && !excludecountry.includes(flt.country)).sort(compare).slice(0,6)
    }
  }

  const compare = ( a, b ) => {
    if ( a.cases.total > b.cases.total ){
      return -1;
    }
    if ( a.cases.total < b.cases.total ){
      return 1;
    }
    return 0;
  }
  

module.exports = covidService;