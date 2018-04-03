/**
 * Portuguese tests for parse.
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

const mockLanCode: string = 'pt-br';

describe('[PT] Testing errorInline function', () => {
    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/pt-br/errorInline.json').then((file: Array<telegramInline>) => {
            return expect(errorInline(mockLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[PT] Testing searchInline function', () => {
    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/pt-br/searchInline.json').then(file => {
            return expect(searchInline(mockLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[PT] Testing endInline function', () => {
    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/pt-br/endInline.json').then(file => {
            return expect(endInline(mockLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
