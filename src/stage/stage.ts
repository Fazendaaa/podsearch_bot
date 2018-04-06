/**
 * stage handles the bot "conversation".
 */
'use strict';

import { config } from 'dotenv';
import {
    options,
    response,
    search
} from 'itunes-search';
import { resultExtended } from '../@types/parse/main';
import { parseResponse } from '../others/parse';
import { arrayLoad } from '../others/utils';
const telegraf = require('telegraf');
const telegram = require('telegraf/telegram');
const Markup = telegraf.Markup;
const stage = require('telegraf/stage');
const scene = require('telegraf/scenes/base');
const { leave } = stage;

config();
/**
 * A "hack".
 */
export const telegramCore = new telegram(process.env.BOT_KEY);

/*
 * Handling podcast search through talking to bot.
 */
const talkingSearch = new scene('talkingSearch');

/**
 * Message asking for the podcast name for search for it.
 */
talkingSearch.enter(({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);

    replyWithMarkdown(i18n.t('search'), Markup.forceReply().extra());
});

/**
 * Catching the podcast name for search for it.
 */
talkingSearch.on('text', ({ i18n, replyWithMarkdown, message, scene }) => {
    const value: string = message.text;
    const userId: number = message.from.id;
    /**
     * This  option  is  an  option  to  language, since works better -- sincerely still don't know why, maybe something
     * related to iTunes API -- to return data in user native language.
     */
    const country: string = message.from.language_code.split('-')[1] || 'us';
    const language: string = message.from.language_code.split('-')[0] || 'en';
    const opts: options = {
        country: country,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    let buttons: Array<object> = undefined;
    let keyboard: any = undefined;

    /**
     * Setting up locale language info.
     */
    i18n.locale(language);

    buttons = <Array<object>>arrayLoad(i18n.repository[language].keyboard);
    keyboard = telegraf.Markup.keyboard(buttons).resize().extra();

    replyWithMarkdown(i18n.t('searching')).then(({ message_id, chat }) => {
        search({ term: value, ...opts }, (err: Error, data: response) => {
            if (err) {
                replyWithMarkdown(i18n.t('error'));
                console.error(err);
            } else {
                parseResponse(data, userId, message.from.language_code).then((parsed: resultExtended) => {
                    telegramCore.editMessageText(chat.id, message_id, undefined, i18n.t('mask', parsed), parsed.keyboard)
                        .then(() => {
                            telegramCore.sendMessage(chat.id, i18n.t('searchDone'), keyboard);
                            scene.leave();
                        });
                }).catch((error: string) => {
                    console.error(error);
                    replyWithMarkdown(i18n.t('noResult', { value }));
                });
            }
        });
    }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
});

/**
 * Creating "conversation" handler.
 */
export const talkingSearchManager = new stage();
talkingSearchManager.register(talkingSearch);
