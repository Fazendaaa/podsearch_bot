'use strict';

export const handlePrivateConversation = async ({ argument, message }, { replyWithMarkdown }) => {
    if ('' === argument) {
        const keyboard = markup.keyboard(arrayLoad(i18n.repository[language].keyboard)).resize().extra();
        replyWithMarkdown(i18n.t('greetingsPrivate'), keyboard);
    }

    const searchParams = {
        id: parseInt(argument, 10),
        language: message.from.language_code.split('-')[0] || 'en',
        country: message.from.language_code.split('-')[1] || 'us'
    };
    const functionsParams = {
        translate: i18nNode.api.t,
        shorten: tiny,
        fetchRss: handlerRss.parseURL
    };

    /**
     * That would mean starting a bot conversation through a link to listen some podcast.
     */
    await replyWithMarkdown(i18n.t('sending')).catch(console.error);
    lastEpisode(searchParams, i18nNode.api, functionsParams).then((episode: resultExtended) => {
        replyWithMarkdown(i18n.t('episode', episode), episode.keyboard);
    }).catch(error => {
        replyWithMarkdown(i18n.t('error'));
        console.error(error);
    });
};

export const handleSubscribe = async ({ answerCbQuery }) => {
    const result = await subscription.add(0, 0).catch(console.error);

    if ('added' === result) {
        answerCbQuery(i18n.t('working'), true);
    } else if ('already subscribed' === result) {
        answerCbQuery(i18n.t('working'), true);
    }

    answerCbQuery(i18n.t('working'), true);
};

export const handleUnsubscribe = async ({ answerCbQuery }) => {
    const result = await subscription.remove(0, 0).catch(console.error);

    if ('added' === result) {
        answerCbQuery(i18n.t('working'), true);
    } else if ('already subscribed' === result) {
        answerCbQuery(i18n.t('working'), true);
    }

    answerCbQuery(i18n.t('working'), true);
};

export const handleEpisode = ({ episode }, { answerCbQuery }) => {
    if ('last' === episode) {
        answerCbQuery(i18n.t('sending'), false);
    } else if ('notAvailable' === episode) {
        answerCbQuery(i18n.t('notAvailable', { id: options[2] }), true);
    }

    answerCbQuery('default', true);
};
