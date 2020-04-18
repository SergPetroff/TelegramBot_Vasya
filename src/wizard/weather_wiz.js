const WizardScene = require('telegraf/scenes/wizard')
const showWeatherInfo =require('../services/weather')
const findCityWeather = new WizardScene('find-Weather',
    (ctx) => {
        ctx.reply("Ведите город, например: Berlin");

        //Necessary for store the input
       // ctx.scene.session.user = {};

        //Store the telegram user id
        //ctx.scene.session.user.userId = ctx.update.callback_query.from.id;
        return ctx.wizard.next();
    },
    async (ctx) => {
        
        //Validate the name
        if (ctx.message.text.length < 1 ) {
            
            return ctx.reply("Слишком короткое название!");
        }
        const strmess = ctx.message.text.split("/").length===2?ctx.message.text.split("/")[1]:ctx.message.text

        
        //Store the entered name
        const weatherData = await showWeatherInfo(strmess)
        ctx.replyWithMarkdown(`${weatherData}`)
        return ctx.scene.leave()
    }
);

// const findLocationWeather = new WizardScene('find-location-Weather',
//     (ctx) => {
//         ctx.reply('🕵🏻‍♂️ Предоставьте тов. майору ваше местоположение', Extra.markup((markup) => {
//             return markup.resize()
//               .keyboard([
//                 markup.contactRequestButton('Send contact'),
//                 markup.locationRequestButton('Send location')
//               ])
//           }))
//         return ctx.wizard.next();
//     },
//     async (ctx) => {
//         console.log(ctx)
//         //Validate the name
//         if (ctx.message.text.length < 1 ) {
//             return ctx.reply("Слишком короткое название!");
//         }

//         //Store the entered name
//        // const weatherData = await showWeatherInfo(ctx.message.text)
//        // ctx.replyWithMarkdown(`${weatherData}`)
//         return ctx.scene.leave()
//     }
// );

module.exports = findCityWeather