'use strict';

import * as Parser from 'rss-parser';
import { tiny } from 'tiny-shortener';
import { lastPodcastEpisode } from '../../../src/lib/handlers/lastPodcastEpisode';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests';
const parser = new Parser();

jest.setTimeout(60000);

const functions = [{
    name: 'lastPodcastEpisode', func: lastPodcastEpisode
}];
const mock = initMock({ path: 'handlers/lastPodcastEpisode' }, { functions });

languageTesting((languageCountry) => {
    const opts = {
        translate: true,
        shortener: tiny,
        rss: parser
    };

    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func, opts }));
});
