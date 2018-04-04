/**
 * Handling  functions  that  does  parsing  and  checking  of  data. More about the non official typings for goo.gl and
 * itunes-search can be found at: ./src/@typings/
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const i18n_node_yaml = require("i18n-node-yaml");
const moment = require("moment");
const path_1 = require("path");
const Extra = require('telegraf').Extra;
/**
 * Allows the code to run without passing the environment variables as arguments.
 */
dotenv_1.config();
/**
 * Set Google's API key.
 */
goo_gl_1.setKey(process.env.GOOGLE_KEY);
/**
 * Configure internationalization options.
 */
const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: path_1.resolve(__dirname, '../../locales'),
    locales: ['en', 'pt']
});
/**
 * Just concatenate genres.
 * This will be only used locally, but there's need to exported to be tested later.
 */
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
/**
 * Verify whether or not an iTunes response has all of the needed data to the bot.
 */
exports.hasItAll = (data) => {
    let returnValue = false;
    if (undefined !== data &&
        undefined !== data.releaseDate && (
    /**
     * Why not both? Because only one is needed to an inline preview.
     */
    undefined !== data.artworkUrl60 ||
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
/**
 * This function returns the formated data that will be sent to the user.
 * This will be only used locally, but there's need to exported to be tested later.
 */
exports.maskResponse = (data) => {
    return (undefined !== data) ? {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        /**
         * Just remember the good old days of C lang with its casting.
         */
        genres: exports.hasGenres(data.genres),
        trackCount: data.trackCount,
        itunes: data.itunes,
        rss: data.rss,
        latest: data.latest,
        keyboard: data.keyboard
    } : undefined;
};
/**
 * Returns the formated data that will be showed to the user.
 * This will be only used locally, but there's need to exported to be tested later.
 */
exports.maskResponseInline = (data) => {
    let returnValue = undefined;
    let preview = 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png';
    if (undefined !== data) {
        /**
         * It  takes  the  "lowest"  resolution  image  as  inline  thumbnail  --  the  real  one of the lowest would be
         * artworkUrl30 however, this one has a really low resolution, so the minimum expected has to be artworkUrl60.
         */
        if (undefined !== data.artworkUrl60) {
            preview = data.artworkUrl60;
        }
        else if (undefined !== data.artworkUrl100) {
            preview = data.artworkUrl100;
        }
        else if (undefined !== data.artworkUrl600) {
            preview = data.artworkUrl600;
            /**
             * If  this  else is being called id because artworkUrl600 is not available, in that case, one must be set to be
             * presented to the user at message.
             */
        }
        else {
            data.artworkUrl600 = preview;
        }
        returnValue = {
            id: `${data.trackId}`,
            title: data.artistName,
            type: 'article',
            input_message_content: {
                message_text: i18n.api().t('mask', data, data.lanCode),
                parse_mode: 'Markdown'
            },
            reply_markup: data.keyboard.reply_markup,
            description: exports.hasGenres(data.genres),
            thumb_url: preview
        };
    }
    return returnValue;
};
/**
 * This function takes an result a then returns it with the shortened links about it.
 */
exports.shortenLinks = (data) => new Promise((resolve, reject) => {
    if (undefined !== data) {
        goo_gl_1.shorten(data.feedUrl).then((rss) => {
            goo_gl_1.shorten(data.collectionViewUrl).then((itunes) => {
                resolve(Object.assign({}, data, { itunes, rss }));
            }).catch((error) => {
                reject('Has no iTunes link available.');
            });
        }).catch((error) => {
            reject('Has no RSS link available.');
        });
    }
    else {
        reject('Wrong argument.');
    }
});
/**
 * Parsing data.
 */
exports.parse = (data, userId, lanCode) => new Promise((resolve, reject) => {
    let filtered = undefined;
    let latest = undefined;
    let keyboard = undefined;
    let podcastId = undefined;
    if (undefined !== data && 0 < data.resultCount && undefined !== data.results && undefined !== userId &&
        undefined !== lanCode && 'string' === typeof (lanCode)) {
        /**
         * Some  data  info  comes  incomplete,  this  could  mean  an error later on the process; that's why it must be
         * filtered right here, to avoid it.
         */
        filtered = data.results.filter(exports.hasItAll);
        if (0 < filtered.length) {
            Promise.all(filtered.map((element) => {
                return exports.shortenLinks(element).then((shortened) => {
                    /**
                     * There  is  no need to check whether or not releaseDate exists because the caller function already
                     * verified  this.  That  being said, if releaseDate is undefined, moment will return the current OS
                     * date.
                     */
                    latest = moment(shortened.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
                    /**
                     * Why worry about the collectionId and trackId? Because the in the case, I know that probably won't
                     * happen ever -- but, "just in case" --, if any of it don't happen to be available, that would mean
                     * a simple "double check".
                     */
                    podcastId = shortened.collectionId || shortened.trackId;
                    /**
                     * The  "subscribe/userId/podcastID"  will  be  used  for subscribing to episodes notifications upon
                     * release.
                     */
                    keyboard = Extra.markdown().markup((m) => {
                        return m.inlineKeyboard([m.callbackButton('Subscribe', `subscribe/${userId}/${podcastId}`)]);
                    });
                    /**
                     * Striping the country option from lanCode.
                     */
                    return Object.assign({}, shortened, { latest, keyboard, lanCode: lanCode.split('-')[0] });
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
        reject('Empty results.');
    }
});
/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.  Only  takes  it  the  first  searched  response  because  it  is  a chat with the bot, maybe later when wit.ai
 * integration is implemented, the user can give some feedback and polishing more the search.
 */
exports.parseResponse = (data, userId, lanCode) => new Promise((resolve, reject) => {
    exports.parse(data, userId, lanCode).then((results) => {
        resolve(exports.maskResponse(results[0]));
    }).catch((error) => {
        reject(error);
    });
});
/**
 * Parse it the data for the inline mode of search.
 */
exports.parseResponseInline = (data, userId, lanCode) => new Promise((resolve, reject) => {
    exports.parse(data, userId, lanCode).then((results) => {
        Promise.all(results.map((element) => {
            return exports.maskResponseInline(element);
        })).then((parsed) => {
            resolve(parsed);
        }).catch((error) => {
            throw (error);
        });
    }).catch((error) => {
        reject(error);
    });
});
//# sourceMappingURL=parse.js.map