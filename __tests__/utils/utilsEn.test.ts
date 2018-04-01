/**
 * Tests English.
 */
'use strict';

import { readFile } from 'fs';
import {
    response,
    result
} from 'itunes-search';
import { join } from 'path';
import {
    telegramInline
} from 'telegraf';
import {
    errorInline,
    parse,
    parseResponse,
    parseResponseInline,
    resultExtended,
    searchInline
} from '../../src/utils';
import {
    readAsync
} from './utilsBasic.test';

jest.setTimeout(60000);

// describe('[EN] Testing parseResponse function', () => {
//     test('Parse nerdcast.', () => {
//         expect.assertions(1);

//         return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             return readAsync('nerdcast/en-us/outputThree.json').then((mockOutput: result) => {
//                 const srcResponse: response = {
//                     resultCount: 1,
//                     results: [mockInput]
//                 };

//                 return expect(parseResponse(srcResponse, 'en-us')).resolves.toEqual(mockOutput);
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('[EN] Testing parseResponseInline function', () => {
//     test('Parse nerdcast', () => {
//         expect.assertions(1);

//         return readAsync('nerdcast/en-us/inputTwo.json').then((mockInput: response) => {
//             return readAsync('nerdcast/en-us/outputFour.json').then((mockOutput: Array<telegramInline>) => {
//                 return expect(parseResponseInline(mockInput, 'en-us')).resolves.toEqual(mockOutput);
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('[EN] Testing errorInline function', () => {
//     test('lanCode equals to en-us', () => {
//         expect.assertions(1);

//         return readAsync('/inline/en-us/errorInline.json').then((file: Array<telegramInline>) => {
//             return expect(errorInline('en-us')).toEqual(file);
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('[EN] Testing searchInline function', () => {
//     test('lanCode equals to en-us', () => {
//         expect.assertions(1);

//         return readAsync('/inline/en-us/searchInline.json').then(file => {
//             return expect(searchInline('en-us')).toEqual(file);
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });
