/**
 * Handling  functions  that  does  parsing  and  checking  of  data. More about the non official typings for goo.gl and
 * itunes-search can be found at: ./src/@typings/
 */
'use strict';

import { config } from 'dotenv';
import {
    setKey,
    shorten
} from 'goo.gl';
import * as i18n_node_yaml from 'i18n-node-yaml';
import {
    response,
    result
} from 'itunes-search';
import * as moment from 'moment';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { resultExtended } from '../@types/parse/main';
const extra = require('telegraf').Extra;

config();

/**
 * Set Google's API key.
 */
setKey(process.env.GOOGLE_KEY);

/**
 * Configure internationalization options.
 */
const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: join(__dirname, '../../locales'),
    locales: ['en', 'pt']
});

/**
 * Just concatenate genres.
 * This will be only used locally, but there's need to exported to be tested later.
 */
export const hasGenres = (genres: Array<string>): string => {
    let returnValue: string = undefined;

    if (undefined !== genres) {
        if (1 < genres.length) {
            returnValue = genres.reduce((accumulator, current) => {
                return `${accumulator} | ${current}`;
            });
        } else {
            returnValue = genres[0];
        }
    }

    return returnValue;
};

/**
 * Verify whether or not an iTunes response has all of the needed data to the bot.
 */
export const hasItAll = (data: result): boolean => {
    let returnValue: boolean = false;

    if (undefined !== data &&
        undefined !== data.releaseDate && (
        /**
         * Why not both? Because only one is needed to an inline preview.
         */
            undefined !== data.artworkUrl60 ||
            undefined !== data.artworkUrl100
        ) &&
        undefined !== data.artworkUrl600 &&
        undefined !== data.artistName &&
        undefined !== data.country &&
        undefined !== data.trackCount &&
        undefined !== data.feedUrl &&
        undefined !== data.genres &&
        undefined !== data.collectionViewUrl) {
        returnValue = true;
    }

    return returnValue;
};

/**
 * This function returns the formated data that will be sent to the user.
 * This will be only used locally, but there's need to exported to be tested later.
 */
export const maskResponse = (data: resultExtended): resultExtended => {
    return (undefined !== data) ? {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        /**
         * Just remember the good old days of C lang with its casting.
         */
        genres: hasGenres(<Array<string>> data.genres),
        trackCount: data.trackCount,
        itunes: data.itunes,
        rss: data.rss,
        latest: data.latest,
        keyboard: data.keyboard,
        trackId: data.trackId,
        collectionId: data.collectionId
    } : undefined;
};

/**
 * Returns the formated data that will be showed to the user.
 * This will be only used locally, but there's need to exported to be tested later.
 */
export const maskResponseInline = (data: resultExtended): telegramInline => {
    let returnValue: telegramInline = undefined;
    let preview: string = 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png';

    if (undefined !== data) {
        /**
         * It  takes  the  "lowest"  resolution  image  as  inline  thumbnail  --  the  real  one of the lowest would be
         * artworkUrl30 however, this one has a really low resolution, so the minimum expected has to be artworkUrl60.
         */
        if (undefined !== data.artworkUrl60) {
            preview = data.artworkUrl60;
        } else if (undefined !== data.artworkUrl100) {
            preview = data.artworkUrl100;
        } else if (undefined !== data.artworkUrl600) {
            preview = data.artworkUrl600;
        /**
         * If  this  else is being called id because artworkUrl600 is not available, in that case, one must be set to be
         * presented to the user at message.
         */
        } else {
            data.artworkUrl600 = preview;
        }

        returnValue = {
            id: `${data.trackId}`,
            title: data.artistName,
            type: 'article',
            input_message_content: {
                message_text: i18n.api().t('mask', data, data.lanCode),
                parse_mode: 'Markdown'
            },
            reply_markup: data.keyboard.reply_markup,
            description: hasGenres(<Array<string>> data.genres),
            thumb_url: preview
        };
    }

    return returnValue;
};

/**
 * This function takes an result a then returns it with the shortened links about it.
 */
export const shortenLinks = (data: result): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    if (undefined !== data) {
        shorten(data.feedUrl).then((rss: string) => {
            shorten(data.collectionViewUrl).then((itunes: string) => {
                resolve({ ...data, itunes, rss });
            }).catch((error: string) => {
                reject('Has no iTunes link available.');
            });
        }).catch((error: string) => {
            reject('Has no RSS link available.');
        });
    } else {
        reject('Wrong argument.');
    }
});

/**
 * Parsing data.
 */
export const parse = (data: response, lanCode: string, maskFunction: Function): Promise<Array<resultExtended | telegramInline>> =>
new Promise((resolve: (data: Array<resultExtended | telegramInline>) => void, reject: (error: string) => void) => {
    let filtered: Array<result> = undefined;
    let latest: string = undefined;
    let keyboard: any = undefined;
    let podcastId: number = undefined;
    let buttons: Array<string> = undefined;

    if (undefined !== data && 0 < data.resultCount && undefined !== data.results && undefined !== lanCode &&
        'string' === typeof (lanCode) && undefined !== maskFunction && 'function' === typeof(maskFunction)) {
        /**
         * Some  data  info  comes  incomplete,  this  could  mean  an error later on the process; that's why it must be
         * filtered right here, to avoid it.
         */
        filtered = data.results.filter(hasItAll);

        if (0 < filtered.length) {
            Promise.all(filtered.map((element: result) => {
                return shortenLinks(element).then((shortened: resultExtended) => {
                    /**
                     * There  is  no need to check whether or not releaseDate exists because the caller function already
                     * verified  this.  That  being said, if releaseDate is undefined, moment will return the current OS
                     * date.
                     */
                    latest = moment(shortened.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
                    /**
                     * Why worry about the collectionId and trackId? Because the in the case, I know that probably won't
                     * happen ever -- but, "just in case" --, if any of it don't happen to be available, that would mean
                     * a simple "double check".
                     */
                    podcastId = shortened.collectionId || shortened.trackId;
                    /**
                     * The "subscribe/podcastID" will be used for subscribing to episodes notifications upon release.
                     */
                    buttons = i18n.api().t('card', {}, lanCode.split('-')[0]);
                    keyboard = extra.markdown().markup((m: any) => {
                        return m.inlineKeyboard([
                            m.callbackButton(buttons[0], `subscribe/${podcastId}`),
                            { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
                        ]);
                    });

                    /**
                     * Striping the country option from lanCode.
                     */
                    return maskFunction({ ...shortened, latest, keyboard, lanCode: lanCode.split('-')[0] });
                }).catch((error: string) => {
                    throw error;
                });
            })).then((parsed: Array<resultExtended>) => {
                resolve(parsed);
            }).catch((error: string) => {
                reject(error);
            });
        } else {
            reject('No complete info in the results results to display it.');
        }
    } else {
        reject('Empty results.');
    }
});

/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user. Only takes it the first searched response because it is a command.
 */
export const parseResponse = (data: response, lanCode: string, position: number=0): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    parse(data, lanCode, maskResponse).then((results: Array<resultExtended>) => {
        resolve(results[position]);
    }).catch((error: string) => {
        reject(error);
    });
});

/**
 * Parse it the data for the inline mode of search.
 */
export const parseResponseInline = (data: response, lanCode: string): Promise<Array<telegramInline>> =>
new Promise((resolve: (data: Array<telegramInline>) => void, reject: (error: string) => void) => {
    parse(data, lanCode, maskResponseInline).then((parsed: Array<telegramInline>) => {
        resolve(parsed);
    }).catch((error: string) => {
        reject(error);
    });
});
