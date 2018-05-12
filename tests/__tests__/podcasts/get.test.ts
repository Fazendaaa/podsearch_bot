'use strict';

import { searchPodcast, lookupPodcast, lastPodcastEpisode } from '../../../src/lib/podcasts/get';
import * as Parser from 'rss-parser';
import { tiny } from 'tiny-shortener';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests';
const parser = new Parser();

jest.setTimeout(60000);

const functions = [{
    name: 'searchPodcast', func: searchPodcast }, {
    name: 'lookupPodcast', func: lookupPodcast }, {
    name: 'lastPodcastEpisode', func: lastPodcastEpisode
}];
const mock = initMock({ path: 'podcasts/get' }, { functions });

languageTesting((languageCountry) => {
    const opts = {
        translate: true,
        shortener: tiny,
        rss: parser
    };

    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func, opts }));
});
