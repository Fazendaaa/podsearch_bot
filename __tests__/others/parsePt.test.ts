/**
 * Portuguese tests for parse.
 */
'use strict';

import * as i18n_node_yaml from 'i18n-node-yaml';
import {
    response,
    result
} from 'itunes-search';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { shorten } from 'tinyurl';
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

const mockLanCode: string = 'pt-br';

let i18nNode = undefined;

beforeAll(() => {
    i18nNode = i18n_node_yaml({
        debug: true,
        translationFolder: join(__dirname, '../../locales'),
        locales: ['en', 'pt']
    });
});

describe('[PT] Testing parseResponse function', () => {
    test('Parse nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/pt-br/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/pt-br/output/parseResponse.json').then((mockOutput: result) => {
                return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
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
                return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
