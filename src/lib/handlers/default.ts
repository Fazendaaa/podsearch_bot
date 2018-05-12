'use strict';

import { join } from 'path';

export const handleNoSearch = ({ username }, { translate }) => {
    const mainPath: string = '../../gif/';

    return [{
        text: translate('letMeHelpYou', { username }) }, { 
        text: translate('wrongInputCmd') }, { 
        source: join(__dirname, mainPath, 'searchCmd.mp4') }, {
        text: translate('wrongInputButton') }, {
        source: join(__dirname, mainPath, 'searchButton.mp4') }, {
        text: translate('wrongInputInline') }, {
        source: join(__dirname, mainPath, 'searchInline.mp4')
    }];
};
