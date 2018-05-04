'use strict';

import { response, result } from 'itunes-search';
import * as moment from 'moment';
import { parseParameters, parseFunctions } from '../@types/podcast/parse';
import { maskResponse, maskResponseInline } from './mask';
import { podcastKeyboard } from '../telegram/keyboard';

const hasItAll = (data: result): boolean => {
    const properties = ['releaseDate', 'artistName', 'country', 'trackCount', 'feedUrl', 'genres', 'collectionViewUrl',
    'artworkUrl60', 'artworkUrl100', 'artworkUrl600'];

    properties.map((element: string) => {
        if (undefined == data.hasOwnProperty(element)) {
            return false;
        }
    });

    return true;
};

const shortenLinks = (data: result, shortener: Function) => {
    const rss = shortener(data.feedUrl).catch((error: Error) => {
        console.error(error);

        return data.feedUrl;
    });
    const itunes = shortener(data.collectionViewUrl).catch((error: Error) => {
        console.error(error);

        return data.collectionViewUrl;
    });

    return { itunes, rss };
};

const parseMapping = ({ podcast, country }, { translate, shortener, maskFunction }) => {
    const links = shortenLinks(podcast, shortener);
    const latest = moment(podcast.releaseDate).locale(country).format('Do MMMM YYYY, h:mm a');
    const podcastId = podcast.collectionId || podcast.trackId;
    const keyboard = podcastKeyboard({ podcastId }, { translate });

    return maskFunction({ ...podcast, latest, keyboard, links }, translate);
};

const parsePodcast = async ({ podcasts, country }: parseParameters, { maskFunction, shortener, translate }: parseFunctions) => {
    if (undefined == podcasts ) {
        return new TypeError('Wrong argument.');
    }

    const filtered = podcasts.results.filter(hasItAll);

    if (0 === filtered.length) {
        return new Error('No complete info in the results results to display it.');
    }

    return await Promise.all(filtered.map((element: result) => {
        return parseMapping({ podcast: element, country }, { translate, shortener, maskFunction });
    }));
};

export const parsePodcastCommand = async ({ podcasts, country, position = 0 }, { shortener, translate }) => {
    return await parsePodcast({ podcasts, country }, { shortener, translate, maskFunction: maskResponse })
    .then((results) => {
        return results[ position ];
    });
};

export const parsePodcastInline = async ({ podcasts, country }, { shortener, translate }) => {
    return await parsePodcast({ podcasts, country }, { shortener, translate, maskFunction: maskResponseInline });
};
