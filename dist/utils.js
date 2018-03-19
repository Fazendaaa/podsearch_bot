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
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
exports.parseResponse = (element) => new Promise((resolve, reject) => {
    if (element.hasOwnProperty('results')) {
        const data = element.results[0] || undefined;
        const srcRss = data.feedUrl || '';
        goo_gl_1.shorten(srcRss).then((rss) => {
            const srcItunes = data.collectionViewUrl || '';
            goo_gl_1.shorten(srcItunes).then((itunes) => {
                const latest = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a') || '';
                resolve(`[\u200B](${data.artworkUrl600})**Name**: ${data.artistName}\nCountry: ${data.country}
Genre: ${data.primaryGenreName}\n# Episodes: ${data.trackCount}\nLastest Episode: ${latest}\nRSS: ${rss}
iTunes: ${itunes}`);
            }).catch((error) => {
                throw (error);
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject('Wrong argument');
    }
});
//# sourceMappingURL=utils.js.map