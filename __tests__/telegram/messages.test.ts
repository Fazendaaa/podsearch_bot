'use strict';

import { languageTesting, initMock } from '../../__mocks__/mocks';
import { join } from 'path';
import { errorInline, searchInline, endInline, notFoundInline } from '../../src/lib/telegram/messages';

jest.setTimeout(60000);

const functionTesting = (element) => {
    const functions = [{
        name: 'errorInline', func: errorInline }, {
        name: 'searchInline', func: searchInline }, {
        name: 'endInline', func: endInline }, {
        name: 'notFoundInline', func: notFoundInline
    }];
    const mock = initMock('telegram/messages', functions);

    functions.forEach(({ name, func }) => test(name, () => {
        const translateFunction = mock[element].translate;
        const outputFile = mock[element].mock[name];

        expect(func(translateFunction, 'mistyped')).toEqual(outputFile);
    }));
};

languageTesting(functionTesting);
