const Telegraf = require('telegraf');
const covidService = require("./services/covid");
const formatCountryMsg = require("./messages/country");
const express = require('express');
const expressApp = express();

const BOT_TOKEN = process.env.BOT_TOKEN || "95669930:AAFufAdJdpOtMLRTUlzOM3twxLzBq-geZHE"

const port = process.env.PORT || 3000;

expressApp.get('/', (req, res) => {
    res.send('Hello World!')
  })
  expressApp.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => ctx.reply(`
Добро пожаловать в COVID19 Bot!
Вам нужно отправить название страны что бы получить статистику.
`));

bot.help(ctx => ctx.reply(`Например:
Russia
Spain
Germany`));

bot.hears(/.*/, async ctx => {
    try {
        const {data} = await covidService.getByCountry(ctx.message.text);
        if(data && data.results===0){
            return ctx.reply(`Страна не найдена`)
        }
        console.log(`Country:${data.response[0].country}`)
        return ctx.replyWithMarkdown(formatCountryMsg(data.response[0])
        )
    }catch(e) {
        console.log(`Error! ${e}`)
      }
});
bot.startPolling().then(res =>{
    const date = new Date();
    console.log(`Bot launched at ${date}`)
}).catch(err => console.log(`Bot error: ${err}`));

// bot.launch().then(res =>{
//     const date = new Date();
//     console.log(`Bot launched at ${date}`)
// }).catch(err => console.log(`Bot error: ${err}`));
