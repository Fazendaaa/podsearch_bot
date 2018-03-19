'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * More about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
const dotenv_1 = require("dotenv");
const itunes_search_1 = require("itunes-search");
const utils_1 = require("./utils");
/**
 * Why using the "old" pattern instead of the new one?
 * I had a little bit of an issue making the typing for Telegraf package, had to open my own question in Stack Overflow.
 * Thankfully I had a lot of help. You can see more at: https://stackoverflow.com/q/49348607/7092954
 * brentatkins opened my eys to the real issue: https://stackoverflow.com/q/49348607/7092954
 */
const telegraf = require('telegraf');
/**
 * Allows the code to run without passing the enviroment variables as arguments.
 */
dotenv_1.config();
/**
 * Set Telegram's API key.
 */
const bot = new telegraf(process.env.BOT_KEY);
/**
 * Start poll updates.
 */
bot.startPolling();
/**
 * Will print each bot's requisition.
 */
bot.use(telegraf.log());
/**
 * iTunes  search  options for podcast, since this API searches anything in iTunes store and this bot it's only for uses
 * on podcast, this arguments must be setted.
 */
const opts = {
    media: 'podcast',
    entity: 'podcast',
    limit: 1
};
/**
 * Greetings to new users when chatting one-to-one.
 */
bot.start((ctx) => {
    ctx.reply('Welcome!');
});
/**
 * /search + 'podcast name', then returns it to the user all the data.
 */
bot.command('search', (ctx) => {
    const value = utils_1.removeCmd(ctx.update.message.text);
    itunes_search_1.search(value, opts, (data) => {
        utils_1.parseResponse(data).then(message => {
            ctx.reply(message, { parse_mode: 'Markdown' });
        }).catch((error) => {
            ctx.reply('There has been an error in the search. Please, try again later.');
        });
    });
});
//# sourceMappingURL=main.js.map