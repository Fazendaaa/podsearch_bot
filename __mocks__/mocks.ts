'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
const telegrafI18n = require('telegraf-i18n');

const readMock = (filename: string) => JSON.parse(readFileSync(join(__dirname, `./${filename}.json`), 'utf8'));
const languagesCode = readMock('languages');
export const initMock = (path: string, functions: Array<object>) => languagesCode.reduce(curryReduceMock(path, functions), {});

export const readFiles = (root, functions, path) => functions.reduce((acc, cur) => {
    const functionName = cur.name;
    acc[functionName] = readMock(`${path}/${root}/${functionName}`);

    return acc;
}, {});

export const translateRoot = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../src/locales')
});

const curryReduceMock = (path: string, functions: Array<object>) => ((acc, cur) => {
    const language = cur.split('_')[0];
    const obj = {
        mock: readFiles(cur, functions, path),
        translate: (languageCode, resourceKey) => translateRoot.t(language, languageCode, resourceKey)
    }

    acc[cur] = obj;

    return acc;
});

export const languageTesting = (functionTesting: (languageCountry) => void) => {
    languagesCode.forEach((element: string) => {
        describe(`[${element}] Function Testing`, () => functionTesting(element));
    });
};
