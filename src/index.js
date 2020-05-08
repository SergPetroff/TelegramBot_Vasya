const Telegraf = require('telegraf');

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const countryEmoji = require("country-emoji");
const covidService = require('./services/covid')
const showWeatherInfo =require('./services/weather')
const rateCurCBR = require('./services/rateCurCBR')
const rateCurTCS = require('./services/rateCurTCS')
const rateCrypto = require('./services/rateCrypto')
const wizardWeather = require('./wizard/weather_wiz')
const wizCovidFind = require('./wizard/covid_wiz')
const { enter, leave } = Stage
const {BOT_TOKEN} = require('./keys/keys')
const {HEROKU_URL} = require('./keys/keys')


const port = process.env.PORT || 3000;


const bot = new Telegraf(BOT_TOKEN); 

//Wizard
const stageWeather = new Stage([wizardWeather,wizCovidFind]);

bot.use(session())
bot.use(stageWeather.middleware())

bot.start(ctx => ctx.replyWithMarkdown(`
Добро пожаловать  *${ctx.from.first_name}* в Vasya Bot!
Я умею показывать статистику по заражению COVID19 а так же погоду по городам.
`));

bot.help(ctx => {
  
  ctx.replyWithMarkdown(`
Привет *${ctx.from.first_name}*, что бы вызвать бота, напиши вася`)
}
);




const defaultbtn =  Markup.inlineKeyboard([
  [Markup.callbackButton("🌦 Погода", "weather"),
  Markup.callbackButton("💶 Курс валют", "changeMoney")],
  [Markup.callbackButton("🦠 COVID-19", "covid_wiz")]
]
).extra()



bot.hears(/вася/gi, (ctx)=>{
  return ctx.replyWithMarkdown(`Жми кнопку *${ctx.from.first_name}*`, 
  defaultbtn
  )
})

bot.hears(/vasya/gi, (ctx)=>{
  return ctx.replyWithMarkdown(`Жми кнопку *${ctx.from.first_name}*`, 
  defaultbtn
  )
})

//Covid
bot.action('covid_wiz',async (ctx, next) => {
  //Получаем инфу по РФ
  const rusinfo=  await covidService.InfoOnCountry('Russia')
  //получаем инфу по топ 6 стран
   const covidStat = await covidService.Statistic()

  //Собираем массив кнопок
  let topCountryMsg =""
   const topcoutry = covidStat.forEach(cntr => {
  
    topCountryMsg= topCountryMsg+ `${countryEmoji.flag(cntr.country)} *${cntr.country}* новые: *${cntr.cases.new?cntr.cases.new:'н/д'}*, всего: *${cntr.cases.total}*
      `
    
     //Markup.callbackButton(`${countryEmoji.flag(cntr.country)} ${cntr.country}`,"getCovidCountry")
   });
   //Добавляем кнопку поиска по названию
  // markupbtn.push(Markup.callbackButton("🔎 Поиск по названию","findCovidCountry"))
console.log(topCountryMsg)
  ctx.replyWithMarkdown(`
      ${rusinfo}
      ⬇️ TOP стран по заражениям ⬇️

      ${topCountryMsg}
    `,
    Markup.inlineKeyboard([Markup.callbackButton("🔎 Поиск по названию","findCovidCountry")]).extra())  
     //Markup.inlineKeyboard([markupbtn.slice(0,2),markupbtn.slice(2,4),markupbtn.slice(4,6), markupbtn.slice(6,7)]).extra())  
  next()
})

bot.action("getCovidCountry", (ctx,next)=>{
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

bot.action("findCovidCountry", (ctx,next)=>{
  Stage.enter('find-covid')(ctx)
})


//Погода
bot.action('weather',async (ctx, next) => {
  
  const moscowData = await showWeatherInfo('Moscow')
  ctx.replyWithMarkdown(`${moscowData}`,
  Markup.inlineKeyboard([
    [Markup.callbackButton("🔎 Найти по названию", "weatherOnCity")]]).extra() 
  )
  
  next()
})

bot.action("weatherOnCity", (ctx,next)=>{
  
  Stage.enter('find-Weather')(ctx)
})


//Курс валют
bot.action('changeMoney',async (ctx, next) => {
  
  const rateCBR = await rateCurCBR()
  ctx.replyWithHTML(rateCBR)

  const dataExchng = await rateCurTCS()
  ctx.replyWithHTML(dataExchng)

  const dataCrypto = await rateCrypto()
  console.log(dataCrypto)
  ctx.replyWithHTML(dataCrypto)
  next()
})

console.log(`env: ${process.env.NODE_ENV}`)
if(process.env.NODE_ENV==='production'){
  
  console.log(`Run app on url: ${HEROKU_URL}/bot${BOT_TOKEN}`)
  bot.telegram.setWebhook(`${HEROKU_URL}/bot${BOT_TOKEN}`);
  bot.startWebhook(`/bot${BOT_TOKEN}`, null, port)
}else{

  bot.launch().then(res =>{
    const date = new Date();
    console.log(`Bot launched at ${date}`)
}).catch(err => console.log(`Bot error: ${err}`));

}





