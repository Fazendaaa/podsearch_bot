/**
 * English tests for parse.
 */
'use strict';

import {
    response,
    result
} from 'itunes-search';
import { telegramInline } from 'telegraf';
import { resultExtended } from '../../src/@types/parse/main';
import {
    hasGenres,
    hasItAll,
    maskResponse,
    maskResponseInline,
    parse,
    parseResponse,
    parseResponseInline,
    shortenLinks
} from '../../src/others/parse';
import { readAsync } from '../../src/others/utils';

jest.setTimeout(60000);

const mockUserId: number = 0;
const mockLanCode: string = 'en-us';

describe('[EN] Testing parseResponse function', () => {
    test('Parse nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parseResponse.json').then((mockOutput: result) => {
                return expect(parseResponse(mockInput, mockUserId, mockLanCode)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing parseResponseInline function', () => {
    test('Parse nerdcast', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchInline.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parseResponseInline.json').then((mockOutput: Array<telegramInline>) => {
                return expect(parseResponseInline(mockInput, mockUserId, mockLanCode)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
