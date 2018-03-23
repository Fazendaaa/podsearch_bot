'use strict';

/**
 * More about the non official typings for goo.gl and itunes-search can be found at: ./src/@typings/
 */
import { config } from 'dotenv';
import {
    setKey,
    shorten
} from 'goo.gl';
import {
    response,
    result
} from 'itunes-search';
import * as moment from 'moment';

config();
/**
 * Set Google's API key.
 */
setKey(process.env.GOOGLE_KEY);

/**
 * This function removes the '/cmd' of the command.
 */
export const removeCmd = (cmd: string = ''): string => {
    return (typeof cmd === 'string') ? cmd.replace(/(\/\w+)\s*/, '') : '';
};

export const messageToString = (message: string) => {
    return Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o');;
};

/**
 * This function returns the formated data that will be sent to the user.
 */
const maskResponse = (data: result, itunes: string, rss: string, latest: string): object => {
    return {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        country: data.country,
        primaryGenreName: data.primaryGenreName,
        trackCount: data.trackCount,
        itunes,
        rss,
        latest
    };
};

/**
 * This function returns the formated data that will be sent to the user.
 */
const maskInline = (data: result, itunes: string, rss: string, latest: string): object => {
    return {
        id: `${data.trackId}`,
        title: data.artistName,
        type: 'article',
        input_message_content: {
            message_text: 'Test',
            parse_mode: 'Markdown'
        },
        description: 'test',
        thumb_url: data.trackViewUrl
    };
};

/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
export const parseResponse = (data: result): Promise<object> => new Promise((resolve: (data: object) => void, reject: (error: string) => void) => {
    if (undefined !== data) {
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        } else if (undefined === data.artworkUrl600) {
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
                        resolve(maskResponse(data, itunes, rss, latest));
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

export const parseInline = (data: result): Promise<object> => new Promise((resolve: (data: object) => void, reject: (error: string) => void) => {
    if (undefined !== data) {
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        } else if (undefined === data.artworkUrl600) {
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
                        resolve(maskInline(data, itunes, rss, latest));
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

export const errorInline = {
    id: '0',
    title: 'Error',
    type: 'article',
    input_message_content: {
        message_text: 'Error',
        parse_mode: 'Markdown'
    },
    description: 'test',
    thumb_url: 'https://developers.google.com/maps/documentation/streetview/images/error-image-generic.png'
};
