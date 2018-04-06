/**
 * Main  file,  handles all the Telegram's requests and does the piping API searches through the parsing functions. More
 * about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const itunes_search_1 = require("itunes-search");
const path_1 = require("path");
const parse_1 = require("./others/parse");
const stream_1 = require("./others/stream");
const utils_1 = require("./others/utils");
const stage_1 = require("./stage/stage");
/**
 * Why using the "old" pattern instead of the new one?
 * I had a little bit of an issue making the typing for Telegraf package, had to open my own question in Stack Overflow.
 * Thankfully I had a lot of help. You can see more at: https://stackoverflow.com/q/49348607/7092954
 * brentatkins opened my eys to the real issue: https://stackoverflow.com/q/49348607/7092954
 */
const telegraf = require('telegraf');
const session = telegraf.session;
const markup = telegraf.Markup;
const extra = telegraf.Extra;
const telegrafI18n = require('telegraf-i18n');
/**
 * Allows the code to run without passing the environment variables as arguments.
 */
dotenv_1.config();
/**
 * Start bot and then setting its options like:
 *  - Internationalization support;
 *  - Polling;
 *  - Log each bot requisition;
 *  - Bot commands -- with internationalization support;
 *  - Conversation handler.
 */
const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path_1.resolve(__dirname, '../locales')
});
bot.startPolling();
bot.use(session());
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.use(stage_1.talkingSearchManager.middleware());
/**
 * This could lead to a problem someday(?)
 */
const commands = i18n.repository.commands;
const helpCommand = utils_1.arrayLoad(commands.help);
const aboutCommand = utils_1.arrayLoad(commands.about);
const searchCommand = utils_1.arrayLoad(commands.search);
/**
 * telegraf.log() will print all errors as well but, since this bot is running at Heroku, when an error occurs it's shut
 * down, consuming this error might help out -- still working on it to see if was any improvement.
 * Unfortunately, there's no way of reporting to the user that an error occurred once is consumed here.
 */
bot.catch((err) => {
    console.log(err);
});
/**
 * Greetings to new users when chatting one-to-one.
 */
bot.start(({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    const argument = utils_1.removeCmd(message.text);
    let keyboard = undefined;
    let keyboardInline = undefined;
    i18n.locale(language);
    keyboard = markup.keyboard(utils_1.arrayLoad(i18n.repository[language].keyboard)).resize().extra();
    replyWithMarkdown(i18n.t('greetings'), keyboard);
    /**
     * That would mean starting a bot conversation through a link to listen some podcast.
     */
    if ('' !== argument) {
        replyWithMarkdown(i18n.t('sending')).then(() => {
            stream_1.lastEpisode(parseInt(argument, 10), message.from.language_code).then((episode) => {
                keyboardInline = extra.markdown().markup((m) => {
                    return m.inlineKeyboard([
                        m.callbackButton(i18n.t('subscribe'), `subscribe/${episode.trackId}`),
                        { text: i18n.t('listen'), url: episode.link }
                    ]);
                });
                replyWithMarkdown(i18n.t('episode', episode), keyboardInline);
            }).catch(error => {
                console.error(error);
                replyWithMarkdown(i18n.t('error'));
            });
        });
    }
});
/**
 * Message saying how to use this bot.
 */
bot.command(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});
/**
 * Message saying more about this bot.
 */
bot.command(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});
/**
 * /search + 'podcast name', then returns it to the user all the data.
 *
 * iTunes  search  options for podcast, since this API searches anything in iTunes store and this bot it's only for uses
 * on  podcast,  this arguments must be set. And, this command works only talking to the bot, so there's no need to show
 * more than one result.
 */
bot.command(searchCommand, ({ i18n, replyWithMarkdown, replyWithVideo, message }) => {
    const value = utils_1.removeCmd(message.text);
    const userId = message.from.id;
    const country = message.from.language_code.split('-')[1] || 'us';
    const language = message.from.language_code.split('-')[0] || 'en';
    const opts = {
        country: country,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    i18n.locale(language);
    if (value !== '') {
        itunes_search_1.search(Object.assign({ term: value }, opts), (err, data) => {
            if (err) {
                replyWithMarkdown(i18n.t('error'));
                console.error(err);
            }
            else {
                parse_1.parseResponse(data, userId, message.from.language_code).then((parsed) => {
                    replyWithMarkdown(i18n.t('mask', parsed), parsed.keyboard);
                }).catch((error) => {
                    console.error(error);
                    replyWithMarkdown(i18n.t('noResult', { value }));
                });
            }
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
 * Handles  the  inline  searching.  Since all the parsing language data is done behind in the library parse, there's no
 * need  in  setting telegraf-i18n here -- only if the user wanna change it's default search language to be different of
 * his Telegram's language.
 */
bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery }) => {
    const value = utils_1.messageToString(inlineQuery.query);
    const userId = inlineQuery.from.id;
    const lanCode = inlineQuery.from.language_code;
    const pageLimit = 20;
    const offset = parseInt(inlineQuery.offset, 10) || 0;
    const country = inlineQuery.from.language_code.split('-')[1] || 'us';
    const opts = {
        country: country,
        limit: offset + pageLimit,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No'
    };
    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if (value !== '') {
        itunes_search_1.search(Object.assign({ term: value }, opts), (err, data) => {
            if (err) {
                console.error(err);
                utils_1.errorInline(lanCode).then((inline) => {
                    answerInlineQuery([inline]);
                });
            }
            else {
                if (0 < data.resultCount) {
                    /**
                     * "Pseudo-pagination",  since  this  API  doesn't  allow  it  true pagination. And this is a lot of
                     * overwork,  because  each  scroll down the bot will search all the already presented results again
                     * and again.  Kind of to read the next page of a book you would need to read all the pages that you
                     * already read so that you can continue.
                     */
                    data.results = data.results.slice(offset, offset + pageLimit);
                    /**
                     * Checking  the  offset  to  be equals to zero so that mean that the bot hasn't shown the user only
                     * fewer podcast options, or even none, in the search.
                     */
                    if (0 < data.results.length) {
                        parse_1.parseResponseInline(data, userId, lanCode).then((results) => {
                            answerInlineQuery(results, { next_offset: offset + pageLimit });
                        }).catch((error) => {
                            console.error(error);
                            utils_1.errorInline(lanCode).then((inline) => {
                                answerInlineQuery([inline]);
                            });
                        });
                        /**
                         * If there's nothing else to be presented at the user, this would mean an end of search.
                         */
                    }
                    else {
                        utils_1.endInline(lanCode).then((inline) => {
                            answerInlineQuery([inline]);
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                    /**
                     * In case that the user search anything that isn't available in iTunes store or mistyping.
                     */
                }
                else {
                    utils_1.notFoundInline(value, lanCode).then((inline) => {
                        answerInlineQuery([inline]);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }
        });
        /**
         * Incentive the user to search for a podcast.
         */
    }
    else {
        utils_1.searchInline(lanCode).then((inline) => {
            answerInlineQuery([inline]);
        }).catch((error) => {
            console.error(error);
        });
    }
});
/**
 * Handling buttons request.
 */
bot.on('callback_query', ({ i18n, answerCbQuery, update }) => {
    const lanCode = update.callback_query.from.language_code;
    const language = lanCode.split('-')[0] || 'en';
    const options = update.callback_query.data.split('/');
    const chat = update.callback_query.from.id;
    let keyboard = undefined;
    i18n.locale(language);
    switch (options[0]) {
        case 'subscribe':
            answerCbQuery(i18n.t('working'), true);
            break;
        case 'episode':
            switch (options[1]) {
                case 'last':
                    stream_1.lastEpisode(parseInt(options[2], 10), lanCode).then((episode) => {
                        answerCbQuery(i18n.t('stream'), false).then(() => {
                            keyboard = extra.markdown().markup((m) => {
                                return m.inlineKeyboard([
                                    m.callbackButton(i18n.t('subscribe'), `subscribe/${episode.trackId}`),
                                    { text: i18n.t('listen'), url: episode.link }
                                ]);
                            });
                            stage_1.telegramCore.sendMessage(chat, i18n.t('episode', episode), keyboard).catch(error => {
                                throw (error);
                            });
                        }).catch(error => {
                            throw (error);
                        });
                    }).catch(error => {
                        console.error(error);
                        answerCbQuery(i18n.t('error'), true);
                    });
                    break;
                default:
                    answerCbQuery('default', true);
            }
            break;
        default:
            answerCbQuery('default', true);
    }
});
/**
 * Handling help button.
 */
bot.hears(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});
/**
 * Handling about button.
 */
bot.hears(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});
/**
 * Handling search button.
 */
bot.hears(searchCommand, ({ scene }) => {
    scene.enter('talkingSearch');
});
//# sourceMappingURL=main.js.map