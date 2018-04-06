/**
 * "Stream" the podcast through Telegram built-in browser.
 */
'use strict';

import { config } from 'dotenv';
import {
    setKey,
    shorten
} from 'goo.gl';
import {
    lookup,
    options,
    response,
    result
} from 'itunes-search';
import * as Parser from 'rss-parser';
import { resultExtended } from '../@types/parse/main';
import { item } from '../@types/stream/main';
const handlerRss = new Parser();

config();

setKey(process.env.GOOGLE_KEY);

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

    if (undefined !== id && 'number' === typeof(id) && undefined !== lanCode && 'string' === typeof(lanCode)) {
        lookup({ country: lanCode.split('-')[1], ...options}, (err: Error, data: response) => {
            if (err) {
                reject('Something wrong occurred with search.');
            } else {
                handlerRss.parseURL(data.results[0].feedUrl).then((parsed) => {
                    shorten(linkEpisode(parsed.items[0])).then(short => {
                        resolve({
                            link: short,
                            ...data.results[0]
                        });
                    }).catch((error) => {
                        throw(error);
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    } else {
        reject('Wrong argument.');
    }
});
