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
import { resolve } from 'path';
import { telegramInline } from 'telegraf';

/**
 * Allows the code to run without passing the environment variables as arguments.
 */
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
    translationFolder: resolve(__dirname, '../locales'),
    locales: ['en', 'pt']
});

/**
 * This will be only used locally, but there's need to exported to be tested later.
 */
export type resultExtended = {
    wrapperType?: string;
    kind?: string;
    collectionId?: number;
    trackId?: number;
    artistName?: string;
    collectionName?: string;
    trackName?: string;
    collectionCensoredName?: string;
    trackCensoredName?: string;
    collectionArtistId?: number;
    collectionArtistViewUrl?: string;
    collectionViewUrl?: string;
    feedUrl?: string;
    trackViewUrl?: string;
    previewUrl?: string;
    artworkUrl30?: string;
    artworkUrl60?: string;
    artworkUrl100?: string;
    artworkUrl600?: string;
    collectionPrice?: number;
    trackPrice?: number;
    trackRentalPrice?: number;
    collectionHdPrice?: number;
    trackHdPrice?: number;
    trackHdRentalPrice?: number;
    releaseDate?: string;
    collectionExplicitness?: string;
    trackExplicitness?: string;
    discCount?: number;
    discNumber?: number;
    trackCount?: number;
    trackNumber?: number;
    trackTimeMillis?: number;
    country?: string;
    currency?: string;
    primaryGenreName?: string;
    contentAdvisoryRating?: string;
    shortDescription?: string;
    longDescription?: string;
    hasITunesExtras?: boolean;
    genreIds?: Array<string>;
    genres?: Array<string> | string;
    itunes?: string;
    rss?: string;
    latest?: string;
    lanCode?: string;
};

/**
 * This function removes the '/cmd' of the command.
 */
export const removeCmd = (cmd: string): string => {
    return (undefined !== cmd && 'string' === typeof cmd) ? cmd.replace(/(\/\w+)\s*/, '') : undefined;
};

/**
 * "Handles" all the query input so this way even whether or not a user sends an sticker, that won't be parsed.
 */
export const messageToString = (message: string): string => {
    return (undefined !== message && 'string' === typeof message) ?
    Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
    undefined;
};

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
        latest: data.latest
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
        }

        returnValue = {
            id: `${data.trackId}`,
            title: data.artistName,
            type: 'article',
            input_message_content: {
                message_text: i18n.api(data.lanCode).t('mask', data),
                parse_mode: 'Markdown'
            },
            description: hasGenres(<Array<string>> data.genres),
            thumb_url: preview
        };
    }

    return returnValue;
};

/**
 * This  function takes an result a then returns it with the shortened links about it and it latest episode release in a
 * readable way.
 * This will be only used locally, but there's need to exported to be tested later.
 */
export const shortenLinks = (data: result): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    if (undefined !== data) {
        shorten(data.feedUrl).then((rss: string) => {
            shorten(data.collectionViewUrl).then((itunes: string) => {
                /**
                 * There  is  no  need  to  check  whether or not releaseDate exists because the caller function already
                 * verified this. That being said, if releaseDate is undefined, moment will return the current OS date.
                 */
                const latest: string = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a');

                if (undefined === latest) {
                    reject('Error occurred while converting date.');
                } else {
                    resolve({ ...data, itunes, rss, latest });
                }
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
export const parse = (data: response): Promise<Array<resultExtended>> =>
new Promise((resolve: (data: Array<resultExtended>) => void, reject: (error: string) => void) => {
    if (undefined !== data && 0 < data.resultCount && undefined !== data.results) {
        /**
         * Some  data  info  comes  incomplete,  this  could  mean  an error later on the process; that's why it must be
         * filtered right here, to avoid it.
         */
        const filtered: Array<result> = data.results.filter(hasItAll);

        if (0 < filtered.length) {
            Promise.all(filtered.map((element: result) => {
                return shortenLinks(element).catch((error: string) => {
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
 * user.  Only  takes  it  the  first  searched  response  because  it  is  a chat with the bot, maybe later when wit.ai
 * integration is implemented, the user can give some feedback and polishing more the search.
 */
export const parseResponse = (data: response): Promise<resultExtended> =>
new Promise((resolve: (data: resultExtended) => void, reject: (error: string) => void) => {
    parse(data).then((results: Array<resultExtended>) => {
        resolve(maskResponse(results[0]));
    }).catch((error: string) => {
        reject(error);
    });
});

/**
 * Parse it the data for the inline mode of search.
 */
export const parseResponseInline = (data: response, lanCode: string): Promise<Array<telegramInline>> =>
new Promise((resolve: (data: Array<telegramInline>) => void, reject: (error: string) => void) => {
    if (undefined !== lanCode && 'string' === typeof lanCode) {
        /**
         * Removing the country from the language option.
         */
        const lang = lanCode.split('-')[0];

        parse(data).then((results: Array<resultExtended>) => {
            const parsed: Array<telegramInline> = results.map((element: resultExtended) => {
                return maskResponseInline({ ...element, lanCode: lang });
            });

            resolve(parsed);
        }).catch((error: string) => {
            reject(error);
        });
    } else {
        reject('No lanCode available.');
    }
});

/**
 * Just an error message to be sent to the user in case of failed search.
 */
export const errorInline = (lanCode: string): Array<telegramInline> => {
    let returnValue: Array<telegramInline> = undefined;
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof(lanCode)) {
        lang = lanCode.split('-')[0];

        returnValue = [{
            id: '0',
            title: 'Error',
            type: 'article',
            input_message_content: {
                message_text: i18n.api(lang).t('errorInlineMessage'),
                parse_mode: 'Markdown'
            },
            description: i18n.api(lang).t('errorInlineDescription'),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
        }];
    }

    return returnValue;
};

/**
 * Just a search message to be sent to the user in case of an empty search query.
 */
export const searchInline = (lanCode: string): Array<telegramInline> => {
    let returnValue: Array<telegramInline> = undefined;
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof(lanCode)) {
        lang = lanCode.split('-')[0];

        returnValue = [{
            id: '0',
            title: 'Search Podcasts',
            type: 'article',
            input_message_content: {
                message_text: i18n.api(lang).t('searchInlineMessage'),
                parse_mode: 'Markdown'
            },
            description: i18n.api(lang).t('searchInlineDescription'),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
        }];
    }

    return returnValue;
};
