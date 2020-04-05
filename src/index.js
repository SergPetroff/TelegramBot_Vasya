const Telegraf = require('telegraf');
const covidService = require("./services/covid");
const weatherService = require("./services/weather");
const formatCountryMsg = require("./messages/country");

const Composer = require('telegraf/composer')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')



const BOT_TOKEN = process.env.BOT_TOKEN || "95669930:AAFufAdJdpOtMLRTUlzOM3twxLzBq-geZHE"
const URL = process.env.URL || 'https://pumpkin-pie-87349.herokuapp.com';
const  weatherservice_key = "8802edb4386b2aa0cb701ee80caaf778"

const port = process.env.PORT || 3000;


const bot = new Telegraf(BOT_TOKEN);  





bot.start(ctx => ctx.replyWithMarkdown(`
Добро пожаловать  *${ctx.from.first_name}* в Vasya Bot!
Я умею показывать статистику по заражению COVID19 а так же погоду по городам.
`));

bot.help(ctx => ctx.replyWithMarkdown(`
Привет *${ctx.from.first_name}*, что бы вызвать бота, напиши вася`));

//Статистика по COVID19
//   bot.hears(/\/country (.+)/, async (ctx) => {
//     await sendCovidINfo(ctx)
// });


//Погода
// bot.hears(/\/weather (.+)/,async (ctx) => { 
//   await showWeatherInfo(ctx)
// });

const showWeatherInfo = async (ctx) =>{
  try {
    console.log(ctx.message.text)
    var resptext = ctx.message.text
    var text=resptext.split("/").length===2?resptext.split("/")[1]:resptext
    if(text.length>2){
      const params = {
        access_key: weatherservice_key,
        query:text
      }
      const weatherdata = await weatherService.getByCity(params);
      if(weatherdata && weatherdata.current){

        return ctx.replyWithMarkdown(
          `Температура в *${params.query}*: *${weatherdata.current.temperature}* ºC
           Скорость ветра: *${weatherdata.current.wind_speed}* км/ч,`);
      }else{
        return ctx.replyWithMarkdown(`Я не нашел города  *${params.query}* 😢` )
      }
    }else{
      return ctx.reply(`Введите город`)
    }
}catch(e){
  console.log(`Error! ${e}`)
}
}
const sendCovidINfo = async (ctx)=>{
  try {
    console.log(ctx.message.text)
    const resptext = ctx.message.text
    var text=resptext.split("/").length===2?resptext.split("/")[1]:resptext
    if(text.length>2){
      const {data} = await covidService.getByCountry(text);
      if(data && data.results===0){
          return ctx.replyWithMarkdown(`Я не нашел страны  *${params.query}* 😢` )
          
      }
      //console.log(`Country:${data.response[0].country}`)
      return ctx.replyWithMarkdown(formatCountryMsg(data.response[0])
      )


    }else{
      return ctx.reply(`Введите страну`)
    }

    
      
  }catch(e) { 
      console.log(`Error! ${e}`)
    }
}
//Wizard
const stepHandler = new Composer()


stepHandler.action('covid_wiz', (ctx) => {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.choice = "covid"
  ctx.reply('Введите страну на англ языке, пример: Russia')  
  return ctx.wizard.next()
})
stepHandler.action('weather', (ctx) => {
  ctx.wizard.state.data = {};
    ctx.wizard.state.data.choice = "weather"
  ctx.reply('Введите город на англ языке, пример: Moscow')
  //console.log(`Weather: ${ctx.message.text}`)
  return ctx.wizard.next()
})
stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
        ctx.replyWithMarkdown(`Жми кнопку *${ctx.from.first_name}*`, 
        Markup.inlineKeyboard([
            Markup.callbackButton("😷 Китайская вирусня", "covid_wiz"),
            Markup.callbackButton("🌦 Погода", "weather")
          ]).extra()
        )
        return ctx.wizard.next()

    },
    stepHandler,
    async (ctx) => {
        if(ctx.wizard.state.data.choice==='covid'){
          await sendCovidINfo(ctx)
        }else if(ctx.wizard.state.data.choice==='weather'){
          await showWeatherInfo(ctx)
        }
        ctx.scene.leave()
    }
)

const stage = new Stage([superWizard])

bot.use(session())
bot.use(stage.middleware())
bot.hears(/вася/gi, (ctx)=>{
    Stage.enter('super-wizard')(ctx)
  })


console.log(`${URL}/bot${BOT_TOKEN}`)
bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, port)

//bot.launch()

//bot.startPolling();

// bot.launch().then(res =>{
//     const date = new Date();
//     console.log(`Bot launched at ${date}`)
// }).catch(err => console.log(`Bot error: ${err}`));
