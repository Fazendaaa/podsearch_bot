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
 * Setting timeout to 10s.
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

// describe('Testing removeCmd function', () => {
//     test('Searching \"/search Nerdcast\".', () => {
//         expect(removeCmd('/search Nerdcast')).toEqual('Nerdcast');
//     });

//     /**
//      * It is good to test a simple input without spaces then one with it, to see whether or not the regex is working.
//      */
//     test('Searching \"/search The Story by The Mission\".', () => {
//         expect(removeCmd('/search The Story by The Mission')).toEqual('The Story by The Mission');
//     });

//     test('Just \"/search\"', () => {
//         expect(removeCmd('/search')).toEqual('');
//     });

//     /**
//      * Need to change this function later to return nothing instead of an backslash.
//      */
//     test('Just a \"/\".', () => {
//         expect(removeCmd('/')).toEqual('/');
//     });

//     test('Empty string.', () => {
//         expect(removeCmd('')).toEqual('');
//     });

//     /**
//      * Since there's no command there's nothing to be removed.
//      */
//     test('Only \"The Story by The Mission\".', () => {
//         expect(removeCmd('The Story by The Mission')).toEqual('The Story by The Mission');
//     });

//     test('Only \"undefined\".', () => {
//         expect(removeCmd(undefined)).toEqual(undefined);
//     });
// });

// describe('Testing messageToString function.', () => {
//     test('Searching \"@podsearchbot The Story by The Mission\"', () => {
//         expect(messageToString('The Story by The Mission')).toEqual('The Story by The Mission');
//     });

//     test('Only \"undefined\".', () => {
//         expect(messageToString(undefined)).toEqual(undefined);
//     });

//     test('Empty string.', () => {
//         expect(messageToString('')).toEqual('');
//     });
// });

// describe('Testing hasGenres function', () => {
//     test('Only \"undefined\".', () => {
//         expect(hasGenres(undefined)).toEqual(undefined);
//     });

//     /**
//      * Haven't write one only with empty -- without the an array -- because the TS raises an type error. That is one of
//      * the advantages of writing tests on a type language.
//      */
//     test('Empty string.', () => {
//         expect(hasGenres([''])).toEqual('');
//     });

//     test('One argument.', () => {
//         expect(hasGenres(['one arg'])).toEqual('one arg');
//     });

//     test('Two arguments.', () => {
//         expect(hasGenres(['one arg', 'two arg'])).toEqual('one arg | two arg');
//     });

//     test('Three arguments.', () => {
//         expect(hasGenres(['one arg', 'two arg', 'three arg'])).toEqual('one arg | two arg | three arg');
//     });
// });

// /**
//  * Since  this  is  an mocking test to verify whether or not the data is available instead of the kind of it, there's no
//  * need of checking it coercion.
//  */
// describe('Testing hasItAll function.', () => {
//     test('Has it all.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             expect(hasItAll(mock)).toEqual(true);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Only \"undefined\".',() => {
//         expect(hasItAll(undefined)).toEqual(false);
//     });

//     test('Without releaseDate.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.releaseDate;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl60.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.artworkUrl60;

//             expect(hasItAll(mock)).toEqual(true);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl100.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.artworkUrl100;

//             expect(hasItAll(mock)).toEqual(true);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl60 and artworkUrl100.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.artworkUrl60;
//             delete mock.artworkUrl100;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl600.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.artworkUrl600;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artistName.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.artistName;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without country.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.country;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without trackCount.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.trackCount;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without feedUrl.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.feedUrl;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without genres.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.genres;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without collectionViewUrl.', (done: jest.DoneCallback) => {
//         readAsync('result.json').then((mock: result) => {
//             delete mock.collectionViewUrl;

//             expect(hasItAll(mock)).toEqual(false);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('Testing maskResponse function.', () => {
//     /**
//      * Since  the  caller  function  of maskResponse has already verified all of the data passed to it if verified again
//      * this would mean a twice check up, that being said it would mean a more slow program due this double checking.
//      */
//     test('Only \"undefined\".', () => {
//         expect(maskResponse(undefined)).toEqual(undefined);
//     });
// });

// describe('Testing maskResponseInline function.', () => {
//     test('Only \"undefined\".', () => {
//         expect(maskResponseInline(undefined)).toEqual(undefined);
//     });
// });

// /**
//  * Since  shortenLinks  function also parse it the data for the latest episode, this would mean a need to check this out
//  * too.  But  since  the  caller function already verify this, there's no need; even if there's no releaseDate info, the
//  * moment  library  would  return the current OS date, that of course would mean an error, but since I don't know how to
//  * properly  write  a  moment error -- which, otherwise throws an error that is handled --, there's no way I can write a
//  * test for it.
//  */
// describe('Testing shortenLinks function.', () => {
//     test('Only \"undefined\".', () => {
//         expect(shortenLinks(undefined)).rejects.toEqual('Wrong argument.');
//     });

//     test('Shorten all nerdcast links.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const dst: resultExtended = {
//                 ...mock,
//                 itunes: 'https://goo.gl/kwHu7z',
//                 rss: 'https://goo.gl/bECbi2',
//                 latest: 'July 11th 2016, 4:05 am'
//             };

//             expect(shortenLinks(mock)).resolves.toEqual(dst);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Shorten nerdcast RSS link -- without iTunes link.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             delete mock.feedUrl;

//             expect(shortenLinks(mock)).rejects.toEqual('Has no RSS link available.');
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Shorten nerdcast iTunes link -- without RSS link.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             delete mock.collectionViewUrl;

//             expect(shortenLinks(mock)).rejects.toEqual('Has no iTunes link available.');
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('Testing parse function', () => {
//     const noComplete: string = 'No complete info in the results results to display it.';

//     test('undefined', () => {
//         expect(parse(undefined)).rejects.toEqual('Empty results.');
//     });

//     /**
//      * Since it will check out first the resultCount, there is no need of population results array.
//      */
//     test('resultCount equals to zero.', () => {
//         const srcResponse: response = {
//             resultCount: 0,
//             results: []
//         };

//         expect(parse(srcResponse)).rejects.toEqual('Empty results.');
//     });

//     /**
//      * Since results array must be empty, there is no need of populating also.
//      */
//     test('Without results array.', () => {
//         const srcResponse: response = {
//             resultCount: 1,
//             results: []
//         };

//         expect(parse(srcResponse)).rejects.toEqual(noComplete);
//     });

//     test('Without releaseDate.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].releaseDate;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl60.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             readAsync('nerdcast/en-us/outputOne.json').then((mockOutput: result) => {
//                 const srcResponse: response = {
//                     resultCount: 1,
//                     results: [mockInput]
//                 };
//                 delete srcResponse.results[0].artworkUrl60;

//                 expect(parse(srcResponse)).resolves.toEqual(mockOutput);
//                 done();
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl100.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             readAsync('nerdcast/en-us/outputOne.json').then((mockOutput: result) => {
//                 const srcResponse: response = {
//                     resultCount: 1,
//                     results: [mockInput]
//                 };
//                 delete srcResponse.results[0].artworkUrl100;

//                 expect(parse(srcResponse)).resolves.toEqual(mockOutput);
//                 done();
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl60 and artworkUrl100.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].artworkUrl60;
//             delete srcResponse.results[0].artworkUrl100;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artworkUrl600.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].artworkUrl600;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without artistName.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].releaseDate;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without country.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].country;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without trackCount.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].trackCount;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without feedUrl.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].feedUrl;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without genres.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].genres;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Without collectionViewUrl.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mock: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mock]
//             };
//             delete srcResponse.results[0].collectionViewUrl;

//             expect(parse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('Testing parseResponse function', () => {
//     const noComplete: string = 'No complete info in the results results to display it.';

//     test('Parse nerdcast.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             readAsync('nerdcast/en-us/outputThree.json').then((mockOutput: result) => {
//                 const srcResponse: response = {
//                     resultCount: 1,
//                     results: [mockInput]
//                 };

//                 expect(parseResponse(srcResponse)).resolves.toEqual(mockOutput);
//                 done();
//             }).catch((error: Error) => {
//                 throw error;
//             });
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Data equals to undefined.', () => {
//         expect(parseResponse(undefined)).rejects.toEqual('Empty results.');
//     });

//     test('Has no RSS link.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].feedUrl;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no iTunes link.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].artworkUrl600;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no latest episode date.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].releaseDate;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no podcast artwork.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].artworkUrl600;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no name.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].artistName;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no country.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].country;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no genre.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].genres;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('Has no number of episodes.', (done: jest.DoneCallback) => {
//         readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
//             const srcResponse: response = {
//                 resultCount: 1,
//                 results: [mockInput]
//             };
//             delete srcResponse.results[0].trackCount;

//             expect(parseResponse(srcResponse)).rejects.toEqual(noComplete);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

describe('Testing parseResponseInline function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Parse nerdcast', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputTwo.json').then((mockInput: response) => {
            return readAsync('nerdcast/en-us/outputFour.json').then((mockOutput: Array<telegramInline>) => {
                return expect(parseResponseInline(mockInput, 'en-us')).resolves.toEqual(mockOutput);
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
            return expect(parseResponseInline(mockInput, undefined)).rejects.toEqual('No lanCode available.');
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

        return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual('Empty results.');
    });

    test('No results.', () => {
        const srcResponse: response = {
            resultCount: 20,
            results: []
        };
        expect.assertions(1);

        return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
    });

    test('Data equals to undefined.', () => {
        expect.assertions(1);

        return expect(parseResponseInline(undefined, 'en-us')).rejects.toEqual('Empty results.');
    });

    test('Has no RSS link', () => {
        expect.assertions(1);

        return readAsync('nerdcast/en-us/inputOne.json').then((mockInput: result) => {
            const srcResponse: response = {
                resultCount: 1,
                results: [mockInput]
            };
            delete srcResponse.results[0].feedUrl;

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
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

            return expect(parseResponseInline(srcResponse, 'en-us')).rejects.toEqual(noComplete);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

// describe('Testing errorInline function', () => {
//     test('lanCode equals to undefined', () => {
//         expect(errorInline(undefined)).toEqual(undefined);
//     });

//     test('lanCode equals to en-uS', (done: jest.DoneCallback) => {
//         readAsync('/inline/en-us/errorInline.json').then((file: Array<telegramInline>) => {
//             expect(errorInline('en-us')).toEqual(file);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('lanCode equals to pt-br', (done: jest.DoneCallback) => {
//         readAsync('/inline/pt-br/errorInline.json').then(file => {
//             expect(errorInline('pt-br')).toEqual(file);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });

// describe('Testing searchInline function', () => {
//     test('lanCode equals to undefined', () => {
//         expect(searchInline(undefined)).toEqual(undefined);
//     });

//     test('lanCode equals to en-us', (done: jest.DoneCallback) => {
//         readAsync('/inline/en/searchInline.json').then(file => {
//             expect(searchInline('en-us')).toEqual(file);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });

//     test('lanCode equals to pt-br', (done: jest.DoneCallback) => {
//         readAsync('/inline/pt/searchInline.json').then(file => {
//             console.log(searchInline('pt-br'));
//             // expect(searchInline('pt-br')).toEqual(file);
//             done();
//         }).catch((error: Error) => {
//             console.error(error);
//         });
//     });
// });
