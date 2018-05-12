'use strict';

import { tiny } from 'tiny-shortener';
import { parsePodcastCommand } from '../podcasts/parse';
import { searchPodcast } from '../podcasts/get';
import { podcastKeyboard } from '../telegram/keyboard';

export const handleStage = async ({ term, country, language, position = 0 }, { translateRoot, translate }) => {
    const searched = await searchPodcast({ term }).catch((error) => {
        return [];
    });

    if (0 !== searched.length) {
        const podcasts = [searched[position]];

        return parsePodcastCommand({ podcasts, language, country }, { shortener: tiny, translateRoot, translate }).then((parsed) => {
            return parsed[0];
        });
    }

    return { text: translate('noResult', { value: term }), keyboard: null };
};
