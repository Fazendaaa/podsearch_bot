'use strict';

import { response, result } from 'itunes-search';
import * as moment from 'moment';
import { parseParameters, parseFunctions } from '../@types/podcasts/parse';
import { maskResponse, maskResponseInline } from './mask';
import { podcastKeyboard } from '../telegram/keyboard';

const hasAllFunctions = (parameters) => {
    const args = [ 'maskFunction', 'shortener', 'translateRoot' ];
    
    return args.reduce((acc, cur) => {
        return (false === acc || false === parameters.hasOwnProperty(cur)) ? false : true;
    }, true);
};

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
    const translate = (languageCode, resourceKey) => translateRoot.t(language, languageCode, resourceKey);

    return maskFunction({ ...podcast, ...links, latest, keyboard }, { translate } );
};

const reducePodcast = ({ language, country }, { maskFunction, shortener, translateRoot }) => (async (acc, podcast) => {
    if (hasAllPodcastData(podcast)) {
        const parsed = await parseMapping({ podcast, language, country }, { maskFunction, shortener, translateRoot });
        acc.then((result) => result.push(parsed));
    }

    return acc;
});

const parsePodcast = ({ podcasts, language, country }: parseParameters, { maskFunction, shortener, translateRoot }: parseFunctions) => {
    if (hasAllFunctions({ maskFunction, shortener, translateRoot })) {
        return podcasts.reduce(reducePodcast({ language, country }, { maskFunction, shortener, translateRoot }), Promise.resolve([]));
    }

    console.error(new Error('Missing important parameter in parsePodcast.'));

    return [];
};

const curryParsePodcast = ({ maskFunction }) => ((first, second) => parsePodcast(first, { maskFunction, ...second }));

export const parsePodcastCommand = curryParsePodcast({ maskFunction: maskResponse });
export const parsePodcastInline = curryParsePodcast({ maskFunction: maskResponseInline });
