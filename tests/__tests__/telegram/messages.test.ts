'use strict';

import { errorInline, searchInline, endInline, notFoundInline } from '../../../src/lib/telegram/messages';
import { initMock } from '../../__mocks__/mocks';
import { languageTesting } from '../../tests';

jest.setTimeout(60000);

const functions = [{
    name: 'errorInline', func: errorInline }, {
    name: 'searchInline', func: searchInline }, {
    name: 'endInline', func: endInline }, {
    name: 'notFoundInline', func: notFoundInline
}];
const mock = initMock({ path: 'telegram/messages' }, { functions });

languageTesting((languageCountry) => functions.forEach(({ name, func }) => test(name, () => {
    const translateFunction = mock[languageCountry].translate;
    const outputFile = mock[languageCountry].mock[name];

    expect(func(translateFunction, 'mistyped')).toEqual(outputFile);
})));
