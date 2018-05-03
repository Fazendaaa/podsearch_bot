'use strict';

import { join } from 'path';
import * as Parser from 'rss-parser';
import { tiny } from 'tiny-shortener';
import { resultExtended } from './@types/parse/main';
import { Subscription } from './database/subscription';
import { fetchLastEpisode } from './lib/stream';
import { arrayLoad } from './lib/utils';
const telegraf = require('telegraf');
const markup = telegraf.Markup;

const handlerRss = new Parser();
const subscription = new Subscription();

const functionsParams = {
    shorten: tiny,
    fetchRss: handlerRss.parseURL
};

export const handlePrivateConversation = async ({ id, country, language }, { translate, replyWithMarkdown }) => {
    if (isNaN(id)) {
        const buttons = arrayLoad(translate.repository[language].keyboard);
        const keyboard = markup.keyboard(buttons).resize().extra();

        return { text: translate('greetingsPrivate'), keyboard };
    }

    /**
     * That would mean starting a bot conversation through a link to listen some podcast.
     */
    await replyWithMarkdown(translate('sending')).catch(console.error);

    return fetchLastEpisode({ id, country, language }, { translate, ...functionsParams }).then((episode: resultExtended) => {
        return { text: translate('episode', episode), keyboard: episode.keyboard };
    }).catch(error => {
        console.error(error);

        return { text: translate('error'), keyboard: null };
    });
};

export const handleSubscribe = async ({ userId, podcastId }, { translate }): Promise<string> => {
    const result = await subscription.add(userId, podcastId).catch(console.error);

    if ('added' === result) {
        return translate('working');
    } if ('already subscribed' === result) {
        return translate('working');
    }

    /**
     * Even in a case of error trough the catch, this will run.
     */
    return translate('working');
};

export const handleUnsubscribe = async ({ userId, podcastId }, { translate }): Promise<string> => {
    const result = await subscription.remove(userId, podcastId).catch(console.error);

    if ('added' === result) {
        return translate('working');
    } else if ('already subscribed' === result) {
        return translate('working');
    }

    return translate('working');
};

export const handleEpisode = ({ episode, id }, { translate }): string => {
    if ('last' === episode) {
        return translate('sending');
    } else if ('notAvailable' === episode) {
        return translate('notAvailable', { id });
    }

    return translate('default');
};
