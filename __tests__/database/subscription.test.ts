'use strict';

import { Subscription } from '../../src/lib/database/subscription';

let subscription;

jest.setTimeout(60000);

beforeAll(() => {
    subscription = new Subscription();
});

describe('Nothing yet.', () => {
    test.skip('Nothing yet.', () => {
        expect(true).toEqual(true);
    });
});
