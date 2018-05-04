/**
 * Main  file,  handles all the Telegram's requests and does the piping API searches through the parsing functions. More
 * about the non official typings can be found at: ./src/@typings/itunes-search/
 */
'use strict';

import { config } from 'dotenv';
import { join } from 'path';
import { languageCode, setLocale } from './lib/telegram/middleware';
import { talkingSearchManager } from './lib/telegram/stage';
import { arrayLoad, messageToString, removeCmd } from './lib/utils';
import { handleStartKeyboard, handleNoSearch } from './defaultHandler';
import { handleSubscribe, handleUnsubscribe } from './databaseHandler';
import { handleEpisode, handleSearchCommand, handleLastEpisode, handleSearchInline } from './podcastHandler';
const telegraf = require('telegraf');
const session = telegraf.session;
const telegrafI18n = require('telegraf-i18n');

config();

const bot = new telegraf(process.env.BOT_KEY);
const i18n = new telegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    directory: join(__dirname, '../locales')
});

bot.startPolling();
bot.use(session());
bot.use(telegraf.log());
bot.use(i18n.middleware());
bot.use(new languageCode().middleware());
bot.use(new setLocale().middleware());
bot.use(talkingSearchManager.middleware());

const commands = i18n.repository.commands;
const helpCommand = <Array<string>> arrayLoad(commands.help);
const aboutCommand = <Array<string>> arrayLoad(commands.about);
const searchCommand = <Array<string>> arrayLoad(commands.search);

bot.catch((err) => {
    console.log(err);
});

bot.start(async ({ i18n, replyWithMarkdown, message, language, country }) => {
    const id = parseInt(removeCmd(message.text), 10);

    /**
     * A new conversation.
     */
    if (isNaN(id)) {
        replyWithMarkdown(i18n.t('greetingsPrivate'), handleStartKeyboard({ rootTranslate: i18n, language }));
    } else if ('private' === message.chat.type) {
        const sendMessage = await handleLastEpisode({ id, country }, { translate: i18n.t });  

        await replyWithMarkdown(i18n.t('sending')).catch(console.error);
        replyWithMarkdown(sendMessage.text, sendMessage.keyboard);
    } else {
        replyWithMarkdown(i18n.t('greetingsGroup'));
    }
});

bot.command(helpCommand, ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('help'));
});

bot.command(aboutCommand, ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.command(searchCommand, async ({ i18n, replyWithMarkdown, replyWithVideo, message, language, country }) => {
    const term: string = removeCmd(message.text);
    
    if ('' === term) {
        const gifs = handleNoSearch({ translate: i18n.t });

        gifs.map((element) => {
            element.hasOwnProperty('source') ? replyWithVideo(element) : replyWithMarkdown(element.text);
        });
    } else {
        const searched = await handleSearchCommand({ country, term }, { translate: i18n.t });

        replyWithMarkdown(searched.text, searched.keyboard);
    }
});

bot.hears(helpCommand, ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('help'));
});

bot.hears(aboutCommand, ({ i18n, replyWithMarkdown }) => {
    replyWithMarkdown(i18n.t('about'), { disable_web_page_preview: true });
});

bot.hears(searchCommand, ({ scene }) => {
    scene.enter('talkingSearch');
});

bot.on('inline_query', async ({ i18n, answerInlineQuery, inlineQuery, language, country }) => {
    const pageLimit: number = 20;
    const term: string = messageToString(inlineQuery.query);
    const offset: number = parseInt(inlineQuery.offset, 10) || 0;
    const results = await handleSearchInline({ country, term, offset, pageLimit }, { translate: i18n.t });

    answerInlineQuery(results, { next_offset: offset + pageLimit });
});

/**
 * Handling buttons request.
 */
bot.on('callback_query', async ({ i18n, answerCbQuery, update, scene, language }) => {
    const options: Array<string> = update.callback_query.data.split('/');

    /**
     * "Pattern-matching"?
     */
    if ('subscribe' === options[0]) {
        answerCbQuery(await handleSubscribe({ userId: 0, podcastId: 0 }, { translate: i18n.t }), true);
    } if ('unsubscribe' === options[0]) {
        answerCbQuery(await handleUnsubscribe({ userId: 0, podcastId: 0 }, { translate: i18n.t }), true);
    } if ('episode' === options[0]) {
        answerCbQuery(handleEpisode({ episode: options[1], id: options[2] }, { translate: i18n.t }), true);
    } if ('again' === options[0]) {
        answerCbQuery(i18n.t('again'), false);
        scene.reenter();
    } if ('finished' === options[0]) {
        answerCbQuery(i18n.t('finished'), false);
        scene.leave();
    } else {
        answerCbQuery('default', true);
    }
});
