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
    removeCmd,
    resultExtended,
    shortenLinks
} from '../src/utils';

/**
 * "Mock" data.
 */
const srcResult: result = {
    wrapperType: 'track',
    kind: 'podcast',
    collectionId: 1103141552,
    trackId: 1103141552,
    artistName: 'Nerdcast',
    collectionName: 'Nerdcast',
    trackName: 'Nerdcast',
    collectionCensoredName: 'Nerdcast',
    trackCensoredName: 'Nerdcast',
    collectionViewUrl: 'https://itunes.apple.com/us/podcast/nerdcast/id1103141552?mt=2&uo=4',
    feedUrl: 'http://feeds.soundcloud.com/users/soundcloud:users:219177314/sounds.rss',
    trackViewUrl: 'https://itunes.apple.com/us/podcast/nerdcast/id1103141552?mt=2&uo=4',
    artworkUrl30: 'http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/30x30bb.jpg',
    artworkUrl60: 'http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/60x60bb.jpg',
    artworkUrl100: 'http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/100x100bb.jpg',
    collectionPrice: 0,
    trackPrice: 0,
    trackRentalPrice: 0,
    collectionHdPrice: 0,
    trackHdPrice: 0,
    trackHdRentalPrice: 0,
    releaseDate: '2016-07-11T07:05:00Z',
    collectionExplicitness: 'cleaned',
    trackExplicitness: 'cleaned',
    trackCount: 2,
    country: 'USA',
    currency: 'USD',
    primaryGenreName: 'Comedy',
    contentAdvisoryRating: 'Clean',
    artworkUrl600: 'http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/600x600bb.jpg',
    genreIds: ['1303', '26'],
    genres: ['Comedy', 'Podcasts'],
    itunes: 'https://goo.gl/kwHu7z',
    rss: 'https://goo.gl/bECbi2',
    latest: 'July 11th 2016, 4:05 am'
};

const srcResponse: response = {
    resultCount: 1,
    results: [srcResult]
};

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

    test('', () => {
        expect(removeCmd('')).toEqual('');
    });

    test('someWordWithoutCmd', () => {
        expect(removeCmd('someWordWithoutCmd')).toEqual('someWordWithoutCmd');
    });
});

describe('Testing messageToString function', () => {
    test('@podsearch nerdcast', () => {
        expect(messageToString('nerdcast')).toEqual('nerdcast');
    });
});

describe('Testing hasGenres function', () => {
    test('undefined', () => {
        expect(hasGenres(undefined)).toEqual('');
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
        const dst: resultExtended = {
            ...srcResult,
            itunes: 'https://goo.gl/kwHu7z',
            rss: 'https://goo.gl/bECbi2',
            latest: 'July 11th 2016, 4:05 am'
        };

        expect(shortenLinks(srcResult)).resolves.toEqual(dst);
    });
});

describe('Testing parse function', () => {
    test('udefined', () => {
        expect(parse(undefined)).rejects.toEqual('Empty results.');
    });
});

describe('Testing parseResponse function', () => {
    const noComplete: string = 'No complete info in the results results to display it.';

    test('Parse nerdcast', () => {
        const file: string = join(__dirname, 'test.json');

        readFile(file, 'utf8', (err: Error, data: string) => {
            expect(parseResponse(srcResponse)).resolves.toEqual(JSON.parse(data));
        });
    });

    /**
     * Catching errors.
     */
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

// describe('Testing parseResponseInline function', () => {
//     test('', () => {
//         expect(parseResponseInline()).toEqual();
//     });
// });
