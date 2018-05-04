'use strict';

import { lookup, options, response, result, search } from 'itunes-search';

/**
 * Explicit  is  set  to  not  be  available because of the App Store policies of non explicit content for non registers
 * third-parties  app.  Was  decided  to  not  shown  then since Telegram had some fights in the past about this kind of
 * content.
 */
const defaultOptions: options = {
    media: 'podcast',
    entity: 'podcast',
    explicit: 'No'
};

export const searchPodcast = async (searchOptions): Promise<Array<result> | Error> =>
new Promise((resolve: (searchResult: Array<result>) => void, reject: (error: Error) => void) => {
    search({ defaultOptions, ...searchOptions }, (err: string, data: results) => {
        if (err || 0 === data.resultCount) {
            reject(new Error(err));
        }

        resolve(data.results);
    });
});

export const lookupPodcast = (searchOptions): Promise<result | Error> =>
new Promise((resolve: (searchResult: result) => void, reject: (error: Error) => void) => {
    lookup({ defaultOptions, limit: 1, ...searchOptions }, (err: string, data: response) => {
        if (err || 0 === data.resultCount) {
            reject(new Error(err));
        }

        resolve(data.results[0]);
    });
});
