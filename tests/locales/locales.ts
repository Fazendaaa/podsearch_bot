'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
const telegrafI18n = require('telegraf-i18n');

const path = '../../src/locales/';

export const languagesCode = JSON.parse(readFileSync(join(__dirname, `${path}/locales.json`), 'utf8'));

export const translateRoot = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, path)
});
