/**
 * "Stream" the podcast through Telegram built-in browser.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const i18n_node_yaml = require("i18n-node-yaml");
const itunes_search_1 = require("itunes-search");
const path_1 = require("path");
const Parser = require("rss-parser");
const extra = require('telegraf').Extra;
/**
 * RSS fetcher.
 */
const handlerRss = new Parser();
dotenv_1.config();
goo_gl_1.setKey(process.env.GOOGLE_KEY);
const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: path_1.join(__dirname, '../../locales'),
    locales: ['en', 'pt']
});
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
    const options = {
        id: id,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    let keyboard = undefined;
    let link = undefined;
    let country = undefined;
    let language = undefined;
    if (undefined !== id && 'number' === typeof (id) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        language = lanCode.split('-')[0];
        country = lanCode.split('-')[1];
        itunes_search_1.lookup(Object.assign({ country }, options), (err, data) => {
            if (err || 0 === data.resultCount) {
                reject('Something wrong occurred with search.');
            }
            else {
                handlerRss.parseURL(data.results[0].feedUrl).then((parsed) => {
                    link = exports.linkEpisode(parsed.items[0]);
                    /**
                     * Verifies if the link is one of the know objects value then parse it.
                     */
                    if (undefined !== link) {
                        goo_gl_1.shorten(link).then((short) => {
                            keyboard = extra.markdown().markup((m) => {
                                return m.inlineKeyboard([
                                    m.callbackButton(i18n.api().t('subscribe', {}, language), `subscribe/${id}`),
                                    { text: i18n.api().t('listen', {}, language), url: short }
                                ]);
                            });
                            resolve(Object.assign({ keyboard }, data.results[0]));
                        }).catch((error) => {
                            throw (error);
                        });
                        /**
                         * If not, the user will be notified and asked to report it to improve linkEpisode.
                         */
                    }
                    else {
                        keyboard = extra.markdown().markup((m) => {
                            return m.inlineKeyboard([
                                m.callbackButton(i18n.api().t('subscribe', {}, language), `subscribe/${id}`),
                                m.callbackButton(i18n.api().t('listen', {}, language), `episode/notAvailable/${id}`)
                            ]);
                        });
                        resolve(Object.assign({ keyboard }, data.results[0]));
                    }
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