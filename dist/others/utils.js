/**
 * Library that handles functions of basic nature.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const i18n_node_yaml = require("i18n-node-yaml");
const path_1 = require("path");
/**
 * Configure internationalization options.
 */
const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: path_1.resolve(__dirname, '../../locales'),
    locales: ['en', 'pt']
});
/**
 * I  know  that  isn't  the right way of doing mocking tests but, right now, is the way that I came up to. This testing
 * file  is  a nightmare of reading I/O -- need to correct ASAP this, if this continue tha way it is, scale testing will
 * be impossible.
 */
exports.readAsync = (filename) => new Promise((resolve, reject) => {
    fs_1.readFile(path_1.join(__dirname, `../../__mocks__/${filename}`), 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(JSON.parse(data));
        }
    });
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