/**
 * Tests stream.
 */
'use strict';

import { response } from 'itunes-search';
import { resultExtended } from '../../src/@types/parse/main';
import { item } from '../../src/@types/stream/main';
import {
    lastEpisode,
    linkEpisode,
    nameEpisode
} from '../../src/others/stream';
import { readAsync } from '../../src/others/utils';

jest.setTimeout(60000);

const mockLanguage: string = 'en';
const mockLanCode: string = 'en-us';

/**
 * RSS item has different kind of podcast link. Verifies all kind available.
 */
describe('Testing linkEpisode function.', () => {
    test('rss \"undefined\".', () => {
        expect(() => {
            return linkEpisode(undefined);
        }).toThrowError('Wrong argument.');
    });

    test('rss has only \"guid\" -- with https.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            delete mockInput.link;

            return expect(linkEpisode(mockInput)).toMatch(`${mockInput.guid}`);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('rss has \"guid\" -- without https.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            return expect(linkEpisode(mockInput)).toMatch(`${mockInput.guid}`);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('rss has only \"guid\" -- without https.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.1.json').then((mockInput: item) => {
            delete mockInput.link;

            return expect(linkEpisode(mockInput)).toEqual(undefined);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('rss has only \"link\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            delete mockInput.guid;

            return expect(linkEpisode(mockInput)).toMatch(`${mockInput.link}`);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('rss has both.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            return expect(linkEpisode(mockInput)).toMatch(`${mockInput.guid}`);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

/**
 * Fetch episode name.
 */
describe('Testing nameEpisode function.', () => {
    test('both \"undefined\".', () => {
        return expect(() => {
            return nameEpisode(undefined, undefined);
        }).toThrow('Wrong argument.');
    });

    test('rss \"undefined\".', () => {
        return expect(() => {
            return nameEpisode(undefined, mockLanguage);
        }).toThrow('Wrong argument.');
    });

    test('language \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            return expect(() => {
                return nameEpisode(mockInput, undefined);
            }).toThrow('Wrong argument.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('All working.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            return expect(nameEpisode(mockInput, mockLanguage)).toEqual(`${mockInput.title}`);
        });
    });
});

/**
 * Since   last  episode  is  not  related  to  the  podcast  language,  there's  no  need  of  testing  this  with  the
 * internationalization data.
 */
describe('Testing lastEpisode function.', () => {
    test('both \"undefined\".', () => {
        return expect(lastEpisode(undefined, undefined)).rejects.toMatch('Wrong argument.');
    });

    test('id is \"undefined\".', () => {
        return expect(lastEpisode(undefined, mockLanCode)).rejects.toMatch('Wrong argument.');
    });

    test('lanCode is \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(mockInput.results[0].trackId, undefined)).rejects.toMatch('Wrong argument.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Wrong id.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(0, mockLanCode)).rejects.toMatch('Something wrong occurred with search.');
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
                return expect(lastEpisode(mockInput.results[0].trackId, mockLanCode)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw(error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
