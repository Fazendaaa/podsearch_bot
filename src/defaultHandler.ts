'use strict';

import { join } from 'path';
import { resultExtended } from './@types/parse/main';
import { arrayLoad } from './lib/utils';
const telegraf = require('telegraf');
const markup = telegraf.Markup;

export const handleStartKeyboard = ({ rootTranslate, language }) => {
    const buttons = arrayLoad(rootTranslate.repository[language].keyboard);
    const keyboard = markup.keyboard(buttons);

    return keyboard.resize().extra();
}

export const handleNoSearch = ({ translate }) => {
    return [{
        text: translate('wrongInputCmd') }, { 
        source: join(__dirname, '../gif/searchCmd.mp4') }, {
        text: translate('wrongInputButton') }, {
        source: join(__dirname, '../gif/searchButton.mp4') }, {
        text: translate('wrongInputInline') }, {
        source: join(__dirname, '../gif/searchInline.mp4')
    }];
};
