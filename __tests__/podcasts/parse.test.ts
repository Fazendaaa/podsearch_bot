/**
 * Tests basic.
 *
 * Basic matchers difference:
 *  * toBe = for numbers;
 *  * toEqual = for object;
 *  * toMatch = for string.
 * The others are selfs explanatory.
 *
 * The other important thing is that all the locale options here will be set to mockLanCode even though there is a file with
 * all the en-us testing, but that file is only for those tests where language and country are extreme relevant to it.
 */
'use strict';

import * as i18n_node_yaml from 'i18n-node-yaml';
import {
    response,
    result
} from 'itunes-search';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { shorten } from 'tinyurl';
import { resultExtended } from '../../src/@types/parse/main';
import {
    hasGenres,
    hasItAll,
    maskResponse,
    maskResponseInline,
    parse,
    parseResponse,
    parseResponseInline,
    shortenLinks
} from '../../src/others/parse';
import { readAsync } from '../../src/others/utils';

/**
 * Setting timeout to 60s === 60000ms.
 */
jest.setTimeout(60000);

const mockLanCode: string = 'en-us';

/**
 * Why not use a real language code instead? Because of the overhead of refactoring if that language becomes available.
 */
const unsupportedLanCode: string = 'nothing';
const noComplete: string = 'No complete info in the results results to display it.';
const noArg: string = 'Wrong argument.';
let i18nNode = undefined;
let mockI18nNode = undefined;

beforeAll(() => {
    /**
     * It might not seen but, under the hood, i18n_node_yaml is calling a Promise.
     */
    i18nNode = i18n_node_yaml({
        debug: true,
        translationFolder: join(__dirname, '../../locales'),
        locales: ['en', 'pt']
    });

    /**
     * Wrong path on purpose to raise an error.
     */
    mockI18nNode = i18n_node_yaml({
        debug: true,
        translationFolder: join(__dirname, '../../__mocks__/locales'),
        locales: ['en', 'pt']
    });
});

/**
 * Just a mock function to run shorten without success.
 */
const mockShorten = (link: string): Promise<string> =>
new Promise((resolve: (data: string) => void, reject: (error: string) => void) => {
    reject('Has no RSS available.');
});

describe('Testing hasGenres function', () => {
    test('Only \"undefined\".', () => {
        expect(hasGenres(undefined)).toBeUndefined();
    });

    /**
     * Haven't write one only with empty -- without the an array -- because the TS raises an type error. That is one of
     * the advantages of writing tests on a type language.
     */
    test('Empty string.', () => {
        expect(hasGenres([''])).toMatch('');
    });

    test('One argument.', () => {
        expect(hasGenres(['one arg'])).toMatch('one arg');
    });

    test('Two arguments.', () => {
        expect(hasGenres(['one arg', 'two arg'])).toMatch('one arg | two arg');
    });

    test('Three arguments.', () => {
        expect(hasGenres(['one arg', 'two arg', 'three arg'])).toMatch('one arg | two arg | three arg');
    });
});

/**
 * Since  this  is  an mocking test to verify whether or not the data is available instead of the kind of it, there's no
 * need of checking it coercion.
 */
describe('Testing hasItAll function.', () => {
    test('Has it all.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return expect(hasItAll(mockInput.results[0])).toBeTruthy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Only \"undefined\".', () => {
        expect(hasItAll(undefined)).toBeFalsy();
    });

    test('Without releaseDate.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl60;

            return expect(hasItAll(mockInput.results[0])).toBeTruthy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl100;

            return expect(hasItAll(mockInput.results[0])).toBeTruthy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl60;
            delete mockInput.results[0].artworkUrl100;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artistName;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].collectionViewUrl;

            return expect(hasItAll(mockInput.results[0])).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing maskResponse function.', () => {
    /**
     * Since  the  caller  function  of maskResponse has already verified all of the data passed to it if verified again
     * this would mean a twice check up, that being said it would mean a more slow program due this double checking.
     */
    test('Only \"undefined\".', () => {
        expect(maskResponse(undefined)).toBeUndefined();
    });
});

describe('Testing maskResponseInline function.', () => {
    test('Only \"undefined\".', () => {
        expect(maskResponseInline(undefined, i18nNode.api)).toBeUndefined();
    });

    test('Without artworkUrl60, artworkUrl100 and artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/maskResponseInline.json').then((mockInput: resultExtended) => {
            return readAsync('nerdcast/unsupported/output/maskResponseInline.1.json').then((mockOutput: resultExtended) => {
                delete mockInput.artworkUrl60;
                delete mockInput.artworkUrl100;
                delete mockInput.artworkUrl600;

                return expect(maskResponseInline(mockInput, i18nNode.api)).toEqual(mockOutput);
            }).catch((error: Error) => {
                throw(error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/maskResponseInline.json').then((mockInput: resultExtended) => {
            return readAsync('nerdcast/unsupported/output/maskResponseInline.2.json').then((mockOutput: resultExtended) => {
                delete mockInput.artworkUrl60;
                delete mockInput.artworkUrl100;

                return expect(maskResponseInline(mockInput, i18nNode.api)).toEqual(mockOutput);
            }).catch((error: Error) => {
                throw (error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    /**
     * There's  no  1need  to  check  without  artworkUrl100  and  artworkUrl600  because  when  if both are missing and
     * artworkUrl60 is presented it will be used.
     */
    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/maskResponseInline.json').then((mockInput: resultExtended) => {
            return readAsync('nerdcast/unsupported/output/maskResponseInline.3.json').then((mockOutput: resultExtended) => {
                delete mockInput.artworkUrl60;

                return expect(maskResponseInline(mockInput, i18nNode.api)).toEqual(mockOutput);
            }).catch((error: Error) => {
                throw (error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

/**
 * Since  shortenLinks  function also parse it the data for the latest episode, this would mean a need to check this out
 * too.  But  since  the  caller function already verify this, there's no need; even if there's no releaseDate info, the
 * moment  library  would  return the current OS date, that of course would mean an error, but since I don't know how to
 * properly  write  a  moment error -- which, otherwise throws an error that is handled --, there's no way I can write a
 * test for it.
 */
describe('Testing shortenLinks function.', () => {
    test('data \"undefined\".', () => {
        expect(shortenLinks(undefined, shorten)).rejects.toMatch('Wrong argument.');
    });

    test('Shorten all nerdcast links.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/shortened.json').then((mockOutput: resultExtended) => {
                return expect(shortenLinks(mockInput.results[0], shorten)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw (error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast RSS link -- without iTunes link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].collectionViewUrl;

            return expect(shortenLinks(mockInput.results[0], shorten)).rejects.toMatch('Has no iTunes link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast iTunes link -- without RSS link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(shortenLinks(mockInput.results[0], shorten)).rejects.toMatch('Has no RSS link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten a non-link in RSS.', () => {
        expect.assertions(1);

        /**
         * A  new  unsupported folder is needed because this kind of test is too closed, when changes occur to supported
         * languages won't be need to refactor each time this test; that's why relaying in the en-us to this case isn't
         * the best approach at first sight.
         */
        return readAsync('nerdcast/unsupported/input/searchCommand.1.json').then((mockInput: response) => {
            return expect(shortenLinks(mockInput.results[0], shorten)).rejects.toMatch('Has no RSS link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten a non-link in iTunes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.2.json').then((mockInput: response) => {
            return expect(shortenLinks(mockInput.results[0], shorten)).rejects.toMatch('Has no iTunes link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

/**
 * Since  parse  function takes an function as argument, to transform the data, in this test it will be given a function
 * that only returns this data, preserving from changes.
 */
const returnParse = (data: object): object => {
    return data;
};

describe('Testing parse function', () => {
    test('All \"undefined\".', () => {
        expect(parse(undefined, undefined, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('data and userId \"undefined\".', () => {
        expect(parse(undefined, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('data and lanCode \"undefined\".', () => {
        expect(parse(undefined, undefined, returnParse, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('userId and lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parse(mockInput, undefined, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('data \"undefined\".', () => {
        expect(parse(undefined, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parse(mockInput, undefined, returnParse, shorten, i18nNode.api)).rejects.toMatch(noArg);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Parsing nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parsed.json').then((mockOutput: Array<resultExtended>) => {
                return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    /**
     * Since it will check out first the resultCount, there is no need of population results array.
     */
    test('resultCount equals to zero.', () => {
        const srcResponse: response = {
            resultCount: 0,
            results: []
        };

        expect(parse(srcResponse, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    /**
     * Since results array must be empty, there is no need of populating also.
     */
    test('Without results array.', () => {
        const srcResponse: response = {
            resultCount: 1,
            results: []
        };

        expect(parse(srcResponse, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
    });

    test('Without releaseDate.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parsed.1.json').then((mockOutput: Array<resultExtended>) => {
                delete mockInput.results[0].artworkUrl60;

                return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parsed.2.json').then((mockOutput: Array<resultExtended>) => {
                delete mockInput.results[0].artworkUrl100;

                return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl60;
            delete mockInput.results[0].artworkUrl100;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].collectionViewUrl;

            return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionId.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].collectionId;

            return readAsync('nerdcast/unsupported/output/parsed.json').then((mockOutput: Array<resultExtended>) => {
                return expect(parse(mockInput, mockLanCode, returnParse, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/parsed.1.json').then((mockOutput: Array<resultExtended>) => {
                return expect(parse(mockInput, unsupportedLanCode, returnParse, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Unsupported releaseDate.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.3.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/parsed.2.json').then((mockOutput: Array<resultExtended>) => {
                return expect(parse(mockInput, unsupportedLanCode, returnParse, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no real shorten.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parse(mockInput, unsupportedLanCode, returnParse, mockShorten, i18nNode.api)).rejects.toMatch('Has no RSS link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no real i18nNode.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parse(mockInput, unsupportedLanCode, returnParse, shorten, mockI18nNode.api)).rejects.toThrow();
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parseResponse function', () => {
    test('All \"undefined\".', () => {
        expect(parseResponse(undefined, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('data and userId \"undefined\".', () => {
        expect(parseResponse(undefined, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('data and lanCode \"undefined\".', () => {
        expect(parseResponse(undefined, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('userId and lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parseResponse(mockInput, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('data \"undefined\".', () => {
        expect(parseResponse(undefined, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parseResponse(mockInput, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no RSS link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no latest episode date.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artistName;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(parseResponse(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/parseResponse.json').then((mockOutput: Array<resultExtended>) => {
                return expect(parseResponse(mockInput, unsupportedLanCode, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

/**
 * Why  use  searchCommand? Because if a search returns only one searched element and, that element, hasn't all the data
 * complete, the search must return empty.
 */
describe('Testing parseResponseInline function', () => {
    test('All \"undefined\".', () => {
        expect(parseResponseInline(undefined, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('data and userId \"undefined\".', () => {
        expect(parseResponseInline(undefined, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('data and lanCode \"undefined\".', () => {
        expect(parseResponseInline(undefined, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('userId and lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parseResponseInline(mockInput, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('data \"undefined\".', () => {
        expect(parseResponseInline(undefined, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parseResponseInline(mockInput, undefined, shorten, i18nNode.api)).rejects.toMatch(noArg);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('resultCount equals to zero.', () => {
        const srcResponse: response = {
            resultCount: 0,
            results: []
        };
        expect.assertions(1);

        return expect(parseResponseInline(srcResponse, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noArg);
    });

    test('No results.', () => {
        const srcResponse: response = {
            resultCount: 20,
            results: []
        };
        expect.assertions(1);

        return expect(parseResponseInline(srcResponse, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
    });

    test('Has no RSS link', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no latest episode date.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artistName;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(parseResponseInline(mockInput, mockLanCode, shorten, i18nNode.api)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/unsupported/input/searchInline.json').then((mockInput: response) => {
            return readAsync('nerdcast/unsupported/output/parseResponseInline.json').then((mockOutput: Array<telegramInline>) => {
                return expect(parseResponseInline(mockInput, unsupportedLanCode, shorten, i18nNode.api)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
