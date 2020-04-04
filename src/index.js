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





bot.start(ctx => ctx.reply(`
Добро пожаловать в Vasya Bot!
Я умею показывать статистику по заражению COVID19 а так же погоду по городам.
`));

bot.help(ctx => ctx.reply(`Например:
      /Russia
      /Spain
      /Germany
      
      Что бы получить погоду в городе введите: 
      /weather London`));

//Статистика по COVID19
  bot.hears(/\/country (.+)/, async (ctx) => {
    await sendCovidINfo(ctx)
});


//Погода
bot.hears(/\/weather (.+)/,async (ctx) => { 
  await showWeatherInfo(ctx)
});

const showWeatherInfo = async (ctx) =>{
  try {
    console.log(ctx.message.text)
    var resp = ctx.message.text.split(" ");
   
    if(resp[1].length>2){
      const params = {
        access_key: weatherservice_key,
        query:resp[1]
      }
      const weatherdata = await weatherService.getByCity(params);
      if(weatherdata && weatherdata.current){

        return ctx.replyWithMarkdown(
          `Температура в *${params.query}*: *${weatherdata.current.temperature}* ºC
           Скорость ветра: *${weatherdata.current.wind_speed}* км/ч,`);
      }else{
        return ctx.replyWithMarkdown(`Я не нашел такого города  *${params.query}* 😢` )
      }
    }else{
      return ctx.reply(`Введите город`)
    }
}catch(e){
  console.log(`Error! ${e}`)
}
}
const sendCovidINfo = async (ctx, wizard= false)=>{
  try {
    console.log(ctx.message.text)
    var resp = ctx.message.text.split(" ");
    if(resp[1].length>2){
      const {data} = await covidService.getByCountry(resp[1]);
      if(data && data.results===0){
          return ctx.replyWithMarkdown(`Я не нашел такой страны  *${params.query}* 😢` )
          if(wizard){

          }
      }
      console.log(`Country:${data.response[0].country}`)
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
    ctx.wizard.state.data.choice = "weather"
  ctx.reply('Введите город на англ языке, пример: Moscow')
  //console.log(`Weather: ${ctx.message.text}`)
  return ctx.wizard.next()
})
stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
        ctx.reply('Жми кнопку', 
        Markup.inlineKeyboard([
            Markup.callbackButton("😷 Китайская вирусня", "covid_wiz"),
            Markup.callbackButton("🌦 Погода", "weather")
          ]).extra()
        )
        return ctx.wizard.next()

    },
    stepHandler,
    async (ctx) => {
        // ctx.reply(`Вы ввели:${ctx.message.text}
        // Выбор юзера:${ctx.wizard.state.data.choice}`)
        if(ctx.wizard.state.data.choice==='covid'){
          ctx.reply(`Вы выбрали covid, страна:${ctx.message.text}`)
          await sendCovidINfo(ctx)
         // return ctx.scene.leave()
        }else if(ctx.wizard.state.data.choice==='weather'){
          ctx.reply(`Вы выбрали weather, город:${ctx.message.text}`)
          await showWeatherInfo(ctx)
         // return ctx.scene.leave()
        }
        
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

//bot.startPolling();

// bot.launch().then(res =>{
//     const date = new Date();
//     console.log(`Bot launched at ${date}`)
// }).catch(err => console.log(`Bot error: ${err}`));
