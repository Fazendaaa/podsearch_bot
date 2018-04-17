'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const extra = require('telegraf').Extra;
exports.hasGenres = (genres) => {
    let returnValue = undefined;
    if (undefined !== genres) {
        if (1 < genres.length) {
            returnValue = genres.reduce((accumulator, current) => {
                return `${accumulator} | ${current}`;
            });
        }
        else {
            returnValue = genres[0];
        }
    }
    return returnValue;
};
exports.hasItAll = (data) => {
    let returnValue = false;
    if (undefined !== data &&
        undefined !== data.releaseDate && (undefined !== data.artworkUrl60 ||
        undefined !== data.artworkUrl100) &&
        undefined !== data.artworkUrl600 &&
        undefined !== data.artistName &&
        undefined !== data.country &&
        undefined !== data.trackCount &&
        undefined !== data.feedUrl &&
        undefined !== data.genres &&
        undefined !== data.collectionViewUrl) {
        returnValue = true;
    }
    return returnValue;
};
exports.maskResponse = (data) => {
    return (undefined !== data) ? {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        collectionName: data.collectionName,
        genres: exports.hasGenres(data.genres),
        trackCount: data.trackCount,
        itunes: data.itunes,
        rss: data.rss,
        latest: data.latest,
        keyboard: data.keyboard,
        trackId: data.trackId,
        collectionId: data.collectionId
    } : undefined;
};
exports.maskResponseInline = (data, i18n) => {
    let returnValue = undefined;
    let preview = 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png';
    if (undefined !== data) {
        if (undefined !== data.artworkUrl60) {
            preview = data.artworkUrl60;
        }
        else if (undefined !== data.artworkUrl100) {
            preview = data.artworkUrl100;
        }
        else if (undefined !== data.artworkUrl600) {
            preview = data.artworkUrl600;
        }
        else {
            data.artworkUrl600 = preview;
        }
        returnValue = {
            id: `${data.trackId}`,
            title: data.artistName,
            type: 'article',
            input_message_content: {
                message_text: i18n().t('mask', data, data.lanCode),
                parse_mode: 'Markdown'
            },
            reply_markup: data.keyboard.reply_markup,
            description: exports.hasGenres(data.genres),
            thumb_url: preview
        };
    }
    return returnValue;
};
exports.shortenLinks = (data, shortener) => new Promise((resolve, reject) => {
    if (undefined !== data) {
        shortener(data.feedUrl, (rss) => {
            if ('' === rss) {
                reject('Has no RSS link available.');
            }
            else {
                shortener(data.collectionViewUrl, (itunes) => {
                    if ('' === itunes) {
                        reject('Has no iTunes link available.');
                    }
                    else {
                        resolve(Object.assign({}, data, { itunes, rss }));
                    }
                });
            }
        });
    }
    else {
        reject('Wrong argument.');
    }
});
exports.parse = (data, lanCode, maskFunction, shortener, i18n) => new Promise((resolve, reject) => {
    let filtered = undefined;
    let latest = undefined;
    let keyboard = undefined;
    let podcastId = undefined;
    let buttons = undefined;
    if (undefined !== data && 0 < data.resultCount && undefined !== data.results && undefined !== lanCode &&
        'string' === typeof (lanCode) && undefined !== maskFunction && 'function' === typeof (maskFunction) &&
        undefined !== shortener && 'function' === typeof (shortener) && undefined !== i18n && 'function' === typeof (i18n)) {
        filtered = data.results.filter(exports.hasItAll);
        if (0 < filtered.length) {
            Promise.all(filtered.map((element) => {
                return exports.shortenLinks(element, shortener).then((shortened) => {
                    latest = moment(shortened.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
                    podcastId = shortened.collectionId || shortened.trackId;
                    buttons = i18n().t('card', {}, lanCode.split('-')[0]);
                    keyboard = extra.markdown().markup((m) => {
                        return m.inlineKeyboard([
                            m.callbackButton(buttons[0], `subscribe/${podcastId}`),
                            { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
                        ]);
                    });
                    return maskFunction(Object.assign({}, shortened, { latest, keyboard, lanCode: lanCode.split('-')[0] }), i18n);
                }).catch((error) => {
                    throw error;
                });
            })).then((parsed) => {
                resolve(parsed);
            }).catch((error) => {
                reject(error);
            });
        }
        else {
            reject('No complete info in the results results to display it.');
        }
    }
    else {
        reject('Wrong argument.');
    }
});
exports.parseResponse = (data, lanCode, shortener, i18n, position = 0) => new Promise((resolve, reject) => {
    exports.parse(data, lanCode, exports.maskResponse, shortener, i18n).then((results) => {
        resolve(results[position]);
    }).catch((error) => {
        reject(error);
    });
});
exports.parseResponseInline = (data, lanCode, shortener, i18n) => new Promise((resolve, reject) => {
    exports.parse(data, lanCode, exports.maskResponseInline, shortener, i18n).then((parsed) => {
        resolve(parsed);
    }).catch((error) => {
        reject(error);
    });
});
//# sourceMappingURL=parse.js.map