const axios = require("axios");
const formatCountryMsg = require("../messages/country");

const getByCountry = (country) => {
    return axios({
        "method": "GET",
        "url": "https://covid-193.p.rapidapi.com/statistics",
        "headers": {
            "content-type": "application/octet-stream",
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "90e013270emsh108a1289e8d917ep1f1e3fjsn3f72ee3b8e98"
        }, params: {
            "country": country
        }
    })
}


const sendCovidINfo = async (ctx)=>{
    try {
      console.log(ctx.message.text)
      const resptext = ctx.message.text
      var text=resptext.split("/").length===2?resptext.split("/")[1]:resptext
      if(text.length>2){
        const {data} = await getByCountry(text);
        if(data && data.results===0){
            return ctx.replyWithMarkdown(`Я не нашел страны  *${text}* 😢` )
            
        }
        //console.log(`Country:${data.response[0].country}`)
        return ctx.replyWithMarkdown(formatCountryMsg(data.response[0])
        )
  
  
      }else{
        return ctx.reply(`Введите страну`)
      }
  
      
        
    }catch(e) { 
        console.log(`Error! ${e}`)
      }
  }

module.exports = sendCovidINfo;