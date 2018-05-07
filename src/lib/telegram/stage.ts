'use strict';

import { handleStage } from '../handlers/stage';
import { searchKeyboard, botKeyboard, forceReplyKeyboard } from '../telegram/keyboard';
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');

const talkingSearch = new scene('talkingSearch');

talkingSearch.enter(async ({ i18n, deleteMessage, language, country, replyWithMarkdown, message, update, session, editMessageText }) => {
    const src = message || update.callback_query;
    const userId: number = src.from.id;
    const term: string = session[userId];
    const position = parseInt(update.callback_query.data.split('/')[1], 10) || 0;
    const translateRoot = i18n;
    const translate = (languageCode, resourceKey?) => translateRoot.t(language, languageCode, resourceKey);

    if (undefined != message) {
        replyWithMarkdown(translate('search'), forceReplyKeyboard);
    } if (undefined == update) {
        replyWithMarkdown(translate('error'));        
    }
    
    /**
     * Removing the option to retry the search.
     */
    deleteMessage();

    const { message_id, chat } = await replyWithMarkdown(translate('searching')).catch(console.error);
    const send = await handleStage({ term, country, language, position }, { translateRoot, translate });

    editMessageText(chat.id, message_id, undefined, send.text, send.keyboard).catch(console.error);

    replyWithMarkdown(translate('searchResult'), searchKeyboard({ position, language }, { translateRoot }));
});

talkingSearch.on('text', ({ i18n, replyWithMarkdown, lanCode, message, session }) => {
    const userId: number = message.from.id;

    /**
     * Creating user search "history" -- need to find something better to replace this.
     */
    session[userId] = message.text;

    // handleStage({ i18n, replyWithMarkdown, term: session[userId], language_code: lanCode });
});

talkingSearch.leave(({ i18n, replyWithMarkdown, deleteMessage, language, update }) => {
    if ('finished' === update.callback_query.data) {
        deleteMessage();
        replyWithMarkdown(i18n.t('searchDone'), botKeyboard({ language }, { translateRoot: i18n }));
    }
});

export const talkingSearchManager = new stage();
talkingSearchManager.register(talkingSearch);
