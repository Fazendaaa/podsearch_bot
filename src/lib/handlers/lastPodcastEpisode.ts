'use strict';

import * as moment from 'moment';
import { lookupPodcast } from '../podcasts/get';
import { streamKeyboard } from '../telegram/keyboard';
import { resultExtended } from '../@types/podcasts/main';

const fetchNameEpisode = ({ rssContent }, { translate }): string => {
    if (true === rssContent.hasOwnProperty('title')) {
        return rssContent.title;
    }

    return translate('noName');
};

export const lastPodcastEpisode = ({ id, country }, { translate, rss, shortener }): Promise<resultExtended | Error> =>
new Promise(async (resolve: (data: resultExtended) => void, reject: (error: Error) => void) => {
    const podcastItunes = await lookupPodcast({ id, country }).catch(reject);
    const lastEpisode = podcastItunes[0];
    const podcastContent = await rss.parseURL(lastEpisode.feedUrl).catch(reject);
    const rssContent = podcastContent.items[0];
    const keyboard = await streamKeyboard({ rssContent, id }, { translate, shortener });

    resolve({
        name: fetchNameEpisode({ rssContent }, { translate }),
        latest: moment(lastEpisode.releaseDate).locale(country).format('Do MMMM YYYY, h:mm a'),
        keyboard,
        ...lastEpisode
    });
});
