/**
 * Tests stream.
 */
'use strict';

import { response } from 'itunes-search';
import { lastEpisode } from '../../src/others/stream';
import { readAsync } from '../../src/others/utils';

jest.setTimeout(60000);

/**
 * Since last episode is not related to the podcast language, there's no need of testing this in 
 */
describe('Testing lastEpisode function.', () => {
    test('id is \"undefined\".', () => {
        expect.assertions(1);

        return expect(lastEpisode(undefined)).rejects.toMatch('Something wrong occurred.');
    });

    /**
     * Last at the time of this writing.
     */
    test('Fetching \"last\" nerdcast episode.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(mockInput.results[0].trackId)).resolves.toEqual('No');
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
