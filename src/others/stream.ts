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
const handlerRss = new Parser();

config();

/**
 * Set Google's API key.
 */
setKey(process.env.GOOGLE_KEY);

/**
 * Fetch the last podcast episode.
 */
export const lastEpisode = (id: number): Promise<string> =>
new Promise((resolve: (data: string) => void, reject: (error: string) => void) => {
    if (undefined !== id && 'number' === typeof(id)) {
        /**
         * There's  no  need  of  passing  country or any lang options since only the Podcast's URL is important in this
         * case.
         */
        const options = {
            id: id,
            media: 'podcast',
            entity: 'podcast',
            explicit: 'No',
            limit: 1
        };

        lookup(options, (err: Error, data: response) => {
            handlerRss.parseURL(data.results[0].feedUrl).then((parsed) => {
                shorten(parsed.items[0].guid).then(short => {
                    resolve(short);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    } else {
        reject('Something wrong occurred.');
    }
});
