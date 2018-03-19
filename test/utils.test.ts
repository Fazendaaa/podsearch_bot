'use strict';

/**
 * This import might seen a little bit unecessary, but TS compiler complains about the Jest functions being used without
 * being imported before.
 */
import { } from 'jest';
import {
    parseResponse,
    removeCmd
} from '../src/utils';

describe('Testing parseResponse function', () => {
    test('Parse nerdcast', () => {
        const src: object = {
            resultCount: 1,
            results: [{
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
                genreIds: [Array],
                genres: [Array]
            }]
        };
        const dst: string = '[\u200B](http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/600x600bb.jpg)**Name**: Nerdcast\nCountry: USA\nGenre: Comedy\n# Episodes: 2\nLastest Episode: July 11th 2016, 4:05 am\nRSS: https://goo.gl/bECbi2\niTunes: https://goo.gl/kwHu7z';

        expect(parseResponse(src)).resolves.toEqual(dst);
    });
});

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
});
