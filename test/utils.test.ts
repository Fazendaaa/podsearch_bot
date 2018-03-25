'use strict';

/**
 * This  import  might seen a little bit unecessary, but TS compiler complains about the Jest functions being used as an
 * imported  one.  This  is  because /node_modules/@types/jest/index.d.ts doesn't declare Jest as module. Just importing
 * Jest in the tsconfig.json as type is enough.
 */
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

describe('Testing messageToString function', () => {
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

describe('Testing hasItAll function.', () => {
    /**
     * Since  this  is an mocking test to verify whether or not the data is available instead of the kind of it, there's
     * no need of cheking it coersion.
     */
    const mock: result = {
        releaseDate: '',
        artworkUrl60: '',
        artworkUrl100: '',
        artworkUrl600: '',
        artistName: '',
        country: '',
        trackCount: '',
        feedUrl: '',
        genres: '',
        collectionViewUrl: ''
    };

    test('Has it all.', () => {
        expect(hasItAll(mock)).toEqual(true);
    });

    test('Only \"undefined\".', () => {
        expect(hasItAll(undefined)).toEqual(false);
    });

    test('Without releaseDate.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.releaseDate;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without artworkUrl60.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.artworkUrl60;

        expect(hasItAll(without)).toEqual(true);
    });

    test('Without artworkUrl100.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.artworkUrl100;

        expect(hasItAll(without)).toEqual(true);
    });

    test('Without artworkUrl60 and artworkUrl100.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.artworkUrl60;
        delete without.artworkUrl100;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without artworkUrl600.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.artworkUrl600;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without artistName.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.artistName;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without country.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.country;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without trackCount.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.trackCount;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without feedUrl.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.feedUrl;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without genres.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.genres;

        expect(hasItAll(without)).toEqual(false);
    });

    test('Without collectionViewUrl.', () => {
        const without = JSON.parse(JSON.stringify(mock));
        delete without.collectionViewUrl;

        expect(hasItAll(without)).toEqual(false);
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

describe('Testing shortenLinks function.', () => {
    test('Only \"undefined\".', () => {
        expect(shortenLinks(undefined)).rejects.toEqual('Wrong argument.');
    });

    readFile(join(__dirname, 'test_one_input.json'), 'utf8', (err: Error, data: string) => {
        const testOneInput = JSON.parse(data);
        const dst: resultExtended = {
            ...testOneInput,
            itunes: 'https://goo.gl/kwHu7z',
            rss: 'https://goo.gl/bECbi2',
            latest: 'July 11th 2016, 4:05 am'
        };

        test('Shorten all nerdcast links.', () => {
            expect(shortenLinks(testOneInput)).resolves.toEqual(dst);
        });

        test('Shorten nerdcast RSS link -- without iTunes link.', () => {
            const onlyRSS = JSON.parse(JSON.stringify(testOneInput));
            delete onlyRSS.collectionViewUrl;

            expect(shortenLinks(onlyRSS)).rejects.toEqual('Has no RSS link available.');
        });

        test('Shorten nerdcast iTunes link -- without RSS link.', () => {
            const onlyiTunes = JSON.parse(JSON.stringify(testOneInput));
            delete onlyiTunes.feedUrl;

            expect(shortenLinks(onlyiTunes)).rejects.toEqual('Has no iTunes link available.');
        });

        /**
         * Since  shortenLinks  function  also  parse it the data for the latest episode, there's need to check this out
         * too.  The error message could sound a little "odd", but since shortenLinks it's called after all the API data
         * has been verified, the only way to raise an error when parsing the date is if happens at the moment library.
         */
        test('Without date of the last episode info.', () => {
            const withOutDate = JSON.parse(JSON.stringify(testOneInput));
            delete withOutDate.releaseDate;

            expect(shortenLinks(withOutDate)).rejects.toEqual('Error occured while converting date.');
        });
    });
});

describe('Testing parse function', () => {
    test('udefined', () => {
        expect(parse(undefined)).rejects.toEqual('Empty results.');
    });

    readFile(join(__dirname, 'test_one_input.json'), 'utf8', (err: Error, data: string) => {
        const testOneInput = JSON.parse(data);
        const srcResponse: response = {
            resultCount: 1,
            results: testOneInput
        };

        test('resultCount equals to zero.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            without.resultCount = 0;

            expect(parse(without)).rejects.toEqual('Empty results.');
        });

        test('Without results array.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results;

            expect(parse(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without releaseDate.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].releaseDate;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without artworkUrl60.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].artworkUrl60;

            expect(hasItAll(without)).toEqual(true);
        });

        test('Without artworkUrl100.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].artworkUrl100;

            expect(hasItAll(without)).toEqual(true);
        });

        test('Without artworkUrl60 and artworkUrl100.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].artworkUrl60;
            delete without.results[0].artworkUrl100;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without artworkUrl600.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].artworkUrl600;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without artistName.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].artistName;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without country.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].country;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without trackCount.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].trackCount;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without feedUrl.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].feedUrl;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without genres.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].genres;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });

        test('Without collectionViewUrl.', () => {
            const without: response = JSON.parse(JSON.stringify(srcResponse));
            delete without.results[0].collectionViewUrl;

            expect(hasItAll(without)).rejects.toEqual('No complete info in the results results to display it.');
        });
    });
});

describe('Testing parseResponse function', () => {
    readFile(join(__dirname, 'test_one_input.json'), 'utf8', (err: Error, data: string) => {
        const testOneInput = JSON.parse(data);
        const dst: resultExtended = {
            ...testOneInput,
            itunes: 'https://goo.gl/kwHu7z',
            rss: 'https://goo.gl/bECbi2',
            latest: 'July 11th 2016, 4:05 am'
        };
        const srcResponse: response = {
            resultCount: 1,
            results: testOneInput
        };
        const noComplete: string = 'No complete info in the results results to display it.';

        readFile(join(__dirname, 'test_one_output.json'), 'utf8', (err: Error, data: string) => {
            const testOneOutput = JSON.parse(data);

            test('Parse nerdcast', () => {
                expect(parseResponse(srcResponse)).resolves.toEqual(testOneOutput);
            });
        });

        test('undefined', () => {
            expect(parseResponse(undefined)).rejects.toEqual('Empty results.');
        });

        test('Has no RSS link', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].feedUrl;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no iTunes link', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].collectionViewUrl;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no lastest episode date.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].releaseDate;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no podcast artwork.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].artworkUrl600;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no name.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].artistName;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no country.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].country;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no genre.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].genres;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });

        test('Has no number of episodes.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].trackCount;

            expect(parseResponse(newSrc)).rejects.toEqual(noComplete);
        });
    });
});

describe('Testing parseResponseInline function', () => {
    readFile(join(__dirname, 'test_two_input.json'), 'utf8', (err: Error, data: string) => {
        const testTwoInput = JSON.parse(data);
        const srcResponse: response = {
            resultCount: 20,
            results: testTwoInput
        };
        const noComplete: string = 'No complete info in the results results to display it.';
        const lanCode: string = 'en_us';

        readFile(join(__dirname, 'test_two_output.json'), 'utf8', (err: Error, data: string) => {
            const testTwoOutput = JSON.parse(data);

            test('Parse nerdcast', () => {
                expect(parseResponseInline(srcResponse, lanCode)).resolves.toEqual(testTwoOutput);
            });
        });

        test('undefined', () => {
            expect(parseResponseInline(undefined, lanCode)).rejects.toEqual('Empty results.');
        });

        test('Has no RSS link', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].feedUrl;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no iTunes link', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].collectionViewUrl;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no lastest episode date.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].releaseDate;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no podcast artwork.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].artworkUrl600;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no name.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].artistName;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no country.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].country;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no genre.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].genres;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });

        test('Has no number of episodes.', () => {
            const newSrc: response = JSON.parse(JSON.stringify(srcResponse));
            delete newSrc.results[0].trackCount;

            expect(parseResponseInline(newSrc, lanCode)).rejects.toEqual(noComplete);
        });
    });
});
