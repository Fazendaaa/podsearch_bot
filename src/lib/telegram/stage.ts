'use strict';

import * as tinyShortener from 'tiny-shortener';
import { parsePodcastCommand } from '../podcasts/parse';
import { searchPodcast } from '../podcasts/search';
import { searchKeyboard, botKeyboard, forceReplyKeyboard } from './keyboard';
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');

const talkingSearch = new scene('talkingSearch');

/**
 * The  export  here  is  just  for  unit testing. After learning how to do tests with integration to talkingSearch this
 * export will be removed.
 */
export const handleStage = async ({ term, country, language, position = 0 }, { translateRoot }) => {
    const shortener = tinyShortener.tiny;
    const translate = (languageCode, resourceKey?) => translateRoot.t(language, languageCode, resourceKey);

    return await searchPodcast({ term }).then((podcasts) => {
        const podcast = parsePodcastCommand({ podcasts, language, country }, { shortener, translateRoot });

        return (0 !== podcast.length) ?
            { text: translate('searchResult'), keyboard: searchKeyboard({ position, language }, { translateRoot }) } :
            { text: translate('error'), keyboard: null };
    }).catch((error: Error) => {
        console.error(error);

        return { text: translate('noResult', { value: term }), keyboard: null };
    });
};

talkingSearch.enter(async ({ i18n, deleteMessage, language, country, replyWithMarkdown, message, update, session, editMessageText }) => {
    const src = message || update.callback_query;
    const userId: number = src.from.id;
    const term: string = session[userId];
    const position = parseInt(update.callback_query.data.split('/')[1], 10) || 0;

    if (undefined != message) {
        replyWithMarkdown(i18n.t('search'), forceReplyKeyboard);
    } if (undefined == update) {
        replyWithMarkdown(i18n.t('error'));        
    }
    
    /**
     * Removing the option to retry the search.
     */
    deleteMessage();

    const { message_id, chat } = await replyWithMarkdown(i18n.t('searching')).catch(console.error);
    const send = await handleStage({ term, country, language, position }, { translateRoot: i18n });

    editMessageText(chat.id, message_id, undefined, send.text, send.keyboard).catch(console.error);
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
