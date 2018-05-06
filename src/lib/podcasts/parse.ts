'use strict';

import { response, result } from 'itunes-search';
import * as moment from 'moment';
import { parseParameters, parseFunctions } from '../@types/podcasts/parse';
import { maskResponse, maskResponseInline } from './mask';
import { podcastKeyboard } from '../telegram/keyboard';

const hasAllPodcastData = (data: result): boolean => {
    const properties = [ 'releaseDate', 'artistName', 'country', 'trackCount', 'feedUrl', 'genres', 'collectionViewUrl',
    'artworkUrl60', 'artworkUrl100', 'artworkUrl600', 'collectionId', 'trackId', 'collectionName' ];

    return properties.reduce((acc, cur) => {
        return (false === acc || false === data.hasOwnProperty(cur)) ? false : true;
    }, true);
};

const shortenLinks = async (data: result, shortener: Function) => {
    const rss = shortener(data.feedUrl).catch((error: Error) => {
        console.error(error);

        return data.feedUrl;
    });
    const itunes = shortener(data.collectionViewUrl).catch((error: Error) => {
        console.error(error);

        return data.collectionViewUrl;
    });

    return { itunes: await itunes, rss: await rss };
};

const parseMapping = ({ podcast, language, country }, { maskFunction, shortener, translateRoot }) => {
    const links = shortenLinks(podcast, shortener);
    const latest = moment(podcast.releaseDate).locale(country).format('Do MMMM YYYY, h:mm a');
    /**
     * What was the logic behind this?
     */
    const podcastId = podcast.collectionId || podcast.trackId;
    const keyboard = podcastKeyboard({ language, podcastId }, { translateRoot });

    return maskFunction({ ...podcast, latest, keyboard, links }, translateRoot.t );
};

const parsePodcast = ({ podcasts, language, country }: parseParameters, { maskFunction, shortener, translateRoot }: parseFunctions) => {
    return podcasts.reduce((acc, podcast) => {
        if (hasAllPodcastData(podcast)) {
            acc.push(parseMapping({ podcast, language, country }, { maskFunction, shortener, translateRoot }));
        }

        return acc;
    }, []);
};

/**
 * Do some bindings here.
 */
export const parsePodcastCommand = ({ podcasts, language, country }, { shortener, translateRoot }) => {
    return parsePodcast({ podcasts, language, country }, { shortener, translateRoot, maskFunction: maskResponse });
};

export const parsePodcastInline = ({ podcasts, language, country }, { shortener, translateRoot }) => {
    return parsePodcast({ podcasts, language, country }, { shortener, translateRoot, maskFunction: maskResponseInline });
};
