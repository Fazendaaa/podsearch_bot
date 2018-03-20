'use strict';

/**
 * More about the non official typings for goo.gl and itunes-search can be found at: ./src/@typings/
 */
import { config } from 'dotenv';
import {
    setKey,
    shorten
} from 'goo.gl';
import { response, result } from 'itunes-search';
import * as moment from 'moment';

config();
/**
 * Set Google's API key.
 */
setKey(process.env.GOOGLE_KEY);

/**
 * This function removes the '/cmd' of the command.
 */
export const removeCmd = (cmd: string): string => {
    return (typeof cmd === 'string') ? cmd.replace(/(\/\w+)\s*/, '') : '';
};

/**
 * This function returns the formated data that will be sent to the user.
 */
const mask = (data: result, itunes: string, rss: string, latest: string): string => {
    return `[\u200B](${data.artworkUrl600})**Name**: ${data.artistName}\nCountry: ${data.country}
Genre: ${data.primaryGenreName}\n# Episodes: ${data.trackCount}\nLastest Episode: ${latest}\nRSS: ${rss}
iTunes: ${itunes}`;
};

/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
export const parseResponse = (element: response): Promise<string> => new Promise((resolve, reject) => {
    if (undefined !== element && element.hasOwnProperty('results')) {
        const data: result = element.results[0] || undefined;
        const srcRss: string = data.feedUrl || undefined;

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
        } else {
            shorten(srcRss).then((rss: string) => {
                const srcItunes: string = data.collectionViewUrl || undefined;

                shorten(srcItunes).then((itunes: string) => {
                    const latest: string = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a') || undefined;

                    resolve(mask(data, itunes, rss, latest));
                }).catch((error: string) => {
                    reject('Has no iTunes link available.');
                });
            }).catch((error: string) => {
                reject('Has no RSS link available.');
            });
        }

    } else {
        reject('Wrong argument');
    }
});
