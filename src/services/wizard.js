const sendCovidINfo = require("./covid");
const showWeatherInfo = require("./weather");


const Composer = require('telegraf/composer')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')




const stepHandler = new Composer()

stepHandler.action('covid_wiz', (ctx) => {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.choice = "covid"
  ctx.replyWithMarkdown(`Введи страну на англ языке, пример: Russia (если в группе то /Russia)`)
  // Markup.inlineKeyboard([
  //   Markup.callbackButton("🇷🇺 Россия", "getDefaultCovid"),
  // ]).extra())  
  return ctx.wizard.next()
})

// stepHandler.action('getDefaultCovid', (ctx) => {
//   console.log(ctx)
// })
stepHandler.action('weather', (ctx) => {
  ctx.wizard.state.data = {};
    ctx.wizard.state.data.choice = "weather"
  ctx.reply('Введите город на англ языке, пример: Moscow (если в группе то /Moscow)')
  //console.log(`Weather: ${ctx.message.text}`)
  return ctx.wizard.next()
})
//stepHandler.use((ctx) => ctx.replyWithMarkdown('Press `Next` button or type /next'))

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
      console.log(`
        Вызов бота из: ${ctx.chat.type} ${ctx.chat.type==='group'?ctx.chat.title:''},
        UserName: ${ctx.from.username},
        User_id: ${ctx.from.id}`
       )
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

module.exports = superWizard