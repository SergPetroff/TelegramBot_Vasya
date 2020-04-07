const Composer = require('telegraf/composer')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const covidService = require('./covid')
const countryEmoji = require("country-emoji");
const showWeatherInfo =require('./weather')

const stepHandler = new Composer()

stepHandler.action('covid_wiz',async (ctx) => {

  ctx.wizard.state.data = {};
  ctx.wizard.state.data.choice = "covid"
  //Получаем инфу по РФ
  const rusinfo=  await covidService.InfoOnCountry('Russia')
  //получаем инфу по топ 6 стран
   const covidStat = await covidService.Statistic()

  //Собираем массив кнопок
   const markupbtn = covidStat.map(cntr => {
    return Markup.callbackButton(`${countryEmoji.flag(cntr.country)} ${cntr.country}`,cntr.country)
   });
   //Добавляем кнопку поиска по названию
   markupbtn.push(Markup.callbackButton("🔎 Поиск по названию","findOnName"))

  ctx.replyWithMarkdown(`
      ${rusinfo}
      ⬇️ TOP стран по заражениям ⬇️
    `,
     Markup.inlineKeyboard([markupbtn.slice(0,2),markupbtn.slice(2,4),markupbtn.slice(4,6), markupbtn.slice(6,7)]).extra())  

  return ctx.wizard.next()
})


stepHandler.action('weather', (ctx) => {
  ctx.wizard.state.data = {};
    ctx.wizard.state.data.choice = "weather"
  ctx.reply('Введите город на англ языке, пример: Moscow (если в группе то /Moscow)')
  //console.log(`Weather: ${ctx.message.text}`)
  return ctx.wizard.next()
})

stepHandler.action('changeMoney', (ctx) => {
  ctx.wizard.state.data = {};
    ctx.wizard.state.data.choice = "changeMoney"
  ctx.reply('Скоро здесь будет курс валют')
  //console.log(`Weather: ${ctx.message.text}`)
  ctx.scene.leave()
})
//stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

//const stepChoiceCountry = new Composer()

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
      console.log(`
        Вызов бота из: ${ctx.chat.type} ${ctx.chat.type==='group'?ctx.chat.title:''},
        UserName: ${ctx.from.username},
        User_id: ${ctx.from.id}`
       )
        ctx.replyWithMarkdown(`Жми кнопку *${ctx.from.first_name}*`, 
        Markup.inlineKeyboard([
            [Markup.callbackButton("🌦 Погода", "weather"),
            Markup.callbackButton("💱 Курс валют", "changeMoney")],
            [Markup.callbackButton("😷 Китайская вирусня", "covid_wiz")]
          ]).extra()
        )
        return ctx.wizard.next()

    },
    stepHandler,
     async (ctx) => {
      if(ctx.wizard.state.data.choice==='covid'){
        if(ctx.update.callback_query && ctx.update.callback_query.data){
          if(ctx.update.callback_query.data!=="findOnName"){
            const resultCovidInfo=  await covidService.InfoOnCountry(ctx.update.callback_query.data)
            ctx.replyWithMarkdown(resultCovidInfo)
            ctx.scene.leave()
          }else if(ctx.update.callback_query.data==="findOnName"){
            ctx.replyWithMarkdown(`Введи страну на англ языке, пример: Iran (если в группе то /Iran)`)
            return ctx.wizard.next()
          }
        }else{
          ctx.replyWithMarkdown(`Произошла досадная ошибка 😢` )
        }
        
      }else if(ctx.wizard.state.data.choice==='weather'){
        await showWeatherInfo(ctx)
        ctx.scene.leave()
      }


    },
    async (ctx) => {
      
         //поиск страны при вводе вручную
        const resptext = ctx.message.text
        const text=resptext.split("/").length===2?resptext.split("/")[1]:resptext
        if(text.length>2){
          const resultCovidInfo=  await covidService.InfoOnCountry(text)
          ctx.replyWithMarkdown(resultCovidInfo)
        } 
       
       ctx.scene.leave()
   }
)

module.exports = superWizard