module.exports = {
    RAPIDAPI_KEY:process.env.NODE_ENV==='production'?process.env.RAPIDAPI_KEY:"yourkey",
    WEATHERSERVICE_KEY:process.env.NODE_ENV==='production'?process.env.WEATHERSERVICE_KEY:"yourkey",
    BOT_TOKEN:process.env.NODE_ENV==='production'?process.env.BOT_TOKEN:"yourkey",
    HEROKU_URL:process.env.NODE_ENV==='production'?process.env.HEROKU_URL:"https://pumpkin-pie-87349.herokuapp.com",
}