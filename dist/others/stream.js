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
 * Since RSS feed has no rule to link which parameter will be the episode link, this function handles that; fetching the
 * last episode URL.
 */
exports.linkEpisode = (rss) => {
    let link = undefined;
    if (undefined !== rss && 'object' === typeof (rss)) {
        /**
         * Even  with  guid  property,  some  cases -- particularly in Soundcloud --, are populated with tags that won't
         * return  the  proper  stream link. Just lookup to see whether or not an http -- or https -- link is available,
         * that  would  be  faster  than requesting a search through any other API to find the episode link through that
         * tags.
         */
        if (true === rss.hasOwnProperty('guid') && rss.guid.includes('http')) {
            link = rss.guid;
        }
        else if (true === rss.hasOwnProperty('link')) {
            link = rss.link;
        }
        return link;
    }
    else {
        throw (new Error('Wrong argument.'));
    }
};
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
                goo_gl_1.shorten(exports.linkEpisode(parsed.items[0])).then(short => {
                    resolve(short);
                }).catch((error) => {
                    throw (error);
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