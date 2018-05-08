'use strict';

import { searchPodcast, lookupPodcast } from '../../../src/lib/podcasts/get';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests';

const functions = [{
    name: 'searchPodcast', func: searchPodcast }, {
    name: 'lookupPodcast', func: lookupPodcast        
}];
const mock = initMock({ path: 'podcasts/get' }, { functions });

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func }));
});
