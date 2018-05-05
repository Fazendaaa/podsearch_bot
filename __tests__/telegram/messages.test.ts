'use strict';

import { readMock } from '../../__mocks__/readMocks';
import { join } from 'path';
import { errorInline, searchInline, endInline, notFoundInline } from '../../src/lib/telegram/messages';
const telegrafI18n = require('telegraf-i18n');

/**
 * Function.name not working in Jest, maybe in a next update.
 */
const functions = [{
    name: 'errorInline', func: errorInline }, {
    name: 'searchInline', func: searchInline }, {
    name: 'endInline', func: endInline }, {
    name: 'notFoundInline', func: notFoundInline 
}];
const languagesCode = [ 'en_us', 'pt_br' ];
let i18n, translations;

const readFiles = (root) => functions.reduce((acc, cur) => {
    const functionName = cur.name;
    acc[functionName] = readMock(`telegram/messages/${root}/${functionName}.json`);

    return acc;
}, {});

const reduceTranslations = (acc, cur) => {
    const language = cur.split('_')[0];
    const obj = {
        output: readFiles(cur),
        translate: (languageCode, resourceKey) => i18n.t(language, languageCode, resourceKey)
    }

    acc[cur] = obj;

    return acc;
};

jest.setTimeout(60000);

beforeAll(async (done) => {
    i18n = new telegrafI18n({
        defaultLanguage: 'en',
        allowMissing: true,
        directory: join(__dirname, '../../src/locales')
    });
    translations = languagesCode.reduce(reduceTranslations, {});
    
    done();
});

functions.forEach((element) => {
    const method = element.name;
    const func = element.func;

    describe(method, () => {
        test('Translations.', async () => {
            expect.assertions(translations.length);
            
            return await Object.keys(translations).forEach((language) => {
                const translateFunction = translations[language].translate;
                const outputFile = translations[language].output[method];

                return expect(func(translateFunction, 'mistyped')).toEqual(outputFile);
            });
        });
    });
});
