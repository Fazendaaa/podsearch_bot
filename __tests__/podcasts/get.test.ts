'use strict';

import { searchPodcast, lookupPodcast } from '../../src/lib/podcasts/get';
import { initMock, languageTesting } from '../../__mocks__/mocks';

const functionTesting = (languageCountry) => {
    const functions = [{
        name: 'searchPodcast', func: searchPodcast }, {
        name: 'lookupPodcast', func: lookupPodcast        
    }];
    const mock = initMock('podcasts/get', functions);
    const translate = mock[languageCountry].translate;
    const array = mock[languageCountry].mock[name];

    expect.assertions(array.length);

    return functions.forEach(({ name, func }) => {

    });
};

describe.skip('Skiping', () => {
    test.skip('skipping');
});

// languageTesting(functionTesting);
