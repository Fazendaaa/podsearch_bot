'use strict';

/**
 * More about the non official typings for goo.gl and itunes-search can be found at: ./src/@typings/
 */
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

/**
 * Allows the code to run without passing the enviroment variables as arguments.
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
 * This function removes the '/cmd' of the command.
 */
export const removeCmd = (cmd: string = ''): string => {
    return (typeof cmd === 'string') ? cmd.replace(/(\/\w+)\s*/, '') : '';
};

/**
 * "Handles" all the query input so this way even whether or not a user sends an sticker, that won't be parsed.
 */
export const messageToString = (message: string): string => {
    return Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o');
};

/**
 * This function returns the formated data that will be sent to the user.
 */
const maskResponse = (data: object): object => {
    return {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        country: data.country,
        primaryGenreName: data.primaryGenreName,
        trackCount: data.trackCount,
        itunes: data.itunes,
        rss: data.rss,
        latest: data.latest
    };
};

/**
 * Verify whether or not an iTunes response has all of the needed data to the bot.
 */
export const hasItAll = (data: result): boolean => {
    let rtnval: boolean = false;

    if (undefined !== data &&
        undefined !== data.releaseDate && (
            undefined !== data.artworkUrl30 ||
            undefined !== data.artworkUrl60 ||
            undefined !== data.artworkUrl100 ||
            undefined !== data.artworkUrl600
        ) &&
        undefined !== data.artistName &&
        undefined !== data.country &&
        undefined !== data.primaryGenreName &&
        undefined !== data.trackCount &&
        undefined !== data.feedUrl &&
        undefined !== data.collectionViewUrl) {
        rtnval = true;
    }

    return rtnval;
};

/**
 * Returns the formated data that will be showed to the user.
 */
const maskInline = (data: object): object => {
    let preview: string = 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png';

    /**
     * It  takes  the  "lowest" resolution image as inline thumbnail -- the real one of the lowest would be artworkUrl30
     * however, this one has a really low resolution, so the minimum expected has to be artworkUrl60.
     */
    if (undefined !== data.artworkUrl60) {
        preview = data.artworkUrl60;
    } else if (undefined !== data.artworkUrl100) {
        preview = data.artworkUrl100;
    } else if (undefined !== data.artworkUrl600) {
        preview = data.artworkUrl600;
    }

    /**
     * Telegram's format of inline reponse.
     */
    return {
        id: `${data.trackId}`,
        title: data.artistName,
        type: 'article',
        input_message_content: {
            message_text: i18n.api(data.lanCode).t('mask', data),
            parse_mode: 'Markdown'
        },
        description: data.shortDescription,
        thumb_url: preview
    };
};

/**
 * Lorem ipsum.
 */
const parse = (data: result): Promise<object> => new Promise((resolve: (data: object) => void, reject: (error: string) => void) => {
    if (undefined !== data) {
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        } else if (undefined === data.artworkUrl30 ||
            undefined === data.artworkUrl60 ||
            undefined === data.artworkUrl100 ||
            undefined === data.artworkUrl600
        ) {
            reject('Has no podcast artwork.');
        } else if (undefined === data.artistName) {
            reject('Has no name.');
        } else if (undefined === data.country) {
            reject('Has no country.');
        } else if (undefined === data.primaryGenreName) {
            reject('Has no genre.');
        } else if (undefined === data.trackCount) {
            reject('Has no number of episodes.');
        } else if (undefined === data.feedUrl) {
            reject('Has no number RSS link.');
        } else if (undefined === data.collectionViewUrl) {
            reject('Has no number iTunes link.');
        } else {
            shorten(data.feedUrl).then((rss: string) => {
                shorten(data.collectionViewUrl).then((itunes: string) => {
                    const latest: string = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a');

                    if (undefined === latest) {
                        reject('Error occured while converting date.');
                    } else {
                        resolve({...data, itunes, rss, latest});
                    }
                }).catch((error: string) => {
                    console.error(error);

                    reject('Has no iTunes link available.');
                });
            }).catch((error: string) => {
                console.error(error);

                reject('Has no RSS link available.');
            });
        }
    } else {
        reject('Wrong argument');
    }
});

/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
export const parseResponse = (data: result): Promise<object> => new Promise((resolve: (data: object) => void, reject: (error: string) => void) => {
    parse(data).then((result: object) => {
        resolve(maskResponse(result));
    }).catch((error: string) => {
        /**
         * Since this catch already console.error in parse function, there's no need to do it here also. Just pop up the
         * reject message for the calling function to debbug it later.
         */
        reject(error);
    });
});

/**
 * Lorem ipsum.
 */
export const parseInline = (data: result, lanCode: string): Promise<object> => new Promise((resolve: (data: object) => void, reject: (error: string) => void) => {
    parse(data).then((result: object) => {
        /**
         * In  case that the podcast has no description -- a lot of them hasn't -- just inform the user,
         * in this case doesn't pay the price thrown an reject.
         */
        if (undefined === result.shortDescription) {
            result.shortDescription = 'Has no description.';
        }

        resolve(maskInline({...result, lanCode}));
    }).catch((error: string) => {
        reject(error);
    });
});

/**
 * Just an error message to be sent to the user in case of failed search.
 */
export const errorInline = {
    id: '0',
    title: 'Error',
    type: 'article',
    input_message_content: {
        message_text: '[*Error*] Try it again later.',
        parse_mode: 'Markdown'
    },
    description: 'Something went wrong, check your typing or try it again later.',
    thumb_url: 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png'
};
