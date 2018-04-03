/**
 * Library that handles functions of basic nature.
 */
'use strict';

import { readFile } from 'fs';
import * as i18n_node_yaml from 'i18n-node-yaml';
import {
    join,
    resolve
} from 'path';
import { telegramInline } from 'telegraf';

/**
 * Configure internationalization options.
 */
const i18n = i18n_node_yaml({
    debug: true,
    translationFolder: resolve(__dirname, '../../locales'),
    locales: ['en', 'pt']
});

/**
 * I  know  that  isn't  the right way of doing mocking tests but, right now, is the way that I came up to. This testing
 * file  is  a nightmare of reading I/O -- need to correct ASAP this, if this continue tha way it is, scale testing will
 * be impossible.
 */
export const readAsync = (filename: string): Promise<object> =>
new Promise((resolve: (data: object) => void, reject: (data: Error) => void) => {
    readFile(join(__dirname, `../../__mocks__/${filename}`), 'utf8', (err: Error, data: string) => {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(data));
        }
    });
});

/**
 * This function removes the '/cmd' of the command.
 */
export const removeCmd = (cmd: string): string => {
    return (undefined !== cmd && 'string' === typeof cmd) ? cmd.replace(/(\/\w+)\s*/, '') : undefined;
};

/**
 * "Handles" all the query input so this way even whether or not a user sends an sticker, that won't be parsed.
 */
export const messageToString = (message: string): string => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(message, 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};

/**
 * Just an error message to be sent to the user in case of failed search.
 */
export const errorInline = (lanCode: string): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api(lang).t('errorTitle'),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api(lang).t('errorInlineMessage'),
                    parse_mode: 'Markdown'
                },
                description: i18n.api(lang).t('errorInlineDescription'),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
            });
        }).catch((error: Error) => {
            reject(error);
        });
    } else {
        reject(undefined);
    }
});

/**
 * Just a search message to be sent to the user in case of an empty search query.
 */
export const searchInline = (lanCode: string): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api(lang).t('searchTitle'),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api(lang).t('searchInlineMessage'),
                    parse_mode: 'Markdown'
                },
                description: i18n.api(lang).t('searchInlineDescription'),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            });
        }).catch((error: Error) => {
            reject(error);
        });
    } else {
        reject(undefined);
    }
});

/**
 * Just a end search message to be sent to the user at the bottom of search query.
 */
export const endInline = (lanCode: string): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        i18n.ready.then(() => {
            resolve({
                id: '0',
                title: i18n.api(lang).t('endTitle'),
                type: 'article',
                input_message_content: {
                    message_text: i18n.api(lang).t('endInlineMessage'),
                    parse_mode: 'Markdown'
                },
                description: i18n.api(lang).t('endInlineDescription'),
                thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
            });
        }).catch((error: Error) => {
            reject(error);
        });
    } else {
        reject(undefined);
    }
});
