'use strict';

import { handleNoSearch } from '../../../src/lib/handlers/default';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests';

jest.setTimeout(60000);

const functions = [{
    name: 'handleNoSearch', func: handleNoSearch
}];
const mock = initMock({ path: 'handlers/default' }, { functions });
const opts = {
    translate: true
};

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => functionTesting({ name, mock, languageCountry }, { func, opts }));
});
