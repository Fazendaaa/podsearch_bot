'use strict';

const extra = require('telegraf').Extra;

export const podcastKeyboard = ({ podcastId }, { translate }) => {
    const buttons = translate('card');
    const keyboard = extra.markdown().markup((m: any) => {
        return m.inlineKeyboard([
            m.callbackButton(buttons[0], `subscribe/${podcastId}`),
            { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
        ]);
    });
};
