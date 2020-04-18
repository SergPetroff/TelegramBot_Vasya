const axios = require("axios");
const xml2js = require('xml2js');
const parser = new xml2js.Parser()

const getDataFromCBR = async ()=>{
    try{

        const curFullDate = new Date()
        const dateJSON = curFullDate.toJSON().slice(0, 10);
        const fDate = dateJSON.slice(8, 10) + '/'  
                           + dateJSON.slice(5, 7) + '/'  
                           + dateJSON.slice(0, 4); 
        return axios.get('http://www.cbr.ru/scripts/XML_daily.asp?date_req='+fDate).then(res=>{
            if(res.data){
             return parser.parseStringPromise(res.data).then(function (result) {
                    const valuts = ['USD','EUR','GBP']
                    const allValute = result.ValCurs.Valute
                    const resultValute = allValute.filter(item =>{ 
                        return valuts.includes(item.CharCode[0])
                    }).map(itemmap =>{
                        return {'Code':itemmap.CharCode[0],
                                'Value':itemmap.Value[0]}
                            })
                    resultValute.push({'Code':'Date','Value': result.ValCurs.$.Date})
                    return resultValute
                  })
                  .catch(function (err) {
                    console.error(err)
                  });
                
            }
            return `н/д`
        }).catch(err=>{
            console.error(err)
            return err
        })
    }catch(err){
        console.error(err)
    }

}
const messageRateCBR = async()=>{
    const dataRateCBR = await getDataFromCBR()
    const dataValue = dataRateCBR.find(item => item.Code==='Date')
    const USDValue = dataRateCBR.find(item => item.Code==='USD')
    const EURValue = dataRateCBR.find(item => item.Code==='EUR')
    const GBPValue = dataRateCBR.find(item => item.Code==='GBP')

    
    const message =  `
    🏦 <b>Курс валют ЦБРФ на ${dataValue.Value} </b>
    <b>$: ${USDValue.Value}</b>
    <b>€: ${EURValue.Value}</b>
    <b>£: ${GBPValue.Value}</b>
    `
    return message
}

module.exports = messageRateCBR