'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const itunes_search_1 = require("itunes-search");
const moment = require("moment");
const markup = require('telegraf').Markup;
const assertLastEpisode = (searchParams, functionsParams) => new Promise((resolve, reject) => {
    if (false === searchParams.hasOwnProperty('id') || 'number' !== typeof searchParams.id) {
        reject(new TypeError('searchParams has no id property of type number.'));
    }
    if (false === searchParams.hasOwnProperty('language') || 'string' !== typeof searchParams.language) {
        reject(new TypeError('searchParams has no language property of type string.'));
    }
    if (false === searchParams.hasOwnProperty('country') || 'string' !== typeof searchParams.country) {
        reject(new TypeError('searchParams has no country property of type string.'));
    }
    if (false === functionsParams.hasOwnProperty('translate') || 'function' !== typeof searchParams.translate) {
        reject(new TypeError('searchParams has no translate property of type function.'));
    }
    if (false === functionsParams.hasOwnProperty('shorten') || 'function' !== typeof searchParams.shorten) {
        reject(new TypeError('searchParams has no shorten property of type function.'));
    }
    if (false === functionsParams.hasOwnProperty('shorten') || 'function' !== typeof searchParams.fetchRss) {
        reject(new TypeError('searchParams has no shorten property of type function.'));
    }
    resolve('Ok');
});
const fetchPodcast = (searchParams) => new Promise((resolve, reject) => {
    const options = {
        id: searchParams.id,
        country: searchParams.country,
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };
    itunes_search_1.lookup(options, (err, data) => {
        if (err || 0 === data.resultCount) {
            reject(new Error('Something wrong occurred with search.'));
        }
        resolve(data.results[0]);
    });
});
const fetchLinkEpisode = (rss) => {
    if (true === rss.hasOwnProperty('guid') && rss.guid.includes('http')) {
        return rss.guid;
    }
    if (true === rss.hasOwnProperty('link')) {
        return rss.link;
    }
    throw (new Error('Undefined episode link.'));
};
const fetchNameEpisode = (searchParams, functionsParams) => {
    if (true === searchParams.lastEpisode.hasOwnProperty('title')) {
        return searchParams.lastEpisode.title;
    }
    return functionsParams.translate('noName', {}, searchParams.language);
};
const fetchKeyboard = (searchParams, functionsParams) => __awaiter(this, void 0, void 0, function* () {
    const keyboard = markup.inlineKeyboard([
        markup.callbackButton(functionsParams.translate('subscribe', {}, searchParams.language), `subscribe/${searchParams.id}`),
    ]).extra();
    let linkButton;
    try {
        linkButton = {
            text: functionsParams.translate('listen', {}, searchParams.language),
            url: yield functionsParams.shorten(fetchLinkEpisode(searchParams.lastEpisode)).catch((error) => {
                throw new Error(`Shortening error: ${error}`);
            })
        };
    }
    catch (_a) {
        linkButton = markup.callbackButton(functionsParams.translate('listen', {}, searchParams.language), `episode/notAvailable/${searchParams.id}`);
    }
    finally {
        keyboard.push(linkButton);
    }
    return keyboard;
});
exports.fetchLastEpisode = (searchParams, functionsParams) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
    yield assertLastEpisode(searchParams, functionsParams).catch(reject);
    const podcastItunes = yield fetchPodcast(searchParams).catch(reject);
    const podcastContent = yield functionsParams.fetchRss(podcastItunes.feedUrl).catch(reject);
    const lastEpisode = podcastContent.items[0];
    resolve(Object.assign({ name: fetchNameEpisode(Object.assign({ lastEpisode }, searchParams), functionsParams), latest: moment(lastEpisode.pubDate).locale(searchParams.country).format('Do MMMM YYYY, h:mm a'), keyboard: fetchKeyboard(Object.assign({ lastEpisode }, searchParams), functionsParams) }, podcastItunes));
}));
//# sourceMappingURL=stream.js.map