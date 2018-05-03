/**
 * Main  file,  handles all the Telegram's requests and does the piping API searches through the parsing functions. More
 * about the non official typings can be found at: ./src/@typings/itunes-search/
 */
'use strict';

import { config } from 'dotenv';
import { join } from 'path';
import { languageCode } from './lib/middleware';
import { searchThroughCommand, searchThroughInline } from './lib/search';
import { talkingSearchManager } from './lib/stage';
import { arrayLoad, messageToString, removeCmd } from './lib/utils';
import { handleEpisode, handlePrivateConversation, handleSubscribe, handleUnsubscribe } from './mainHandler';

/**
 * Why using the "old" pattern instead of the new one?
 * I had a little bit of an issue making the typing for Telegraf package, had to open my own question in Stack Overflow.
 * Thankfully I had a lot of help. You can see more at: https://stackoverflow.com/q/49348607/7092954
 * brentatkins opened my eys to the real issue: https://stackoverflow.com/q/49348607/7092954
 */
const telegrafI18n = require('telegraf-i18n');
const telegraf = require('telegraf');
const session = telegraf.session;

config();

const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../locales')
});

const commands = i18n.repository.commands;
const helpCommand = <Array<string>> arrayLoad(commands.help);
const aboutCommand = <Array<string>> arrayLoad(commands.about);
const searchCommand = <Array<string>> arrayLoad(commands.search);

const bot = new telegraf(process.env.BOT_KEY);
bot.startPolling();
bot.use(session());
bot.use(new languageCode().middleware());
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.use(talkingSearchManager.middleware());

bot.catch((err) => {
    console.log(err);
});

bot.start(async ({ i18n, replyWithMarkdown, message, language, country }) => {
    i18n.locale(language);

    if ('private' === message.chat.type) {
        const paramsArgs = { id: parseInt(removeCmd(message.text), 10), country, language };
        const functionsArgs = { translate: i18n, replyWithMarkdown };
        const sendMessage = await handlePrivateConversation(paramsArgs, functionsArgs);

        replyWithMarkdown(sendMessage.text, sendMessage.keyboard);
    }

    replyWithMarkdown(i18n.t('greetingsGroup'));
});

bot.command(helpCommand, ({ i18n, replyWithMarkdown, message, language }) => {
    i18n.locale(language);

    replyWithMarkdown(i18n.t('help'));
});

bot.command(aboutCommand, ({ i18n, replyWithMarkdown, message, language }) => {
    i18n.locale(language);

    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.command(searchCommand, ({ i18n, replyWithMarkdown, replyWithVideo, message, language, country }) => {
    const term: string = removeCmd(message.text);

    i18n.locale(language);

    searchThroughCommand({ country, term, message }, { tiny, replyWithMarkdown, replyWithVideo, translate: i18n });
});

bot.hears(helpCommand, ({ i18n, replyWithMarkdown, message, language }) => {
    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});

bot.hears(aboutCommand, ({ i18n, replyWithMarkdown, message, language }) => {
    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.hears(searchCommand, ({ scene }) => {
    scene.enter('talkingSearch');
});

bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery, language, country }) => {
    const term: string = messageToString(inlineQuery.query);
    const pageLimit: number = 20;
    const offset: number = parseInt(inlineQuery.offset, 10) || 0;

    searchThroughInline({ country, language, term, offset, pageLimit }, { translate: i18n, answerInlineQuery, inlineQuery });
});

/**
 * Handling buttons request.
 */
bot.on('callback_query', async ({ i18n, answerCbQuery, update, scene, language }) => {
    const options: Array<string> = update.callback_query.data.split('/');

    i18n.locale(language);

    if ('subscribe' === options[0]) {
        answerCbQuery(await handleSubscribe({ userId: 0, podcastId: 0 }, { translate: i18n }), true);
    } if ('unsubscribe' === options[0]) {
        answerCbQuery(await handleUnsubscribe({ userId: 0, podcastId: 0 }, { translate: i18n }), true);
    } if ('episode' === options[0]) {
        answerCbQuery(handleEpisode({ episode: options[1], id: options[2] }, { translate: i18n }), true);
    } if ('again' === options[0]) {
        answerCbQuery(i18n.t('again'), false);
        scene.reenter();
    } if ('finished' === options[0]) {
        answerCbQuery(i18n.t('finished'), false);
        scene.leave();
    }

    answerCbQuery('default', true);
});
