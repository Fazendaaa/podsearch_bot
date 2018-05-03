/**
 * Explicit  is  set  to  not  be  available because of the App Store policies of non explicit content for non registers
 * third-parties  app.  Was  decided  to  not  shown  then since Telegram had some fights in the past about this kind of
 * content.
 */
'use strict';

import { lookup, options, response, result, search } from 'itunes-search';
import { join } from 'path';
import { telegramInline } from 'telegraf';
import { resultExtended } from '../@types/parse/main';
import { parseResponse, parseResponseInline } from '../lib/parse';
import { arrayLoad, endInline, errorInline, messageToString, notFoundInline, removeCmd, searchInline } from '../lib/utils';

const replyGIFNoSearch = async ({ replyWithMarkdown, replyWithVideo, translate }) => {
    await replyWithMarkdown(translate('wrongInputCmd')).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });
    await replyWithVideo({ source: join(__dirname, '../../gif/searchCmd.mp4') }).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });
    await replyWithMarkdown(translate('wrongInputButton')).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });
    await replyWithVideo({ source: join(__dirname, '../../gif/searchButton.mp4') }).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });
    await replyWithMarkdown(translate('wrongInputInline')).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });
    await replyWithVideo({ source: join(__dirname, '../../gif/searchInline.mp4') }).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });
};

export const searchPodcast = (searchOptions): Promise<response | Error> =>
new Promise ((resolve: (searchResult: response) => void, reject: (error: Error) => void) => {
    const defaultOptions: options = {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No'
    };

    search({ defaultOptions, ...searchOptions }, (err: Error, data: response) => {
        if (err || 0 === data.resultCount) {
            reject(err);
        }

        resolve(data);
    });
});

export const lookupPodcast = (searchOptions): Promise<result | Error> =>
new Promise((resolve: (searchResult: result) => void, reject: (error: Error) => void) => {
    const defaultOptions: options = {
        media: 'podcast',
        entity: 'podcast',
        explicit: 'No',
        limit: 1
    };

    lookup({ defaultOptions, ...searchOptions }, (err: Error, data: response) => {
        if (err || 0 === data.resultCount) {
            reject(err);
        }

        resolve(data.results[0]);
    });
});

export const searchThroughCommand = async ({ country, term, message }, { tiny, replyWithMarkdown, replyWithVideo, translate }) => {
    if ('' === term) {
        replyGIFNoSearch({ replyWithMarkdown, replyWithVideo, translate });
    }

    const podcasts = <response> await searchPodcast({ term, country, limit: 1 }).catch((error: Error) => {
        replyWithMarkdown(translate('error'));
        console.error(error);
    });

    const parsed = <resultExtended> await parseResponse(podcasts, message.from.language_code, tiny, translate).catch((error: string) => {
        console.error(error);
        replyWithMarkdown(translate('noResult', { term }));
    });

    replyWithMarkdown(translate('mask', parsed), parsed.keyboard);
};

const sendInlineError = (error, { translate, answerInlineQuery }) => {
    answerInlineQuery([errorInline(translate)]);
    console.error(error);
};

export const searchThroughInline = async ({ country, language, term, offset, pageLimit }, { tiny, translate, answerInlineQuery, inlineQuery }) => {
    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if ('' === term) {
        answerInlineQuery([searchInline(translate)]);
    }

    const podcasts = <response> await searchPodcast({ term, country, limit: offset + pageLimit }).catch((error: Error) => {
        sendInlineError(error, { translate, answerInlineQuery });
    });

    /**
     * "Pseudo-pagination", since this API doesn't allow it true pagination.
     */
    podcasts.results = podcasts.results.slice(offset, offset + pageLimit);

    if (0 === podcasts.results.length) {
        answerInlineQuery([endInline(translate)]);
    }

    const results = await parseResponseInline(podcasts, tiny, translate).catch((error: Error) => {
        sendInlineError(error, { translate, answerInlineQuery });
    });

    answerInlineQuery(results, { next_offset: offset + pageLimit });
};
