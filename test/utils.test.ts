'use strict';

/**
 * This  import  might seen a little bit unecessary, but TS compiler complains about the Jest functions being used as an
 * imported  one.  This  is  because /node_modules/@types/jest/index.d.ts doesn't declare Jest as module. Just importing
 * Jest in the tsconfig.json as type is enough.
 */
import { response } from 'itunes-search';
import {
    parseResponse,
    removeCmd
} from '../src/utils';

describe('Testing parseResponse function', () => {
    const src: response = {
        resultCount: 1,
        /**
         * The  "original"  response  will  have a lot more of data but, for the purposing of testing, the following
         * data is the only that we need.
         */
        results: [{
            artistName: 'Nerdcast',
            collectionViewUrl: 'https://itunes.apple.com/us/podcast/nerdcast/id1103141552?mt=2&uo=4',
            feedUrl: 'http://feeds.soundcloud.com/users/soundcloud:users:219177314/sounds.rss',
            releaseDate: '2016-07-11T07:05:00Z',
            trackCount: 2,
            country: 'USA',
            primaryGenreName: 'Comedy',
            artworkUrl600: 'http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/600x600bb.jpg'
        }]
    };

    test('Parse nerdcast', () => {
        const dst: string = '[\u200B](http://is1.mzstatic.com/image/thumb/Music71/v4/1c/4e/bf/1c4ebfcd-c792-f28e-071b-ff9343d8958a/source/600x600bb.jpg)**Name**: Nerdcast\nCountry: USA\nGenre: Comedy\n# Episodes: 2\nLastest Episode: July 11th 2016, 4:05 am\nRSS: https://goo.gl/bECbi2\niTunes: https://goo.gl/kwHu7z';

        expect(parseResponse(src)).resolves.toEqual(dst);
    });

    /**
     * Catching errors.
     */
    test('Undefined argument', () => {
        expect(parseResponse(undefined)).rejects.toEqual('Wrong argument');
    });

    test('Has no RSS link', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].feedUrl;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no RSS link available.');
    });

    test('Has no iTunes link', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].collectionViewUrl;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no iTunes link available.');
    });

    test('Has no lastest episode date.', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].releaseDate;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no lastest episode date.');
    });

    test('Has no podcast artwork.', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].artworkUrl600;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no podcast artwork.');
    });

    test('Has no name.', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].artistName;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no name.');
    });

    test('Has no country.', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].country;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no country.');
    });

    test('Has no genre.', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].primaryGenreName;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no genre.');
    });

    test('Has no number of episodes.', () => {
        const newSrc: response = JSON.parse(JSON.stringify(src));
        delete newSrc.results[0].trackCount;

        expect(parseResponse(newSrc)).rejects.toEqual('Has no number of episodes.');
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

    test('', () => {
        expect(removeCmd('')).toEqual('');
    });

    test('someWordWithoutCmd', () => {
        expect(removeCmd('someWordWithoutCmd')).toEqual('someWordWithoutCmd');
    });
});
