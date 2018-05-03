'use strict';

import { join } from 'path';
import * as Parser from 'rss-parser';
import { tiny } from 'tiny-shortener';
import { resultExtended } from './@types/parse/main';
import { searchThroughCommand, searchThroughInline } from './lib/search';
import { Subscription } from './lib/database/subscription';
import { fetchLastEpisode } from './lib/stream';
import { arrayLoad } from './lib/utils';
const telegraf = require('telegraf');
const markup = telegraf.Markup;

const handlerRss = new Parser();
const subscription = new Subscription();

export const handleStartKeyboard = ({ rootTranslate, language }) => {
    const buttons = arrayLoad(rootTranslate.repository[language].keyboard);

    /**
     * Improve this train wreck(?)
     */
    return markup.keyboard(buttons).resize().extra();
}

export const handleNoSearch = ({ translate }) => {
    return [{
        text: translate('wrongInputCmd') }, { 
        source: join(__dirname, '../gif/searchCmd.mp4') }, {
        text: translate('wrongInputButton') }, {
        source: join(__dirname, '../gif/searchButton.mp4') }, {
        text: translate('wrongInputInline') }, {
        source: join(__dirname, '../gif/searchInline.mp4')
    }];
};

export const handlePrivateConversation = async ({ id, country }, { translate }) => {
    const functionsParams = {
        translate,
        shorten: tiny,
        fetchRss: handlerRss.parseURL
    };

    return fetchLastEpisode({ id, country }, functionsParams).then((episode: resultExtended) => {
        return { text: translate('episode', episode), keyboard: episode.keyboard };
    }).catch(error => {
        console.error(error);

        return { text: translate('error'), keyboard: null };
    });
};

export const handleSearchCommand = async ({ country, term }, { translate }) => {
    return await searchThroughCommand({ country, term }, { shortener: tiny, translate });
};

export const handleSearchInline = async ({ country, term, offset, pageLimit } , { translate }) => {
    return await searchThroughInline({ country, term, offset, pageLimit }, { shortener: tiny, translate });
};

export const handleSubscribe = async ({ userId, podcastId }, { translate }): Promise<string> => {
    const result = await subscription.add(userId, podcastId).catch(console.error);

    if ('added' === result) {
        return translate('working');
    } if ('already subscribed' === result) {
        return translate('working');
    }

    /**
     * Even in a case of error trough the subscription's catch, this will run.
     */
    return translate('working');
};

export const handleUnsubscribe = async ({ userId, podcastId }, { translate }): Promise<string> => {
    const result = await subscription.remove(userId, podcastId).catch(console.error);

    if ('added' === result) {
        return translate('working');
    } if ('already subscribed' === result) {
        return translate('working');
    }

    return translate('working');
};

export const handleEpisode = ({ episode, id }, { translate }): string => {
    if ('last' === episode) {
        return translate('sending');
    } if ('notAvailable' === episode) {
        return translate('notAvailable', { id });
    }

    return translate('default');
};
