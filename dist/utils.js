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
 */
const hasGenres = (genres) => {
    return (undefined !== genres) ? genres.reduce((accumulator, current) => {
        return `${accumulator} | ${current}`;
    }, '') : '';
};
/**
 * This function returns the formated data that will be sent to the user.
 */
const maskResponse = (data) => {
    return {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        country: data.country,
        genres: hasGenres(data.genres),
        trackCount: data.trackCount,
        itunes: data.itunes,
        rss: data.rss,
        latest: data.latest
    };
};
/**
 * Verify whether or not an iTunes response has all of the needed data to the bot.
 */
exports.hasItAll = (data) => {
    let rtnval = false;
    if (undefined !== data &&
        undefined !== data.releaseDate && (undefined !== data.artworkUrl30 ||
        undefined !== data.artworkUrl60 ||
        undefined !== data.artworkUrl100 ||
        undefined !== data.artworkUrl600) &&
        undefined !== data.artistName &&
        undefined !== data.country &&
        undefined !== data.trackCount &&
        undefined !== data.feedUrl &&
        undefined !== data.collectionViewUrl) {
        rtnval = true;
    }
    return rtnval;
};
/**
 * Returns the formated data that will be showed to the user.
 */
const maskInline = (data) => {
    let preview = 'https://github.com/Fazendaaa/podsearch_bot/blob/dev/img/error.png';
    /**
     * It  takes  the  "lowest" resolution image as inline thumbnail -- the real one of the lowest would be artworkUrl30
     * however, this one has a really low resolution, so the minimum expected has to be artworkUrl60.
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
    /**
     * Telegram's format of inline reponse.
     */
    return {
        id: `${data.trackId}`,
        title: data.artistName,
        type: 'article',
        input_message_content: {
            message_text: i18n.api(data.lanCode).t('mask', data),
            parse_mode: 'Markdown'
        },
        description: hasGenres(data.genres),
        thumb_url: preview
    };
};
/**
 * Parsing data.
 */
const parse = (data) => new Promise((resolve, reject) => {
    if (undefined !== data) {
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        }
        else if (undefined === data.artworkUrl30 ||
            undefined === data.artworkUrl60 ||
            undefined === data.artworkUrl100 ||
            undefined === data.artworkUrl600) {
            reject('Has no podcast artwork.');
        }
        else if (undefined === data.artistName) {
            reject('Has no name.');
        }
        else if (undefined === data.country) {
            reject('Has no country.');
        }
        else if (undefined === data.trackCount) {
            reject('Has no number of episodes.');
        }
        else if (undefined === data.feedUrl) {
            reject('Has no number RSS link.');
        }
        else if (undefined === data.collectionViewUrl) {
            reject('Has no number iTunes link.');
        }
        else {
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
                    console.error(error);
                    reject('Has no iTunes link available.');
                });
            }).catch((error) => {
                console.error(error);
                reject('Has no RSS link available.');
            });
        }
    }
    else {
        reject('Wrong argument');
    }
});
/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
exports.parseResponse = (data) => new Promise((resolve, reject) => {
    parse(data).then((result) => {
        resolve(maskResponse(result));
    }).catch((error) => {
        /**
         * Since this catch already console.error in parse function, there's no need to do it here also. Just pop up the
         * reject message for the calling function to debbug it later.
         */
        reject(error);
    });
});
/**
 * Lorem ipsum.
 */
exports.parseInline = (data, lanCode) => new Promise((resolve, reject) => {
    parse(data).then((result) => {
        resolve(maskInline(Object.assign({}, result, { lanCode })));
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