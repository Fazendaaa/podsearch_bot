/**
 * Utils testing.
 */
'use strict';

import { telegramInline } from 'telegraf';
import {
    endInline,
    errorInline,
    messageToString,
    removeCmd,
    searchInline
} from '../../src/others/utils';

jest.setTimeout(60000);

const mockUserId: number = 0;
const mockLanCode: string = 'en-us';

describe('Testing removeCmd function', () => {
    test('Searching \"/search Nerdcast\".', () => {
        expect(removeCmd('/search Nerdcast')).toMatch('Nerdcast');
    });

    /**
     * It is good to test a simple input without spaces then one with it, to see whether or not the regex is working.
     */
    test('Searching \"/search The Story by The Mission\".', () => {
        expect(removeCmd('/search The Story by The Mission')).toMatch('The Story by The Mission');
    });

    test('Just \"/search\"', () => {
        expect(removeCmd('/search')).toMatch('');
    });

    /**
     * Need to change this function later to return nothing instead of an backslash.
     */
    test('Just a \"/\".', () => {
        expect(removeCmd('/')).toMatch('/');
    });

    test('Empty string.', () => {
        expect(removeCmd('')).toMatch('');
    });

    /**
     * Since there's no command there's nothing to be removed.
     */
    test('Only \"The Story by The Mission\".', () => {
        expect(removeCmd('The Story by The Mission')).toMatch('The Story by The Mission');
    });

    test('Only \"undefined\".', () => {
        expect(removeCmd(undefined)).toBeUndefined();
    });
});

describe('Testing messageToString function.', () => {
    test('Searching \"@podsearchbot The Story by The Mission\"', () => {
        expect(messageToString('The Story by The Mission')).toMatch('The Story by The Mission');
    });

    test('Only \"undefined\".', () => {
        expect(messageToString(undefined)).toBeUndefined();
    });

    test('Empty string.', () => {
        expect(messageToString('')).toMatch('');
    });
});

describe('Testing errorInline function', () => {
    test('lanCode equals to undefined', () => {
        expect.assertions(1);

        return expect(errorInline(undefined)).rejects.toBeUndefined();
    });
});

describe('Testing searchInline function', () => {
    test('lanCode equals to undefined', () => {
        expect.assertions(1);

        return expect(searchInline(undefined)).rejects.toBeUndefined();
    });
});

describe('Testing endInline function', () => {
    test('lanCode equals to undefined', () => {
        expect.assertions(1);

        return expect(endInline(undefined)).rejects.toBeUndefined();
    });
});
