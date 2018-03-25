'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * More about the non official typings for goo.gl and itunes-search can be found at: ./src/@typings/
 */
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const i18n_node_yaml = require("i18n-node-yaml");
const moment = require("moment");
const path_1 = require("path");
/**
 * Allows the code to run without passing the enviroment variables as arguments.
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
exports.removeCmd = (cmd = '') => {
    return (typeof cmd === 'string') ? cmd.replace(/(\/\w+)\s*/, '') : '';
};
/**
 * "Handles" all the query input so this way even whether or not a user sends an sticker, that won't be parsed.
 */
exports.messageToString = (message) => {
    return Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o');
};
/**
 * Just concatenate genres.
 * This will be only used locally, but there's need to exported to be tested later.
 */
exports.hasGenres = (genres) => {
    return (undefined !== genres) ? genres.reduce((accumulator, current) => {
        return `${accumulator} | ${current}`;
    }, '') : '';
};
/**
 * Verify whether or not an iTunes response has all of the needed data to the bot.
 */
exports.hasItAll = (data) => {
    let rtnval = false;
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
        rtnval = true;
    }
    return rtnval;
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
        country: data.country,
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
    let rtnval = undefined;
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
        rtnval = {
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
    return rtnval;
};
/**
 * This function takes an result a then returns it with the shortened links about it and it lastest episode release in a
 * readable way.
 * This will be only used locally, but there's need to exported to be tested later.
 */
exports.shortenLinks = (data) => new Promise((resolve, reject) => {
    goo_gl_1.shorten(data.feedUrl).then((rss) => {
        goo_gl_1.shorten(data.collectionViewUrl).then((itunes) => {
            const latest = moment(data.releaseDate).format('MMMM Do YYYY, h:mm a');
            if (undefined === latest) {
                reject('Error occured while converting date.');
            }
            else {
                resolve(Object.assign({}, data, { itunes, rss, latest }));
            }
        }).catch((error) => {
            reject('Has no iTunes link available.');
        });
    }).catch((error) => {
        reject('Has no RSS link available.');
    });
});
/**
 * Parsing data.
 */
exports.parse = (data) => new Promise((resolve, reject) => {
    if (undefined !== data && 0 < data.resultCount) {
        /**
         * Some  data  info  comes  uncomplete,  this  could  mean  an error later on the process; that's why it must be
         * filtered right here, to avoid it.
         */
        const filtered = data.results.filter(exports.hasItAll);
        if (0 < filtered.length) {
            Promise.all(filtered.map((element) => {
                return exports.shortenLinks(element).catch((error) => {
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
 * integration is implemented, the user can give some feeedback and polishing more the search.
 */
exports.parseResponse = (data) => new Promise((resolve, reject) => {
    exports.parse(data).then((results) => {
        resolve(exports.maskResponse(results[0]));
    }).catch((error) => {
        reject(error);
    });
});
/**
 * Parse it the data for the inline mode of search.
 */
exports.parseResponseInline = (data, lanCode) => new Promise((resolve, reject) => {
    exports.parse(data).then((results) => {
        const parsed = results.map((element) => {
            return exports.maskResponseInline(Object.assign({}, element, { lanCode }));
        });
        resolve(parsed);
    }).catch((error) => {
        reject(error);
    });
});
/**
 * Just an error message to be sent to the user in case of failed search.
 */
exports.errorInline = {
    id: '0',
    title: 'Error',
    type: 'article',
    input_message_content: {
        message_text: '[\u200B](https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/dev/img/error.png)*Error*: Try it again later.',
        parse_mode: 'Markdown'
    },
    description: 'Something went wrong, check your typing or try it again later.',
    thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/dev/img/error.png'
};
/**
 * Just an earch message to be sent to the user in case of an empty search querry.
 */
exports.searchInline = {
    id: '0',
    title: 'Search Podcasts',
    type: 'article',
    input_message_content: {
        message_text: '[\u200B](https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/dev/img/logo.png)Try to search any podcast.',
        parse_mode: 'Markdown'
    },
    description: 'Please, just type what your looking for.',
    thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/dev/img/logo.png'
};
//# sourceMappingURL=utils.js.map