'use strict';

import { searchPodcast, lookupPodcast } from '../../src/lib/podcasts/get';
import { initMock, languageTesting } from '../../__mocks__/mocks';

const functionTesting = (languageCountry) => {
    const functions = [{
        name: 'searchPodcast', func: searchPodcast }, {
        name: 'lookupPodcast', func: lookupPodcast        
    }];
    const mock = initMock('podcasts/get', functions);

    
};

languageTesting(functionTesting);
