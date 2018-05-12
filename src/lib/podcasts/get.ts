'use strict';

import { lookup, options, response, result, search } from 'itunes-search';
import * as moment from 'moment';
import { resultExtended } from '../@types/podcasts/main';
import { streamKeyboard } from '../telegram/keyboard';

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

const fetchNameEpisode = ({ rssContent }, { translate }): string => {
    if (true === rssContent.hasOwnProperty('title')) {
        return rssContent.title;
    }

    return translate('noName');
};

export const lastPodcastEpisode = ({ id, country }, { translate, rss, shortener }): Promise<resultExtended | Error> =>
new Promise(async (resolve: (data: resultExtended) => void, reject: (error: Error) => void) => {
    const podcastItunes = await lookupPodcast({ id, country }).catch(reject);
    const lastEpisode = podcastItunes[0];
    const podcastContent = await rss.parseURL(lastEpisode.feedUrl).catch(reject);
    const rssContent = podcastContent.items[0];
    const keyboard = await streamKeyboard({ rssContent, id }, { translate, shortener });

    resolve({
        name: fetchNameEpisode({ rssContent }, { translate }),
        latest: moment(lastEpisode.releaseDate).locale(country).format('Do MMMM YYYY, h:mm a'),
        keyboard,
        ...lastEpisode
    });
});
