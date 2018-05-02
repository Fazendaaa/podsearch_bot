/**
 * Explicit  is  set  to  not  be  available because of the App Store policies of non explicit content for non registers
 * third-parties  app.  Was  decided  to  not  shown  then since Telegram had some fights in the past about this kind of
 * content.
 */

'use strict';

import {
    lookup,
    options,
    response,
    result,
    search
} from 'itunes-search';
import { join } from 'path';
import { resultExtended } from '../@types/parse/main';
import {
    parseResponse,
    parseResponseInline
} from '../others/parse';
import {
    arrayLoad,
    endInline,
    errorInline,
    messageToString,
    notFoundInline,
    removeCmd,
    searchInline
} from '../others/utils';

const replyGIFNoSearch = async ({ replyWithMarkdown, replyWithVideo, i18n }) => {
    await replyWithMarkdown(i18n.t('wrongInputCmd')).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
    await replyWithVideo({ source: join(__dirname, '../../gif/searchCmd.mp4') }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
    await replyWithMarkdown(i18n.t('wrongInputButton')).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
    await replyWithVideo({ source: join(__dirname, '../../gif/searchButton.mp4') }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
    await replyWithMarkdown(i18n.t('wrongInputInline')).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
    await replyWithVideo({ source: join(__dirname, '../../gif/searchInline.mp4') }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
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

export const searchThroughCommand = async ({ country, term, message }, { replyWithMarkdown, replyWithVideo, i18n }) => {
    if ('' === term) {
        replyGIFNoSearch({ replyWithMarkdown, replyWithVideo, i18n });
    }

    const podcasts = <response> await searchPodcast({ term, country, limit: 1 }).catch((error: Error) => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });

    const parsed = <resultExtended> await parseResponse(podcasts, message.from.language_code, tiny, i18nNode.api).catch((error: string) => {
        console.error(error);
        replyWithMarkdown(i18n.t('noResult', { term }));
    });

    replyWithMarkdown(i18n.t('mask', parsed), parsed.keyboard);
};

const sendInlineError = async ({ error, lanCode }, { i18nNode, answerInlineQuery }) => {
    const errorMessage = await errorInline(lanCode, i18nNode.api).catch(console.error);

    answerInlineQuery([errorMessage]);
    console.error(error);
};

export const searchThroughInline = async ({ country, term, offset, pageLimit, lanCode }, { tiny, i18n, i18nNode, answerInlineQuery, inlineQuery }) => {
    /**
     * Verify whether or not the user has typed anything to search for.
     */
    if ('' === term) {
        const inline = await searchInline(lanCode, i18nNode.api).catch(console.error);
        answerInlineQuery([inline]);
    }

    const podcasts = <response> await searchPodcast({ term, country, limit: offset + pageLimit }).catch((error: Error) => {
        sendInlineError({ error, lanCode }, { i18nNode, answerInlineQuery });
    });

    /**
     * "Pseudo-pagination", since this API doesn't allow it true pagination.
     */
    podcasts.results = podcasts.results.slice(offset, offset + pageLimit);

    if (0 === podcasts.results.length) {
        const endMessage = await endInline(lanCode, i18nNode.api).catch(console.error);

        answerInlineQuery([endMessage]);
    }

    const results = await parseResponseInline(podcasts, lanCode, tiny, i18nNode.api).catch((error: Error) => {
        sendInlineError({ error, lanCode}, { i18nNode, answerInlineQuery});
    });

    answerInlineQuery(results, { next_offset: offset + pageLimit });
};
