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
exports.lastEpisode = (id, lanCode) => new Promise((resolve, reject) => {
    let options = undefined;
    if (undefined !== id && 'number' === typeof (id) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        options = {
            id: id,
            media: 'podcast',
            entity: 'podcast',
            explicit: 'No',
            country: lanCode.split('-')[1],
            limit: 1
        };
        itunes_search_1.lookup(options, (err, data) => {
            if (err) {
                reject('Something wrong occurred with search.');
            }
            else {
                handlerRss.parseURL(data.results[0].feedUrl).then((parsed) => {
                    goo_gl_1.shorten(exports.linkEpisode(parsed.items[0])).then(short => {
                        resolve(Object.assign({ link: short }, data.results[0]));
                    }).catch((error) => {
                        throw (error);
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }
    else {
        reject('Wrong argument.');
    }
});
//# sourceMappingURL=stream.js.map