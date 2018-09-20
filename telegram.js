const TeleBot = require('telebot');
const {telegram} = require('./config');


const bot = new TeleBot(telegram);
bot.start();


module.exports = bot;
