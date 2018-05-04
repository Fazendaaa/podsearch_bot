'use strict';

import { response, result } from 'itunes-search';
import { telegramInline } from 'telegraf';
import { parsePodcastCommand, parsePodcastInline } from '../../src/lib/podcasts/parse';
import { readAsync } from '../../src/lib/utils';

let input;
let output;

jest.setTimeout(60000);

beforeAll(async (done) => {
    input = await readAsync('');
    output = await readAsync('');

    done();
});

describe('Testing function parsePodcastCommand', () => {
    test('', async () => {
        expect.assertions(1);

        return await expect(parsePodcastCommand({}, {})).resolves.toEqual({});
    });
});
