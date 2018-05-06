'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
const telegrafI18n = require('telegraf-i18n');

export const languagesCode = ['en_us', 'pt_br'];

export const readMock = (filename: string) => JSON.parse(readFileSync(join(__dirname, `./${filename}`), 'utf8'));

export const translateRoot = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../src/locales')
});
