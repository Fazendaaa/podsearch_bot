'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const itunes_search_1 = require("itunes-search");
const moment = require("moment");
const extra = require('telegraf').Extra;
exports.linkEpisode = (rss) => {
    let link = undefined;
    if (undefined !== rss && 'object' === typeof (rss)) {
        if (true === rss.hasOwnProperty('guid') && rss.guid.includes('http')) {
            link = rss.guid;
        }
        else if (true === rss.hasOwnProperty('link')) {
            link = rss.link;
        }
        else {
            link = undefined;
        }
        return link;
    }
    else {
        throw (new Error('Wrong argument.'));
    }
};
exports.nameEpisode = (rss, language, i18n) => {
    let name = undefined;
    if (undefined !== rss && 'object' === typeof (rss) && undefined !== language && 'string' === typeof (language)) {
        if (true === rss.hasOwnProperty('title')) {
            name = rss.title;
        }
        else {
            name = i18n().t('noName', {}, language);
        }
        return name;
    }
    else {
        throw (new Error('Wrong argument.'));
    }
};
exports.lastEpisode = (id, lanCode, i18n, shorten, rssFetcher) => new Promise((resolve, reject) => {
    const options = {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    let keyboard = undefined;
    let link = undefined;
    let country = undefined;
    let language = undefined;
    let name = undefined;
    let latest = undefined;
    if (undefined !== id && 'number' === typeof (id) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        language = lanCode.split('-')[0];
        country = lanCode.split('-')[1];
        itunes_search_1.lookup(Object.assign({ id, country }, options), (err, data) => {
            if (err || 0 === data.resultCount) {
                reject('Something wrong occurred with search.');
            }
            else {
                rssFetcher.parseURL(data.results[0].feedUrl).then((parsed) => {
                    link = exports.linkEpisode(parsed.items[0]);
                    name = exports.nameEpisode(parsed.items[0], language, i18n);
                    latest = moment(parsed.items[0].pubDate).locale(country).format('Do MMMM YYYY, h:mm a');
                    if (undefined !== link) {
                        shorten(link).then((short) => {
                            keyboard = extra.markdown().markup((m) => {
                                return m.inlineKeyboard([
                                    m.callbackButton(i18n().t('subscribe', {}, language), `subscribe/${id}`),
                                    { text: i18n().t('listen', {}, language), url: short }
                                ]);
                            });
                            resolve(Object.assign({ name,
                                latest,
                                keyboard }, data.results[0]));
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                    else {
                        keyboard = extra.markdown().markup((m) => {
                            return m.inlineKeyboard([
                                m.callbackButton(i18n().t('subscribe', {}, language), `subscribe/${id}`),
                                m.callbackButton(i18n().t('listen', {}, language), `episode/notAvailable/${id}`)
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