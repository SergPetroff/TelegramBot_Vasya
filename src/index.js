const Telegraf = require('telegraf');
const covidService = require("./services/covid");
const weatherService = require("./services/weather");
const formatCountryMsg = require("./messages/country");
const express = require('express');
const expressApp = express();

const BOT_TOKEN = process.env.BOT_TOKEN || "95669930:AAFufAdJdpOtMLRTUlzOM3twxLzBq-geZHE"
const URL = process.env.URL || 'https://pumpkin-pie-87349.herokuapp.com/';
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
      /London`));

//Статистика по COVID19
  bot.hears(/\/country (.+)/, async (ctx) => {
    try {
      console.log(ctx.message.text)
      var resp = ctx.message.text.split(" ");
      if(resp[1].length>2){
        const {data} = await covidService.getByCountry(resp[1]);
        if(data && data.results===0){
            return ctx.reply(`Страна не найдена`)
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
});


//Погода
bot.hears(/\/weather (.+)/, async (ctx) => { 
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
            `Погода в *${params.query}*: *${weatherdata.current.temperature}* C, Скорость ветра: *${weatherdata.current.wind_speed}* км/ч,`);
        }
      }else{
        return ctx.reply(`Введите город`)
      }
  }catch(e){
    console.log(`Error! ${e}`)
  }
});

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, port)

//bot.startPolling();

// bot.launch().then(res =>{
//     const date = new Date();
//     console.log(`Bot launched at ${date}`)
// }).catch(err => console.log(`Bot error: ${err}`));
