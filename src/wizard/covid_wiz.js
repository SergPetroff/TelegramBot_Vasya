const WizardScene = require('telegraf/scenes/wizard')
const covidService = require('../services/covid')
const covidFindWiz = new WizardScene('find-covid',
    (ctx) => {
        ctx.reply("Введи страну на англ языке, пример: Turkey (в группе /Turkey)");

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

        console.log(strmess)
        //Store the entered name
        const infoCovid=  await covidService.InfoOnCountry(strmess)
        ctx.replyWithMarkdown(`${infoCovid}`)
        return ctx.scene.leave()
    }
);


module.exports = covidFindWiz