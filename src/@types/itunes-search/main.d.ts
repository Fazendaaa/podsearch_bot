/**
 * Since this package has no typings for TS, this is an unofficial.
 */
declare module 'itunes-search' {
    export type options = {
        country?: string;
        attribute?: string;
        entity?: string;
        explicit?: string;
        limit?: number;
        media?: string;
        lang?: string;
    };

    export type result = {
        wrapperType: string;
        kind: string;
        collectionId: number;
        trackId: number;
        artistName: string;
        collectionName: string;
        trackName: string;
        collectionCensoredName: string;
        trackCensoredName: string;
        collectionArtistId: number;
        collectionArtistViewUrl: string;
        collectionViewUrl: string;
        feedUrl: string;
        trackViewUrl: string;
        previewUrl: string;
        artworkUrl30: string;
        artworkUrl60: string;
        artworkUrl100: string;
        artworkUrl600: string;
        collectionPrice: number;
        trackPrice: number;
        trackRentalPrice: number;
        collectionHdPrice: number;
        trackHdPrice: number;
        trackHdRentalPrice: number;
        releaseDate: string;
        collectionExplicitness: string;
        trackExplicitness: string;
        discCount: number;
        discNumber: number;
        trackCount: number;
        trackNumber: number;
        trackTimeMillis: number;
        country: string;
        currency: string;
        primaryGenreName: string;
        contentAdvisoryRating: string;
        shortDescription: string;
        longDescription: string;
        hasITunesExtras: boolean;
        genreIds: Array<string>;
        genres: Array<string>;
    }

    export type response = {
        resultCount: number;
        results: Array<result>;
    };

    export function search(query: string, opts: options, callback: (response: response) => void): void;
}
