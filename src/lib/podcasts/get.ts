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

export const searchPodcast = async (searchOptions): Promise<Array<result>> =>
new Promise((resolve: (searchResult: Array<result>) => void, reject: (error: Array<result>) => void) => {
    search({ ...defaultOptions, ...searchOptions }, (err: string, data: response) => {
        if (err) {
            console.error(new Error(err));

            reject([]);
        } if (0 === data.resultCount) {
            reject([]);            
        }

        resolve(data.results);
    });
});

export const lookupPodcast = (searchOptions): Promise<Array<result>> =>
new Promise((resolve: (searchResult: Array<result>) => void, reject: (error) => void) => {
    lookup({ limit: 1, ...defaultOptions, ...searchOptions }, (err: string, data: response) => {
        if (err) {
            console.error(new Error(err));

            reject([]);
        } if (0 === data.resultCount) {
            reject([]);
        }

        resolve(data.results);
    });
});
