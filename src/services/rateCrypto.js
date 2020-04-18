const axios = require("axios");

const getDataCrypto = async () =>{
    try{

        return  axios.get('https://www.bitstamp.net/api/v2/ticker/btcusd').then(responseapi => {
            if(responseapi.data){
               
               return `
                *Курс BTC на бирже Bitstamp:* 
                last: *${responseapi.data.last} usd*, 
                high: *${responseapi.data.high} usd*, 
                low: *${responseapi.data.low} usd*
               `
            }
            return `КУрс крипто`
        })
    }catch(err){
        console.error(err)
    }
}

module.exports = getDataCrypto