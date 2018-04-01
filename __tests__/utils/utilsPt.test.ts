/**
 * Tests Portuguese.
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

// describe('[PT] Testing parseResponse function', () => {
//     test('Parse nerdcast.', () => {
//         expect.assertions(1);

//         return readAsync('nerdcast/pt-br/inputOne.json').then((mockInput: result) => {
//             return readAsync('nerdcast/pt-br/outputThree.json').then((mockOutput: result) => {
//                 const srcResponse: response = {
//                     resultCount: 1,
//                     results: [mockInput]
//                 };

//                 return expect(parseResponse(srcResponse, 'pt-br')).resolves.toEqual(mockOutput);
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('[PT] Testing parseResponseInline function', () => {
//     test('Parse nerdcast', () => {
//         expect.assertions(1);

//         return readAsync('nerdcast/pt-br/inputTwo.json').then((mockInput: response) => {
//             return readAsync('nerdcast/pt-br/outputFour.json').then((mockOutput: Array<telegramInline>) => {
//                 return expect(parseResponseInline(mockInput, 'pt-br')).resolves.toEqual(mockOutput);
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('[PT] Testing errorInline function', () => {
//     test('lanCode equals to pt-br', () => {
//         expect.assertions(1);

//         return readAsync('/inline/pt-br/errorInline.json').then((file: Array<telegramInline>) => {
//             return expect(errorInline('pt-br')).toEqual(file);
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('[PT] Testing searchInline function', () => {
//     test('lanCode equals to pt-br', () => {
//         expect.assertions(1);

//         return readAsync('/inline/pt-br/searchInline.json').then(file => {
//             return expect(searchInline('pt-br')).toEqual(file);
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });
