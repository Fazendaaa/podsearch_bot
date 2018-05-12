'use strict';

import { arrayLoad } from '../utils';
const extra = require('telegraf').Extra;
const markup = require('telegraf').Markup;

export const podcastKeyboard = ({ podcastId, language }, { translateRoot }) => {
    const buttons = <Array<string>> arrayLoad(translateRoot.repository[language].card);
    const keyboard = markup.inlineKeyboard([
        markup.callbackButton(buttons[0], `subscribe/${podcastId}`),
        { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
    ]).extra();

    return keyboard;
};

export const searchKeyboard = ({ position, language }, { translateRoot }) => {
    const buttons = <Array<string>> arrayLoad(translateRoot.repository[language].confirm);
    const keyboard = markup.inlineKeyboard([
        markup.callbackButton(buttons[0], 'finished'),
        markup.callbackButton(buttons[1], `again/${position}`)
    ]).extra();

    return keyboard;
};

export const botKeyboard = ({ language }, { translateRoot }) => {
    const buttons = <Array<string>> arrayLoad(translateRoot.repository[language].keyboard);
    const keyboard = markup.keyboard(buttons).resize().extra();

    return keyboard;
};

export const forceReplyKeyboard = markup.forceReply().extra();

const fetchLinkEpisode = (rss): string | Error => {
    /**
     * Even  with  guid property, some cases -- particularly in Soundcloud --, are populated with tags that won't return
     * the  proper  stream link, that's why the need to check if contains and http/https attached to it.
     */
    if (true === rss.hasOwnProperty('guid') && rss.guid.includes('http')) {
        return rss.guid;
    } if (true === rss.hasOwnProperty('link')) {
        return rss.link;
    }

    throw (new Error('Undefined episode link.'));
};

export const streamKeyboard = async ({ rssContent, id }, { translate, shortener }) => {
    const keyboard = markup.inlineKeyboard([markup.callbackButton(translate('subscribe'), `subscribe/${id}`)]).extra();
    let linkButton;

    try {
        linkButton = {
            text: translate('listen'),
            url: await shortener(fetchLinkEpisode(rssContent)).catch((error: Error) => {
                throw new Error(`Shortening error: ${error}`);
            })
        };
    } catch {
        linkButton = markup.callbackButton(translate('listen'), `episode/notAvailable/${id}`);
    } finally {
        keyboard.reply_markup.inline_keyboard.push(linkButton);

        return keyboard;
    }
};
