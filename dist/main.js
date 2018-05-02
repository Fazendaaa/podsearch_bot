'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const i18n_node_yaml = require("i18n-node-yaml");
const itunes_search_1 = require("itunes-search");
const path_1 = require("path");
const Parser = require("rss-parser");
const tiny_shortener_1 = require("tiny-shortener");
const subscription_1 = require("./database/subscription");
const parse_1 = require("./others/parse");
const stream_1 = require("./others/stream");
const utils_1 = require("./others/utils");
const stage_1 = require("./stage/stage");
const telegrafI18n = require('telegraf-i18n');
const telegraf = require('telegraf');
const session = telegraf.session;
const markup = telegraf.Markup;
const extra = telegraf.Extra;
dotenv_1.config();
const i18nNode = i18n_node_yaml({
    debug: true,
    translationFolder: path_1.join(__dirname, '../locales'),
    locales: ['en', 'pt']
});
const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: path_1.join(__dirname, '../locales')
});
bot.startPolling();
bot.use(session());
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.use(stage_1.talkingSearchManager.middleware());
const subscription = new subscription_1.Subscription();
const handlerRss = new Parser();
const commands = i18n.repository.commands;
const helpCommand = utils_1.arrayLoad(commands.help);
const aboutCommand = utils_1.arrayLoad(commands.about);
const searchCommand = utils_1.arrayLoad(commands.search);
bot.catch((err) => {
    console.log(err);
});
bot.start(({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    const argument = utils_1.removeCmd(message.text);
    let keyboard = undefined;
    i18n.locale(language);
    if ('private' === message.chat.type) {
        if ('' === argument) {
            keyboard = markup.keyboard(utils_1.arrayLoad(i18n.repository[language].keyboard)).resize().extra();
            replyWithMarkdown(i18n.t('greetingsPrivate'), keyboard);
        }
        else {
            replyWithMarkdown(i18n.t('sending')).then(() => {
                const searchParams = {
                    id: parseInt(argument, 10),
                    language: message.from.language_code.split('-')[0] || 'en',
                    country: message.from.language_code.split('-')[1] || 'us'
                };
                const functionsParams = {
                    translate: i18nNode.api.t,
                    shorten: tiny_shortener_1.tiny,
                    fetchRss: handlerRss.parseURL
                };
                stream_1.lastEpisode(searchParams, i18nNode.api, functionsParams).then((episode) => {
                    replyWithMarkdown(i18n.t('episode', episode), episode.keyboard);
                }).catch(error => {
                    replyWithMarkdown(i18n.t('error'));
                    throw (error);
                });
            }).catch(error => {
                console.error(error);
            });
        }
    }
    else {
        replyWithMarkdown(i18n.t('greetingsGroup'));
    }
});
bot.command(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});
bot.command(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});
bot.command(searchCommand, ({ i18n, replyWithMarkdown, replyWithVideo, message }) => {
    const value = utils_1.removeCmd(message.text);
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
                parse_1.parseResponse(data, message.from.language_code, tiny_shortener_1.tiny, i18nNode.api).then((parsed) => {
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
            replyWithVideo({ source: path_1.join(__dirname, '../gif/searchCmd.mp4') }).then(() => {
                replyWithMarkdown(i18n.t('wrongInputButton')).then(() => {
                    replyWithVideo({ source: path_1.join(__dirname, '../gif/searchButton.mp4') }).then(() => {
                        replyWithMarkdown(i18n.t('wrongInputInline')).then(() => {
                            replyWithVideo({ source: path_1.join(__dirname, '../gif/searchInline.mp4') }).catch((error) => {
                                throw error;
                            });
                        }).catch((error) => {
                            throw error;
                        });
                    }).catch((error) => {
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
        entity: 'podcast',
        explicit: 'No'
    };
    if (value !== '') {
        itunes_search_1.search(Object.assign({ term: value }, opts), (err, data) => {
            if (err) {
                console.error(err);
                utils_1.errorInline(lanCode, i18nNode.api).then((inline) => {
                    answerInlineQuery([inline]);
                });
            }
            else {
                if (0 < data.resultCount) {
                    data.results = data.results.slice(offset, offset + pageLimit);
                    if (0 < data.results.length) {
                        parse_1.parseResponseInline(data, lanCode, tiny_shortener_1.tiny, i18nNode.api).then((results) => {
                            answerInlineQuery(results, { next_offset: offset + pageLimit });
                        }).catch((error) => {
                            console.error(error);
                            utils_1.errorInline(lanCode, i18nNode.api).then((inline) => {
                                answerInlineQuery([inline]);
                            });
                        });
                    }
                    else {
                        utils_1.endInline(lanCode, i18nNode.api).then((inline) => {
                            answerInlineQuery([inline]);
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                }
                else {
                    utils_1.notFoundInline(value, lanCode, i18nNode.api).then((inline) => {
                        answerInlineQuery([inline]);
                    }).catch((error) => {
                        console.error(error);
                    });
                }
            }
        });
    }
    else {
        utils_1.searchInline(lanCode, i18nNode.api).then((inline) => {
            answerInlineQuery([inline]);
        }).catch((error) => {
            console.error(error);
        });
    }
});
bot.on('callback_query', ({ i18n, answerCbQuery, update, scene, replyWithMarkdown }) => {
    const language = update.callback_query.from.language_code.split('-')[0] || 'en';
    const options = update.callback_query.data.split('/');
    i18n.locale(language);
    switch (options[0]) {
        case 'subscribe':
            subscription.add(0, 0).then((result) => {
                if ('added' === result) {
                    answerCbQuery(i18n.t('working'), true);
                }
                else if ('already subscribed' === result) {
                    answerCbQuery(i18n.t('working'), true);
                }
                else {
                    answerCbQuery(i18n.t('working'), true);
                }
            });
            break;
        case 'unsubscribe':
            subscription.remove(0, 0).then((result) => {
                if ('added' === result) {
                    answerCbQuery(i18n.t('working'), true);
                }
                else if ('already subscribed' === result) {
                    answerCbQuery(i18n.t('working'), true);
                }
                else {
                    answerCbQuery(i18n.t('working'), true);
                }
            });
            break;
        case 'episode':
            switch (options[1]) {
                case 'last':
                    answerCbQuery(i18n.t('sending'), false);
                    break;
                case 'notAvailable':
                    answerCbQuery(i18n.t('notAvailable', { id: options[2] }), true);
                    break;
                default:
                    answerCbQuery('default', true);
            }
            break;
        case 'again':
            answerCbQuery(i18n.t('again'), false);
            scene.reenter();
            break;
        case 'finished':
            answerCbQuery(i18n.t('finished'), false);
            scene.leave();
            break;
        default:
            answerCbQuery('default', true);
    }
});
bot.hears(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});
bot.hears(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});
bot.hears(searchCommand, ({ scene }) => {
    scene.enter('talkingSearch');
});
//# sourceMappingURL=main.js.map