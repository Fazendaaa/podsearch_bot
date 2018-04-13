/**
 * English tests for parse.
 */
'use strict';

import * as i18n_node_yaml from 'i18n-node-yaml';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import {
    endInline,
    errorInline,
    messageToString,
    notFoundInline,
    readAsync,
    removeCmd,
    searchInline
} from '../../src/others/utils';

jest.setTimeout(60000);

const mockLanCode: string = 'en-us';
let i18nNode = undefined;

beforeAll(async(done) => {
    i18nNode = i18n_node_yaml({
        debug: true,
        translationFolder: join(__dirname, '../../locales'),
        locales: ['en', 'pt']
    });

    await i18nNode.ready.then();
    done();
});

describe('[EN] Testing notFoundInline function.', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/notFoundInline.json').then(file => {
            return expect(notFoundInline('mistyped', mockLanCode, i18nNode.api)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing errorInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/errorInline.json').then((file: Array<telegramInline>) => {
            return expect(errorInline(mockLanCode, i18nNode.api)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing searchInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/searchInline.json').then(file => {
            return expect(searchInline(mockLanCode, i18nNode.api)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing endInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/endInline.json').then(file => {
            return expect(endInline(mockLanCode, i18nNode.api)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
