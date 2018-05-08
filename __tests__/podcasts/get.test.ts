'use strict';

import { searchPodcast, lookupPodcast } from '../../src/lib/podcasts/get';
import { initMock, languageTesting, safeAttribution } from '../../__mocks__/mocks';

const functions = [{
    name: 'searchPodcast', func: searchPodcast }, {
    name: 'lookupPodcast', func: lookupPodcast        
}];
const mock = initMock('podcasts/get', functions);

const functionTesting = ({ name, mock, languageCountry }, { func }) => test(name, async () => {
    const translate = mock[languageCountry].translate;
    const array = mock[languageCountry].mock[name];

    expect.assertions(array.length);

    return array.reduce(async (acc, cur) => {
        const value = await safeAttribution({ cur }, { func: func(cur.input) });
        acc.then((result) => result.push(value));

        return acc;
    }, Promise.resolve( [] ));
});

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func }));
});
