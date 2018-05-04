'use strict';

import * as Parser from 'rss-parser';
import { tiny } from 'tiny-shortener';
import { resultExtended } from './@types/parse/main';
import { parsePodcastCommand, parsePodcastInline } from './lib/podcasts/parse';
import { searchPodcast } from './lib/podcasts/search';
import { fetchLastEpisode } from './lib/podcasts/stream';
import { endInline, searchInline, errorInline } from './lib/telegram/messages';
const telegraf = require('telegraf');
const markup = telegraf.Markup;
const handlerRss = new Parser();

const functionArgs = {
    shortener: tiny,
    fetchRss: handlerRss
};

export const handleLastEpisode = async ({ id, country }, { translate }) => {
    return fetchLastEpisode({ id, country }, { functionArgs, ...translate }).then((episode: resultExtended) => {
        return { text: translate('episode', episode), keyboard: episode.keyboard };
    }).catch((error: Error) => {
        console.error(error);

        return { text: translate('error'), keyboard: null };
    });
};

const parsingCommand = ({ podcasts, term }, { translate }) => {
    return parsePodcastCommand({ podcasts }, { functionArgs, ...translate }).then((parsed) => {
        return { text: translate('mask', parsed), keyboard: parsed.keyboard };
    }).catch((error: string) => {
        console.error(error);
    
        return { text: translate('noResult', { term }), keyboard: null };
    });
};

export const handleSearchCommand = async ({ country, term }, { translate }) => {
    return await searchPodcast({ term, country, limit: 1 }).then(async (podcasts) => {
        return await parsingCommand ({ podcasts, term }, { translate });
    }).catch((error: Error) => {
        console.error(error);

        return { text: translate('error'), keyboard: null };
    });
};

/**
 * "Pseudo-pagination", since iTunes API doesn't allow it true pagination.
 */
const paginatingPodcasts = ({ podcasts, offset, pageLimit }, { translate }) => {
    podcasts.results = podcasts.results.slice(offset, offset + pageLimit);

    if (0 === podcasts.results.length) {
        return endInline(translate);
    }

    return parsePodcastInline({ podcasts }, { functionArgs, ...translate }).catch((error: Error) => {
        return searchInline(translate);
    });
};

export const handleSearchInline = async ({ country, term, offset, pageLimit } , { translate }) => {
    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if ('' === term) {
        return [ searchInline(translate) ];
    }

    return await searchPodcast({ term, country, limit: offset + pageLimit }).then((podcasts) => {
        return [ paginatingPodcasts({ podcasts, offset, pageLimit }, { translate }) ];
    }).catch((error: Error) => {
        console.error(error);

        return [ errorInline(translate) ];
    });
};

export const handleEpisode = ({ episode, id }, { translate }): string => {
    if ('last' === episode) {
        return translate('sending');
    } if ('notAvailable' === episode) {
        return translate('notAvailable', { id });
    }

    return translate('default');
};
