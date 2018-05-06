'use strict';

import { languagesCode, readMock, translateRoot } from '../../__mocks__/mocks';
import { handleStage } from '../../src/lib/telegram/stage';

let translate;

beforeAll(async (done) => {
    done();
});

jest.setTimeout(60000);

describe('handleStage', () => {
    test('Test', async () => {
        console.log(await handleStage({ term: 'B9', country: 'us', language: 'en' }, { translateRoot }));
    });
});
