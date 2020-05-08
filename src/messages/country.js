const countryEmoji = require("country-emoji");

const toDate = date =>{
    const lastdate = new Date(date)
    const jsondate = lastdate.toJSON().split("T")
    const strTime = jsondate[1].slice(0,2)+':'+jsondate[1].slice(3,5)+':'+jsondate[1].slice(6,8)
    const strDate = jsondate[0].slice(8, 10) + '.'  
    + jsondate[0].slice(5, 7) + '.'  
    + jsondate[0].slice(0, 4); 

    return `${strDate} ${strTime}`

}

module.exports = (data)=>{
    return `
    *${data.country}* ${countryEmoji.flag(data.country) || ''} ${toDate(data.time)}
    🦠 Новые случаи: *${data.cases.new?data.cases.new:"н/д"}*
    💊 Всего сейчас: *${data.cases.active}*
    👍 Вылечились: *${data.cases.recovered}*
    🤮 В крит.состоянии: *${data.cases.critical?data.cases.critical:"н/д"}*
    💀 Смертей:*${data.deaths.new?data.deaths.new:"н/д"}*, всего: *${data.deaths.total?data.deaths.total:"н/д"}*
    --------------------------
    🧪 Сделано тестов: *${data.tests.total?data.tests.total:"н/д"}*
    🚑 Всего заражений: *${data.cases.total}*
    `
}