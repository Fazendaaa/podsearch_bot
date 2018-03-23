'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * More about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
const dotenv_1 = require("dotenv");
const itunes_search_1 = require("itunes-search");
const path_1 = require("path");
const utils_1 = require("./utils");
/**
 * Why using the "old" pattern instead of the new one?
 * I had a little bit of an issue making the typing for Telegraf package, had to open my own question in Stack Overflow.
 * Thankfully I had a lot of help. You can see more at: https://stackoverflow.com/q/49348607/7092954
 * brentatkins opened my eys to the real issue: https://stackoverflow.com/q/49348607/7092954
 */
const telegraf = require('telegraf');
const telegrafI18n = require('telegraf-i18n');
/**
 * Allows the code to run without passing the enviroment variables as arguments.
 */
dotenv_1.config();
/**
 * Configure deafult user language to English.
 */
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path_1.resolve(__dirname, '../locales')
});
/**
 * Set Telegram's API key.
 */
const bot = new telegraf(process.env.BOT_KEY);
/**
 * Start bot options like:
 *  - poll updates;
 *  - log each bot requisition;
 *  - locale support.
 */
bot.startPolling();
bot.use(telegraf.log());
bot.use(i18n.middleware());
/**
 * Making markdown parsing available to all replies.
 */
const parseMd = { parse_mode: 'Markdown' };
/**
 * Greetings to new users when chatting one-to-one.
 */
bot.command('/start', ({ i18n, reply }) => {
    reply(i18n.t('greetings'), parseMd);
});
/**
 * /search + 'podcast name', then returns it to the user all the data.
 *
 * iTunes  search  options for podcast, since this API searches anything in iTunes store and this bot it's only for uses
 * on  podcast,  this  arguments  must be setted. And, this command works only talking to the bot, so there's no need to
 * show more than one result.
 */
bot.command('search', ({ i18n, reply, message }) => {
    const opts = {
        media: 'podcast',
        entity: 'podcast',
        limit: 1
    };
    const value = utils_1.removeCmd(message.text);
    if (value !== '') {
        itunes_search_1.search(value, opts, (data) => {
            if (0 < data.resultCount) {
                utils_1.parseResponse(data.results[0]).then((parsed) => {
                    reply(i18n.t('mask', parsed), parseMd);
                }).catch((error) => {
                    reply(i18n.t('error'), parseMd);
                });
            }
            else {
                reply(i18n.t('noResult', { value }), parseMd);
            }
        });
    }
    else {
        reply(i18n.t('wrongInput'), parseMd);
    }
});
/**
 *
 */
bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery, message, reply }) => {
    const opts = {
        media: 'podcast',
        entity: 'podcast',
        limit: 25
    };
    const value = utils_1.messageToString(inlineQuery.query);
    if (value !== '') {
        itunes_search_1.search(value, opts, (data) => {
            if (0 < data.resultCount) {
                /**
                 * Removing all of the uncomplete data.
                 */
                const results = data.results.filter((element) => {
                    return utils_1.hasItAll(element);
                });
                Promise.all(results.map((element) => {
                    return utils_1.parseInline(element, inlineQuery.language_code);
                })).then(results => {
                    answerInlineQuery(results);
                }).catch(error => {
                    console.error(error);
                    answerInlineQuery([utils_1.errorInline]);
                });
            }
            else {
                answerInlineQuery([utils_1.errorInline]);
            }
        });
    }
    else {
        answerInlineQuery([utils_1.errorInline]);
    }
});
//# sourceMappingURL=main.js.map