'use strict';

import { response, result } from 'itunes-search';
import * as moment from 'moment';
import { parseParameters, parseFunctions } from '../@types/podcasts/parse';
import { maskResponse, maskResponseInline } from './mask';
import { podcastKeyboard } from '../telegram/keyboard';

const hasAllPodcastData = (data: result): boolean => {
    const properties = [ 'releaseDate', 'artistName', 'country', 'trackCount', 'feedUrl', 'genres', 'collectionViewUrl',
    'artworkUrl60', 'artworkUrl100', 'artworkUrl600', 'collectionId', 'collectionName' ];

    return properties.reduce((acc, cur) => {
        return (false === acc || false === data.hasOwnProperty(cur)) ? false : true;
    }, true);
};

const shortenLinks = (data: result, shortener: Function) => {
    return Promise.all([ shortener(data.feedUrl), shortener(data.collectionViewUrl) ]).then((shortened) => {
        return { rss: shortened[0], itunes: shortened[1] };
    }).catch((error: Error) => {
        console.log(error);

        return { rss: data.feedUrl, itunes: data.collectionViewUrl };
    });
};

const parseMapping = async ({ podcast, language, country }, { maskFunction, shortener, translateRoot }) => {
    const links = await shortenLinks(podcast, shortener);
    const latest = moment(podcast.releaseDate).locale(country).format('Do MMMM YYYY, h:mm a');
    const podcastId = podcast.collectionId;
    const keyboard = podcastKeyboard({ language, podcastId }, { translateRoot });

    return maskFunction({ ...podcast, ...links, latest, keyboard }, translateRoot.t );
};

const parsePodcast = ({ podcasts, language, country }: parseParameters, { maskFunction, shortener, translateRoot }: parseFunctions) =>
podcasts.reduce(async (acc, podcast) => {
    if (hasAllPodcastData(podcast)) {
        const parsed = await parseMapping({ podcast, language, country }, { maskFunction, shortener, translateRoot });
        acc.then((result) => result.push(parsed));
    }

    return acc;
}, Promise.resolve( [] ));

const curryParsePodcast = ({ maskFunction }) => ((first, second) => parsePodcast(first, { maskFunction, ...second }));

export const parsePodcastCommand = curryParsePodcast({ maskFunction: maskResponse });
export const parsePodcastInline = curryParsePodcast({ maskFunction: maskResponseInline });
