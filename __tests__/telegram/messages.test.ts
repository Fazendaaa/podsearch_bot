'use strict';

import { languageTesting, initMock } from '../../__mocks__/mocks';
import { join } from 'path';
import { errorInline, searchInline, endInline, notFoundInline } from '../../src/lib/telegram/messages';

jest.setTimeout(60000);

const functions = [{
    name: 'errorInline', func: errorInline }, {
    name: 'searchInline', func: searchInline }, {
    name: 'endInline', func: endInline }, {
    name: 'notFoundInline', func: notFoundInline
}];
const mock = initMock('telegram/messages', functions);

languageTesting((languageCountry) => functions.forEach(({ name, func }) => test(name, () => {
    const translateFunction = mock[languageCountry].translate;
    const outputFile = mock[languageCountry].mock[name];

    expect(func(translateFunction, 'mistyped')).toEqual(outputFile);
})));
