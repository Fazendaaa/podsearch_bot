'use strict';

import { join } from 'path';
import { resultExtended } from '../../@types/parse/main';
import { arrayLoad } from '../utils';
const telegraf = require('telegraf');
const markup = telegraf.Markup;

export const handleStartKeyboard = ({ rootTranslate, language }) => {
    const buttons = arrayLoad(rootTranslate.repository[language].keyboard);
    const keyboard = markup.keyboard(buttons);

    return keyboard.resize().extra();
}

export const handleNoSearch = ({ translate }) => {
    const mainPath: string = '../../gif/';

    return [{
        text: translate('wrongInputCmd') }, { 
        source: join(__dirname, mainPath, 'searchCmd.mp4') }, {
        text: translate('wrongInputButton') }, {
        source: join(__dirname, mainPath, 'searchButton.mp4') }, {
        text: translate('wrongInputInline') }, {
        source: join(__dirname, mainPath, 'searchInline.mp4')
    }];
};
