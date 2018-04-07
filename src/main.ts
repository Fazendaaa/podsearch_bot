/**
 * Main  file,  handles all the Telegram's requests and does the piping API searches through the parsing functions. More
 * about the non official typings for itunes search can be found at: ./src/@typings/itunes-search/
 */
'use strict';

import { config } from 'dotenv';
import {
    lookup,
    options,
    response,
    result,
    search
} from 'itunes-search';
import { resolve } from 'path';
import { telegramInline } from 'telegraf';
import { resultExtended } from './@types/parse/main';
import {
    parseResponse,
    parseResponseInline
} from './others/parse';
import {
    lastEpisode
} from './others/stream';
import {
    arrayLoad,
    endInline,
    errorInline,
    messageToString,
    notFoundInline,
    removeCmd,
    searchInline
} from './others/utils';
import { talkingSearchManager } from './stage/stage';

/**
 * Why using the "old" pattern instead of the new one?
 * I had a little bit of an issue making the typing for Telegraf package, had to open my own question in Stack Overflow.
 * Thankfully I had a lot of help. You can see more at: https://stackoverflow.com/q/49348607/7092954
 * brentatkins opened my eys to the real issue: https://stackoverflow.com/q/49348607/7092954
 */
const telegrafI18n = require('telegraf-i18n');
const telegraf = require('telegraf');
const session = telegraf.session;
const markup = telegraf.Markup;
const extra = telegraf.Extra;

/**
 * Allows the code to run without passing the environment variables as arguments.
 */
config();

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
    directory: resolve(__dirname, '../locales')
});

bot.startPolling();
bot.use(session());
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.use(talkingSearchManager.middleware());

/**
 * This could lead to a problem someday(?)
 */
const commands = i18n.repository.commands;
const helpCommand: Array<string> = <Array<string>> arrayLoad(commands.help);
const aboutCommand: Array<string> = <Array<string>> arrayLoad(commands.about);
const searchCommand: Array<string> = <Array<string>> arrayLoad(commands.search);

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
    const language: string = message.from.language_code.split('-')[0] || 'en';
    const argument: string = removeCmd(message.text);
    let keyboard: any = undefined;

    i18n.locale(language);

    if ('private' === message.chat.type) {
        keyboard = markup.keyboard(arrayLoad(i18n.repository[language].keyboard)).resize().extra();
        replyWithMarkdown(i18n.t('greetingsPrivate'), keyboard);

        /**
         * That would mean starting a bot conversation through a link to listen some podcast.
         */
        if ('' !== argument) {
            replyWithMarkdown(i18n.t('sending')).then(() => {
                lastEpisode(parseInt(argument, 10), message.from.language_code).then((episode: resultExtended) => {
                    replyWithMarkdown(i18n.t('episode', episode), episode.keyboard);
                }).catch(error => {
                    replyWithMarkdown(i18n.t('error'));
                    throw (error);
                });
            }).catch(error => {
                console.error(error);
            });
        }
    } else {
        replyWithMarkdown(i18n.t('greetingsGroup'));
    }
});

/**
 * Message saying how to use this bot.
 */
bot.command(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});

/**
 * Message saying more about this bot.
 */
bot.command(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

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
    const value: string = removeCmd(message.text);
    const country: string = message.from.language_code.split('-')[1] || 'us';
    const language: string = message.from.language_code.split('-')[0] || 'en';
    const opts: options = {
        country: country,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };

    i18n.locale(language);

    if (value !== '') {
        search({ term: value, ...opts }, (err: Error, data: response) => {
            if (err) {
                replyWithMarkdown(i18n.t('error'));
                console.error(err);
            } else {
                parseResponse(data, message.from.language_code).then((parsed: resultExtended) => {
                    replyWithMarkdown(i18n.t('mask', parsed), parsed.keyboard);
                }).catch((error: string) => {
                    console.error(error);
                    replyWithMarkdown(i18n.t('noResult', { value }));
                });
            }
        });
    /**
     * In case that the user hasn't send any podcast to be searched for, show him how to do searches.
     */
    } else {
        replyWithMarkdown(i18n.t('wrongInputCmd')).then(() => {
            replyWithVideo({ source: resolve(__dirname, '../gif/searchCmd.mp4') }).then(() => {
                replyWithMarkdown(i18n.t('wrongInputButton')).then(() => {
                    replyWithVideo({ source: resolve(__dirname, '../gif/searchButton.mp4') }).then(() => {
                        replyWithMarkdown(i18n.t('wrongInputInline')).then(() => {
                            replyWithVideo({ source: resolve(__dirname, '../gif/searchInline.mp4') }).catch((error: Error) => {
                                throw error;
                            });
                        }).catch((error: Error) => {
                            throw error;
                        });
                    }).catch((error: Error) => {
                        throw error;
                    });
                }).catch((error: Error) => {
                    throw error;
                });
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
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
    const value: string = messageToString(inlineQuery.query);
    const lanCode: string = inlineQuery.from.language_code;
    const pageLimit: number = 20;
    const offset: number = parseInt(inlineQuery.offset, 10) || 0;
    const country: string = inlineQuery.from.language_code.split('-')[1] || 'us';
    const opts: options = {
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
        search({ term: value, ...opts }, (err: Error, data: response) => {
            if (err) {
                console.error(err);
                errorInline(lanCode).then((inline: telegramInline) => {
                    answerInlineQuery([inline]);
                });
            } else {
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
                        parseResponseInline(data, lanCode).then((results: Array<telegramInline>) => {
                            answerInlineQuery(results, { next_offset: offset + pageLimit });
                        }).catch((error: Error) => {
                            console.error(error);
                            errorInline(lanCode).then((inline: telegramInline) => {
                                answerInlineQuery([inline]);
                            });
                        });
                    /**
                     * If there's nothing else to be presented at the user, this would mean an end of search.
                     */
                    } else {
                        endInline(lanCode).then((inline: telegramInline) => {
                            answerInlineQuery([inline]);
                        }).catch((error: Error) => {
                            console.error(error);
                        });
                    }
                /**
                 * In case that the user search anything that isn't available in iTunes store or mistyping.
                 */
                } else {
                    notFoundInline(value, lanCode).then((inline: telegramInline) => {
                        answerInlineQuery([inline]);
                    }).catch((error: Error) => {
                        console.error(error);
                    });
                }
            }
        });
    /**
     * Incentive the user to search for a podcast.
     */
    } else {
        searchInline(lanCode).then((inline: telegramInline) => {
            answerInlineQuery([inline]);
        }).catch((error: Error) => {
            console.error(error);
        });
    }
});

/**
 * Handling buttons request.
 */
bot.on('callback_query', ({ i18n, answerCbQuery, update, scene, replyWithMarkdown }) => {
    const lanCode: string = update.callback_query.from.language_code;
    const language: string = lanCode.split('-')[0] || 'en';
    const options: Array<string> = update.callback_query.data.split('/');
    const user: number = update.callback_query.from.id;
    let keyboard: any = undefined;

    i18n.locale(language);

    switch (options[0]) {
        case 'subscribe':
            answerCbQuery(i18n.t('working'), true);
            break;
        case 'episode':
            switch (options[1]) {
                /**
                 * Sends the user a message with the podcast episode link attached to.
                 */
                case 'last':
                    answerCbQuery(i18n.t('sending'), false).then(() => {
                        keyboard = extra.markdown().markup((m: any) => {
                            return m.inlineKeyboard([
                                m.callbackButton(i18n.api().t('subscribe', {}, language), `subscribe/${options[2]}`),
                                { text: i18n.api().t('listen', {}, language), url: `t.me/${process.env.BOT_NAME}?start=${options[2]}` }
                            ]);
                        });

                        replyWithMarkdown(user, i18n.t('sending'), keyboard);
                    });
                    break;
                /**
                 * With the podcast is in a not know pattern, let the user know about it.
                 */
                case 'notAvailable':
                    answerCbQuery(i18n.t('notAvailable', { id: options[2] }), true);
                    break;
                default:
                    answerCbQuery('default', true);
            }
            break;
        /**
         * Result was not what user was looking for.
         */
        case 'again':
            answerCbQuery(i18n.t('again'), false);
            scene.reenter();
            break;
        /**
         * User found the result it was looking for.
         */
        case 'finished':
            answerCbQuery(i18n.t('finished'), false);
            scene.leave();
            break;
        default:
            answerCbQuery('default', true);
    }
});

/**
 * Handling help button.
 */
bot.hears(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});

/**
 * Handling about button.
 */
bot.hears(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

/**
 * Handling search button.
 */
bot.hears(searchCommand, ({ scene }) => {
    scene.enter('talkingSearch');
});
