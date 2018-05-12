'use strict';

import * as Parser from 'rss-parser';
import { tiny } from 'tiny-shortener';
import { handleLastEpisode } from '../../../src/lib/handlers/podcasts';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests';
const parser = new Parser();

jest.setTimeout(60000);

const functions = [{
    name: 'handleLastEpisode', func: handleLastEpisode
}];
const mock = initMock({ path: 'handlers/podcasts' }, { functions });
const opts = {
    translate: true
};

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func, opts }));
});
