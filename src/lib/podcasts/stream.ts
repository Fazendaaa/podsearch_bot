'use strict';

import { result } from 'itunes-search';
import * as moment from 'moment';
import { resultExtended } from '../@types/parse/main';
import { lookupPodcast } from './search';
const markup = require('telegraf').Markup;

const assertLastEpisode = (searchParams: object, functionsParams: object): Promise<string | TypeError> =>
new Promise(async (resolve: (message: string) => void, reject: (error: TypeError) => void) => {
    const check = [ {
        param: 'searchParams', property: 'id', type: 'number' }, {
        param: 'searchParams', property: 'country', type: 'string' }, {
        param: 'functionsParams', property: 'translate', type: 'function' }, {
        param: 'functionsParams', property: 'fetchRss', type: 'function' }, {
        param: 'functionsParams', property: 'shorten', type: 'function'
    }];

    await check.map(element => {
        if (false === element.param.hasOwnProperty(element.property) || element.type !== typeof element.property) {
            reject(new TypeError(`${element.param} has no ${element.property} property of type ${element.type}.`));
        }
    });

    resolve('Ok');
});

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

const fetchNameEpisode = ({ lastEpisode }, { translate }): string => {
    if (true === lastEpisode.hasOwnProperty('title')) {
        return lastEpisode.title;
    }

    return translate('noName');
};

const fetchKeyboard = async ({ lastEpisode }, { translate, shorten }) => {
    const keyboard = markup.inlineKeyboard([ markup.callbackButton(translate('subscribe'), `subscribe/${id}`) ]).extra();
    let linkButton;

    try {
        linkButton = {
            text: translate('listen'),
            url: await shorten(fetchLinkEpisode(lastEpisode)).catch((error: Error) => {
                throw new Error(`Shortening error: ${error}`);
            })
        };
    } catch {
        linkButton = markup.callbackButton(translate('listen'), `episode/notAvailable/${id}`);
    } finally {
        keyboard.push(linkButton);
    }

    return keyboard;
};

export const fetchLastEpisode = ({ id, country }, { translate, fetchRss, shorten}): Promise<resultExtended | Error> =>
new Promise(async (resolve: (data: resultExtended) => void, reject: (error: Error) => void) => {
    await assertLastEpisode({ id, country }, { translate, fetchRss, shorten }).catch(reject);

    const podcastItunes = <result> await lookupPodcast({ id, country }).catch(reject);
    const podcastContent = await fetchRss(podcastItunes.feedUrl).catch(reject);
    const lastEpisode = podcastContent.items[0];

    resolve({
        name: fetchNameEpisode({ lastEpisode }, { translate }),
        latest: moment(lastEpisode.pubDate).locale(country).format('Do MMMM YYYY, h:mm a'),
        keyboard: fetchKeyboard({ lastEpisode }, { translate, shorten }),
        ...lastEpisode
    });
});
