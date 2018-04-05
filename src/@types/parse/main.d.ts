/**
 * Parse typings.
 */
/**
 * This will be only used locally, but there's need to exported to be tested later.
 * Since Markup still doesn't have any typing, it will be any.
 */
export type resultExtended = {
    wrapperType?: string;
    kind?: string;
    collectionId?: number;
    trackId?: number;
    artistName?: string;
    collectionName?: string;
    trackName?: string;
    collectionCensoredName?: string;
    trackCensoredName?: string;
    collectionArtistId?: number;
    collectionArtistViewUrl?: string;
    collectionViewUrl?: string;
    feedUrl?: string;
    trackViewUrl?: string;
    previewUrl?: string;
    artworkUrl30?: string;
    artworkUrl60?: string;
    artworkUrl100?: string;
    artworkUrl600?: string;
    collectionPrice?: number;
    trackPrice?: number;
    trackRentalPrice?: number;
    collectionHdPrice?: number;
    trackHdPrice?: number;
    trackHdRentalPrice?: number;
    releaseDate?: string;
    collectionExplicitness?: string;
    trackExplicitness?: string;
    discCount?: number;
    discNumber?: number;
    trackCount?: number;
    trackNumber?: number;
    trackTimeMillis?: number;
    country?: string;
    currency?: string;
    primaryGenreName?: string;
    contentAdvisoryRating?: string;
    shortDescription?: string;
    longDescription?: string;
    hasITunesExtras?: boolean;
    genreIds?: Array<string>;
    genres?: Array<string> | string;
    itunes?: string;
    rss?: string;
    latest?: string;
    lanCode?: string;
    keyboard?: any;
};
