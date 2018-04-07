/**
 * Tests stream.
 */
'use strict';

import { response } from 'itunes-search';
import { resultExtended } from '../../src/@types/parse/main';
import { item } from '../../src/@types/stream/main';
import {
    lastEpisode,
    linkEpisode
} from '../../src/others/stream';
import { readAsync } from '../../src/others/utils';

jest.setTimeout(60000);

/**
 * RSS item has different kind of podcast link. Verifies all kind available.
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
    test('both \"undefined\".', () => {
        expect.assertions(1);

        return expect(lastEpisode(undefined, undefined)).rejects.toMatch('Wrong argument.');
    });

    test('id is \"undefined\".', () => {
        expect.assertions(1);

        return expect(lastEpisode(undefined, undefined)).rejects.toMatch('Wrong argument.');
    });

    test('lanCode is \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(mockInput.results[0].trackId, undefined)).rejects.toMatch('Wrong argument.');
        }).catch((error: Error) => {
            console.error(error);
        });

    });

    /**
     * Last at the time of this writing.
     */
    test('Fetching \"last\" nerdcast episode.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/lastEpisode.json').then((mockOutput: resultExtended) => {
                return expect(lastEpisode(mockInput.results[0].trackId, 'en-us')).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw(error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
