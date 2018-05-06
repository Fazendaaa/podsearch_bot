'use strict';

import { readMock, translateRoot, languagesCode } from '../../__mocks__/mocks';
import { join } from 'path';
import { podcastKeyboard, forceReplyKeyboard, botKeyboard, searchKeyboard } from '../../src/lib/telegram/keyboard';

jest.setTimeout(60000);

/**
 * Skipping until set mock files.
 */
describe.skip('Nothing yet.', () => {
    test('podcastKeyboard.', () => {
        console.log(podcastKeyboard({ podcastId: 0, language: 'en' }, { translateRoot }));
    });
    test('searchKeyboard.', () => {
        console.log(searchKeyboard({ position: 0, language: 'en' }, { translateRoot }));
    });
    test('forceReplyKeyboard.', () => {
        console.log(forceReplyKeyboard);
    });
    test('botKeyboard.', () => {
        console.log(botKeyboard({ language: 'en' }, { translateRoot }));
    });
});
