/**
 * Tests stream.
 */
'use strict';

import { response } from 'itunes-search';
import { item } from '../../src/@types/stream/main';
import {
    lastEpisode,
    linkEpisode
} from '../../src/others/stream';
import { readAsync } from '../../src/others/utils';

jest.setTimeout(60000);

/**
 * Lorem ipsum.
 */
describe('Testing linkEpisode function.', () => {
    test('item \"undefined\".', () => {
        expect(() => {
            return linkEpisode(undefined);
        }).toThrowError('Wrong argument.');
    });
});

/**
 * Since   last  episode  is  not  related  to  the  podcast  language,  there's  no  need  of  testing  this  with  the
 * internationalization data.
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
            return readAsync('nerdcast/unsupported/output/lastEpisode.json').then((mockOutput: item) => {
                return expect(lastEpisode(mockInput.results[0].trackId)).resolves.toEqual(mockOutput.link);
            }).catch((error: Error) => {
                throw(error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
