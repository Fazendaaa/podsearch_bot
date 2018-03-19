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
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
export const parseResponse = (element: response): Promise<string> => new Promise((resolve, reject) => {
    if (element.hasOwnProperty('results')) {
        const data: result = element.results[0] || undefined;
        const srcRss: string = data.feedUrl || '';

        shorten(srcRss).then((rss: string) => {
            const srcItunes: string = data.collectionViewUrl || '';

            shorten(srcItunes).then((itunes: string) => {
                const latest: string = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a') || '';

                resolve(`[\u200B](${data.artworkUrl600})**Name**: ${data.artistName}\nCountry: ${data.country}
Genre: ${data.primaryGenreName}\n# Episodes: ${data.trackCount}\nLastest Episode: ${latest}\nRSS: ${rss}
iTunes: ${itunes}`);
            }).catch((error: string) => {
                throw(error);
            });
        }).catch((error: string) => {
            reject(error);
        });
    } else {
        reject('Wrong argument');
    }
});
