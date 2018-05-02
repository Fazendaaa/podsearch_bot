/**
 * Main  file,  handles all the Telegram's requests and does the piping API searches through the parsing functions. More
 * about the non official typings can be found at: ./src/@typings/itunes-search/
 */
'use strict';

import { config } from 'dotenv';
import * as i18n_node_yaml from 'i18n-node-yaml';
import { join } from 'path';
import * as Parser from 'rss-parser';
import { telegramInline } from 'telegraf';
import { tiny } from 'tiny-shortener';
import { resultExtended } from './@types/parse/main';
import { Subscription } from './database/subscription';
import { handleEpisode, handlePrivateConversation, handleSubscribe, handleUnsubscribe } from './mainHandler';
import { fetchLastEpisode } from './others/stream';
import { searchThroughCommand, searchThroughInline } from './search/search';
import { talkingSearchManager } from './stage/stage';

/**
 * Why using the "old" pattern instead of the new one?
 * I had a little bit of an issue making the typing for Telegraf package, had to open my own question in Stack Overflow.
 * Thankfully I had a lot of help. You can see more at: https://stackoverflow.com/q/49348607/7092954
 * brentatkins opened my eys to the real issue: https://stackoverflow.com/q/49348607/7092954
 */
const telegrafI18n = require('telegraf-i18n');
const telegraf = require('telegraf');
const session = telegraf.session;
const markup = telegraf.Markup;
const extra = telegraf.Extra;

config();

const subscription = new Subscription();
const handlerRss = new Parser();
const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../locales')
});
const i18nNode = i18n_node_yaml({
    debug: true,
    translationFolder: join(__dirname, '../locales'),
    locales: ['en', 'pt']
});

/**
 * This could lead to a problem someday(?)
 */
const commands = i18n.repository.commands;
const helpCommand: Array<string> = <Array<string>> arrayLoad(commands.help);
const aboutCommand: Array<string> = <Array<string>> arrayLoad(commands.about);
const searchCommand: Array<string> = <Array<string>> arrayLoad(commands.search);

bot.startPolling();
bot.use(session());
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.use(talkingSearchManager.middleware());

bot.catch((err) => {
    console.log(err);
});

bot.start(({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';
    const argument: string = removeCmd(message.text);

    i18n.locale(language);

    if ('private' === message.chat.type) {
        handlePrivateConversation();
    }

    replyWithMarkdown(i18n.t('greetingsGroup'));
});

bot.command(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);

    replyWithMarkdown(i18n.t('help'));
});

bot.command(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);

    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.command(searchCommand, ({ i18n, replyWithMarkdown, replyWithVideo, message }) => {
    const term: string = removeCmd(message.text);
    const country: string = message.from.language_code.split('-')[1] || 'us';
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);

    searchThroughCommand({ country, term, message }, { replyWithMarkdown, replyWithVideo, i18n });
});

bot.hears(helpCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);
    replyWithMarkdown(i18n.t('help'));
});

bot.hears(aboutCommand, ({ i18n, replyWithMarkdown, message }) => {
    const language: string = message.from.language_code.split('-')[0] || 'en';

    i18n.locale(language);
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.hears(searchCommand, ({ scene }) => {
    scene.enter('talkingSearch');
});

bot.on('inline_query', ({ i18n, answerInlineQuery, inlineQuery }) => {
    const term: string = messageToString(inlineQuery.query);
    const lanCode: string = inlineQuery.from.language_code;
    const pageLimit: number = 20;
    const offset: number = parseInt(inlineQuery.offset, 10) || 0;
    const country: string = inlineQuery.from.language_code.split('-')[1] || 'us';

    searchThroughInline({ country, term, offset, pageLimit, lanCode }, { i18n, answerInlineQuery, inlineQuery });
});

/**
 * Handling buttons request.
 */
bot.on('callback_query', ({ i18n, answerCbQuery, update, scene, replyWithMarkdown }) => {
    const language: string = update.callback_query.from.language_code.split('-')[0] || 'en';
    const options: Array<string> = update.callback_query.data.split('/');

    i18n.locale(language);

    if ('subscribe' === options[0]) {
        handleSubscribe({ answerCbQuery });
    } else if ('unsubscribe' === options[0]) {
        handleUnsubscribe({ answerCbQuery });
    } else if ('episode' === options[0]) {
        handleEpisode({ episode: options[1] }, { answerCbQuery });
    } else if ('again' === options[0]) {
        answerCbQuery(i18n.t('again'), false);
        scene.reenter();
    } else if ('finished' === options[0]) {
        answerCbQuery(i18n.t('finished'), false);
        scene.leave();
    }

    answerCbQuery('default', true);
});
