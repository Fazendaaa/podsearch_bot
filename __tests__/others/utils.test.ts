/**
 * Utils testing.
 */
'use strict';

import { join } from 'path';
import { telegramInline } from 'telegraf';
import {
    arrayLoad,
    endInline,
    errorInline,
    messageToString,
    notFoundInline,
    readAsync,
    removeCmd,
    searchInline
} from '../../src/others/utils';

jest.setTimeout(60000);

const mockUserId: number = 0;
const mockLanCode: string = 'en-us';
const unsupportedLanCode: string = 'nothing';

describe('Testing arrayLoad function.', () => {
    test('options \"undefined\".', () => {
        expect(() => {
            return arrayLoad(undefined);
        }).toThrowError('Wrong argument.');
    });

    test('options with empty array.', () => {
        expect(arrayLoad([])).toEqual([]);
    });

    test('Parsing right argument.', () => {
        const array: Array<object> = [
            () => {
                return 'foo';
            },
            () => {
                return 'bar';
            }
        ];

        expect(arrayLoad(array)).toEqual(['foo', 'bar']);
    });

    test('Parsing right nested argument.', () => {
        const array: Array<object> = [
            [() => {
                return 'foo';
            }],
            () => {
                return 'bar';
            }
        ];

        expect(arrayLoad(array)).toEqual([['foo'], 'bar']);
    });
});

describe('Testing readAsync function.', () => {
    test('filename \"undefined\".', () => {
        const filePath: string = join(__dirname, '../../__mocks__/undefined');
        const errorMessage: string = `ENOENT: no such file or directory, open \'${filePath}\'`;
        expect.assertions(1);

        return expect(readAsync(undefined)).rejects.toThrowError(errorMessage);
    });
});

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

describe('Testing notFoundInline function.', () => {
    test('both equals to undefined.', () => {
        expect.assertions(1);

        return expect(notFoundInline(undefined, undefined)).rejects.toBeUndefined();
    });

    test('lanCode equals to undefined.', () => {
        expect.assertions(1);

        return expect(notFoundInline('mistyped', undefined)).rejects.toBeUndefined();
    });

    test('value equals to undefined.', () => {
        expect.assertions(1);

        return expect(notFoundInline(undefined, 'en-us')).rejects.toBeUndefined();
    });

    /**
     * Falls back to English when encounter a non supported language.
     */
    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/notFoundInline.json').then(file => {
            return expect(notFoundInline('mistyped', unsupportedLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing errorInline function.', () => {
    test('lanCode equals to undefined.', () => {
        expect.assertions(1);

        return expect(errorInline(undefined)).rejects.toBeUndefined();
    });

    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/errorInline.json').then(file => {
            return expect(errorInline(unsupportedLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing searchInline function.', () => {
    test('lanCode equals to undefined.', () => {
        expect.assertions(1);

        return expect(searchInline(undefined)).rejects.toBeUndefined();
    });

    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/searchInline.json').then(file => {
            return expect(searchInline(unsupportedLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});

describe('Testing endInline function.', () => {
    test('lanCode equals to undefined.', () => {
        expect.assertions(1);

        return expect(endInline(undefined)).rejects.toBeUndefined();
    });

    test('Unsupported lanCode.', () => {
        expect.assertions(1);

        return readAsync('/inlineMessages/en-us/endInline.json').then(file => {
            return expect(endInline(unsupportedLanCode)).resolves.toEqual(file);
        }).catch((error: Error) => {
            console.error(error);
        });
    });
});
