'use strict';

import { searchPodcast, lookupPodcast } from '../../src/lib/podcasts/search';
import { initMock, languagesCode } from '../../__mocks__/mocks';


const functions = [{
    name: 'searchPodcast', func: searchPodcast }, {
    name: 'lookupPodcast', func: lookupPodcast        
}];
let mock;

beforeAll(async (done) => {
    mock = await initMock('podcasts/search', functions);

    done();
});

jest.setTimeout(60000);
    
describe('Nothing yet.', () => {
    test.skip('Nothing yet.', () => {
        expect(true).toEqual(true);
    });
});
