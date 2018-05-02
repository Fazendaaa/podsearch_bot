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
const moment = require("moment");
const extra = require('telegraf').Extra;
exports.hasGenres = (genres) => {
    if (undefined == genres) {
        throw (new TypeError('Wrong argument.'));
    }
    return genres.reduce((accumulator, current) => `${accumulator} | ${current}`);
};
exports.hasItAll = (data) => {
    if (undefined == data ||
        undefined == data.releaseDate ||
        undefined == data.artworkUrl600 ||
        undefined == data.artistName ||
        undefined == data.country ||
        undefined == data.trackCount ||
        undefined == data.feedUrl ||
        undefined == data.genres ||
        undefined == data.collectionViewUrl) {
        return false;
    }
    if (undefined == data.artworkUrl60 || undefined == data.artworkUrl100) {
        return false;
    }
    return true;
};
exports.maskResponse = (data) => {
    return {
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
    };
};
exports.maskResponseInline = (data, i18n) => {
    let preview = 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png';
    if (undefined == data) {
        throw (new TypeError('Wrong argument.'));
    }
    if (undefined != data.artworkUrl60) {
        preview = data.artworkUrl60;
    }
    else if (undefined != data.artworkUrl100) {
        preview = data.artworkUrl100;
    }
    else if (undefined != data.artworkUrl600) {
        preview = data.artworkUrl600;
    }
    else {
        data.artworkUrl600 = preview;
    }
    return {
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
};
exports.shortenLinks = (data, shortener) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
    if (undefined == data) {
        reject('Wrong argument.');
    }
    const rss = yield shortener(data.feedUrl).catch(reject('Has no RSS link available.'));
    const itunes = yield shortener(data.collectionViewUrl).catch(reject('Has no iTunes link available.'));
    resolve(Object.assign({}, data, { itunes, rss }));
}));
const parseMap = (shortened, lanCode, i18n, maskFunction) => {
    const latest = moment(shortened.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
    const podcastId = shortened.collectionId || shortened.trackId;
    const buttons = i18n().t('card', {}, lanCode.split('-')[0]);
    const keyboard = extra.markdown().markup((m) => {
        return m.inlineKeyboard([
            m.callbackButton(buttons[0], `subscribe/${podcastId}`),
            { text: buttons[1], url: `t.me/${process.env.BOT_NAME}?start=${podcastId}` }
        ]);
    });
    return maskFunction(Object.assign({}, shortened, { latest, keyboard, lanCode: lanCode.split('-')[0] }), i18n);
};
exports.parse = (data, lanCode, maskFunction, shortener, i18n) => new Promise((resolve, reject) => {
    if (undefined == data ||
        0 == data.resultCount ||
        undefined == data.results ||
        undefined == lanCode ||
        'string' !== typeof (lanCode) ||
        undefined == maskFunction ||
        'function' !== typeof (maskFunction) ||
        undefined == shortener ||
        'function' !== typeof (shortener) ||
        undefined == i18n ||
        'function' !== typeof (i18n)) {
        reject('Wrong argument.');
    }
    const filtered = data.results.filter(exports.hasItAll);
    if (0 == filtered.length) {
        reject('No complete info in the results results to display it.');
    }
    Promise.all(filtered.map((element) => {
        return exports.shortenLinks(element, shortener).then((shortened) => {
            return parseMap(shortened, lanCode, i18n, maskFunction);
        }).catch((error) => {
            throw error;
        });
    })).then((parsed) => {
        resolve(parsed);
    }).catch((error) => {
        reject(error);
    });
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