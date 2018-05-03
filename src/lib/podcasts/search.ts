/**
 * Explicit  is  set  to  not  be  available because of the App Store policies of non explicit content for non registers
 * third-parties  app.  Was  decided  to  not  shown  then since Telegram had some fights in the past about this kind of
 * content.
 */
'use strict';

import { lookup, options, response, result, search } from 'itunes-search';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { resultExtended } from '../@types/parse/main';
import { parsePodcastCommand, parsePodcastInline } from './parse';
import { arrayLoad, endInline, errorInline, messageToString, notFoundInline, removeCmd, searchInline } from './utils';

export const searchPodcast = (searchOptions): Promise<response | Error> =>
new Promise ((resolve: (searchResult: response) => void, reject: (error: Error) => void) => {
    const defaultOptions: options = {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No'
    };

    search({ defaultOptions, ...searchOptions }, (err: Error, data: response) => {
        if (err || 0 === data.resultCount) {
            reject(err);
        }

        resolve(data);
    });
});

export const lookupPodcast = (searchOptions): Promise<result | Error> =>
new Promise((resolve: (searchResult: result) => void, reject: (error: Error) => void) => {
    const defaultOptions: options = {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };

    lookup({ defaultOptions, ...searchOptions }, (err: Error, data: response) => {
        if (err || 0 === data.resultCount) {
            reject(err);
        }

        resolve(data.results[0]);
    });
});

export const searchThroughCommand = async ({ country, term }, { shortener, translate }) => {
    const podcasts = <response> await searchPodcast({ term, country, limit: 1 }).catch(console.error);

    return await parsePodcastCommand(podcasts, shortener, translate).then((parsed) => {
        return { text: translate('mask', parsed), keyboard: parsed.keyboard};
    }).catch((error: string) => {
        console.error(error);

        return { text: translate('noResult', { term }), keyboard: null };
    });
};

/**
 * "Pseudo-pagination", since iTunes API doesn't allow it true pagination.
 */
const paginatingPodcasts = ({ podcasts, offset, pageLimit }, { shortener, translate }) => {
    podcasts.results = podcasts.results.slice(offset, offset + pageLimit);

    if (0 === podcasts.results.length) {
        return [ endInline(translate) ];
    }

    return parsePodcastInline(podcasts, shortener, translate).catch((error: Error) => {
        return [ searchInline(translate) ];
    });
};

export const searchThroughInline = async ({ country, term, offset, pageLimit }, { shortener, translate }) => {
    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if ('' === term) {
        return [ searchInline(translate) ];
    }

    return await searchPodcast({ term, country, limit: offset + pageLimit }).then((podcasts) => {
        return paginatingPodcasts({ podcasts, offset, pageLimit }, { shortener, translate });
    }).catch((error: Error) => {
        console.error(error);

        return [ errorInline(translate) ];
    });
};
