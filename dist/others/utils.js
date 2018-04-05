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
    translationFolder: path_1.join(__dirname, '../../locales'),
    defaultLocale: 'en',
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
 * Retrieves telegraf-i18n array string.
 */
exports.arrayLoad = (options) => {
    if (undefined !== options && 'object' === typeof (options)) {
        return options.map((element) => {
            if ('function' === typeof (element)) {
                return element();
                /**
                 * Doing a recursive search in case of an nested array.
                 */
            }
            else {
                return exports.arrayLoad(element);
            }
        });
    }
    else {
        throw new Error('Wrong argument.');
    }
};
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
 * Just an not found message to be sent to the user in case of failed search.
 */
exports.notFoundInline = (value, lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== value && 'string' === typeof (value) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                /**
                 * Passing lang in api() call didn't fall to default when language isn't supported. That's why needed it
                 * change to call it in t().
                 */
                title: i18n.api().t('notFoundInlineTitle', { value }, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('notFoundInlineMessage', { value }, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('notFoundInlineDescription', { value }, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
/**
 * Just an error message to be sent to the user in case of failed search.
 */
exports.errorInline = (lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                /**
                 * Passing lang in api() call didn't fall to default when language isn't supported. That's why needed it
                 * change to call it in t().
                 */
                title: i18n.api().t('errorInlineTitle', {}, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('errorInlineMessage', {}, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('errorInlineDescription', {}, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
/**
 * Just a search message to be sent to the user in case of an empty search query.
 */
exports.searchInline = (lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api().t('searchInlineTitle', {}, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('searchInlineMessage', {}, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('searchInlineDescription', {}, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
/**
 * Just a end search message to be sent to the user at the bottom of search query.
 */
exports.endInline = (lanCode) => new Promise((resolve, reject) => {
    let lang = undefined;
    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];
        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api().t('endInlineTitle', {}, lang),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api().t('endInlineMessage', {}, lang),
                    parse_mode: 'Markdown'
                },
                description: i18n.api().t('endInlineDescription', {}, lang),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            });
        }).catch((error) => {
            reject(error);
        });
    }
    else {
        reject(undefined);
    }
});
//# sourceMappingURL=utils.js.map