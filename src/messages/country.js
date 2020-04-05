const countryEmoji = require("country-emoji");

module.exports = (data)=>{
    return `
        Страна: *${data.country}* ${countryEmoji.flag(data.country) || ''}
    🦠 Новые случаи: *${data.cases.new?data.cases.new:"н/д"}*
    💊 Всего сейчас: *${data.cases.active}*
    👍 Вылечились: *${data.cases.recovered}*
    🤮 В крит.состоянии: *${data.cases.critical}*
    💀 Смертей: *${data.deaths.total}*
    --------------------------
    🧪 Всего взяли тест: *${data.tests.total}*
    🚑 Всего заражений: *${data.cases.total}*
    `
}