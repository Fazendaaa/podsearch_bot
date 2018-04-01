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
const fs_1 = require("fs");
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
    translationFolder: path_1.resolve(__dirname, '../locales'),
    locales: ['en', 'pt']
});
/**
 * This function removes the '/cmd' of the command.
 */
exports.removeCmd = (cmd) => {
    return (undefined !== cmd && 'string' === typeof cmd) ? cmd.replace(/(\/\w+)\s*/, '') : undefined;
};
/**
 * "Handles" all the query input so this way even whether or not a user sends an sticker, that won't be parsed.
 */
exports.messageToString = (message) => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};
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
        latest: data.latest
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
        }
        returnValue = {
            id: `${data.trackId}`,
            title: data.artistName,
            type: 'article',
            input_message_content: {
                message_text: i18n.api(data.lanCode).t('mask', data),
                parse_mode: 'Markdown'
            },
            description: exports.hasGenres(data.genres),
            thumb_url: preview
        };
    }
    return returnValue;
};
/**
 * This  function takes an result a then returns it with the shortened links about it and it latest episode release in a
 * readable way.
 * This will be only used locally, but there's need to exported to be tested later.
 */
exports.shortenLinks = (data, lanCode) => new Promise((resolve, reject) => {
    if (undefined !== data && undefined !== lanCode && 'string' === typeof (lanCode)) {
        goo_gl_1.shorten(data.feedUrl).then((rss) => {
            goo_gl_1.shorten(data.collectionViewUrl).then((itunes) => {
                /**
                 * There  is  no  need  to  check  whether or not releaseDate exists because the caller function already
                 * verified this. That being said, if releaseDate is undefined, moment will return the current OS date.
                 */
                const latest = moment(data.releaseDate).locale(lanCode).format('Do MMMM YYYY, h:mm a');
                if (undefined === latest) {
                    reject('Error occurred while converting date.');
                }
                else {
                    fs_1.writeFile('outputThree.json', JSON.stringify(Object.assign({}, data, { itunes, rss, latest })), err => {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            console.log('Wrote.');
                        }
                    });
                    resolve(Object.assign({}, data, { itunes, rss, latest }));
                }
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
exports.parse = (data, lanCode) => new Promise((resolve, reject) => {
    if (undefined !== data && 0 < data.resultCount && undefined !== data.results) {
        /**
         * Some  data  info  comes  incomplete,  this  could  mean  an error later on the process; that's why it must be
         * filtered right here, to avoid it.
         */
        const filtered = data.results.filter(exports.hasItAll);
        if (0 < filtered.length) {
            Promise.all(filtered.map((element) => {
                return exports.shortenLinks(element, lanCode).catch((error) => {
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
exports.parseResponse = (data, lanCode) => new Promise((resolve, reject) => {
    exports.parse(data, lanCode).then((results) => {
        resolve(exports.maskResponse(results[0]));
    }).catch((error) => {
        reject(error);
    });
});
/**
 * Parse it the data for the inline mode of search.
 */
exports.parseResponseInline = (data, lanCode) => new Promise((resolve, reject) => {
    if (undefined !== lanCode && 'string' === typeof lanCode) {
        /**
         * Removing the country from the language option.
         */
        const lang = lanCode.split('-')[0];
        exports.parse(data, lanCode).then((results) => {
            const parsed = results.map((element) => {
                return exports.maskResponseInline(Object.assign({}, element, { lanCode: lang }));
            });
            resolve(parsed);
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject('No lanCode available.');
    }
});
/**
 * Just an error message to be sent to the user in case of failed search.
 */
exports.errorInline = (lanCode) => {
    let returnValue = undefined;
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        returnValue = [{
                id: '0',
                title: 'Error',
                type: 'article',
                input_message_content: {
                    message_text: i18n.api(lang).t('errorInlineMessage'),
                    parse_mode: 'Markdown'
                },
                description: i18n.api(lang).t('errorInlineDescription'),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
            }];
    }
    return returnValue;
};
/**
 * Just a search message to be sent to the user in case of an empty search query.
 */
exports.searchInline = (lanCode) => {
    let returnValue = undefined;
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        returnValue = [{
                id: '0',
                title: 'Search Podcasts',
                type: 'article',
                input_message_content: {
                    message_text: i18n.api(lang).t('searchInlineMessage'),
                    parse_mode: 'Markdown'
                },
                description: i18n.api(lang).t('searchInlineDescription'),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            }];
    }
    return returnValue;
};
//# sourceMappingURL=utils.js.map