'use strict';

const hasGenres = (genres: Array<string>): string => {
    if (undefined == genres) {
        throw (new TypeError('Wrong argument.'));
    }

    return genres.reduce((accumulator, current) => `${accumulator} | ${current}`);
};

export const maskResponse = (data) => {
    return {
        artworkUrl600: data.artworkUrl600,
        releaseDate: data.releaseDate,
        artistName: data.artistName,
        collectionName: data.collectionName,
        genres: hasGenres(<Array<string>> data.genres),
        trackCount: data.trackCount,
        itunes: data.itunes,
        rss: data.rss,
        latest: data.latest,
        keyboard: data.keyboard,
        trackId: data.trackId,
        collectionId: data.collectionId
    };
};

export const maskResponseInline = (data, { translate }) => {
    let preview;

    if (undefined != data.artworkUrl60) {
        preview = data.artworkUrl60;
    } else if (undefined != data.artworkUrl100) {
        preview = data.artworkUrl100;
    }

    return {
        id: `${data.trackId}`,
        title: data.artistName,
        type: 'article',
        input_message_content: {
            message_text: <string> translate('mask', data),
            parse_mode: 'Markdown'
        },
        reply_markup: data.keyboard.reply_markup,
        description: hasGenres (<Array<string>> data.genres),
        thumb_url: preview
    };
};
