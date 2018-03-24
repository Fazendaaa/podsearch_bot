'use strict';

/**
 * More about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
import { config } from 'dotenv';
import {
    options,
    response,
    result,
    search
} from 'itunes-search';
import { resolve } from 'path';
import {
    errorInline,
    hasItAll,
    messageToString,
    parseInline,
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
const telegrafI18n = require('telegraf-i18n');

/**
 * Allows the code to run without passing the enviroment variables as arguments.
 */
config();

/**
 * Start bot and then set options like:
 *  - Default markdown option for message parsing;
 *  - Polling;
 *  - Log each bot requisition;
 *  - Internacionalization support.
 */
const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: resolve(__dirname, '../locales')
});

bot.startPolling();
bot.use(telegraf.log());
bot.use(i18n.middleware());

/**
 * Greetings to new users when chatting one-to-one.
 */
bot.command('start', ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('greetings'));
});

/**
 * /search + 'podcast name', then returns it to the user all the data.
 *
 * iTunes  search  options for podcast, since this API searches anything in iTunes store and this bot it's only for uses
 * on  podcast,  this  arguments  must be setted. And, this command works only talking to the bot, so there's no need to
 * show more than one result.
 */
bot.command('search', ({ i18n, replyWithMarkdown, message }) => {
    const opts: options = {
        media: 'podcast',
        entity: 'podcast',
        limit: 1
    };
    const value: string = removeCmd(message.text);

    if (value !== '') {
        search(value, opts, (data: response) => {
            if (0 < data.resultCount) {
                parseResponse(data.results[0]).then((parsed: object) => {
                    replyWithMarkdown(i18n.t('mask', parsed));
                }).catch((error: string) => {
                    console.error(error);

                    replyWithMarkdown(i18n.t('error'));
                });
            } else {
                replyWithMarkdown(i18n.t('noResult', {value}));
            }
        });
    } else {
        replyWithMarkdown(i18n.t('wrongInput'));
    }
});

/**
 * Handles the inline searching.
 */
bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery }) => {
    const opts: options = {
        media: 'podcast',
        entity: 'podcast',
        limit: 25
    };
    const value: string = messageToString(inlineQuery.query);

    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if (value !== '') {
        search(value, opts, (data: response) => {
            if (0 < data.resultCount) {
                /**
                 * Removing all of the uncomplete data from the iTunes search.
                 */
                const results = data.results.filter((element: result) => {
                    return hasItAll(element);
                });

                Promise.all(results.map((element: result) => {
                    return parseInline(element, inlineQuery.language_code);
                })).then(results => {
                    answerInlineQuery(results);
                }).catch(error => {
                    console.error(error);

                    answerInlineQuery([errorInline]);
                });
            } else {
                answerInlineQuery([errorInline]);
            }
        });
    } else {
        answerInlineQuery([errorInline]);
    }
});
