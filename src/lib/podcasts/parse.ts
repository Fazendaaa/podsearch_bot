'use strict';

import { response, result } from 'itunes-search';
import * as moment from 'moment';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { resultExtended } from '../@types/parse/main';
const extra = require('telegraf').Extra;

export const hasItAll = (data: result): boolean => {
    const properties = ['releaseDate', 'artistName', 'country', 'trackCount', 'feedUrl', 'genres', 'collectionViewUrl',
    'artworkUrl60', 'artworkUrl100', 'artworkUrl600'];

    properties.map((element: string) => {
        if (undefined == data.hasOwnProperty(element)) {
            return false;
        }
    });

    return true;
};

export const shortenLinks = (data: result, shortener: Function): Promise<resultExtended> =>
new Promise(async (resolve: (response: resultExtended) => void, reject: (error: string) => void) => {
    if (undefined == data) {
        reject('Wrong argument.');
    }

    const rss = await shortener(data.feedUrl).catch(reject('Has no RSS link available.'));
    const itunes = await shortener(data.collectionViewUrl).catch(reject('Has no iTunes link available.'));

    resolve({ ...data, itunes, rss });
});

const parseMap = (shortened: resultExtended, lanCode: string, i18n: api, maskFunction: Function) => {
    /**
     * There  is  no need to check whether or not releaseDate exists because the caller function already
     * verified  this.  That  being said, if releaseDate is undefined, moment will return the current OS
     * date.
     */
    const latest = moment(shortened.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
    /**
     * Why worry about the collectionId and trackId? Because the in the case, I know that probably won't
     * happen ever -- but, "just in case" --, if any of it don't happen to be available, that would mean
     * a simple "double check".
     */
    const podcastId = shortened.collectionId || shortened.trackId;
    /**
     * The "subscribe/podcastID" will be used for subscribing to episodes notifications upon release.
     */
    const buttons = <Array<string>>i18n().t('card', {}, lanCode.split('-')[0]);
    const keyboard = extra.markdown().markup((m: any) => {
        return m.inlineKeyboard([
            m.callbackButton(buttons[0], `subscribe/${podcastId}`),
            { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
        ]);
    });

    /**
     * Striping  the country option from lanCode. And the i18n will only be used when maskResponseInline
     * is being called.
     */
    return maskFunction({ ...shortened, latest, keyboard, lanCode: lanCode.split('-')[0] }, i18n);
};

export const parse = (data: response, lanCode: string, maskFunction: Function, shortener: Function, i18n: api): Promise<Array<resultExtended | telegramInline>> =>
new Promise((resolve: (data: Array<resultExtended | telegramInline>) => void, reject: (error: string) => void) => {
    if (undefined == data ||
        0 == data.resultCount ||
        undefined == data.results ||
        undefined == lanCode ||
        'string' !== typeof (lanCode) ||
        undefined == maskFunction ||
        'function' !== typeof(maskFunction) ||
        undefined == shortener ||
        'function' !== typeof (shortener) ||
        undefined == i18n ||
        'function' !== typeof(i18n)) {
        reject('Wrong argument.');
    }

    /**
     * Some  data  info  comes incomplete, this could mean an error later on the process; that's why it must be filtered
     * right here, to avoid it.
     */
    const filtered = data.results.filter(hasItAll);

    /**
     * The "Bad".
     */
    if (0 == filtered.length) {
        reject('No complete info in the results results to display it.');
    }

    /**
     * The "ugly":
     * it's needed to reduce iterations over the array.
     */
    Promise.all(filtered.map((element: result) => {
        return shortenLinks(element, shortener).then((shortened: resultExtended) => {
            return parseMap(shortened, lanCode, i18n, maskFunction);
        }).catch((error: string) => {
            throw error;
        });
    })).then((parsed: Array<resultExtended>) => {
        resolve(parsed);
    }).catch((error: string) => {
        reject(error);
    });
});

export const parsePodcastCommand = ({ data, position: number = 0 }, { shortener, translate }): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    parse(data, maskResponse, shortener, i18n).then((results: Array<resultExtended>) => {
        resolve(results[position]);
    }).catch((error: string) => {
        reject(error);
    });
});

export const parsePodcastInline = (data: response, shortener: Function, i18n: api): Promise<Array<telegramInline>> =>
new Promise((resolve: (data: Array<telegramInline>) => void, reject: (error: string) => void) => {
    parse(data, maskResponseInline, shortener, i18n).then((parsed: Array<telegramInline>) => {
        resolve(parsed);
    }).catch((error: string) => {
        reject(error);
    });
});
