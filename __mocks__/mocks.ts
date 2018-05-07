'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
const telegrafI18n = require('telegraf-i18n');

const readMock = (filename: string) => JSON.parse(readFileSync(join(__dirname, `./${filename}.json`), 'utf8'));

export const languagesCode = readMock('languages').languages;

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
