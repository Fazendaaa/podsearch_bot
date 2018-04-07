'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const itunes_search_1 = require("itunes-search");
const parse_1 = require("../others/parse");
const utils_1 = require("../others/utils");
const telegraf = require('telegraf');
const markup = telegraf.Markup;
const extra = telegraf.Extra;
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');
const talkingSearch = new scene('talkingSearch');
const handleSearch = ({ i18n, replyWithMarkdown, text, language_code, editMessageText }, position = 0) => {
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
                parse_1.parseResponse(data, language_code, position).then((parsed) => {
                    replyWithMarkdown(i18n.t('mask', parsed), parsed.keyboard).then(() => {
                        buttons = utils_1.arrayLoad(i18n.repository[language].confirm);
                        keyboard = extra.markdown().markup((m) => {
                            return m.inlineKeyboard([
                                m.callbackButton(buttons[0], `finished/${parsed.collectionId}`),
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
talkingSearch.enter(({ i18n, replyWithMarkdown, message, update, editMessageText }) => {
    const src = message || update.callback_query;
    const language = src.from.language_code.split('-')[0] || 'en';
    let counter = undefined;
    let value = undefined;
    let lanCode = undefined;
    i18n.locale(language);
    if (undefined !== message) {
        replyWithMarkdown(i18n.t('search'), markup.forceReply().extra());
    }
    else if (undefined !== update) {
        value = update.callback_query.text;
        counter = parseInt(update.callback_query.data.split('/')[1], 10);
        lanCode = update.callback_query.from.language_code;
        handleSearch({ i18n, replyWithMarkdown, text: value, language_code: lanCode, editMessageText }, counter + 1);
    }
});
talkingSearch.on('text', ({ i18n, replyWithMarkdown, message, editMessageText }) => {
    const lanCode = message.from.language_code;
    const language = lanCode.split('-')[0] || 'en';
    i18n.locale(language);
    handleSearch({ i18n, replyWithMarkdown, text: message.text, language_code: lanCode, editMessageText });
});
talkingSearch.leave(({ i18n, replyWithMarkdown, update }) => {
    const language = update.callback_query.from.language_code.split('-')[0] || 'en';
    let buttons = undefined;
    let keyboard = undefined;
    i18n.locale(language);
    buttons = utils_1.arrayLoad(i18n.repository[language].keyboard);
    keyboard = markup.keyboard(buttons).resize().extra();
    replyWithMarkdown(i18n.t('searchDone'), keyboard);
});
exports.talkingSearchManager = new stage();
exports.talkingSearchManager.register(talkingSearch);
//# sourceMappingURL=stage.js.map