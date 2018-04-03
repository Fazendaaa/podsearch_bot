/**
 * Tests basic.
 *
 * Basic matchers difference:
 *  * toBe = for numbers;
 *  * toEqual = for object;
 *  * toMatch = for string.
 * The others are selfs explanatory.
 *
 * The other important thing is that all the locale options here will be set to 'en-us' even though there is a file with
 * all the en-us testing, but that file is only for those tests where language and country are extreme relevant to it.
 */
'use strict';

import {
    response,
    result
} from 'itunes-search';
import {
    telegramInline
} from 'telegraf';
import { resultExtended } from '../../src/@types/utils/main';
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
import {
    errorInline,
    messageToString,
    readAsync,
    removeCmd,
    searchInline
} from '../../src/others/utils';

/**
 * Setting timeout to 60s === 60000ms.
 */
jest.setTimeout(60000);

describe('Testing removeCmd function', () => {
    test('Searching \"/search Nerdcast\".', () => {
        expect(removeCmd('/search Nerdcast')).toMatch('Nerdcast');
    });

    /**
     * It is good to test a simple input without spaces then one with it, to see whether or not the regex is working.
     */
    test('Searching \"/search The Story by The Mission\".', () => {
        expect(removeCmd('/search The Story by The Mission')).toMatch('The Story by The Mission');
    });

    test('Just \"/search\"', () => {
        expect(removeCmd('/search')).toMatch('');
    });

    /**
     * Need to change this function later to return nothing instead of an backslash.
     */
    test('Just a \"/\".', () => {
        expect(removeCmd('/')).toMatch('/');
    });

    test('Empty string.', () => {
        expect(removeCmd('')).toMatch('');
    });

    /**
     * Since there's no command there's nothing to be removed.
     */
    test('Only \"The Story by The Mission\".', () => {
        expect(removeCmd('The Story by The Mission')).toMatch('The Story by The Mission');
    });

    test('Only \"undefined\".', () => {
        expect(removeCmd(undefined)).toBeUndefined();
    });
});

describe('Testing messageToString function.', () => {
    test('Searching \"@podsearchbot The Story by The Mission\"', () => {
        expect(messageToString('The Story by The Mission')).toMatch('The Story by The Mission');
    });

    test('Only \"undefined\".', () => {
        expect(messageToString(undefined)).toBeUndefined();
    });

    test('Empty string.', () => {
        expect(messageToString('')).toMatch('');
    });
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

        return readAsync('result.json').then((mockInput: result) => {
            return expect(hasItAll(mockInput)).toBeTruthy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Only \"undefined\".', () => {
        expect(hasItAll(undefined)).toBeFalsy();
    });

    test('Without releaseDate.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.releaseDate;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.artworkUrl60;

            return expect(hasItAll(mockInput)).toBeTruthy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.artworkUrl100;

            return expect(hasItAll(mockInput)).toBeTruthy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.artworkUrl60;
            delete mockInput.artworkUrl100;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.artworkUrl600;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.artistName;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.country;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.trackCount;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.feedUrl;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.genres;

            return expect(hasItAll(mockInput)).toBeFalsy();
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mockInput: result) => {
            delete mockInput.collectionViewUrl;

            return expect(hasItAll(mockInput)).toBeFalsy();
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
        expect(maskResponseInline(undefined)).toBeUndefined();
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
    test('Both \"undefined\".', () => {
        expect(shortenLinks(undefined, undefined)).rejects.toMatch('Wrong argument.');
    });

    test('data \"undefined\".', () => {
        expect(shortenLinks(undefined, 'en-us')).rejects.toMatch('Wrong argument.');
    });

    test('lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            expect(shortenLinks(mockInput.results[0], undefined)).rejects.toMatch('Wrong argument.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten all nerdcast links.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/shortened.json').then((mockOutput: resultExtended) => {
                return expect(shortenLinks(mockInput.results[0], 'en-us')).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw (error);
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast RSS link -- without iTunes link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].collectionViewUrl;

            return expect(shortenLinks(mockInput.results[0], 'en-us')).rejects.toMatch('Has no iTunes link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast iTunes link -- without RSS link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(shortenLinks(mockInput.results[0], 'en-us')).rejects.toMatch('Has no RSS link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parse function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Both \"undefined\".', () => {
        expect(parse(undefined, undefined)).rejects.toMatch('Empty results.');
    });

    test('data \"undefined\".', () => {
        expect(parse(undefined, 'en-us')).rejects.toMatch('Empty results.');
    });

    test('lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parse(mockInput, undefined)).rejects.toMatch('Empty results.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Parsing nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parsed.json').then((mockOutput: Array<resultExtended>) => {
                return expect(parse(mockInput, 'en-us')).resolves.toEqual(mockOutput);
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

        expect(parse(srcResponse, 'en-us')).rejects.toMatch('Empty results.');
    });

    /**
     * Since results array must be empty, there is no need of populating also.
     */
    test('Without results array.', () => {
        const srcResponse: response = {
            resultCount: 1,
            results: []
        };

        expect(parse(srcResponse, 'en-us')).rejects.toMatch(noComplete);
    });

    test('Without releaseDate.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/output/parsed.1.json').then((mockOutput: Array<resultExtended>) => {
                delete mockInput.results[0].artworkUrl60;

                return expect(parse(mockInput, 'en-us')).resolves.toEqual(mockOutput);
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

                return expect(parse(mockInput, 'en-us')).resolves.toEqual(mockOutput);
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

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].collectionViewUrl;

            return expect(parse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parseResponse function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Both \"undefined\".', () => {
        expect(parseResponse(undefined, 'en-us')).rejects.toMatch('Empty results.');
    });

    test('data \"undefined\".', () => {
        expect(parseResponse(undefined, 'en-us')).rejects.toMatch('Empty results.');
    });

    test('lanCode \"undefined\".', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            return expect(parseResponse(mockInput, undefined)).rejects.toMatch('Empty results.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no RSS link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no latest episode date.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artistName;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(parseResponse(mockInput, 'en-us')).rejects.toMatch(noComplete);
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
    const noComplete: string = 'No complete info in the results results to display it.';

    test('No lanCode', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchInline.json').then((mockInput: response) => {
            return expect(parseResponseInline(mockInput, undefined)).rejects.toMatch('No lanCode available.');
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

        return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch('Empty results.');
    });

    test('No results.', () => {
        const srcResponse: response = {
            resultCount: 20,
            results: []
        };
        expect.assertions(1);

        return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
    });

    test('Data equals to undefined.', () => {
        expect.assertions(1);

        return expect(parseResponseInline(undefined, 'en-us')).rejects.toMatch('Empty results.');
    });

    test('Has no RSS link', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].feedUrl;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no latest episode date.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].releaseDate;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artworkUrl600;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].artistName;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].country;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].genres;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/input/searchCommand.json').then((mockInput: response) => {
            delete mockInput.results[0].trackCount;

            return expect(parseResponseInline(mockInput, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing errorInline function', () => {
    test('lanCode equals to undefined', () => {
        expect(errorInline(undefined)).toBeUndefined();
    });
});

describe('Testing searchInline function', () => {
    test('lanCode equals to undefined', () => {
        expect(searchInline(undefined)).toBeUndefined();
    });
});
