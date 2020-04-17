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
                eurrub.spread = Math.round(((eurrub.sell-eurrub.buy)/eurrub.sell)*100)
                let gbprub = allrub.find(itemfind=>{return itemfind.fromCurrency.name==="GBP"})
                gbprub.spread = Math.round(((gbprub.sell-gbprub.buy)/gbprub.sell)*100)

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
      const strusd = dataExc.usdrub.sell?` <b>$:</b> я покупаю: <b>${dataExc.usdrub.sell}</b>,  я продаю: <b>${dataExc.usdrub.buy}</b>, спред: <b>${dataExc.usdrub.spread?dataExc.usdrub.spread:"н/д"}%</b>`:`<b>$: н/д</b> <i> повторите запрос позже</i>`
      const streur = dataExc.eurrub.sell?`<b>€:</b> я покупаю: <b>${dataExc.eurrub.sell}</b>,  я продаю: <b>${dataExc.eurrub.buy}</b>, спред: <b>${dataExc.eurrub.spread?dataExc.eurrub.spread:"н/д"}%</b>`:`<b>€: н/д</b> <i> повторите запрос позже</i>`
      const strgbp = dataExc.gbprub.sell?`<b>£:</b> я покупаю: <b>${dataExc.gbprub.sell}</b>,  я продаю: <b>${dataExc.gbprub.buy}</b>, спред: <b>${dataExc.gbprub.spread?dataExc.gbprub.spread:"н/д"}%</b>`:`<b>£: н/д</b> <i> повторите запрос позже</i>`
       return `
       💸<b>Курс валют в Тинькофф банк к рублю</b>
       ${strusd}
       ${streur}
       ${strgbp}
       `
    }else{
        return `Произошла досадная ошибка 😢`
    }
    
}


module.exports = showExchangeTCS
