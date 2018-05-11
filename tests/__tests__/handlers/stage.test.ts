'use strict';

import { handleStage } from '../../../src/lib/handlers/stage';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests'; 
import { translateRoot } from '../../locales/locales';

jest.setTimeout(60000);

const functions = [{
    name: 'handleStage', func: handleStage
}];
const mock = initMock({ path: 'handlers/stage' }, { functions });

languageTesting((languageCountry) => {
    const opts = {
        translateRoot,
        translate: true
    };

    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func, opts }));
});
