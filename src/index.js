const Telegraf = require('telegraf');
const covidService = require("./services/covid");
const formatCountryMsg = require("./messages/country");
const BOT_TOKEN = process.env.BOT_TOKEN || "95669930:AAFufAdJdpOtMLRTUlzOM3twxLzBq-geZHE"

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => ctx.reply(`
Добро пожаловать в COVID19 Bot!
Вам нужно отправить название стрнаы что бы получить статистику.
`));

bot.help(ctx => ctx.reply(`Например:
Russia
Spain
Germany`));

bot.hears(/.*/, async ctx => {
    const {data} = await covidService.getByCountry(ctx.message.text);
    if(data && data.results===0){
        return ctx.reply(`Страна не найдена`)
    }
    return ctx.replyWithMarkdown(formatCountryMsg(data.response[0]))
});

bot.launch().then(res =>{
    const date = new Date();
    console.log(`Bot launched at ${date}`)
}).catch(err => console.log(err));
