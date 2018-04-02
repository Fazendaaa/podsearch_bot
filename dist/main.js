/**
 * Main  file,  handles all the Telegram's requests and does the piping API searches through the parsing functions. More
 * about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
 * Allows the code to run without passing the environment variables as arguments.
 */
dotenv_1.config();
/**
 * Start bot and then set options like:
 *  - Default markdown option for message parsing;
 *  - Polling;
 *  - Log each bot requisition;
 *  - Internationalization support.
 */
const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path_1.resolve(__dirname, '../locales')
});
bot.startPolling();
bot.use(telegraf.log());
bot.use(i18n.middleware());
/**
 * Greetings to new users when chatting one-to-one.
 */
bot.command('start', ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('greetings'));
});
/**
 * Message saying how to use this bot.
 */
bot.command('help', ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'), { disable_web_page_preview: true });
});
/**
 * /search + 'podcast name', then returns it to the user all the data.
 *
 * iTunes  search  options for podcast, since this API searches anything in iTunes store and this bot it's only for uses
 * on  podcast,  this arguments must be set. And, this command works only talking to the bot, so there's no need to show
 * more than one result.
 */
bot.command('search', ({ i18n, replyWithMarkdown, replyWithVideo, message }) => {
    const value = utils_1.removeCmd(message.text);
    /**
     * This  option  is  an  option  to  language, since works better -- sincerely still don't know why, maybe something
     * related to iTunes API -- to return data in user native language.
     */
    const country = message.from.language_code.split('-')[1] || 'us';
    const language = message.from.language_code.split('-')[0] || 'en';
    const opts = {
        country: country,
        media: 'podcast',
        entity: 'podcast',
        limit: 1
    };
    /**
     * Setting up locale language info.
     */
    i18n.locale(language);
    if (value !== '') {
        itunes_search_1.search(value, opts, (data) => {
            utils_1.parseResponse(data, message.from.language_code).then((parsed) => {
                replyWithMarkdown(i18n.t('mask', parsed));
            }).catch((error) => {
                console.error(error);
                replyWithMarkdown(i18n.t('error'));
            });
        });
    }
    else {
        replyWithMarkdown(i18n.t('wrongInputCmd')).then(() => {
            replyWithVideo({ source: path_1.resolve(__dirname, '../gif/search_cmd.mp4') }).then(() => {
                replyWithMarkdown(i18n.t('wrongInputInline')).then(() => {
                    replyWithVideo({ source: path_1.resolve(__dirname, '../gif/search_inline.mp4') }).catch((error) => {
                        throw error;
                    });
                }).catch((error) => {
                    throw error;
                });
            }).catch((error) => {
                throw error;
            });
        }).catch((error) => {
            replyWithMarkdown(i18n.t('error'));
            console.error(error);
        });
    }
});
/**
 * Handles the inline searching.
 */
bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery }) => {
    const value = utils_1.messageToString(inlineQuery.query);
    const lanCode = inlineQuery.from.language_code;
    const pageLimit = 20;
    const offset = parseInt(inlineQuery.offset, 10) || 0;
    const country = inlineQuery.from.language_code.split('-')[1] || 'us';
    const opts = {
        country: country,
        limit: offset + pageLimit,
        media: 'podcast',
        entity: 'podcast'
    };
    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if (value !== '') {
        itunes_search_1.search(value, opts, (data) => {
            if (0 < data.resultCount) {
                /**
                 * "Pseudo-pagination", since this API doesn't allow it true pagination.
                 */
                data.results = data.results.slice(offset, offset + pageLimit);
                /**
                 * Checking  the  offset to be equals to zero so that mean that the bot hasn't shown the user only fewer
                 * podcast options, or even none, in the search.
                 */
                if (0 < data.results.length) {
                    utils_1.parseResponseInline(data, lanCode).then((results) => {
                        answerInlineQuery(results, { next_offset: offset + pageLimit });
                    }).catch((error) => {
                        console.error(error);
                        answerInlineQuery(utils_1.errorInline(lanCode));
                    });
                }
            }
            else {
                answerInlineQuery(utils_1.errorInline(lanCode));
            }
        });
        /**
         * Incentive the user to search for a podcast.
         */
    }
    else {
        answerInlineQuery(utils_1.searchInline(lanCode));
    }
});
//# sourceMappingURL=main.js.map