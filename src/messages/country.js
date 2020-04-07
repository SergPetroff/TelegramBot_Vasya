const countryEmoji = require("country-emoji");

module.exports = (data)=>{
    return `
        Страна: *${data.country}* ${countryEmoji.flag(data.country) || ''}
    🦠 Новые случаи: *${data.cases.new?data.cases.new:"н/д"}*
    💊 Всего сейчас: *${data.cases.active}*
    👍 Вылечились: *${data.cases.recovered}*
    🤮 В крит.состоянии: *${data.cases.critical?data.cases.critical:"н/д"}*
    💀 Смертей: *${data.deaths.total?data.deaths.total:"н/д"}*
    --------------------------
    🧪 Сделано тестов: *${data.tests.total?data.tests.total:"н/д"}*
    🚑 Всего заражений: *${data.cases.total}*
    `
}