const Telegraf = require('telegraf');

const session = require('telegraf/session')
const Stage = require('telegraf/stage')

const superWizard =require('./services/wizard')



const BOT_TOKEN = process.env.BOT_TOKEN || "95669930:AAFufAdJdpOtMLRTUlzOM3twxLzBq-geZHE"
const URL = process.env.URL || 'https://pumpkin-pie-87349.herokuapp.com';


const port = process.env.PORT || 3000;


const bot = new Telegraf(BOT_TOKEN);  





bot.start(ctx => ctx.replyWithMarkdown(`
Добро пожаловать  *${ctx.from.first_name}* в Vasya Bot!
Я умею показывать статистику по заражению COVID19 а так же погоду по городам.
`));

bot.help(ctx => {
  
  ctx.replyWithMarkdown(`
Привет *${ctx.from.first_name}*, что бы вызвать бота, напиши вася`)}
);

//Статистика по COVID19
//   bot.hears(/\/country (.+)/, async (ctx) => {
//     await sendCovidINfo(ctx)
// });


//Погода
// bot.hears(/\/weather (.+)/,async (ctx) => { 
//   await showWeatherInfo(ctx)
// });


//Wizard


const stage = new Stage([superWizard])

bot.use(session())
bot.use(stage.middleware())
bot.hears(/вася/gi, (ctx)=>{
    Stage.enter('super-wizard')(ctx)
  })
bot.hears(/vasya/gi, (ctx)=>{
  Stage.enter('super-wizard')(ctx)
})


console.log(`Run app on url: ${URL}/bot${BOT_TOKEN}`)
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, port)

//bot.launch()

//bot.startPolling();

// bot.launch().then(res =>{
//     const date = new Date();
//     console.log(`Bot launched at ${date}`)
// }).catch(err => console.log(`Bot error: ${err}`));
