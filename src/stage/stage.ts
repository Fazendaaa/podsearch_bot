/**
 * stage handles the bot "conversation".
 */
'use strict';

import { config } from 'dotenv';
import {
    setKey,
    shorten
} from 'goo.gl';
import * as i18n_node_yaml from 'i18n-node-yaml';
import {
    lookup,
    options,
    response,
    search
} from 'itunes-search';
import { join } from 'path';
import { resultExtended } from '../@types/parse/main';
import { parseResponse } from '../others/parse';
import { arrayLoad } from '../others/utils';
const telegraf = require('telegraf');
const telegram = telegraf.Telegram;
const markup = telegraf.Markup;
const extra = telegraf.Extra;
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');

config();

setKey(process.env.GOOGLE_KEY);

const i18nNode = i18n_node_yaml({
    debug: true,
    translationFolder: join(__dirname, '../../locales'),
    locales: ['en', 'pt']
});

const telegramCore = new telegram(process.env.BOT_KEY);

/*
 * Handling podcast search through talking to bot.
 */
const talkingSearch = new scene('talkingSearch');

/**
 * Handle the stage searches.
 */
const handleSearch = ({ i18n, replyWithMarkdown, text, language_code }, position: number = 0): void => {
    const language: string = language_code.split('-')[0];
    const country: string = language_code.split('-')[1];
    const opts: options = {
        term: text,
        country: country,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: position + 1
    };
    let buttons: Array<object> = undefined;
    let keyboard: any = undefined;

    replyWithMarkdown(i18n.t('searching')).then(({ message_id, chat }) => {
        search(opts, (err: Error, data: response) => {
            if (err) {
                replyWithMarkdown(i18n.t('error'));
                console.error(err);
            } else {
                parseResponse(data, language_code, shorten, i18nNode.api, position).then((parsed: resultExtended) => {
                    telegramCore.editMessageText(chat.id, message_id, undefined, i18n.t('mask', parsed), parsed.keyboard).then(() => {
                        buttons = <Array<object>>arrayLoad(i18n.repository[language].confirm);
                        keyboard = extra.markdown().markup((m: any) => {
                            return m.inlineKeyboard([
                                m.callbackButton(buttons[0], 'finished'),
                                m.callbackButton(buttons[1], `again/${position}`)
                            ]);
                        });

                        replyWithMarkdown(i18n.t('searchResult'), keyboard);
                    });
                }).catch((error: string) => {
                    console.error(error);
                    replyWithMarkdown(i18n.t('noResult', { value: text }));
                });
            }
        });
    }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
};

/**
 * Message asking for the podcast name for search for it.
 */
talkingSearch.enter(({ i18n, deleteMessage, replyWithMarkdown, message, update, session }) => {
    const src = message || update.callback_query;
    const language: string = src.from.language_code.split('-')[0] || 'en';
    const userId: number = src.from.id;
    let counter: number = undefined;
    let lanCode: string = undefined;

    i18n.locale(language);

    /**
     * First content search.
     */
    if (undefined !== message) {
        replyWithMarkdown(i18n.t('search'), markup.forceReply().extra());
    /**
     * Case that the user didn't find what are looking for and wanna try it again.
     */
    } else if (undefined !== update) {
        counter = parseInt(update.callback_query.data.split('/')[1], 10);
        lanCode = update.callback_query.from.language_code;

        /**
         * Removing the option to retry the search.
         */
        deleteMessage();
        /**
         * session.text is fetching the last user searched podcast name.
         */
        handleSearch({ i18n, replyWithMarkdown, text: session[userId], language_code: lanCode }, counter + 1);
    }
});

/**
 * Catching the podcast name for search for it.
 */
talkingSearch.on('text', ({ i18n, replyWithMarkdown, message, session }) => {
    const userId: number = message.from.id;
    const lanCode: string = message.from.language_code;
    const language: string = lanCode.split('-')[0] || 'en';

    i18n.locale(language);

    /**
     * Creating user search history.
     */
    session[userId] = message.text;

    handleSearch({ i18n, replyWithMarkdown, text: session[userId], language_code: lanCode });
});

/**
 * Ending search.
 */
talkingSearch.leave(({ i18n, replyWithMarkdown, deleteMessage, update }) => {
    const language: string = update.callback_query.from.language_code.split('-')[0] || 'en';
    let buttons: Array<object> = undefined;
    let keyboard: any = undefined;

    i18n.locale(language);

    buttons = <Array<object>>arrayLoad(i18n.repository[language].keyboard);
    keyboard = markup.keyboard(buttons).resize().extra();

    /**
     * Since  this leave option is called each time before the reenter option, only when is really finished this message
     * will be sent to the user.
     */
    if ('finished' === update.callback_query.data) {
        deleteMessage();
        replyWithMarkdown(i18n.t('searchDone'), keyboard);
    }
});

/**
 * Creating "conversation" handler.
 */
export const talkingSearchManager = new stage();
talkingSearchManager.register(talkingSearch);
