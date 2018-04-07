/**
 * "Stream" the podcast through Telegram built-in browser.
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
    result
} from 'itunes-search';
import { join } from 'path';
import * as Parser from 'rss-parser';
import { resultExtended } from '../@types/parse/main';
import { item } from '../@types/stream/main';
const extra = require('telegraf').Extra;

/**
 * RSS fetcher.
 */
const handlerRss = new Parser();

config();

setKey(process.env.GOOGLE_KEY);

const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: join(__dirname, '../../locales'),
    locales: ['en', 'pt']
});

/**
 * Since RSS feed has no rule to link which parameter will be the episode link, this function handles that; fetching the
 * last episode URL.
 */
export const linkEpisode = (rss: item): string => {
    let link: string = undefined;

    if (undefined !== rss && 'object' === typeof (rss)) {
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
        }

        return link;
    } else {
        throw(new Error('Wrong argument.'));
    }
};

/**
 * Fetch the last podcast episode.
 */
export const lastEpisode = (id: number, lanCode: string): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    const options: object = {
        id: id,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    let keyboard: any = undefined;
    let link: string = undefined;
    let country: string = undefined;
    let language: string = undefined;

    if (undefined !== id && 'number' === typeof(id) && undefined !== lanCode && 'string' === typeof(lanCode)) {
        language = lanCode.split('-')[0];
        country = lanCode.split('-')[1];

        lookup({ country, ...options}, (err: Error, data: response) => {
            if (err || 0 === data.resultCount) {
                reject('Something wrong occurred with search.');
            } else {
                handlerRss.parseURL(data.results[0].feedUrl).then((parsed) => {
                    link = linkEpisode(parsed.items[0]);

                    /**
                     * Verifies if the link is one of the know objects value then parse it.
                     */
                    if (undefined !== link) {
                        shorten(link).then((short: string) => {
                            keyboard = extra.markdown().markup((m: any) => {
                                return m.inlineKeyboard([
                                    m.callbackButton(i18n.api().t('subscribe', {}, language), `subscribe/${id}`),
                                    { text: i18n.api().t('listen', {}, language), url: short }
                                ]);
                            });

                            resolve({
                                keyboard,
                                ...data.results[0]
                            });
                        }).catch((error) => {
                            throw(error);
                        });
                    /**
                     * If not, the user will be notified and asked to report it to improve linkEpisode.
                     */
                    } else {
                        keyboard = extra.markdown().markup((m: any) => {
                            return m.inlineKeyboard([
                                m.callbackButton(i18n.api().t('subscribe', {}, language), `subscribe/${id}`),
                                m.callbackButton(i18n.api().t('listen', {}, language), `episode/notAvailable/${id}`)
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
