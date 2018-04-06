/**
 * stage handles the bot "conversation".
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const itunes_search_1 = require("itunes-search");
const parse_1 = require("../others/parse");
const utils_1 = require("../others/utils");
const telegraf = require('telegraf');
const telegram = require('telegraf/telegram');
const Markup = telegraf.Markup;
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');
const { leave } = stage;
dotenv_1.config();
/**
 * A "hack".
 */
exports.telegramCore = new telegram(process.env.BOT_KEY);
/*
 * Handling podcast search through talking to bot.
 */
const talkingSearch = new scene('talkingSearch');
/**
 * Message asking for the podcast name for search for it.
 */
talkingSearch.enter(({ i18n, replyWithMarkdown, message }) => {
    const language = message.from.language_code.split('-')[0] || 'en';
    i18n.locale(language);
    replyWithMarkdown(i18n.t('search'), Markup.forceReply().extra());
});
/**
 * Catching the podcast name for search for it.
 */
talkingSearch.on('text', ({ i18n, replyWithMarkdown, message, scene }) => {
    const value = message.text;
    const userId = message.from.id;
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
        explicit: 'No',
        limit: 1
    };
    let buttons = undefined;
    let keyboard = undefined;
    /**
     * Setting up locale language info.
     */
    i18n.locale(language);
    buttons = utils_1.arrayLoad(i18n.repository[language].keyboard);
    keyboard = telegraf.Markup.keyboard(buttons).resize().extra();
    replyWithMarkdown(i18n.t('searching')).then(({ message_id, chat }) => {
        itunes_search_1.search(Object.assign({ term: value }, opts), (err, data) => {
            if (err) {
                replyWithMarkdown(i18n.t('error'));
                console.error(err);
            }
            else {
                parse_1.parseResponse(data, userId, message.from.language_code).then((parsed) => {
                    exports.telegramCore.editMessageText(chat.id, message_id, undefined, i18n.t('mask', parsed), parsed.keyboard)
                        .then(() => {
                        exports.telegramCore.sendMessage(chat.id, i18n.t('searchDone'), keyboard);
                        scene.leave();
                    });
                }).catch((error) => {
                    console.error(error);
                    replyWithMarkdown(i18n.t('noResult', { value }));
                });
            }
        });
    }).catch((error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
});
/**
 * Creating "conversation" handler.
 */
exports.talkingSearchManager = new stage();
exports.talkingSearchManager.register(talkingSearch);
//# sourceMappingURL=stage.js.map