'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';
const telegrafI18n = require('telegraf-i18n');

const path = '../../src/locales/';

/**
 * Default is English language, when the Telegram's API it doesn't sends language or country the bot must be in English.
 */
const fromFiles = JSON.parse(readFileSync(join(__dirname, `${path}/locales.json`), 'utf8'));
fromFiles.push('default');

export const languagesCode = fromFiles;

export const translateRoot = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, path)
});
