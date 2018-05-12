'use strict';

import * as tinyShortener from 'tiny-shortener';
import { parsePodcastCommand, parsePodcastInline } from '../../../src/lib/podcasts/parse';
import { initMock } from '../../__mocks__/mocks';
import { translateRoot } from '../../locales/locales';
import { languageTesting, functionTesting } from '../../tests';

jest.setTimeout(60000);

const functions = [{
    name: 'parsePodcastCommand', func: parsePodcastCommand }, {
    name: 'parsePodcastInline', func: parsePodcastInline
}];
const mock = initMock({ path: 'podcasts/parse' }, { functions });

languageTesting((languageCountry) => {
    const opts = {
        shortener: tinyShortener.tiny,
        translateRoot
    };

    functions.forEach(({ name, func }) => {
        functionTesting({ name, mock, languageCountry }, { func, opts });
    });
});
