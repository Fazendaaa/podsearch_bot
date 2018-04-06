/**
 * "Stream" the podcast through Telegram built-in browser.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const itunes_search_1 = require("itunes-search");
const Parser = require("rss-parser");
const handlerRss = new Parser();
dotenv_1.config();
/**
 * Set Google's API key.
 */
goo_gl_1.setKey(process.env.GOOGLE_KEY);
/**
 * Fetch the last podcast episode.
 */
exports.lastEpisode = (id) => new Promise((resolve, reject) => {
    if (undefined !== id && 'number' === typeof (id)) {
        /**
         * There's  no  need  of  passing  country or any lang options since only the Podcast's URL is important in this
         * case.
         */
        const options = {
            id: id,
            media: 'podcast',
            entity: 'podcast',
            explicit: 'No',
            limit: 1
        };
        itunes_search_1.lookup(options, (err, data) => {
            handlerRss.parseURL(data.results[0].feedUrl).then((parsed) => {
                goo_gl_1.shorten(parsed.items[0].guid).then(short => {
                    resolve(short);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
    else {
        reject('Something wrong occurred.');
    }
});
//# sourceMappingURL=stream.js.map