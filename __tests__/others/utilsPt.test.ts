/**
 * Tests Portuguese.
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
} from '../../src/others/readAsync';
import {
    errorInline,
    parseResponse,
    parseResponseInline,
    searchInline
} from '../../src/others/utils';

jest.setTimeout(60000);

describe('[PT] Testing parseResponse function', () => {
    test('Parse nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/pt-br/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/pt-br/output/parseResponse.json').then((mockOutput: result) => {
                return expect(parseResponse(mockInput, 'pt-br')).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[PT] Testing parseResponseInline function', () => {
    test('Parse nerdcast', () => {
        expect.assertions(1);

        return readAsync('nerdcast/pt-br/input/searchInline.json').then((mockInput: response) => {
            return readAsync('nerdcast/pt-br/output/parseResponseInline.json').then((mockOutput: Array<telegramInline>) => {
                return expect(parseResponseInline(mockInput, 'pt-br')).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[PT] Testing errorInline function', () => {
    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/pt-br/errorInline.json').then((file: Array<telegramInline>) => {
            return expect(errorInline('pt-br')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('[PT] Testing searchInline function', () => {
    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/pt-br/searchInline.json').then(file => {
            return expect(searchInline('pt-br')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
