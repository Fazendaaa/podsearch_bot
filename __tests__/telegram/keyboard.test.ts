'use strict';

import { readMock } from '../../__mocks__/readMocks';
import { join } from 'path';
import { podcastKeyboard } from '../../src/lib/telegram/keyboard';
const telegrafI18n = require('telegraf-i18n');

// /**
//  * Function.name not working in Jest, maybe in a next update.
//  */
// const functions = [{
//     name: 'podcastKeyboard', func: podcastKeyboard
// }];
// const languagesCode = ['en_us', 'pt_br'];
// let i18n, translations;

// const readFiles = (root) => functions.reduce((acc, cur) => {
//     const functionName = cur.name;
//     acc[functionName] = readMock(`telegram/messages/${root}/${functionName}.json`);

//     return acc;
// }, {});

// const reduceTranslations = (acc, cur) => {
//     const language = cur.split('_')[0];
//     const obj = {
//         output: readFiles(cur),
//         translate: (languageCode, resourceKey) => i18n.t(language, languageCode, resourceKey)
//     }

//     acc[cur] = obj;

//     return acc;
// };

// jest.setTimeout(60000);

// beforeAll(async (done) => {
//     i18n = new telegrafI18n({
//         defaultLanguage: 'en',
//         allowMissing: true,
//         directory: join(__dirname, '../../src/locales')
//     });
//     translations = languagesCode.reduce(reduceTranslations, {});

//     done();
// });


// jest.setTimeout(60000);

// describe('Nothing yet.', () => {
//     test.skip('Nothing yet.', () => {
//         expect(true).toEqual(true);
//     });
// });

describe('Nothing yet.', () => {
    test.skip('Nothing yet.', () => {
        expect(true).toEqual(true);
    });
});
