/**
 * "Stream" the podcast through Telegram built-in browser.
 */
'use strict';

import { api } from 'i18n-node-yaml';
import {
    lookup,
    options,
    response,
    result
} from 'itunes-search';
import * as moment from 'moment';
import { join } from 'path';
import { Parser } from 'rss-parser';
import { resultExtended } from '../@types/parse/main';
import { item } from '../@types/stream/main';
const extra = require('telegraf').Extra;

/**
 * Since RSS feed has no rule to link which parameter will be the episode link, this function handles that; fetching the
 * last episode URL.
 */
export const linkEpisode = (rss: item): string => {
    let link: string = undefined;

    if (undefined !== rss && 'object' === typeof(rss)) {
        /**
         * Even  with  guid  property,  some  cases -- particularly in Soundcloud --, are populated with tags that won't
         * return  the  proper  stream link. Just lookup to see whether or not an http -- or https -- link is available,
         * that  would  be  faster  than requesting a search through any other API to find the episode link through that
         * tags.
         */
        if (true === rss.hasOwnProperty('guid') && rss.guid.includes('http')) {
            link = rss.guid;
        } else if (true === rss.hasOwnProperty('link')) {
            link = rss.link;
        /**
         * Since the shorten function will "short" anything that is a string, the best way is to pass an undefined so,
         * that way, won't be shortened at all.
         */
        } else {
            link = undefined;
        }

        return link;
    } else {
        throw(new Error('Wrong argument.'));
    }
};

/**
 * Fetch the episode name.
 */
export const nameEpisode = (rss: item, language: string, i18n: api): string => {
    let name: string = undefined;

    if (undefined !== rss && 'object' === typeof(rss) && undefined !== language && 'string' === typeof(language)) {
        if (true === rss.hasOwnProperty('title')) {
            name = rss.title;
        } else {
            name = i18n().t('noName', {}, language);
        }

        return name;
    } else {
        throw (new Error('Wrong argument.'));
    }
};

/**
 * Fetch the last podcast episode.
 */
export const lastEpisode = (id: number, lanCode: string, i18n: api, shorten: Function, rssFetcher: Parser): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    const options: object = {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    let keyboard: any = undefined;
    let link: string = undefined;
    let country: string = undefined;
    let language: string = undefined;
    let name: string = undefined;
    let latest: string = undefined;

    if (undefined !== id && 'number' === typeof(id) && undefined !== lanCode && 'string' === typeof(lanCode)) {
        language = lanCode.split('-')[0];
        country = lanCode.split('-')[1];

        lookup({ id, country, ...options}, (err: Error, data: response) => {
            if (err || 0 === data.resultCount) {
                reject('Something wrong occurred with search.');
            } else {
                rssFetcher.parseURL(data.results[0].feedUrl).then((parsed) => {
                    link = linkEpisode(parsed.items[0]);
                    name = nameEpisode(parsed.items[0], language, i18n);
                    latest = moment(parsed.items[0].pubDate).locale(country).format('Do MMMM YYYY, h:mm a');

                    /**
                     * Verifies if the link is one of the know objects value then parse it.
                     */
                    if (undefined !== link) {
                        shorten(link).then((short: string) => {
                            keyboard = extra.markdown().markup((m: any) => {
                                return m.inlineKeyboard([
                                    m.callbackButton(i18n().t('subscribe', {}, language), `subscribe/${id}`),
                                    { text: i18n().t('listen', {}, language), url: short }
                                ]);
                            });

                            resolve({
                                name,
                                latest,
                                keyboard,
                                ...data.results[0]
                            });
                        }).catch((error) => {
                            reject(error);
                        });
                    /**
                     * If not, the user will be notified and asked to report it to improve linkEpisode.
                     */
                    } else {
                        keyboard = extra.markdown().markup((m: any) => {
                            return m.inlineKeyboard([
                                m.callbackButton(i18n().t('subscribe', {}, language), `subscribe/${id}`),
                                m.callbackButton(i18n().t('listen', {}, language), `episode/notAvailable/${id}`)
                            ]);
                        });

                        resolve({
                            keyboard,
                            ...data.results[0]
                        });
                    }
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    } else {
        reject('Wrong argument.');
    }
});
