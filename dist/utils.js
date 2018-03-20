'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * More about the non official typings for goo.gl and itunes-search can be found at: ./src/@typings/
 */
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const moment = require("moment");
dotenv_1.config();
/**
 * Set Google's API key.
 */
goo_gl_1.setKey(process.env.GOOGLE_KEY);
/**
 * This function removes the '/cmd' of the command.
 */
exports.removeCmd = (cmd) => {
    return (typeof cmd === 'string') ? cmd.replace(/(\/\w+)\s*/, '') : '';
};
/**
 * This function returns the formated data that will be sent to the user.
 */
const mask = (data, itunes, rss, latest) => {
    return `[\u200B](${data.artworkUrl600})**Name**: ${data.artistName}\nCountry: ${data.country}
Genre: ${data.primaryGenreName}\n# Episodes: ${data.trackCount}\nLastest Episode: ${latest}\nRSS: ${rss}
iTunes: ${itunes}`;
};
/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
exports.parseResponse = (element) => new Promise((resolve, reject) => {
    if (undefined !== element && element.hasOwnProperty('results')) {
        const data = element.results[0] || undefined;
        const srcRss = data.feedUrl || undefined;
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        }
        else if (undefined === data.artworkUrl600) {
            reject('Has no podcast artwork.');
        }
        else if (undefined === data.artistName) {
            reject('Has no name.');
        }
        else if (undefined === data.country) {
            reject('Has no country.');
        }
        else if (undefined === data.primaryGenreName) {
            reject('Has no genre.');
        }
        else if (undefined === data.trackCount) {
            reject('Has no number of episodes.');
        }
        else {
            goo_gl_1.shorten(srcRss).then((rss) => {
                const srcItunes = data.collectionViewUrl || undefined;
                goo_gl_1.shorten(srcItunes).then((itunes) => {
                    const latest = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a') || undefined;
                    resolve(mask(data, itunes, rss, latest));
                }).catch((error) => {
                    reject('Has no iTunes link available.');
                });
            }).catch((error) => {
                reject('Has no RSS link available.');
            });
        }
    }
    else {
        reject('Wrong argument');
    }
});
//# sourceMappingURL=utils.js.map