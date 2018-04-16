/**
 * Tests stream.
 */
'use strict';

import { config } from 'dotenv';
import {
    setKey,
    shorten
} from 'goo.gl';
import * as i18n_node_yaml from 'i18n-node-yaml';
import { response } from 'itunes-search';
import { join } from 'path';
import * as Parser from 'rss-parser';
import { resultExtended } from '../../src/@types/parse/main';
import { item } from '../../src/@types/stream/main';
import {
    lastEpisode,
    linkEpisode,
    nameEpisode
} from '../../src/others/stream';
import { readAsync } from '../../src/others/utils';

config();

setKey(process.env.GOOGLE_KEY);

jest.setTimeout(60000);

/**
 * Emulate when the Parser isn't working.
 */
class MockParser extends Parser {
    constructor(options?: object) {
        super();
    }

    public parseURL(link: string): Promise<string> {
        return new Promise((resolve, reject) => {
            reject('some reject.');
        });
    }
}

/**
 * This  class will be used to test a podcast with a new pattern of episode link. This mock is without any knew pattern
 * to simulate this.
 */
class MockParserLink extends Parser {
    constructor(options?: object) {
        super();
    }

    public parseURL(link: string): Promise<object> {
        return new Promise((resolve, reject) => {
            resolve({
                items: [{
                    title: 'test'
                }]
            });
        });
    }
}

const mockLanguage: string = 'en';
const mockLanCode: string = 'en-us';
const fetcherRss = new Parser();
const mockFetcherRss = new MockParser();
const mockFetcherLinkRss = new MockParserLink();

const mockShorten = (link: string): Promise<string> =>
new Promise((resolve: (data: string) => void, reject: (error: string) => void) => {
    reject('some reject.');
});

let i18nNode = undefined;
let mockI18nNode = undefined;

beforeAll(() => {
    i18nNode = i18n_node_yaml({
        debug: true,
        translationFolder: join(__dirname, '../../locales'),
        locales: ['en', 'pt']
    });

    mockI18nNode = i18n_node_yaml({
        debug: true,
        translationFolder: join(__dirname, '../../__mocks__/locales'),
        locales: ['en', 'pt']
    });
});

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
            return nameEpisode(undefined, undefined, i18nNode.api);
        }).toThrow('Wrong argument.');
    });

    test('rss \"undefined\".', () => {
        return expect(() => {
            return nameEpisode(undefined, mockLanguage, i18nNode.api);
        }).toThrow('Wrong argument.');
    });

    test('language \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            return expect(() => {
                return nameEpisode(mockInput, undefined, i18nNode.api);
            }).toThrow('Wrong argument.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Wrong i18n.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            delete mockInput.title;

            return expect(nameEpisode(mockInput, mockLanguage, mockI18nNode.api)).toBeUndefined();
        });
    });

    test('Without title.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            const returnString: string = 'No last episode name available. Please, report this to my creator.';

            delete mockInput.title;

            return expect(nameEpisode(mockInput, mockLanguage, i18nNode.api)).toMatch(returnString);
        });
    });

    test('All working.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/stream.json').then((mockInput: item) => {
            return expect(nameEpisode(mockInput, mockLanguage, i18nNode.api)).toEqual(`${mockInput.title}`);
        });
    });
});

/**
 * Since   last  episode  is  not  related  to  the  podcast  language,  there's  no  need  of  testing  this  with  the
 * internationalization data.
 */
describe('Testing lastEpisode function.', () => {
    test('both \"undefined\".', () => {
        return expect(lastEpisode(undefined, undefined, i18nNode.api, shorten, fetcherRss)).rejects.toMatch('Wrong argument.');
    });

    test('id is \"undefined\".', () => {
        return expect(lastEpisode(undefined, mockLanCode, i18nNode.api, shorten, fetcherRss)).rejects.toMatch('Wrong argument.');
    });

    test('Wrong id.', () => {
        expect.assertions(1);

        return expect(lastEpisode(0, mockLanCode, shorten, i18nNode.api, fetcherRss)).rejects.toMatch('Something wrong occurred with search.');
    });

    test('lanCode is \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(mockInput.results[0].trackId, undefined, i18nNode.api, shorten, fetcherRss)).rejects.toMatch('Wrong argument.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Wrong parser.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(mockInput.results[0].trackId, mockLanCode, i18nNode.api, shorten, mockFetcherRss)).rejects.toMatch('some reject.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Wrong shorten.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(lastEpisode(mockInput.results[0].trackId, mockLanCode, i18nNode.api, mockShorten, fetcherRss)).rejects.toMatch('some reject.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Wrong i18n.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/lastEpisode.json').then((mockOutput: resultExtended) => {
                return expect(lastEpisode(mockInput.results[0].trackId, mockLanCode, mockI18nNode.api, shorten, fetcherRss)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw (error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Wrong episode link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/lastEpisode.1.json').then((mockOutput: resultExtended) => {
                return expect(lastEpisode(mockInput.results[0].trackId, mockLanCode, mockI18nNode.api, shorten, mockFetcherLinkRss)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw (error);
            });
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
            return readAsync('nerdcast/unsupported/output/lastEpisode.2.json').then((mockOutput: resultExtended) => {
                return expect(lastEpisode(mockInput.results[0].trackId, mockLanCode, i18nNode.api, shorten, fetcherRss)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw(error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
