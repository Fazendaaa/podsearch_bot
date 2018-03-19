'use strict';

/**
 * More about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
import { config } from 'dotenv';
import {
    options,
    response,
    search
} from 'itunes-search';
import {
    parseResponse,
    removeCmd
} from './utils';
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
config();

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
const opts: options = {
    media: 'podcast',
    entity: 'podcast',
    limit: 1
};

/**
 * Greetings to new users when chatting one-to-one.
 */
bot.start((ctx: any) => {
    ctx.reply('Welcome!');
});

/**
 * /search + 'podcast name', then returns it to the user all the data.
 */
bot.command('search', (ctx: any) => {
    const value = removeCmd(ctx.update.message.text);

    search(value, opts, (data: response) => {
        parseResponse(data).then(message => {
            ctx.reply(message, { parse_mode: 'Markdown' });
        }).catch((error: string) => {
            ctx.reply('There has been an error in the search. Please, try again later.');
        });
    });
});
