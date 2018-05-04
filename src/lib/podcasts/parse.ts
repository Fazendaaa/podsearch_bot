'use strict';

import { response, result } from 'itunes-search';
import * as moment from 'moment';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { resultExtended } from '../../@types/parse/main';
import { maskResponse, maskResponseInline } from './mask';
const extra = require('telegraf').Extra;

const hasItAll = (data: result): boolean => {
    const properties = ['releaseDate', 'artistName', 'country', 'trackCount', 'feedUrl', 'genres', 'collectionViewUrl',
    'artworkUrl60', 'artworkUrl100', 'artworkUrl600'];

    properties.map((element: string) => {
        if (undefined == data.hasOwnProperty(element)) {
            return false;
        }
    });

    return true;
};

const shortenLinks = (data: result, shortener: Function): Promise<resultExtended> =>
new Promise(async (resolve: (response: resultExtended) => void, reject: (error: string) => void) => {
    const rss = await shortener(data.feedUrl).catch(reject('Has no RSS link available.'));
    const itunes = await shortener(data.collectionViewUrl).catch(reject('Has no iTunes link available.'));

    resolve({ ...data, itunes, rss });
});

const parseMap = (shortened: resultExtended, lanCode: string, i18n: api, maskFunction: Function) => {
    const latest = moment(shortened.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
    const podcastId = shortened.collectionId || shortened.trackId;
    const buttons = <Array<string>> i18n().t('card', {}, lanCode.split('-')[0]);
    const keyboard = extra.markdown().markup((m: any) => {
        return m.inlineKeyboard([
            m.callbackButton(buttons[0], `subscribe/${podcastId}`),
            { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
        ]);
    });

    return maskFunction({ ...shortened, latest, keyboard, lanCode: lanCode.split('-')[0] }, i18n);
};

type parseParameters = {
    podcasts;
    position?: number;
};

type parseFunctions = {
    maskFunction: Function;
    shortener: Function;
    translate: Function;
};

const parsePodcast = async ({ podcasts, position }: parseParameters, { maskFunction, shortener, translate }: parseFunctions) => {
    if (undefined == podcasts ) {
        return new TypeError('Wrong argument.');
    }

    const filtered = podcasts.results.filter(hasItAll);

    if (0 === filtered.length) {
        return new Error('No complete info in the results results to display it.');
    }

    return await Promise.all(filtered.map((element: result) => {
        return shortenLinks(element, shortener).then((shortened: resultExtended) => {
            return parseMap(shortened, lanCode, i18n, maskFunction);
        }).catch((error: Error) => {
            throw error;
        });
    });
};

export const parsePodcastCommand = async ({ podcasts, position = 0 }, { shortener, translate }) => {
    /**
     * It doesn't simply returns the result because that would mean  the "then" would be unnecessary, meaning that would
     * be removable but the catch would not be returned.
     */
    return await parsePodcast({ podcasts, position }, { shortener, translate, maskFunction: maskResponse })
    .then((results: Array<resultExtended>) => {
        return results[position];
    });
};

export const parsePodcastInline = async ({ podcasts }, { shortener, translate }) => {
    return await parsePodcast({ podcasts }, { shortener, translate, maskFunction: maskResponseInline });
};
