'use strict';

import { config } from 'dotenv';
import { join } from 'path';
import { tiny } from 'tiny-shortener';
import { resultExtended } from '../@types/parse/main';
import { parseResponse } from './parse';
import { searchPodcast } from './search';
import { arrayLoad } from './utils';
const telegraf = require('telegraf');
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');
const markup = telegraf.Markup;
const telegram = telegraf.Telegram;

config();

const telegramCore = new telegram(process.env.BOT_KEY);
const talkingSearch = new scene('talkingSearch');

const editPodcastMessages = async ({ chat, message_id, podcast, language, position }, { i18n, replyWithMarkdown }): void => {
    await telegramCore.editMessageText(chat.id, message_id, undefined, i18n.t('mask', podcast), podcast.keyboard).catch(console.error);

    const buttons = <Array<object>>arrayLoad(i18n.repository[language].confirm);
    const keyboard = markup.inlineKeyboard([
        markup.callbackButton(buttons[0], 'finished'),
        markup.callbackButton(buttons[1], `again/${position}`)
    ]).extra();

    replyWithMarkdown(i18n.t('searchResult'), keyboard);
};

const fetchPodcast = async ({ i18n, replyWithMarkdown, term, language_code }, position: number = 0) => {
    const language: string = language_code.split('-')[0];
    const country: string = language_code.split('-')[1];

    const { message_id, chat } = await replyWithMarkdown(i18n.t('searching')).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });

    const podcast = <response> await searchPodcast({ term, country, limit: position + 1 }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });

    const parsed = await parseResponse(podcast, language_code, tiny, i18nNode.api, position).catch ((error: string) => {
        console.error(error);
        replyWithMarkdown(i18n.t('noResult', { value: term }));
    });

    editPodcastMessages({ chat, message_id, podcast, language, position }, { i18n, replyWithMarkdown });
};

talkingSearch.enter(({ i18n, deleteMessage, replyWithMarkdown, message, update, session }) => {
    const src = message || update.callback_query;
    const language: string = src.from.language_code.split('-')[0] || 'en';
    const userId: number = src.from.id;

    i18n.locale(language);

    /**
     * First content search.
     */
    if (undefined !== message) {
        replyWithMarkdown(i18n.t('search'), markup.forceReply().extra());
    }

    /**
     * Case that the user didn't find what are looking for and wanna try it again.
     */
    else if (undefined !== update) {
        const counter = parseInt(update.callback_query.data.split('/')[1], 10);
        const lanCode = update.callback_query.from.language_code;

        /**
         * Removing the option to retry the search.
         */
        deleteMessage();

        /**
         * session.text is fetching the last user searched podcast name.
         */
        fetchPodcast({ i18n, replyWithMarkdown, term: session[userId], language_code: lanCode }, counter + 1);
    }
});

talkingSearch.on('text', ({ i18n, replyWithMarkdown, message, session }) => {
    const userId: number = message.from.id;
    const lanCode: string = message.from.language_code;
    const language: string = lanCode.split('-')[0] || 'en';

    i18n.locale(language);

    /**
     * Creating user search "history" -- need to find something better to replace this.
     */
    session[userId] = message.text;

    fetchPodcast({ i18n, replyWithMarkdown, term: session[userId], language_code: lanCode });
});

talkingSearch.leave(({ i18n, replyWithMarkdown, deleteMessage, update }) => {
    const language: string = update.callback_query.from.language_code.split('-')[0] || 'en';
    const buttons = <Array<object>> arrayLoad(i18n.repository[language].keyboard);
    const keyboard: any = markup.keyboard(buttons).resize().extra();

    i18n.locale(language);

    if ('finished' === update.callback_query.data) {
        deleteMessage();
        replyWithMarkdown(i18n.t('searchDone'), keyboard);
    }
});

export const talkingSearchManager = new stage();
talkingSearchManager.register(talkingSearch);
