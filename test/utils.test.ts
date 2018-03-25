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
    test('/search nerdcast', () => {
        expect(removeCmd('/search nerdcast')).toEqual('nerdcast');
    });

    test('/search', () => {
        expect(removeCmd('/search')).toEqual('');
    });

    test('/', () => {
        expect(removeCmd('/')).toEqual('/');
    });

    test('Empty', () => {
        expect(removeCmd('')).toEqual('');
    });

    test('someWordWithoutCmd', () => {
        expect(removeCmd('someWordWithoutCmd')).toEqual('someWordWithoutCmd');
    });

    test('undefined', () => {
        expect(removeCmd(undefined)).toEqual(undefined);
    });
});

describe('Testing messageToString function', () => {
    test('@podsearch nerdcast', () => {
        expect(messageToString('nerdcast')).toEqual('nerdcast');
    });

    test('undefined', () => {
        expect(messageToString(undefined)).toEqual(undefined);
    });

    test('Empty', () => {
        expect(messageToString('')).toEqual('');
    });
});

describe('Testing hasGenres function', () => {
    test('undefined', () => {
        expect(hasGenres(undefined)).toEqual(undefined);
    });

    test('Empty', () => {
        expect(hasGenres([''])).toEqual('');
    });

    test('One argument', () => {
        expect(hasGenres(['one arg'])).toEqual('one arg');
    });

    test('Two arguments', () => {
        expect(hasGenres(['one arg', 'two arg'])).toEqual('one arg | two arg');
    });

    test('Three arguments', () => {
        expect(hasGenres(['one arg', 'two arg', 'three arg'])).toEqual('one arg | two arg | three arg');
    });
});

describe('Testing hasItAll function', () => {
    test('undefined', () => {
        expect(hasItAll(undefined)).toEqual(false);
    });
});

describe('Testing maskResponse function', () => {
    test('undefined', () => {
        expect(maskResponse(undefined)).toEqual(undefined);
    });
});

describe('Testing maskResponseInline function', () => {
    test('undefined', () => {
        expect(maskResponseInline(undefined)).toEqual(undefined);
    });
});

describe('Testing shortenLinks function', () => {
    test('Shoren nerdcast links', () => {
        readFile(join(__dirname, 'test_one_input.json'), 'utf8', (err: Error, data: string) => {
            const testOneInput = JSON.parse(data);
            const dst: resultExtended = {
                ...testOneInput,
                itunes: 'https://goo.gl/kwHu7z',
                rss: 'https://goo.gl/bECbi2',
                latest: 'July 11th 2016, 4:05 am'
            };

            expect(shortenLinks(testOneInput)).resolves.toEqual(dst);
        });
    });
});

describe('Testing parse function', () => {
    test('udefined', () => {
        expect(parse(undefined)).rejects.toEqual('Empty results.');
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
