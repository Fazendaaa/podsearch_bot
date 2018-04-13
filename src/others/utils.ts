/**
 * Library that handles functions of basic nature.
 */
'use strict';

import { readFile } from 'fs';
import { api } from 'i18n-node-yaml';
import { join } from 'path';
import { remove } from 'remove-accents';
import { telegramInline } from 'telegraf';

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
 * Retrieves telegraf-i18n array string.
 */
export const arrayLoad = (options: Array<object>): Array<string | object> | Error => {
    if (undefined !== options && 'object' === typeof(options)) {
        return options.map((element: Function) => {
            if ('function' === typeof(element)) {
                return element();
            /**
             * Doing a recursive search in case of an nested array.
             */
            } else {
                return arrayLoad(element);
            }
        });
    } else {
        throw new Error('Wrong argument.');
    }
};

/**
 * This function removes the '/cmd' of the command.
 */
export const removeCmd = (cmd: string): string => {
    return (undefined !== cmd && 'string' === typeof cmd) ? remove(cmd.replace(/(\/\w+)\s*/, '')) : undefined;
};

/**
 * "Handles" all the query input so this way even whether or not a user sends an sticker, that won't be parsed.
 */
export const messageToString = (message: string): string => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(remove(message), 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};

/**
 * Just an not found message to be sent to the user in case of failed search.
 */
export const notFoundInline = (value: string, lanCode: string, i18n: api): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== value && 'string' === typeof (value) && undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        resolve({
            id: '0',
            /**
             * Passing lang in api() call didn't fall to default when language isn't supported. That's why needed it
             * change to call it in t().
             */
            title: i18n().t('notFoundInlineTitle', { value }, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('notFoundInlineMessage', { value }, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('notFoundInlineDescription', { value }, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
        });
    } else {
        reject(undefined);
    }
});

/**
 * Just an error message to be sent to the user in case of failed search.
 */
export const errorInline = (lanCode: string, i18n: api): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        resolve({
            id: '0',
            /**
             * Passing  lang  in  i18n() call didn't fall to default when language isn't supported. That's why needed it
             * change to call it in t().
             */
            title: i18n().t('errorInlineTitle', {}, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('errorInlineMessage', {}, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('errorInlineDescription', {}, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
        });
    } else {
        reject(undefined);
    }
});

/**
 * Just a search message to be sent to the user in case of an empty search query.
 */
export const searchInline = (lanCode: string, i18n: api): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        resolve({
            id: '0',
            title: i18n().t('searchInlineTitle', {}, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('searchInlineMessage', {}, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('searchInlineDescription', {}, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
        });
    } else {
        reject(undefined);
    }
});

/**
 * Just a end search message to be sent to the user at the bottom of search query.
 */
export const endInline = (lanCode: string, i18n: api): Promise<telegramInline> =>
new Promise((resolve: (data: telegramInline) => void, reject: (data: Error) => void) => {
    let lang: string = undefined;

    if (undefined !== lanCode && 'string' === typeof (lanCode)) {
        lang = lanCode.split('-')[0];

        resolve({
            id: '0',
            title: i18n().t('endInlineTitle', {}, lang),
            type: 'article',
            input_message_content: {
                message_text: i18n().t('endInlineMessage', {}, lang),
                parse_mode: 'Markdown'
            },
            description: i18n().t('endInlineDescription', {}, lang),
            thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
        });
    } else {
        reject(undefined);
    }
});
