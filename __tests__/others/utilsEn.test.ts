/**
 * English tests for parse.
 */
'use strict';

import { telegramInline } from 'telegraf';
import {
    endInline,
    errorInline,
    messageToString,
    readAsync,
    removeCmd,
    searchInline
} from '../../src/others/utils';

jest.setTimeout(60000);

const mockLanCode: string = 'en-us';

describe('[EN] Testing errorInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/errorInline.json').then((file: Array<telegramInline>) => {
            return expect(errorInline(mockLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing searchInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/searchInline.json').then(file => {
            return expect(searchInline(mockLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing endInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/endInline.json').then(file => {
            return expect(endInline(mockLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
