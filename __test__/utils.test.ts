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
    shortenLinks
} from '../src/utils';

/**
 * I  know  that  isn't  the right way of doing mocking tests but, right now, is the way that I came up to. This testing
 * file  is  a nightmare of reading I/O -- need to correct ASAP this, if this continue tha way it is, scale testing will
 * be impossible.
 */
const readAsync = (filename: string) => new Promise((resolve, reject) => {
    readFile(join(__dirname, `../__mocksData__/${filename}`), 'utf8', (err: Error, data: string) => {
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
    test('Justa an \"/\".', () => {
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
    test('Searching \"@podsearch The Story by The Mission\"', () => {
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
 * need of cheking it coersion.
 */
describe('Testing hasItAll function.', async() => {
    test('Has it all.', async() => {
        readAsync('result.json').then((mock: result) => {
            expect(hasItAll(mock)).toEqual(true);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Only \"undefined\".', () => {
        expect(hasItAll(undefined)).toEqual(false);
    });

    test('Without releaseDate.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.releaseDate;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl60;

            expect(hasItAll(mock)).toEqual(true);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl100;

            expect(hasItAll(mock)).toEqual(true);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl60;
            delete mock.artworkUrl100;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.artworkUrl600;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.artistName;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.country;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.trackCount;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.feedUrl;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.genres;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        readAsync('result.json').then((mock: result) => {
            delete mock.collectionViewUrl;

            expect(hasItAll(mock)).toEqual(false);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing maskResponse function.', () => {
    /**
     * Since  the  caller  function  of maskResponse has already verified all of the data passed to it if verified again
     * this would mean a twice check up, that being said it woul mean a more slow programa due this double checking.
     */
    test('Only \"undefined\".', () => {
        expect(maskResponse(undefined)).toEqual(undefined);
    });
});

describe('Testing maskResponseInline function.', () => {
    /**
     * Same disclaimer of the last one.
     */
    test('Only \"undefined\".', () => {
        expect(maskResponseInline(undefined)).toEqual(undefined);
    });
});

/**
 * Since  shortenLinks  function also parse it the data for the latest episode, this would mena a need to check this out
 * too.  But  since  the  caller function already verify this, there's no need; even if there's no releaseDate info, the
 * moment  library  would  return the current OS date, that of course would mean an error, but since I don't know how to
 * properly  write  a  moment  error -- wich, otherwise throws an error that is handled --, there's no way I can write a
 * test for it.
 */
describe('Testing shortenLinks function.', () => {
    test('Only \"undefined\".', () => {
        expect(shortenLinks(undefined)).rejects.toEqual('Wrong argument.');
    });

    test('Shorten all nerdcast links.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const dst: resultExtended = {
                ...mock,
                itunes: 'https://goo.gl/kwHu7z',
                rss: 'https://goo.gl/bECbi2',
                latest: 'July 11th 2016, 4:05 am'
            };

            expect(shortenLinks(mock)).resolves.toEqual(dst);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast RSS link -- without iTunes link.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            delete mock.feedUrl;

            expect(shortenLinks(mock)).rejects.toEqual('Has no RSS link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Shorten nerdcast iTunes link -- without RSS link.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            delete mock.collectionViewUrl;

            expect(shortenLinks(mock)).rejects.toEqual('Has no iTunes link available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parse function', () => {
    test('udefined', () => {
        expect(parse(undefined)).rejects.toEqual('Empty results.');
    });

    /**
     * Since it will check out firt the resultCount, there is no need of population results array.
     */
    test('resultCount equals to zero.', () => {
        const srcResponse: response = {
            resultCount: 0,
            results: []
        };

        expect(parse(srcResponse)).rejects.toEqual('Empty results.');
    });

    /**
     * Since results array must be empty, there is no need of popupating also.
     */
    test('Without results array.', () => {
        const srcResponse: response = {
            resultCount: 1,
            results: []
        };

        expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
    });

    test('Without releaseDate.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].releaseDate;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            readAsync('nerdcast/output_one.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 1,
                    results: [mockInput]
                };
                delete srcResponse.results[0].artworkUrl60;

                expect(parse(srcResponse)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl100.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            readAsync('nerdcast/output_two.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 1,
                    results: [mockInput]
                };
                delete srcResponse.results[0].artworkUrl100;

                expect(parse(srcResponse)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].artworkUrl60;
            delete srcResponse.results[0].artworkUrl100;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artworkUrl600.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].artworkUrl600;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without artistName.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].releaseDate;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without country.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].country;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without trackCount.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].trackCount;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without feedUrl.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].feedUrl;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without genres.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].genres;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Without collectionViewUrl.', () => {
        readAsync('nerdcast/input_one.json').then((mock: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mock]
            };
            delete srcResponse.results[0].collectionViewUrl;

            expect(parse(srcResponse)).rejects.toEqual('No complete info in the results results to display it.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parseResponse function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Parse nerdcast.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            readAsync('nerdcast/output_three.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 1,
                    results: [mockInput]
                };

                expect(parseResponse(srcResponse)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Data equals to undefined.', () => {
        expect(parseResponse(undefined)).rejects.toEqual('Empty results.');
    });

    test('Has no RSS link.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].feedUrl;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no lastest episode date.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].releaseDate;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artistName;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].country;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].genres;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].trackCount;

            expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing parseResponseInline function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';
    const lanCode: string = 'en-US';

    test('Parse nerdcast', () => {
        readAsync('nerdcast/input_two.json').then((mockInput: result) => {
            readAsync('nerdcast/output_four.json').then((mockOutput: result) => {
                const srcResponse: response = {
                    resultCount: 20,
                    results: mockInput
                };

                expect(parseResponseInline(srcResponse, lanCode)).resolves.toEqual(mockOutput);
            }).catch((error: Error) => {
                throw error;
            });
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('No lanCode', () => {
        readAsync('nerdcast/input_two.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 20,
                results: mockInput
            };

            expect(parseResponseInline(srcResponse, undefined)).rejects.toEqual('No lanCode available.');
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('resultCount equals to zero.', () => {
        const srcResponse: response = {
            resultCount: 0,
            results: []
        };

        expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
    });

    test('No results.', () => {
        const srcResponse: response = {
            resultCount: 20,
            results: []
        };

        expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
    });

    test('Data equals to undefined.', () => {
        expect(parseResponseInline(undefined, lanCode)).rejects.toEqual('Empty results.');
    });

    test('Has no RSS link', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].feedUrl;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no iTunes link', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no lastest episode date.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].releaseDate;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no podcast artwork.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artworkUrl600;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no name.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].artistName;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no country.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].country;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no genre.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].genres;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });

    test('Has no number of episodes.', () => {
        readAsync('nerdcast/input_one.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].trackCount;

            expect(parseResponseInline(srcResponse, lanCode)).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
