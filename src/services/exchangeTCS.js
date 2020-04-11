const axios = require("axios");


const getDataFromTCSAPI = async (params) => {
    try{
        return  axios.get('https://www.tinkoff.ru/api/v1/currency_rates/', {params}).then(responseapi => {
            if(responseapi.data && responseapi.data.resultCode==="OK"){
                const  dataExc = responseapi.data
                let allrub =  dataExc.payload.rates.filter(function(item){return item.toCurrency.name==='RUB'&& item.category==="DebitCardsTransfers"})
                let usdrub = allrub.find(itemfind=>{return itemfind.fromCurrency.name==="USD"})
                usdrub.spread = Math.round(((usdrub.sell-usdrub.buy)/usdrub.sell)*100)
                let eurrub = allrub.find(itemfind=>{return itemfind.fromCurrency.name==="EUR"})
                eurrub.spread = Math.round(((eurrub.sell-eurrub.buy)/usdrub.sell)*100)
                let gbprub = allrub.find(itemfind=>{return itemfind.fromCurrency.name==="GBP"})
                gbprub.gbprub = Math.round(((gbprub.sell-gbprub.buy)/gbprub.sell)*100)

                return {
                    usdrub,
                    eurrub,
                    gbprub
                }
            }

        })

    }catch(err){
        return err
    }
    
}

const showExchangeTCS =  async ()=>{

    const dataExc= await getDataFromTCSAPI()
    
    if(dataExc){
      
       return `
       <b>Курс валют в Тинькофф банк к рублю</b>
       <b>USD</b> я покупаю: <b>${dataExc.usdrub.buy}</b>,  я продаю: <b>${dataExc.usdrub.sell}</b>, спред: <b>${dataExc.usdrub.spread?dataExc.usdrub.spread:"н/д"}%</b>
       <b>EUR</b> я покупаю: <b>${dataExc.eurrub.buy}</b>,  я продаю: <b>${dataExc.eurrub.sell}</b>, спред: <b>${dataExc.eurrub.spread?dataExc.eurrub.spread:"н/д"}%</b>
       <b>GBP</b> я покупаю: <b>${dataExc.gbprub.buy}</b>,  я продаю: <b>${dataExc.gbprub.sell}</b>, спред: <b>${dataExc.gbprub.spread?dataExc.gbprub.spread:"н/д"}%</b>
       `
    }else{
        return `Произошла досадная ошибка 😢`
    }
    
}


module.exports = showExchangeTCS
