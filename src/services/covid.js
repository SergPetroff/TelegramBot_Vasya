const axios = require("axios");
const formatCountryMsg = require("../messages/country");
const covidService ={}
const getCovidInfo = (country) => {
    const params = country?{"country": country}:{}
    return axios({
        "method": "GET",
        "url": "https://covid-193.p.rapidapi.com/statistics",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "90e013270emsh108a1289e8d917ep1f1e3fjsn3f72ee3b8e98"
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
        console.log(data.response[0])
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
        return data.response.slice(0,20).sort(compare).slice(0,6)
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