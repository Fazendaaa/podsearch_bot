'use strict';

import { maskResponse, maskResponseInline } from '../../../src/lib/podcasts/mask';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting, functionTesting } from '../../tests';

jest.setTimeout(60000);

const functions = [{
    name: 'maskResponseInline', func: maskResponseInline }, {
    name: 'maskResponse', func: maskResponse
}];
const mock = initMock({ path: 'podcasts/mask' }, { functions });

languageTesting((languageCountry) => {
    functions.forEach(({ name, func }) => {
        functionTesting({ name, mock, languageCountry }, { func, opts: { translate: true } })
    });
});
