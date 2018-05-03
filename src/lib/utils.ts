/**
 * Library that handles functions of basic nature.
 */
'use strict';

import { readFile } from 'fs';
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
    if (undefined == options || 'object' !== typeof(options)) {
        throw new Error('Wrong argument.');
    }

    return options.map((element: Function) => {
        if ('function' === typeof(element)) {
            return element();
        }

        return arrayLoad(element);
    });
};

export const removeCmd = (cmd: string): string => {
    return (undefined !== cmd && 'string' === typeof cmd) ? remove(cmd.replace(/(\/\w+)\s*/, '')) : undefined;
};

export const messageToString = (message: string): string => {
    return (undefined !== message && 'string' === typeof message) ?
        Buffer.from(remove(message), 'ascii').toString('ascii').replace(/(?:=\(|:0|:o|: o|: 0)/, ': o') :
        undefined;
};

export const notFoundInline = (value: string, translate): telegramInline => {
    return {
        id: '0',
        title: translate('notFoundInlineTitle', { value }),
        type: 'article',
        input_message_content: {
            message_text: translate('notFoundInlineMessage', { value }),
            parse_mode: 'Markdown'
        },
        description: translate('notFoundInlineDescription', { value }),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
    };
};

export const errorInline = (translate): telegramInline => {
    return {
        id: '0',
        title: translate('errorInlineTitle'),
        type: 'article',
        input_message_content: {
            message_text: translate('errorInlineMessage'),
            parse_mode: 'Markdown'
        },
        description: translate('errorInlineDescription'),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/error.png'
    };
};

export const searchInline = (translate): telegramInline => {
    return {
        id: '0',
        title: translate('searchInlineTitle'),
        type: 'article',
        input_message_content: {
            message_text: translate('searchInlineMessage'),
            parse_mode: 'Markdown'
        },
        description: translate('searchInlineDescription'),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
    };
);

export const endInline = (translate): telegramInline => {
    return {
        id: '0',
        title: translate('endInlineTitle'),
        type: 'article',
        input_message_content: {
            message_text: translate('endInlineMessage'),
            parse_mode: 'Markdown'
        },
        description: translate('endInlineDescription'),
        thumb_url: 'https://raw.githubusercontent.com/Fazendaaa/podsearch_bot/master/img/logo.png'
    };
};
