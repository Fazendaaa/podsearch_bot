'use strict';

import * as tinyShortener from 'tiny-shortener';
import { parsePodcastCommand } from '../podcasts/parse';
import { searchPodcast } from '../podcasts/get';
import { podcastKeyboard } from '../telegram/keyboard';

export const handleStage = async ({ term, country, language, position = 0 }, { translateRoot, translate }) => {
    const shortener = tinyShortener.tiny;
    const podcasts = await searchPodcast({ term });
    const parsed = await parsePodcastCommand({ podcasts, language, country }, { shortener, translateRoot });

    if (0 === parsed.length || parsed.length < position) {
        return { text: translate('noResult', { value: term }), keyboard: null };
    }

    return {
        text: translate('mask', parsed[position]),
        keyboard: podcastKeyboard({ podcastId: parsed[position].podcastId, language }, { translateRoot })
    };
};
