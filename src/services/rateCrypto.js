const axios = require("axios");

const getDataCrypto = async () =>{
    try{

        return  axios.get('https://www.bitstamp.net/api/v2/ticker/btcusd').then(responseapi => {
            if(responseapi.data){
               
               return `
<b>BTC на Bitstamp</b> 
    last: <b>${responseapi.data.last} $</b> , 
    high: <b>${responseapi.data.high} $</b> , 
    low: <b>${responseapi.data.low} $</b> 
               `

            }
            return `КУрс крипто`
        })
    }catch(err){
        console.error(err)
    }
}

module.exports = getDataCrypto