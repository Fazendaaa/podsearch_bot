/**
 * Tests.
 */
'use strict';

import { readFile } from 'fs';
import {
    response,
    result
} from 'itunes-search';
import { join } from 'path';
import {
    telegramInline
} from 'telegraf';
import {
    errorInline,
    hasGenres,
    hasItAll,
    maskResponse,
    maskResponseInline,
    messageToString,
    parse,
    parseResponse,
    parseResponseInline,
    removeCmd,
    resultExtended,
    searchInline,
    shortenLinks
} from '../src/utils';

/**
 * Setting timeout to 10s === 10000ms.
 */
jest.setTimeout(10000);

/**
 * I  know  that  isn't  the right way of doing mocking tests but, right now, is the way that I came up to. This testing
 * file  is  a nightmare of reading I/O -- need to correct ASAP this, if this continue tha way it is, scale testing will
 * be impossible.
 */
const readAsync = (filename: string) => new Promise((resolve, reject) => {
    readFile(join(__dirname, `../__mocks__/${filename}`), 'utf8', (err: Error, data: string) => {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(data));
        }
    });
});

describe('Testing removeCmd function', () => {
    test('Searching \"/search Nerdcast\".', () => {
        expect(removeCmd('/search Nerdcast')).toEqual('Nerdcast');
    });

    /**
     * It is good to test a simple input without spaces then one with it, to see whether or not the regex is working.
     */
    test('Searching \"/search The Story by The Mission\".', () => {
        expect(removeCmd('/search The Story by The Mission')).toEqual('The Story by The Mission');
    });

    test('Just \"/search\"', () => {
        expect(removeCmd('/search')).toEqual('');
    });

    /**
     * Need to change this function later to return nothing instead of an backslash.
     */
    test('Just a \"/\".', () => {
        expect(removeCmd('/')).toEqual('/');
    });

    test('Empty string.', () => {
        expect(removeCmd('')).toEqual('');
    });

    /**
     * Since there's no command there's nothing to be removed.
     */
    test('Only \"The Story by The Mission\".', () => {
        expect(removeCmd('The Story by The Mission')).toEqual('The Story by The Mission');
    });

    test('Only \"undefined\".', () => {
        expect(removeCmd(undefined)).toEqual(undefined);
    });
});

describe('Testing messageToString function.', () => {
    test('Searching \"@podsearchbot The Story by The Mission\"', () => {
        expect(messageToString('The Story by The Mission')).toEqual('The Story by The Mission');
    });

    test('Only \"undefined\".', () => {
        expect(messageToString(undefined)).toEqual(undefined);
    });

    test('Empty string.', () => {
        expect(messageToString('')).toEqual('');
    });
});

describe('Testing hasGenres function', () => {
    test('Only \"undefined\".', () => {
        expect(hasGenres(undefined)).toEqual(undefined);
    });

    /**
     * Haven't write one only with empty -- without the an array -- because the TS raises an type error. That is one of
     * the advantages of writing tests on a type language.
     */
    test('Empty string.', () => {
        expect(hasGenres([''])).toEqual('');
    });

    test('One argument.', () => {
        expect(hasGenres(['one arg'])).toEqual('one arg');
    });

    test('Two arguments.', () => {
        expect(hasGenres(['one arg', 'two arg'])).toEqual('one arg | two arg');
    });

    test('Three arguments.', () => {
        expect(hasGenres(['one arg', 'two arg', 'three arg'])).toEqual('one arg | two arg | three arg');
    });
});

/**
 * Since  this  is  an mocking test to verify whether or not the data is available instead of the kind of it, there's no
 * need of checking it coercion.
 */
describe('Testing hasItAll function.', () => {
    test('Has it all.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            return expect(hasItAll(mock)).toEqual(true);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Only \"undefined\".', () => {
        expect(hasItAll(undefined)).toEqual(false);
    });

    test('Without releaseDate.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.releaseDate;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl60;

            return expect(hasItAll(mock)).toEqual(true);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl100;

            return expect(hasItAll(mock)).toEqual(true);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl60;
            delete mock.artworkUrl100;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl600;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.artistName;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.country;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.trackCount;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.feedUrl;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.genres;

            return expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        expect.assertions(1);

        return readAsync('result.json').then((mock: result) => {
            delete mock.collectionViewUrl;

            return expect(hasItAll(mock)).toEqual(false);
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
        expect(maskResponse(undefined)).toEqual(undefined);
    });
});

describe('Testing maskResponseInline function.', () => {
    test('Only \"undefined\".', () => {
        expect(maskResponseInline(undefined)).toEqual(undefined);
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
    test('Only \"undefined\".', () => {
        expect(shortenLinks(undefined)).rejects.toMatch('Wrong argument.');
    });

    test('Shorten all nerdcast links.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const dst: resultExtended = {
                ...mock,
                itunes: 'https://goo.gl/kwHu7z',
                rss: 'https://goo.gl/bECbi2',
                latest: 'July 11th 2016, 4:05 am'
            };

            return expect(shortenLinks(mock)).resolves.toBe(dst);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast RSS link -- without iTunes link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            delete mock.feedUrl;

            return expect(shortenLinks(mock)).rejects.toMatch('Has no RSS link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast iTunes link -- without RSS link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            delete mock.collectionViewUrl;

            return expect(shortenLinks(mock)).rejects.toMatch('Has no iTunes link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parse function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('undefined', () => {
        expect(parse(undefined)).rejects.toMatch('Empty results.');
    });

    /**
     * Since it will check out first the resultCount, there is no need of population results array.
     */
    test('resultCount equals to zero.', () => {
        const srcResponse: response = {
            resultCount: 0,
            results: []
        };

        expect(parse(srcResponse)).rejects.toMatch('Empty results.');
    });

    /**
     * Since results array must be empty, there is no need of populating also.
     */
    test('Without results array.', () => {
        const srcResponse: response = {
            resultCount: 1,
            results: []
        };

        expect(parse(srcResponse)).rejects.toMatch(noComplete);
    });

    test('Without releaseDate.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].releaseDate;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            return readAsync('nerdcast/en-us/outputOne.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 1,
                    results: [mockInput]
                };
                delete srcResponse.results[0].artworkUrl60;

                return expect(parse(srcResponse)).resolves.toBe(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            return readAsync('nerdcast/en-us/outputTwo.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 1,
                    results: [mockInput]
                };
                delete srcResponse.results[0].artworkUrl100;

                return expect(parse(srcResponse)).resolves.toBe(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].artworkUrl60;
            delete srcResponse.results[0].artworkUrl100;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].artworkUrl600;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].releaseDate;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].country;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].trackCount;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].feedUrl;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].genres;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].collectionViewUrl;

            return expect(parse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parseResponse function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Parse nerdcast.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            return readAsync('nerdcast/en-us/outputThree.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 1,
                    results: [mockInput]
                };

                return expect(parseResponse(srcResponse)).resolves.toBe(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Data equals to undefined.', () => {
        expect(parseResponse(undefined)).rejects.toMatch('Empty results.');
    });

    test('Has no RSS link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].feedUrl;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no latest episode date.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].releaseDate;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artistName;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].country;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].genres;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].trackCount;

            return expect(parseResponse(srcResponse)).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parseResponseInline function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Parse nerdcast', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputTwo.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/outputFour.json').then((mockOutput: Array<telegramInline>) => {
                return expect(parseResponseInline(mockInput, 'en-us')).resolves.toBe(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('No lanCode', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputTwo.json').then((mockInput: response) => {
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

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].feedUrl;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no latest episode date.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].releaseDate;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artistName;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].country;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].genres;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].trackCount;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toMatch(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing errorInline function', () => {
    test('lanCode equals to undefined', () => {
        expect(errorInline(undefined)).toEqual(undefined);
    });

    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inline/en-us/errorInline.json').then((file: Array<telegramInline>) => {
            return expect(errorInline('en-us')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inline/pt-br/errorInline.json').then(file => {
            return expect(errorInline('pt-br')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing searchInline function', () => {
    test('lanCode equals to undefined', () => {
        expect(searchInline(undefined)).toEqual(undefined);
    });

    test('lanCode equals to en-us', () => {
        expect.assertions(1);

        return readAsync('/inline/en-us/searchInline.json').then(file => {
            return expect(searchInline('en-us')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('lanCode equals to pt-br', () => {
        expect.assertions(1);

        return readAsync('/inline/pt-br/searchInline.json').then(file => {
            return expect(searchInline('pt-br')).toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
