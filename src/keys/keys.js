module.exports = {
    RAPIDAPI_KEY:process.env.NODE_ENV==='production'?process.env.RAPIDAPI_KEY:"your key",
    WEATHERSERVICE_KEY:process.env.NODE_ENV==='production'?process.env.WEATHERSERVICE_KEY:"your key"
}