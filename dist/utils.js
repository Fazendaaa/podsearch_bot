'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * More about the non official typings for goo.gl and itunes-search can be found at: ./src/@typings/
 */
const dotenv_1 = require("dotenv");
const goo_gl_1 = require("goo.gl");
const moment = require("moment");
dotenv_1.config();
/**
 * Set Google's API key.
 */
goo_gl_1.setKey(process.env.GOOGLE_KEY);
/**
 * This function removes the '/cmd' of the command.
 */
exports.removeCmd = (cmd = '') => {
    return (typeof cmd === 'string') ? cmd.replace(/(\/\w+)\s*/, '') : '';
};
exports.messageToString = (message) => {
    return Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o');
    ;
};
/**
 * This function returns the formated data that will be sent to the user.
 */
const maskResponse = (data, itunes, rss, latest) => {
    return {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        country: data.country,
        primaryGenreName: data.primaryGenreName,
        trackCount: data.trackCount,
        itunes,
        rss,
        latest
    };
};
/**
 * This function returns the formated data that will be sent to the user.
 */
const maskInline = (data, itunes, rss, latest) => {
    return {
        id: `${data.trackId}`,
        title: data.artistName,
        type: 'article',
        input_message_content: {
            message_text: 'Test',
            parse_mode: 'Markdown'
        },
        description: 'test',
        thumb_url: data.trackViewUrl
    };
};
/**
 * This function takes the search from itunes's API then parse it to the format that will be presented as message to the
 * user.
 */
exports.parseResponse = (data) => new Promise((resolve, reject) => {
    if (undefined !== data) {
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        }
        else if (undefined === data.artworkUrl600) {
            reject('Has no podcast artwork.');
        }
        else if (undefined === data.artistName) {
            reject('Has no name.');
        }
        else if (undefined === data.country) {
            reject('Has no country.');
        }
        else if (undefined === data.primaryGenreName) {
            reject('Has no genre.');
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
                        resolve(maskResponse(data, itunes, rss, latest));
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
exports.parseInline = (data) => new Promise((resolve, reject) => {
    if (undefined !== data) {
        if (undefined === data.releaseDate) {
            reject('Has no lastest episode date.');
        }
        else if (undefined === data.artworkUrl600) {
            reject('Has no podcast artwork.');
        }
        else if (undefined === data.artistName) {
            reject('Has no name.');
        }
        else if (undefined === data.country) {
            reject('Has no country.');
        }
        else if (undefined === data.primaryGenreName) {
            reject('Has no genre.');
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
                        resolve(maskInline(data, itunes, rss, latest));
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
//# sourceMappingURL=utils.js.map