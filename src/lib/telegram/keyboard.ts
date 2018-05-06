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
