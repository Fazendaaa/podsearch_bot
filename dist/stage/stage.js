'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const i18n_node_yaml = require("i18n-node-yaml");
const itunes_search_1 = require("itunes-search");
const path_1 = require("path");
const parse_1 = require("../others/parse");
const utils_1 = require("../others/utils");
const telegraf = require('telegraf');
const telegram = telegraf.Telegram;
const markup = telegraf.Markup;
const extra = telegraf.Extra;
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');
dotenv_1.config();
goo_gl_1.setKey(process.env.GOOGLE_KEY);
const i18nNode = i18n_node_yaml({
    debug: true,
    translationFolder: path_1.join(__dirname, '../../locales'),
    locales: ['en', 'pt']
});
const telegramCore = new telegram(process.env.BOT_KEY);
const talkingSearch = new scene('talkingSearch');
const handleSearch = ({ i18n, replyWithMarkdown, text, language_code }, position = 0) => {
    const language = language_code.split('-')[0];
    const country = language_code.split('-')[1];
    const opts = {
        term: text,
        country: country,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: position + 1
    };
    let buttons = undefined;
    let keyboard = undefined;
    replyWithMarkdown(i18n.t('searching')).then(({ message_id, chat }) => {
        itunes_search_1.search(opts, (err, data) => {
            if (err) {
                replyWithMarkdown(i18n.t('error'));
                console.error(err);
            }
            else {
                parse_1.parseResponse(data, language_code, goo_gl_1.shorten, i18nNode.api, position).then((parsed) => {
                    telegramCore.editMessageText(chat.id, message_id, undefined, i18n.t('mask', parsed), parsed.keyboard).then(() => {
                        buttons = utils_1.arrayLoad(i18n.repository[language].confirm);
                        keyboard = extra.markdown().markup((m) => {
                            return m.inlineKeyboard([
                                m.callbackButton(buttons[0], 'finished'),
                                m.callbackButton(buttons[1], `again/${position}`)
                            ]);
                        });
                        replyWithMarkdown(i18n.t('searchResult'), keyboard);
                    });
                }).catch((error) => {
                    console.error(error);
                    replyWithMarkdown(i18n.t('noResult', { value: text }));
                });
            }
        });
    }).catch((error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
};
talkingSearch.enter(({ i18n, deleteMessage, replyWithMarkdown, message, update, session }) => {
    const src = message || update.callback_query;
    const language = src.from.language_code.split('-')[0] || 'en';
    const userId = src.from.id;
    let counter = undefined;
    let lanCode = undefined;
    i18n.locale(language);
    if (undefined !== message) {
        replyWithMarkdown(i18n.t('search'), markup.forceReply().extra());
    }
    else if (undefined !== update) {
        counter = parseInt(update.callback_query.data.split('/')[1], 10);
        lanCode = update.callback_query.from.language_code;
        deleteMessage();
        handleSearch({ i18n, replyWithMarkdown, text: session[userId], language_code: lanCode }, counter + 1);
    }
});
talkingSearch.on('text', ({ i18n, replyWithMarkdown, message, session }) => {
    const userId = message.from.id;
    const lanCode = message.from.language_code;
    const language = lanCode.split('-')[0] || 'en';
    i18n.locale(language);
    session[userId] = message.text;
    handleSearch({ i18n, replyWithMarkdown, text: session[userId], language_code: lanCode });
});
talkingSearch.leave(({ i18n, replyWithMarkdown, deleteMessage, update }) => {
    const language = update.callback_query.from.language_code.split('-')[0] || 'en';
    let buttons = undefined;
    let keyboard = undefined;
    i18n.locale(language);
    buttons = utils_1.arrayLoad(i18n.repository[language].keyboard);
    keyboard = markup.keyboard(buttons).resize().extra();
    if ('finished' === update.callback_query.data) {
        deleteMessage();
        replyWithMarkdown(i18n.t('searchDone'), keyboard);
    }
});
exports.talkingSearchManager = new stage();
exports.talkingSearchManager.register(talkingSearch);
//# sourceMappingURL=stage.js.map