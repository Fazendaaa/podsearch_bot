/**
 * Tests English.
 */
'use strict';

import {
    response,
    result
} from 'itunes-search';
import {
    telegramInline
} from 'telegraf';
import {
    readAsync
} from '../../src/readAsync';
import {
    errorInline,
    parseResponse,
    parseResponseInline,
    searchInline
} from '../../src/utils';

jest.setTimeout(60000);

describe('[EN] Testing parseResponse function', () => {
    test('Parse nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parseResponse.json').then((mockOutput: result) => {
                return expect(parseResponse(mockInput, 'en-us')).resolves.toEqual(mockOutput);
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
                return expect(parseResponseInline(mockInput, 'en-us')).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing errorInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/errorInline.json').then((file: Array<telegramInline>) => {
            return expect(errorInline('en-us')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[EN] Testing searchInline function', () => {
    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/searchInline.json').then(file => {
            return expect(searchInline('en-us')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
